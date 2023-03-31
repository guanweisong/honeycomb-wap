import PageServer from '@/src/services/page';
import React from 'react';
import PostInfo from '@/src/components/PostInfo';
import Comment from '@/src/components/Comment';
import CommentServer from '@/src/services/comment';
import { MenuType } from '@/src/types/menu/MenuType';
import Layout from '@/src/components/Layout';

export default async function Pages({ params }: { params: { id: string } }) {
  const { id } = params;
  const pageDetail = await PageServer.indexPageDetail(id);
  const commentsData = await CommentServer.index(id);

  return (
    <Layout currentMenu={pageDetail.id}>
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
      <div
        className="markdown-body py-3 lg:py-5"
        dangerouslySetInnerHTML={{ __html: pageDetail.content ?? '' }}
      />
      <Comment id={id} type={MenuType.CATEGORY} />
    </Layout>
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
