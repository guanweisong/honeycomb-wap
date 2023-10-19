import PageServer from '@/src/services/page';
import React from 'react';
import PostInfo from '@/src/components/PostInfo';
import Comment from '@/src/components/Comment';
import CommentServer from '@/src/services/comment';
import { PageEntity } from '@/src/types/page/page.entity';
import PaginationResponse from '@/src/types/pagination.response';
import { CommentEntity } from '@/src/types/comment/comment.entity';
import Markdown from '@/src/components/Markdown';
import SettingServer from '@/src/services/setting';
import PageTitle from '@/src/components/PageTitle';
import ViewServer from '@/src/services/view';
import { UpdateType } from '@/src/types/view/update.view';

export default async function Pages({ params }: { params: { id: string } }) {
  const { id } = params;

  const promise = [];
  promise.push(PageServer.indexPageDetail(id));
  promise.push(CommentServer.index(id));
  promise.push(ViewServer.updateViews({ type: UpdateType.Page, id }));
  const [pageDetail, commentsData] = (await Promise.all(promise)) as [
    PageEntity,
    PaginationResponse<CommentEntity[]>,
  ];

  return (
    <>
      <PageTitle>{pageDetail.title}</PageTitle>
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
      <Comment id={id} />
    </>
  );
}

export interface GenerateMetadataProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const { id } = props.params;
  const setting = await SettingServer.indexSetting();
  const pageDetail = await PageServer.indexPageDetail(id);

  const title = decodeURI(pageDetail.title as string);

  const openGraph = {
    title: title,
    type: 'article',
    description: setting.siteName,
    images: pageDetail.imagesInContent.map((item) => item.url),
  };

  return {
    title,
    description: setting.siteName,
    openGraph,
  };
}

export async function generateStaticParams() {
  return [];
}
