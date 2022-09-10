import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import styles from '../archives/index.module.scss';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  ClockCircleOutlined,
  MessageOutlined,
  EyeOutlined,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import SettingServer from '@/src/services/setting';
import MenuServer from '@/src/services/menu';
import PageServer from '@/src/services/page';
import { PageType } from '@/src/types/page';
import { MenuType } from '@/src/types/menu';
import { SettingType } from '@/src/types/setting';
import Header from '@/src/components/Header';
import Link from 'next/link';
import Footer from '@/src/components/Footer';
import Comment from '@/src/components/Commont';
import ViewServer from '@/src/services/view';
import { PlatformType } from '@/src/types/platform';

interface PagesProps {
  id: string;
  pageDetail: PageType;
  menu: MenuType[];
  setting: SettingType;
  platform: PlatformType;
}

const Pages: NextPage<PagesProps> = (props) => {
  const { pageDetail, id, setting, menu, platform } = props;
  const [commentCount, setCommentCount] = useState<number>(0);
  const [views, setViews] = useState<null | number>(null);

  useEffect(() => {
    handleViews(id);
  }, [id]);

  const handleViews = async (id: string) => {
    if (id) {
      await ViewServer.updateViews({ type: 'pages', id });
      await ViewServer.indexViews({ type: 'pages', id })
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

  if (!pageDetail) {
    return null;
  }

  return (
    <>
      <Header
        title={`${pageDetail.page_title}_${setting.site_name}`}
        setting={setting}
        menu={menu}
        currentMenu={pageDetail._id}
        platform={platform}
      />
      <div className={classNames('container', styles['detail__content'])}>
        <h2 className={styles['detail__title']}>{pageDetail.page_title}</h2>
        <ul className={styles['detail__info']}>
          <li className={styles['detail__info-item']}>
            <UserOutlined />
            &nbsp;
            <Link href={`/list/authors/${pageDetail.page_author.user_name}`}>
              <a className="link-light">{pageDetail.page_author.user_name}</a>
            </Link>
          </li>
          <li className={styles['detail__info-item']}>
            <ClockCircleOutlined />
            &nbsp;{dayjs(pageDetail.created_at).format('YYYY-MM-DD')}
          </li>
          <li className={styles['detail__info-item']}>
            <MessageOutlined />
            &nbsp;{commentCount} 条留言
          </li>
          <li className={styles['detail__info-item']}>
            <EyeOutlined />
            &nbsp;{views === null ? <LoadingOutlined /> : views}&nbsp;次浏览
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
        <Comment id={id} getCount={(total) => getCommentCount(total)} />
      </div>
      <Footer setting={setting} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // @ts-ignore
  const { id } = params;
  const props = { id } as PagesProps;

  // 获取页面详情
  const queryPageDetailResult = await PageServer.indexPageDetail(id);
  props.pageDetail = queryPageDetailResult.data;

  // 并发获取其他信息
  const promise = [];
  // 获取菜单列表
  promise.push(MenuServer.indexMenu());
  // 获取网站配置
  promise.push(SettingServer.indexSetting());

  const promiseAllResult = await Promise.all(promise);

  props.menu = promiseAllResult[0].data.list;
  props.setting = promiseAllResult[1].data[0];

  return {
    props,
    revalidate: 60 * 60 * 24, // 页面静态页面生命1天
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default Pages;
