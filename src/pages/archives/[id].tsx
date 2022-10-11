import React from 'react';
import { SWRConfig, unstable_serialize } from 'swr';
import dayjs from 'dayjs';
import classNames from 'classnames';
import Link from 'next/link';
import Header from '@/src/components/Header';
import Tags from '@/src/components/Tags';
import {
  CalendarOutline,
  CameraOutline,
  ClockCircleOutline,
  ContentOutline,
  EyeOutline,
  MessageOutline,
  UserOutline,
} from 'antd-mobile-icons';
import styles from './index.module.less';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Comment from '@/src/components/Comment';
import PostServer from '@/src/services/post';
import MenuServer from '@/src/services/menu';
import SettingServer from '@/src/services/setting';
import Card from '@/src/components/Card';

// @ts-ignore
import { Choose, If, Otherwise, When } from 'babel-plugin-jsx-control-statements';
import Footer from '@/src/components/Footer';
import useQueryPostDetail from '@/src/hooks/swr/post/use.query.post.detail';
import useQuerySetting from '@/src/hooks/swr/setting/use.query.setting';
import useQueryMenu from '@/src/hooks/swr/menu/use.query.menu';
import useQueryPostRandomList from '@/src/hooks/swr/post/use.query.post.random.list';
import useUpdateViews from '@/src/hooks/swr/views/use.update.post.views';
import useQueryComment from '@/src/hooks/swr/comment/use.query.comment';
import { PostType } from '@/src/types/post/PostType';
import { PostEntity } from '@/src/types/post/post.entity';

export interface ArchivesProps {
  id: string;
  post_category: string;
  fallback: any;
}

const Archives = (props: ArchivesProps) => {
  console.log('props', props);
  const { id, post_category } = props;

  const { data: setting } = useQuerySetting();
  const { data: menu } = useQueryMenu();
  const { data: postDetail } = useQueryPostDetail(id);
  const { data: randomPostsList } = useQueryPostRandomList({ post_category, post_id: id });
  useUpdateViews({ type: 'posts', id });
  const { data: commentsData } = useQueryComment(id);

  const getTitle = () => {
    return postDetail.post_type === PostType.MOVIE
      ? `${postDetail.post_title} ${postDetail.movie_name_en} (${dayjs(
          postDetail.movie_time,
        ).format('YYYY')})`
      : postDetail.post_title;
  };

  return (
    <>
      <Header title={getTitle()} setting={setting} menu={menu} currentMenu={post_category} />
      <div className={classNames('container', styles['detail__content'])}>
        <h2 className={styles['detail__title']}>{getTitle()}</h2>
        <ul className={styles['detail__info']}>
          <li className={styles['detail__info-item']}>
            <UserOutline />
            &nbsp;
            <Link href={`/list/authors/${postDetail.post_author.user_name}`}>
              <a className="link-light">{postDetail.post_author.user_name}</a>
            </Link>
          </li>
          <li className={styles['detail__info-item']}>
            <ClockCircleOutline />
            &nbsp;{dayjs(postDetail.created_at).format('YYYY-MM-DD')}
          </li>
          <li className={styles['detail__info-item']}>
            <MessageOutline />
            &nbsp;{commentsData?.total} 条留言
          </li>
          <li className={styles['detail__info-item']}>
            <EyeOutline />
            &nbsp;{postDetail.post_views}&nbsp;次浏览
          </li>
        </ul>
        <Choose>
          <When condition={postDetail.post_type === PostType.QUOTE}>
            <div
              className={classNames({
                [styles['detail__quote']]: true,
              })}
            >
              {`"${postDetail.quote_content}"`}
            </div>
          </When>
          <Otherwise>
            <div
              className={classNames({
                [styles['detail__detail']]: true,
                'markdown-body': true,
              })}
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: postDetail.post_content }}
            />
          </Otherwise>
        </Choose>
        <ul className={styles['detail__extra']}>
          <If condition={postDetail.post_type === PostType.PHOTOGRAPH}>
            <li className={styles['detail__extra-item']}>
              <CameraOutline />
              {dayjs(postDetail.gallery_time).format('YYYY-MM-DD')}&nbsp; 拍摄于&nbsp;
              {postDetail.gallery_location}
            </li>
          </If>
          <If condition={postDetail.post_type === PostType.MOVIE}>
            <li className={styles['detail__extra-item']}>
              <CalendarOutline />
              &nbsp; 上映于：{dayjs(postDetail.movie_time).format('YYYY-MM-DD')}
            </li>
          </If>
          <If condition={postDetail.post_type === PostType.QUOTE}>
            <li className={styles['detail__extra-item']}>
              <ContentOutline />
              &nbsp; 引用自：{postDetail.quote_author}
            </li>
          </If>
        </ul>
        <Tags {...postDetail} />
        <If condition={randomPostsList.length > 0}>
          <Card title={'猜你喜欢'}>
            <ul className={styles['detail__post-list']}>
              {randomPostsList.map((item: any) => (
                <li key={item._id}>
                  <Link href={`/archives/${item._id}`}>
                    <a className="link-light">{item.post_title || item.quote_content}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </If>
        <Comment id={id} />
      </div>
      <Footer setting={setting} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // @ts-ignore
  const { id } = params;
  const props = { id } as ArchivesProps;
  const fallback: any = {};

  // 获取文章详情
  const queryPostDetailResult = await PostServer.indexPostDetail(id);
  fallback[`/posts/${id}`] = queryPostDetailResult;

  // 并发获取其他信息
  const promise = [];
  // 获取菜单列表
  promise.push(MenuServer.indexMenu());
  // 获取网站配置
  promise.push(SettingServer.indexSetting());
  // 获取随机文章列表
  props.post_category = queryPostDetailResult.post_category._id;
  promise.push(
    PostServer.indexRandomPostByCategoryId({
      post_category: props.post_category,
      number: 10,
      post_id: id,
    }),
  );

  const promiseAllResult = await Promise.all(promise);

  fallback[`/menus`] = promiseAllResult[0];
  fallback[`/settings`] = promiseAllResult[1];
  fallback[
    unstable_serialize([
      `/posts/random`,
      { post_category: props.post_category, number: 10, post_id: id },
    ])
  ] = promiseAllResult[2];

  props.fallback = fallback;

  return {
    props,
    revalidate: 60 * 60 * 24, // 详情页静态页面生命1天
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const Page: NextPage<ArchivesProps> = (props) => {
  const { fallback } = props;
  return (
    <SWRConfig value={{ fallback }}>
      <Archives {...props} />
    </SWRConfig>
  );
};

export default Page;
