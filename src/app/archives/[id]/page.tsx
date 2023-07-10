import React from 'react';
import PostServer from '@/src/services/post';
import { PostType } from '@/src/types/post/PostType';
import dayjs from 'dayjs';
import PostInfo from '@/src/components/PostInfo';
// @ts-ignore
import { Choose, If, Otherwise, When } from 'babel-plugin-jsx-control-statements';
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
      ? `${postDetail.title} ${postDetail.movieNameEn} (${dayjs(postDetail.movieTime).format(
          'YYYY',
        )})`
      : postDetail.title ?? postDetail.quoteContent;
  };

  return (
    <>
      <h2 className="text-center text-base lg:text-xl pt-2 lg:pt-4 dark:text-gray-400">
        {getTitle()}
      </h2>
      <PostInfo
        author={postDetail.author.name}
        date={postDetail.createdAt}
        comments={commentsData?.total}
        views={postDetail.views}
        border={'bottom'}
      />
      <Choose>
        <When condition={postDetail.type === PostType.QUOTE}>
          <div className="py-3 lg:py-5 italic markdown-body">{`"${postDetail.quoteContent}"`}</div>
        </When>
        <Otherwise>
          <div
            className="markdown-body py-3 lg:py-5"
            dangerouslySetInnerHTML={{ __html: postDetail.content ?? '' }}
          />
        </Otherwise>
      </Choose>
      <ul className="border-t border-dashed py-2 text-gray-500 dark:border-gray-900">
        <If condition={postDetail.type === PostType.PHOTOGRAPH}>
          <li className="flex items-center">
            <CameraOutline />
            {dayjs(postDetail.galleryTime).format('YYYY-MM-DD')}&nbsp; 拍摄于&nbsp;
            {postDetail.galleryLocation}
          </li>
        </If>
        <If condition={postDetail.type === PostType.MOVIE}>
          <li className="flex items-center">
            <CalendarOutline />
            &nbsp; 上映于：{dayjs(postDetail.movieTime).format('YYYY-MM-DD')}
          </li>
        </If>
        <If condition={postDetail.type === PostType.QUOTE}>
          <li className="flex items-center">
            <ContentOutline />
            &nbsp; 引用自：{postDetail.quoteAuthor}
          </li>
        </If>
      </ul>
      <Tags {...postDetail} />
      <If condition={randomPostsList.length > 0}>
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
      </If>
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
  const postDetail = await PostServer.indexPostDetail(id);

  /**
   * 格式化文章标题
   */
  const getTitle = () => {
    return postDetail.type === PostType.MOVIE
      ? `${postDetail.title} ${postDetail.movieNameEn} (${dayjs(postDetail.movieTime).format(
          'YYYY',
        )})`
      : postDetail.title ?? postDetail.quoteContent;
  };

  return {
    title: decodeURI(getTitle() as string),
  };
}

export async function generateStaticParams() {
  return [];
}
