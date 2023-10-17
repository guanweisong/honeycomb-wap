import React from 'react';
import PostServer from '@/src/services/post';
import { PostType } from '@/src/types/post/PostType';
import PostInfo from '@/src/components/PostInfo';
import { CalendarOutline, CameraOutline, ContentOutline } from 'antd-mobile-icons';
import Tags from '@/src/components/Tags';
import Card from '@/src/components/Card';
import Link from 'next/link';
import Comment from '@/src/components/Comment';
import CommentServer from '@/src/services/comment';
import { MenuType } from '@/src/types/menu/MenuType';
import { PostEntity } from '@/src/types/post/post.entity';
import PaginationResponse from '@/src/types/pagination.response';
import { CommentEntity } from '@/src/types/comment/comment.entity';
import Markdown from '@/src/components/Markdown';
import SettingServer from '@/src/services/setting';
import { utcFormat } from '@/src/utils/utcFormat';
import PageTitle from '@/src/components/PageTitle';

export default async function Archives({ params }: { params: { id: string } }) {
  const { id } = params;
  const postDetail = await PostServer.indexPostDetail(id);

  const promise = [];
  promise.push(
    PostServer.indexRandomPostByCategoryId({
      postCategory: postDetail.category.id,
      postId: id,
      number: 10,
    }),
  );
  promise.push(CommentServer.index(id));
  const [randomPostsList, commentsData] = (await Promise.all(promise)) as [
    PostEntity[],
    PaginationResponse<CommentEntity[]>,
  ];

  /**
   * 格式化文章标题
   */
  const getTitle = () => {
    return postDetail.type === PostType.MOVIE
      ? `${postDetail.title} ${postDetail.movieNameEn} (${utcFormat(
          postDetail.movieTime!,
          'YYYY',
        )})`
      : postDetail.title ?? postDetail.quoteContent;
  };

  /**
   * 计算 JSONLD
   */
  const jsonLd: any = {
    '@context': 'https://schema.org',
    name: getTitle(),
  };
  switch (postDetail.type) {
    case PostType.ARTICLE:
      jsonLd['@type'] = 'Article';
      jsonLd.image = postDetail.cover?.url;
      jsonLd.description = postDetail.excerpt;
      break;
    case PostType.MOVIE:
      jsonLd['@type'] = 'Movie';
      jsonLd.image = postDetail.cover?.url;
      jsonLd.description = postDetail.excerpt;
      break;
    case PostType.PHOTOGRAPH:
      jsonLd['@type'] = 'Photograph';
      jsonLd.image = postDetail.cover?.url;
      jsonLd.description = postDetail.excerpt;
      break;
    case PostType.QUOTE:
      jsonLd['@type'] = 'Quotation';
      break;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle>{getTitle()}</PageTitle>
      <PostInfo
        author={postDetail.author.name}
        date={postDetail.createdAt}
        comments={commentsData?.total}
        views={postDetail.views}
        border={'bottom'}
      />
      {postDetail.type === PostType.QUOTE ? (
        <div className="py-3 lg:py-5 italic markdown-body">{`"${postDetail.quoteContent}"`}</div>
      ) : (
        <div className="markdown-body py-3 lg:py-5">
          {postDetail.excerpt && (
            <div className="mb-2 p-2 bg-black/5 dark:bg-black/10">{postDetail.excerpt}</div>
          )}
          <Markdown children={postDetail.content} imagesInContent={postDetail.imagesInContent} />
        </div>
      )}
      <ul className="border-t border-dashed py-2 text-gray-500 dark:border-gray-900">
        {postDetail.type === PostType.PHOTOGRAPH && (
          <li className="flex items-center">
            <CameraOutline />
            &nbsp;{utcFormat(postDetail.galleryTime!)}&nbsp; 拍摄于&nbsp;
            {postDetail.galleryLocation}
          </li>
        )}
        {postDetail.type === PostType.MOVIE && (
          <li className="flex items-center">
            <CalendarOutline />
            &nbsp; 上映于：{utcFormat(postDetail.movieTime!)}
          </li>
        )}
        {postDetail.type === PostType.QUOTE && (
          <li className="flex items-center">
            <ContentOutline />
            &nbsp; 引用自：{postDetail.quoteAuthor}
          </li>
        )}
      </ul>
      <Tags {...postDetail} />
      {randomPostsList.length > 0 && (
        <Card title={'猜你喜欢'}>
          <ul className="leading-5 list-outside ml-4 mt-2 list-disc">
            {randomPostsList.map((item: any) => (
              <li key={item.id} className="my-2">
                <Link href={`/archives/${item.id}`} className="block link-light">
                  {item.title || item.quoteContent}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Comment id={id} type={MenuType.CATEGORY} />
    </>
  );
}

export interface GenerateMetadataProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const { id } = props.params;
  const setting = await SettingServer.indexSetting();
  const postDetail = await PostServer.indexPostDetail(id);

  /**
   * 格式化文章标题
   */
  const getTitle = () => {
    return postDetail.type === PostType.MOVIE
      ? `${postDetail.title} ${postDetail.movieNameEn} (${utcFormat(
          postDetail.movieTime!,
          'YYYY',
        )})`
      : postDetail.title ?? postDetail.quoteContent;
  };

  const title = decodeURI(getTitle() as string);

  const openGraph = {
    title: title,
    type: 'article',
    images: postDetail.imagesInContent.map((item) => item.url),
    description: setting.siteName,
  };

  return {
    title,
    description: setting.siteName,
    openGraph,
  };
}

export async function generateStaticParams() {
  return [];
}
