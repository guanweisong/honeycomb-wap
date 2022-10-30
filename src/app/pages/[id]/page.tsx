import PageServer from '@/src/services/page';
import React from 'react';
import PostInfo from '@/src/components/PostInfo';
import Comment from '@/src/components/Comment';
import CommentServer from '@/src/services/comment';
import { MenuType } from '@/src/types/menu/MenuType';

export default async function Pages(props) {
  const { params } = props;
  const { id } = params;
  const pageDetail = await PageServer.indexPageDetail(id);
  const commentsData = await CommentServer.index(id);

  return (
    <>
      <h2 className="text-center text-base lg:text-xl pt-2 lg:pt-4 dark:text-gray-400">
        {pageDetail.page_title}
      </h2>
      <PostInfo
        author={pageDetail.page_author.user_name}
        date={pageDetail.created_at}
        comments={commentsData?.total}
        views={pageDetail.page_views}
        border={'bottom'}
      />
      <div
        className="markdown-body py-3 lg:py-5"
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: pageDetail.page_content }}
      />
      <Comment id={id} type={MenuType.PAGE} />
    </>
  );
}
