import PageServer from '@/src/services/page';
import React from 'react';
import PostInfo from '@/src/components/PostInfo';
import Comment from '@/src/components/Comment';
import CommentServer from '@/src/services/comment';
import { MenuType } from '@/src/types/menu/MenuType';
import { PageEntity } from '@/src/types/page/page.entity';
import PaginationResponse from '@/src/types/pagination.response';
import { CommentEntity } from '@/src/types/comment/comment.entity';
import Markdown from '@/src/components/Markdown';

export default async function Pages({ params }: { params: { id: string } }) {
  const { id } = params;

  const promise = [];
  promise.push(PageServer.indexPageDetail(id));
  promise.push(CommentServer.index(id));
  const [pageDetail, commentsData] = (await Promise.all(promise)) as [
    PageEntity,
    PaginationResponse<CommentEntity[]>,
  ];

  return (
    <>
      <h2 className="text-center text-base lg:text-xl pt-2 lg:pt-4 dark:text-gray-400">
        {pageDetail.title}
      </h2>
      <PostInfo
        author={pageDetail.author.name}
        date={pageDetail.createdAt}
        comments={commentsData?.total}
        views={pageDetail.views}
        border={'bottom'}
      />
      <div className="markdown-body py-3 lg:py-5">
        <Markdown children={pageDetail.content} imagesInContent={pageDetail.imagesInContent} />
      </div>
      <Comment id={id} type={MenuType.CATEGORY} />
    </>
  );
}

export interface GenerateMetadataProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const { id } = props.params;
  const pageDetail = await PageServer.indexPageDetail(id);

  return {
    title: decodeURI(pageDetail.title as string),
  };
}

export async function generateStaticParams() {
  return [];
}
