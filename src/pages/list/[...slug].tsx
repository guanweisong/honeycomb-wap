import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import classNames from 'classnames';
import { InfiniteScroll } from 'antd-mobile';
import Header from '@/src/components/Header';
import Signature from '@/src/components/Signature';
import { postClass } from '@/src/utils/mapping';
import styles from './index.module.less';
import dayjs from 'dayjs';
import { ClockCircleOutline, MessageOutline, EyeOutline } from 'antd-mobile-icons';
import PostServer, { IIndexPostListParamsType } from '@/src/services/post';
import MenuServer from '@/src/services/menu';
import { PostType } from '@/src/types/post';
import { MenuType } from '@/src/types/menu';
import { SettingType } from '@/src/types/setting';
import SettingServer from '@/src/services/setting';
import { PlatformType } from '@/src/types/platform';
import Footer from '@/src/components/Footer';
import NoData from '@/src/components/NoData';

interface CategoryProps {
  post: {
    total: number;
    list: PostType[];
  };
  menu: MenuType[];
  setting: SettingType;
  currentMenu: string;
  typeName: string | undefined;
  type: string | undefined;
  platform: PlatformType;
  queryParams: any;
}

const PAGE_SIZE = 10;

const Category: NextPage<CategoryProps> = (props) => {
  const {
    menu,
    setting,
    currentMenu = '',
    post,
    typeName,
    type = '',
    platform,
    queryParams,
  } = props;
  const [postList, setPostList] = useState(post.list);
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    setPostList(post.list);
    setPageNo(1);
  }, [props]);

  /**
   * 滚动加载
   */
  const loadMore = async () => {
    const queryPostListResult = await PostServer.indexPostList({
      ...queryParams,
      page: pageNo + 1,
    });
    if (queryPostListResult.data?.list?.length) {
      setPageNo(pageNo + 1);
      setPostList([...postList, ...queryPostListResult.data.list]);
    }
  };

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
  const renderCard = (item: PostType) => {
    return (
      <Link href={`/archives/${item._id}`} key={item._id}>
        <div
          className={classNames({
            [styles['post-list__item']]: true,
            [styles[postClass[item.post_type]]]: true,
          })}
        >
          <If condition={[0, 1, 2].includes(item.post_type)}>
            <div className={styles['post-list__photo']}>
              <Link href={`/archives/${item._id}`}>
                <a>
                  <img
                    src={`//${item.post_cover?.media_url}?imageMogr2/thumbnail/1280x`}
                    loading={'lazy'}
                  />
                </a>
              </Link>
            </div>
          </If>
          <Link href={`/archives/${item._id}`}>
            <a className={styles['post-list__content']}>
              <If condition={item.post_type === 1}>
                <>
                  {item.post_title} {item.movie_name_en} ({dayjs(item.movie_time).format('YYYY')})
                </>
              </If>
              <If condition={[0, 2].includes(item.post_type)}>{item.post_title}</If>
              <If condition={item.post_type === 3}>
                <>
                  “{item.quote_content}” —— {item.quote_author}
                </>
              </If>
            </a>
          </Link>
          <ul className={styles['post-list__info']}>
            <li className={styles['post-list__info-item']}>
              <ClockCircleOutline />
              &nbsp;{dayjs(item.created_at).format('YYYY-MM-DD')}
            </li>
            <li className={styles['post-list__info-item']}>
              <MessageOutline />
              &nbsp;{item.comment_count}&nbsp;条留言
            </li>
            <li className={styles['post-list__info-item']}>
              <EyeOutline />
              &nbsp;{item.post_views}&nbsp;次浏览
            </li>
          </ul>
        </div>
      </Link>
    );
  };

  console.log('postList', postList);

  return (
    <>
      <Header
        title={getTitle()}
        setting={setting}
        menu={menu}
        currentMenu={currentMenu}
        platform={platform}
      />
      <div className={'container'}>
        <If condition={['tags', 'authors'].includes(type)}>
          <div className={styles['post-list__title']}>{getTitle()}</div>
        </If>
        <Choose>
          <When condition={postList.length > 0}>
            <>
              <div className={styles['post-list']}>{postList.map((item) => renderCard(item))}</div>
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={Math.ceil(post.total / PAGE_SIZE) > pageNo}
              />
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

Category.defaultProps = {
  menu: [],
  setting: {
    _id: '',
    site_copyright: '',
    site_name: '',
    site_record_no: '',
    site_record_url: '',
    site_signature: '',
  },
  post: {
    total: 0,
    list: [],
  },
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('getStaticProps', params);

  const props = {} as CategoryProps;
  // 获取菜单信息
  const queryMenuResult = await MenuServer.indexMenu();
  props.menu = queryMenuResult.data.list;

  // 获取网站配置
  const querySettingResult = await SettingServer.indexSetting();
  props.setting = querySettingResult.data[0];

  // 获取列表类型
  props.type = typeof params?.slug !== 'undefined' ? params?.slug[0] : undefined;

  if (props.type && ['category', 'tags', 'authors'].includes(props.type)) {
    const queryParams = {
      post_status: [0],
      limit: PAGE_SIZE,
    } as IIndexPostListParamsType;
    // @ts-ignore
    props.typeName = params?.slug?.pop();
    switch (props.type) {
      case 'category':
        // 获取分类ID
        const categoryId = props.menu.find(
          (item) => item.category_title_en === props.typeName,
        )?._id;
        props.currentMenu = categoryId || '';
        if (typeof categoryId !== 'undefined') {
          queryParams.category_id = categoryId;
        }
        props.typeName =
          props.menu.find((item) => item.category_title_en === props.typeName)?.category_title ||
          '';
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
    try {
      const queryPostListResult = await PostServer.indexPostList(queryParams);
      props.post = {
        list: queryPostListResult.data.list,
        total: queryPostListResult.data.total,
      };
    } catch (e) {
      console.error(99999, e);
    }
  }

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

export default Category;
