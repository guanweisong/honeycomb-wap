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
import Layout from '@/src/components/Layout';
import Title from '@/src/components/Title';

export default async function Archives(props) {
  const { params } = props;
  const { id } = params;
  const postDetail = await PostServer.indexPostDetail(id);
  const randomPostsList = await PostServer.indexRandomPostByCategoryId({
    post_category: postDetail.post_category._id,
    post_id: id,
    number: 10,
  });
  const commentsData = await CommentServer.index(id);

  /**
   * 格式化文章标题
   */
  const getTitle = () => {
    return postDetail.post_type === PostType.MOVIE
      ? `${postDetail.post_title} ${postDetail.movie_name_en} (${dayjs(
          postDetail.movie_time,
        ).format('YYYY')})`
      : postDetail.post_title;
  };

  return (
    <Layout currentMenu={postDetail.post_category._id}>
      <Title title={getTitle()} />
      <h2 className="text-center text-base lg:text-xl pt-2 lg:pt-4 dark:text-gray-400">
        {getTitle()}
      </h2>
      <PostInfo
        author={postDetail.post_author.user_name}
        date={postDetail.created_at}
        comments={commentsData?.total}
        views={postDetail.post_views}
        border={'bottom'}
      />
      <Choose>
        <When condition={postDetail.post_type === PostType.QUOTE}>
          <div className="py-3 lg:py-5 italic markdown-body">{`"${postDetail.quote_content}"`}</div>
        </When>
        <Otherwise>
          <div
            className="markdown-body py-3 lg:py-5"
            // @ts-ignore
            dangerouslySetInnerHTML={{ __html: postDetail.post_content }}
          />
        </Otherwise>
      </Choose>
      <ul className="border-t border-dashed py-2 text-gray-500 dark:border-gray-900">
        <If condition={postDetail.post_type === PostType.PHOTOGRAPH}>
          <li className="flex items-center">
            <CameraOutline />
            {dayjs(postDetail.gallery_time).format('YYYY-MM-DD')}&nbsp; 拍摄于&nbsp;
            {postDetail.gallery_location}
          </li>
        </If>
        <If condition={postDetail.post_type === PostType.MOVIE}>
          <li className="flex items-center">
            <CalendarOutline />
            &nbsp; 上映于：{dayjs(postDetail.movie_time).format('YYYY-MM-DD')}
          </li>
        </If>
        <If condition={postDetail.post_type === PostType.QUOTE}>
          <li className="flex items-center">
            <ContentOutline />
            &nbsp; 引用自：{postDetail.quote_author}
          </li>
        </If>
      </ul>
      <Tags {...postDetail} />
      <If condition={randomPostsList.length > 0}>
        <Card title={'猜你喜欢'}>
          <ul className="leading-5 list-outside ml-4 mt-2 list-disc">
            {randomPostsList.map((item: any) => (
              <li key={item._id} className="my-2">
                <Link href={`/archives/${item._id}`} className="block link-light">
                  {item.post_title || item.quote_content}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </If>
      <Comment id={id} type={MenuType.POST} />
    </Layout>
  );
}
