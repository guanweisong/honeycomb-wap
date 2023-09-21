'use client';

import Image from 'next/image';
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
  // @ts-ignore
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
      <Link href={`/archives/${item.id}`} key={item.id} legacyBehavior>
        <div className="mt-4 first:mt-0">
          {[PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(item.type) && (
            <Link href={`/archives/${item.id}`}>
              <Image
                src={`https://${item.cover?.url}`}
                width={item.cover?.width}
                height={item.cover?.height}
                alt={item.title ?? ''}
              />
            </Link>
          )}
          <Link
            href={`/archives/${item.id}`}
            className="p-2 lg:p-4 text-center block text-base lg:text-lg dark:text-gray-400"
          >
            {item.type === PostType.MOVIE && (
              <>
                {item.title} {item.movieNameEn} ({dayjs(item.movieTime).format('YYYY')})
              </>
            )}
            {[PostType.ARTICLE, PostType.PHOTOGRAPH].includes(item.type) && <>{item.title}</>}
            {item.type === PostType.QUOTE && (
              <>
                “{item.quoteContent}” —— {item.quoteAuthor}
              </>
            )}
          </Link>
          <PostInfo
            author={item.author.name}
            date={item.createdAt}
            comments={item.commentCount}
            views={item.views}
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
