'use client';

import Image from 'next/image';
import { PostEntity } from '@/src/types/post/post.entity';
import useQueryPostList from '@/src/hooks/swr/post/use.query.post.list';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { useScroll } from 'ahooks';
import React, { useEffect } from 'react';
import { Link } from '@/src/navigation';
import { PostType, PostTypeName, PostTypeBgColor } from '@/src/types/post/PostType';
import PostInfo, { Align } from '@/src/components/PostInfo';
import Signature from '@/src/components/Signature';
import { AutoCenter, DotLoading } from 'antd-mobile';
import { utcFormat } from '@/src/utils/utcFormat';
import { NextIntlClientProvider, useLocale, useMessages, useTranslations } from 'next-intl';
import { MultiLang } from '@/src/types/Language';
import classNames from 'classnames';

export interface PostListProps {
  initData: PostEntity[];
  queryParams: PostListQuery;
  pageSize: Number;
}

export default function PostList(props: PostListProps) {
  const { initData, queryParams, pageSize } = props;
  const scroll = useScroll(typeof document !== 'undefined' ? document : null);
  const { data, size, setSize } = useQueryPostList(queryParams, initData);
  const messages = useMessages();
  const locale = useLocale() as keyof MultiLang;
  const t = useTranslations('PostList');

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
          {[PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(item.type) &&
            item.cover?.url && (
              <Link href={`/archives/${item.id}`} className="relative">
                <Image
                  priority={true}
                  src={item.cover?.url ?? ''}
                  width={item.cover?.width}
                  height={item.cover?.height}
                  alt={item.title?.[locale] ?? ''}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 33vw"
                />
                <span
                  className={classNames(
                    'absolute left-2 top-2 text-white rounded py-0.5 lg:py-1 px-1 lg:px-2',
                    [PostTypeBgColor[item.type]],
                  )}
                >
                  {PostTypeName[item.type]}
                </span>
              </Link>
            )}
          <div className="p-2 lg:p-4">
            <Link href={`/archives/${item.id}`} className="block text-lg">
              {item.type === PostType.MOVIE && (
                <>
                  {item.title?.[locale]} ({utcFormat(item.movieTime!, 'YYYY')})
                </>
              )}
              {[PostType.ARTICLE, PostType.PHOTOGRAPH].includes(item.type) && (
                <>{item.title?.[locale]}</>
              )}
              {item.type === PostType.QUOTE && (
                <>
                  “{item.quoteContent?.[locale]}” —— {item.quoteAuthor?.[locale]}
                </>
              )}
            </Link>
            {item.excerpt?.[locale] && (
              <div className="text-sm lg:my-2">{item.excerpt?.[locale]}</div>
            )}
            <NextIntlClientProvider messages={messages} locale={locale}>
              <PostInfo
                author={item.author.name}
                date={item.createdAt}
                comments={item.commentCount}
                views={item.views}
                align={Align.Left}
              />
            </NextIntlClientProvider>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <div>{postList.map((item) => renderCard(item))}</div>
      {isEnd && <Signature text={t('listEnd')} />}
      {isLoadingMore && (
        <AutoCenter>
          <DotLoading />
        </AutoCenter>
      )}
    </>
  );
}
