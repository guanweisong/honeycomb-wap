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
import { NextIntlClientProvider } from 'next-intl';
import {
  getLocale,
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from 'next-intl/server';

const PAGE_SIZE = 10;

export default async function List({ params }: { params: { slug: string; locale: string } }) {
  unstable_setRequestLocale(params.locale);
  const messages = await getMessages();
  const t = await getTranslations('PostList');
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
      const categoryId = menu.find((item: MenuEntity) => item.path === typeName)?.id;
      if (typeof categoryId !== 'undefined') {
        queryParams = { ...queryParams, categoryId: categoryId };
      }
      typeName =
        menu.find((item: MenuEntity) => item.path === typeName)?.title?.[params.locale] || '';
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
        title = t('postUnderTag', { tag: typeName });
        break;
      case 'authors':
        title = t('postUnderAuthor', { author: typeName });
        break;
      default:
        if (typeName) {
          title = `${typeName}_${setting.siteName?.[params.locale]}`;
        } else {
          title = setting.siteName?.[params.locale];
        }
    }
    return title;
  };

  return (
    <>
      {['tags', 'authors'].includes(type!) && <div className="mb-2 lg:mb-4">{getTitle()}</div>}
      {postList.length > 0 ? (
        <NextIntlClientProvider messages={messages}>
          <PostList initData={postList} pageSize={PAGE_SIZE} queryParams={queryParams} />
        </NextIntlClientProvider>
      ) : (
        <NoData title={t('emptyTip')} />
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
  const local = await getLocale();
  const t = await getTranslations('PostList');

  // 获取列表类型
  const type = typeof props.params?.slug !== 'undefined' ? props.params?.slug[0] : undefined;
  let typeName = props.params?.slug?.pop();
  switch (type) {
    case 'category':
      typeName = menu.find((item: MenuEntity) => item.path === typeName)?.title?.[local] || '';
      break;
  }

  /**
   * 获取页面标题
   */
  const getTitle = () => {
    let title = '';
    switch (type) {
      case 'tags':
        title = t('postUnderTag', { tag: typeName });
        break;
      case 'authors':
        title = t('postUnderAuthor', { author: typeName });
        break;
      default:
        if (typeName) {
          title = `${typeName}_${setting.siteName?.[local]}`;
        } else {
          title = setting.siteName[local];
        }
    }
    return decodeURI(title);
  };

  const title = getTitle();

  const openGraph = {
    title: title,
    type: 'website',
    images: ['/static/images/logo.png'],
    description: setting.siteSubName[local],
  };

  return {
    title,
    description: setting.siteSubName[local],
    openGraph,
  };
}

export async function generateStaticParams() {
  return [];
}
