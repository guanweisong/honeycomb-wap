import React from 'react';
import { PostStatus } from '@/src/types/post/PostStatus';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import PostServer from '@/src/services/post';
import MenuServer from '@/src/services/menu';
import SettingServer from '@/src/services/setting';
import PostList from '@/src/components/PostList';
import NoData from '@/src/components/NoData';

export const PAGE_SIZE = 10;

export default async function List(props) {
  const { params } = props;
  const setting = await SettingServer.indexSetting();
  const menu = await MenuServer.indexMenu();

  // 获取列表类型
  const type = typeof params?.slug !== 'undefined' ? params?.slug[0] : undefined;

  let queryParams = {
    post_status: [PostStatus.PUBLISHED],
    limit: PAGE_SIZE,
  } as PostListQuery;
  // @ts-ignore
  let typeName = params?.slug?.pop();
  switch (type) {
    case 'category':
      // 获取分类ID
      const categoryId = menu.find((item: MenuEntity) => item.category_title_en === typeName)?._id;
      if (typeof categoryId !== 'undefined') {
        queryParams = { ...queryParams, category_id: categoryId };
      }
      typeName =
        menu.find((item: MenuEntity) => item.category_title_en === typeName)?.category_title || '';
      break;
    case 'tags':
      queryParams = { ...queryParams, tag_name: typeName };
      break;
    case 'authors':
      queryParams = { ...queryParams, user_name: typeName };
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
        title = `${typeName || '首页'}_${setting.site_name}`;
    }
    return title;
  };

  return (
    <>
      <If condition={['tags', 'authors'].includes(type)}>
        <div className="mb-2 ml-2 lg:mb-4 lg:ml-4 text-base">{getTitle()}</div>
      </If>
      <Choose>
        <When condition={postList.length > 0}>
          <PostList initData={postList} pageSize={PAGE_SIZE} queryParams={queryParams} />
        </When>
        <Otherwise>
          <NoData title={'该分类暂时没有文章哦！'} />
        </Otherwise>
      </Choose>
    </>
  );
}
