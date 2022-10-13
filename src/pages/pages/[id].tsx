import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import styles from '../archives/index.module.less';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ClockCircleOutline, MessageOutline, EyeOutline, UserOutline } from 'antd-mobile-icons';
import SettingServer from '@/src/services/setting';
import MenuServer from '@/src/services/menu';
import PageServer from '@/src/services/page';
import Header from '@/src/components/Header';
import Link from 'next/link';
import Footer from '@/src/components/Footer';
import Comment from '@/src/components/Comment';
import useUpdateViews from '@/src/hooks/swr/views/use.update.post.views';
import useQuerySetting from '@/src/hooks/swr/setting/use.query.setting';
import useQueryMenu from '@/src/hooks/swr/menu/use.query.menu';
import useQueryPageDetail from '@/src/hooks/swr/page/use.query.page.detail';
import useQueryComment from '@/src/hooks/swr/comment/use.query.comment';
import { SWRConfig } from 'swr';

interface PagesProps {
  id: string;
  fallback: any;
}

const Pages: NextPage<PagesProps> = (props) => {
  const { id } = props;

  const { data: setting } = useQuerySetting();
  const { data: menu } = useQueryMenu();
  const { data: pageDetail } = useQueryPageDetail(id);
  const { data: commentsData } = useQueryComment(id);

  useUpdateViews({ type: 'pages', id });

  return (
    <>
      <Header
        title={`${pageDetail.page_title}_${setting.site_name}`}
        setting={setting}
        menu={menu}
        currentMenu={pageDetail._id}
      />
      <div className={classNames('container', styles['detail__content'])}>
        <h2 className={styles['detail__title']}>{pageDetail.page_title}</h2>
        <ul className={styles['detail__info']}>
          <li className={styles['detail__info-item']}>
            <UserOutline />
            &nbsp;
            <Link href={`/list/authors/${pageDetail.page_author.user_name}`}>
              <a className="link-light">{pageDetail.page_author.user_name}</a>
            </Link>
          </li>
          <li className={styles['detail__info-item']}>
            <ClockCircleOutline />
            &nbsp;{dayjs(pageDetail.created_at).format('YYYY-MM-DD')}
          </li>
          <li className={styles['detail__info-item']}>
            <MessageOutline />
            &nbsp;{commentsData?.total} 条留言
          </li>
          <li className={styles['detail__info-item']}>
            <EyeOutline />
            &nbsp;{pageDetail.page_views}&nbsp;次浏览
          </li>
        </ul>
        <div
          className={classNames({
            [styles['detail__detail']]: true,
            'markdown-body': true,
          })}
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: pageDetail.page_content }}
        />
        <Comment id={id} />
      </div>
      <Footer setting={setting} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // @ts-ignore
  const { id } = params;
  const props = { id } as PagesProps;
  const fallback: any = {};

  // 获取页面详情
  const queryPageDetailResult = await PageServer.indexPageDetail(id);
  fallback[`/pages/${id}`] = queryPageDetailResult;

  // 并发获取其他信息
  const promise = [];
  // 获取菜单列表
  promise.push(MenuServer.indexMenu());
  // 获取网站配置
  promise.push(SettingServer.indexSetting());

  const promiseAllResult = await Promise.all(promise);

  fallback[`/menus`] = promiseAllResult[0];
  fallback[`/settings`] = promiseAllResult[1];

  props.fallback = fallback;

  return {
    props,
    revalidate: 60 * 60 * 24, // 页面静态页面生命1天
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const Page: NextPage<PagesProps> = (props) => {
  const { fallback } = props;
  return (
    <SWRConfig value={{ fallback }}>
      <Pages {...props} />
    </SWRConfig>
  );
};

export default Page;
