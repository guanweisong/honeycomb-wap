'use client';

import { PostEntity } from '@/src/types/post/post.entity';
import useQueryPostList from '@/src/hooks/swr/post/use.query.post.list';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { useScroll } from 'ahooks';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { PostType } from '@/src/types/post/PostType';
import dayjs from 'dayjs';
import PostInfo from '@/src/components/PostInfo';
import Signature from '@/src/components/Signature';
import { AutoCenter, DotLoading } from 'antd-mobile';

export interface PostListProps {
  initData: PostEntity[];
  queryParams: PostListQuery;
  pageSize: Number;
}

export default function PostList(props: PostListProps) {
  const { initData, queryParams, pageSize } = props;
  const scroll = useScroll(typeof document !== 'undefined' ? document : null);
  const { data, size, setSize } = useQueryPostList(queryParams, initData);

  const postList = data.flat();
  const isEnd = data[data.length - 1]?.length < pageSize;
  const isLoadingMore = typeof data[size - 1] === 'undefined';

  useEffect(() => {
    if (typeof document !== 'undefined' && !isLoadingMore && !isEnd) {
      const { top = 0 } = scroll ?? {};
      const documentHeight = document.body.scrollHeight;
      const scrollTop = top + window.innerHeight;
      const difference = documentHeight - scrollTop;
      if (difference < 300) {
        setSize(size + 1);
      }
    }
  }, [scroll, isLoadingMore]);

  /**
   * 渲染列表卡片
   * @param item
   */
  const renderCard = (item: PostEntity) => {
    return (
      <Link href={`/archives/${item._id}`} key={item._id} legacyBehavior>
        <div className="mt-4 first:mt-0">
          <If
            condition={[PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(
              item.post_type,
            )}
          >
            <div>
              <Link href={`/archives/${item._id}`}>
                <img
                  className="w-full"
                  src={`//${item.post_cover?.media_url}?imageMogr2/thumbnail/1280x`}
                  loading={'lazy'}
                />
              </Link>
            </div>
          </If>
          <Link
            href={`/archives/${item._id}`}
            className="p-2 lg:p-4 text-center block text-base lg:text-lg dark:text-gray-400"
          >
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
      <div>{postList.map((item) => renderCard(item))}</div>
      {isEnd && <Signature text={'到底了'} />}
      {isLoadingMore && (
        <AutoCenter>
          <DotLoading />
        </AutoCenter>
      )}
    </>
  );
}
