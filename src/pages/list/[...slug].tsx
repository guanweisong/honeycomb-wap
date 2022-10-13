import React from 'react';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Button, InfiniteScroll } from 'antd-mobile';
import Header from '@/src/components/Header';
import dayjs from 'dayjs';
import PostServer from '@/src/services/post';
import MenuServer from '@/src/services/menu';
import { PostEntity } from '@/src/types/post/post.entity';
import SettingServer from '@/src/services/setting';
import Footer from '@/src/components/Footer';
import NoData from '@/src/components/NoData';
import { SWRConfig } from 'swr';
import useQuerySetting from '@/src/hooks/swr/setting/use.query.setting';
import useQueryMenu from '@/src/hooks/swr/menu/use.query.menu';
import useQueryPostList from '@/src/hooks/swr/post/use.query.post.list';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { PostType } from '@/src/types/post/PostType';
import { PostStatus } from '@/src/types/post/PostStatus';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import Signature from '@/src/components/Signature';
import PostInfo from '@/src/components/PostInfo';

interface CategoryProps {
  currentMenu: string;
  typeName?: string;
  type?: string;
  queryParams: PostListQuery;
  fallback: any;
  fallbackData: {
    queryPostList: PostEntity[];
  };
}

const PAGE_SIZE = 10;

const Category: NextPage<CategoryProps> = (props) => {
  const { currentMenu = '', typeName, type = '', queryParams, fallbackData } = props;

  const { data: setting } = useQuerySetting();
  const { data: menu } = useQueryMenu();
  const { data, size, setSize } = useQueryPostList(queryParams, fallbackData.queryPostList);

  const postList = data.flat();
  const isEnd = data[data.length - 1]?.length < PAGE_SIZE;
  const isLoadingMore = typeof data[size - 1] === 'undefined';

  /**
   * 滚动加载
   */
  // const loadMore = () => {
  //   setSize(size + 1);
  //   console.log('isLoadingMore', isLoadingMore);
  //   return new Promise<void>((resolve) => {
  //     if (!isLoadingMore) {
  //       resolve();
  //     }
  //   });
  // };

  /**
   * 获取页面标题
   */
  const getTitle = () => {
    let title = '';
    switch (type) {
      case 'tags':
        title = `标签“${typeName}”下的所有文章`;
        break;
      case 'authors':
        title = `作者“${typeName}”下的所有文章`;
        break;
      default:
        title = `${typeName || '首页'}_${setting.site_name}`;
    }
    return title;
  };

  /**
   * 渲染列表卡片
   * @param item
   */
  const renderCard = (item: PostEntity) => {
    return (
      <Link href={`/archives/${item._id}`} key={item._id}>
        <div className="bg-white p-2 mt-4 first:mt-0">
          <If
            condition={[PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(
              item.post_type,
            )}
          >
            <div>
              <Link href={`/archives/${item._id}`}>
                <a>
                  <img
                    className="w-full"
                    src={`//${item.post_cover?.media_url}?imageMogr2/thumbnail/1280x`}
                    loading={'lazy'}
                  />
                </a>
              </Link>
            </div>
          </If>
          <Link href={`/archives/${item._id}`}>
            <a className="p-4 text-center block text-lg">
              <If condition={item.post_type === PostType.MOVIE}>
                <>
                  {item.post_title} {item.movie_name_en} ({dayjs(item.movie_time).format('YYYY')})
                </>
              </If>
              <If condition={[PostType.ARTICLE, PostType.PHOTOGRAPH].includes(item.post_type)}>
                {item.post_title}
              </If>
              <If condition={item.post_type === PostType.QUOTE}>
                <>
                  “{item.quote_content}” —— {item.quote_author}
                </>
              </If>
            </a>
          </Link>
          <PostInfo
            author={item.post_author.user_name}
            date={item.created_at}
            comments={item.comment_count}
            views={item.post_views}
            border={'top'}
          />
        </div>
      </Link>
    );
  };

  return (
    <>
      <Header title={getTitle()} setting={setting} menu={menu} currentMenu={currentMenu} />
      <div className={'container'}>
        <If condition={['tags', 'authors'].includes(type)}>
          <div className="mb-4 ml-4">{getTitle()}</div>
        </If>
        <Choose>
          <When condition={postList.length > 0}>
            <>
              <div>{postList.map((item) => renderCard(item))}</div>
              {/*<InfiniteScroll loadMore={loadMore} hasMore={!isEnd} />*/}
              {!isEnd ? (
                <Button
                  style={{ marginTop: 10 }}
                  onClick={() => setSize(size + 1)}
                  block
                  loading={isLoadingMore}
                  color={'primary'}
                  fill={'outline'}
                >
                  加载更多
                </Button>
              ) : (
                <Signature text={'到底了'} />
              )}
            </>
          </When>
          <Otherwise>
            <NoData title={'该分类暂时没有文章哦！'} />
          </Otherwise>
        </Choose>
      </div>
      <Footer setting={setting} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const props = {} as CategoryProps;
  const fallback: any = {};
  const fallbackData: any = {};

  // 并发获取其他信息
  const promise = [];
  // 获取菜单列表
  promise.push(MenuServer.indexMenu());
  // 获取网站配置
  promise.push(SettingServer.indexSetting());

  const promiseAllResult = await Promise.all(promise);
  fallback[`/menus`] = promiseAllResult[0];
  fallback[`/settings`] = promiseAllResult[1];

  // 获取列表类型
  props.type = typeof params?.slug !== 'undefined' ? params?.slug[0] : undefined;

  if (props.type && ['category', 'tags', 'authors'].includes(props.type)) {
    const queryParams = {
      post_status: [PostStatus.PUBLISHED],
      limit: PAGE_SIZE,
    } as PostListQuery;
    // @ts-ignore
    props.typeName = params?.slug?.pop();
    switch (props.type) {
      case 'category':
        // 获取分类ID
        const categoryId = fallback[`/menus`].find(
          (item: MenuEntity) => item.category_title_en === props.typeName,
        )?._id;
        props.currentMenu = categoryId || '';
        if (typeof categoryId !== 'undefined') {
          queryParams.category_id = categoryId;
        }
        props.typeName =
          fallback[`/menus`].find((item: MenuEntity) => item.category_title_en === props.typeName)
            ?.category_title || '';
        break;
      case 'tags':
        queryParams.tag_name = props.typeName;
        break;
      case 'authors':
        queryParams.user_name = props.typeName;
        break;
    }
    console.log('queryParams', queryParams);
    props.queryParams = queryParams;
    // 获取分类列表
    const queryPostList = await PostServer.indexPostList(queryParams);
    fallbackData.queryPostList = queryPostList;
  }

  props.fallback = fallback;
  props.fallbackData = fallbackData;

  return {
    props,
    revalidate: 60 * 60, // 列表页静态页面生命1小时
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const Page: NextPage<CategoryProps> = (props) => {
  const { fallback } = props;
  return (
    <SWRConfig value={{ fallback }}>
      <Category {...props} />
    </SWRConfig>
  );
};

export default Page;
