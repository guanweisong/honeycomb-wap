import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import Link from 'next/link';
import Header from '@/src/components/Header';
import Tags from '@/src/components/Tags';
import { DotLoading } from 'antd-mobile';
import {
  ClockCircleOutline,
  MessageOutline,
  EyeOutline,
  UserOutline,
  CameraOutline,
  CalendarOutline,
  ContentOutline,
} from 'antd-mobile-icons';
import styles from './index.module.less';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { PostType } from '@/src/types/post';
import { CommentType } from '@/src/types/comment';
import PostServer from '@/src/services/post';
import { MenuType } from '@/src/types/menu';
import MenuServer from '@/src/services/menu';
import { SettingType } from '@/src/types/setting';
import SettingServer from '@/src/services/setting';
import Card from '@/src/components/Card';
import ViewServer from '@/src/services/view';

// @ts-ignore
import { If, When, Otherwise, Choose } from 'babel-plugin-jsx-control-statements';
import Footer from '@/src/components/Footer';
import Comment from '@/src/components/Commont';
import { PlatformType } from '@/src/types/platform';

export interface ArchivesProps {
  postDetail: PostType;
  randomPostsList: PostType[];
  menu: MenuType[];
  setting: SettingType;
  id: string;
  platform: PlatformType;
}

const Archives: NextPage<ArchivesProps> = (props) => {
  const { postDetail, randomPostsList, id, setting, menu, platform } = props;
  const [commentCount, setCommentCount] = useState<number>(0);
  const [views, setViews] = useState<null | number>(null);

  useEffect(() => {
    handleViews(id);
  }, [id]);

  const handleViews = async (id: string) => {
    if (id) {
      await ViewServer.updateViews({ type: 'posts', id });
      await ViewServer.indexViews({ type: 'posts', id })
        .then((result) => {
          if (result.status === 200) {
            setViews(result.data.count);
          }
        })
        .catch((e) => console.error(e));
    }
  };

  const getCommentCount = (total: number) => {
    setCommentCount(total);
  };

  const getTitle = () => {
    return postDetail.post_type === 1
      ? `${postDetail.post_title} ${postDetail.movie_name_en} (${dayjs(
          postDetail.movie_time,
        ).format('YYYY')})`
      : postDetail.post_title;
  };

  if (!postDetail) {
    return null;
  }

  return (
    <>
      <Header
        title={getTitle()}
        setting={setting}
        menu={menu}
        currentMenu={postDetail.post_category._id}
        platform={platform}
      />
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
            &nbsp;{commentCount} 条留言
          </li>
          <li className={styles['detail__info-item']}>
            <EyeOutline />
            &nbsp;{views === null ? <DotLoading /> : views}&nbsp;次浏览
          </li>
        </ul>
        <Choose>
          <When condition={postDetail.post_type === 3}>
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
          <If condition={postDetail.post_type === 2}>
            <li className={styles['detail__extra-item']}>
              <CameraOutline />
              {dayjs(postDetail.gallery_time).format('YYYY-MM-DD')}&nbsp; 拍摄于&nbsp;
              {postDetail.gallery_location}
            </li>
          </If>
          <If condition={postDetail.post_type === 1}>
            <li className={styles['detail__extra-item']}>
              <CalendarOutline />
              &nbsp; 上映于：{dayjs(postDetail.movie_time).format('YYYY-MM-DD')}
            </li>
          </If>
          <If condition={postDetail.post_type === 3}>
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
        <Comment id={id} getCount={(total) => getCommentCount(total)} />
      </div>
      <Footer setting={setting} />
    </>
  );
};

Archives.defaultProps = {
  menu: [],
  setting: {
    _id: '',
    site_copyright: '',
    site_name: '',
    site_record_no: '',
    site_record_url: '',
    site_signature: '',
  },
  randomPostsList: [],
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // @ts-ignore
  const { id } = params;
  const props = { id } as ArchivesProps;

  // 获取文章详情
  const queryPostDetailResult = await PostServer.indexPostDetail(id);
  props.postDetail = queryPostDetailResult.data;

  // 并发获取其他信息
  const promise = [];
  // 获取菜单列表
  promise.push(MenuServer.indexMenu());
  // 获取随机文章列表
  promise.push(
    PostServer.indexRandomPostByCategoryId({
      post_category: props.postDetail.post_category._id,
      number: 10,
    }),
  );
  // 获取网站配置
  promise.push(SettingServer.indexSetting());

  const promiseAllResult = await Promise.all(promise);

  props.menu = promiseAllResult[0].data.list;
  props.randomPostsList = promiseAllResult[1].data?.filter((item: CommentType) => item._id !== id);
  props.setting = promiseAllResult[2].data[0];

  return {
    props,
    revalidate: 60 * 60 * 24, // 详情页静态页面生命1天
  };
};

/**
 * 构建时无必要预生产静态页面，运行时生成即可
 */
// export const getStaticPaths: GetStaticPaths = async () => {
//   const allPosts = await PostServer.indexPostList({limit: 1})
//   const allPath = allPosts.data.list.map((post:PostType) => `/archives/${post._id}`) || []
//   return {
//     paths: allPath,
//     fallback: true,
//   }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Archives;
