import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import SettingServer from '@/src/services/setting';
import MenuServer from '@/src/services/menu';
import PageServer from '@/src/services/page';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import Comment from '@/src/components/Comment';
import useUpdateViews from '@/src/hooks/swr/views/use.update.post.views';
import useQuerySetting from '@/src/hooks/swr/setting/use.query.setting';
import useQueryMenu from '@/src/hooks/swr/menu/use.query.menu';
import useQueryPageDetail from '@/src/hooks/swr/page/use.query.page.detail';
import useQueryComment from '@/src/hooks/swr/comment/use.query.comment';
import { SWRConfig } from 'swr';
import PostInfo from '@/src/components/PostInfo';

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
      <div className="container bg-white px-2 lg:px-4">
        <h2 className="text-center text-xl lg:text-2xl pt-2 lg:pt-4">{pageDetail.page_title}</h2>
        <PostInfo
          author={pageDetail.page_author.user_name}
          date={pageDetail.created_at}
          comments={commentsData?.total}
          views={pageDetail.page_views}
          border={'bottom'}
        />
        <div
          className="markdown-body py-5"
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
