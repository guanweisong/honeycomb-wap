import React from 'react';
import { PostStatus } from '@/src/types/post/PostStatus';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import PostServer from '@/src/services/post';
import MenuServer from '@/src/services/menu';
import SettingServer from '@/src/services/setting';
import PostList from '@/src/components/PostList';
import NoData from '@/src/components/NoData';
import { SettingEntity } from '@/src/types/setting/setting.entity';

const PAGE_SIZE = 10;

export default async function List({ params }: { params: { slug: string } }) {
  const promise = [];
  promise.push(SettingServer.indexSetting());
  promise.push(MenuServer.indexMenu());
  const [setting, menu] = (await Promise.all(promise)) as [SettingEntity, MenuEntity[]];

  const type = typeof params?.slug !== 'undefined' ? params?.slug[0] : undefined;

  let queryParams = {
    status: [PostStatus.PUBLISHED],
    limit: PAGE_SIZE,
  } as PostListQuery;
  // @ts-ignore
  let typeName = decodeURI(params?.slug?.pop());
  switch (type) {
    case 'category':
      // 获取分类ID
      const categoryId = menu.find((item: MenuEntity) => item.titleEn === typeName)?.id;
      if (typeof categoryId !== 'undefined') {
        queryParams = { ...queryParams, categoryId: categoryId };
      }
      typeName = menu.find((item: MenuEntity) => item.titleEn === typeName)?.title || '';
      break;
    case 'tags':
      queryParams = { ...queryParams, tagName: typeName };
      break;
    case 'authors':
      queryParams = { ...queryParams, userName: typeName };
      break;
  }
  console.log('queryParams', queryParams);
  // 获取分类列表
  const postList = await PostServer.indexPostList(queryParams);

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
        if (typeName) {
          title = `${typeName}_${setting.siteName}`;
        } else {
          title = setting.siteName;
        }
    }
    return title;
  };

  return (
    <>
      {['tags', 'authors'].includes(type!) && (
        <div className="mb-2 ml-2 lg:mb-4 lg:ml-4 text-base dark:text-gray-400">{getTitle()}</div>
      )}
      {postList.length > 0 ? (
        <PostList initData={postList} pageSize={PAGE_SIZE} queryParams={queryParams} />
      ) : (
        <NoData title={'该分类暂时没有文章哦！'} />
      )}
    </>
  );
}

export interface GenerateMetadataProps {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const setting = await SettingServer.indexSetting();
  const menu = await MenuServer.indexMenu();

  // 获取列表类型
  const type = typeof props.params?.slug !== 'undefined' ? props.params?.slug[0] : undefined;
  let typeName = props.params?.slug?.pop();
  switch (type) {
    case 'category':
      typeName = menu.find((item: MenuEntity) => item.titleEn === typeName)?.title || '';
      break;
  }

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
        if (typeName) {
          title = `${typeName}_${setting.siteName}`;
        } else {
          title = setting.siteName;
        }
    }
    return decodeURI(title);
  };

  const title = getTitle();

  const openGraph = {
    title: title,
    type: 'website',
    images: ['/static/images/logo.png'],
    description: setting.siteSubName,
  };

  return {
    title,
    description: setting.siteSubName,
    openGraph,
  };
}

export async function generateStaticParams() {
  return [];
}
