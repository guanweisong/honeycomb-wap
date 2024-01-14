import React from 'react';
import CommentServer from '@/src/services/comment';
import CommentClient from '@/src/components/Comment/client';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { MenuType } from '@/src/types/menu/MenuType';

export interface CommentProps {
  id: string;
  type: MenuType;
}

const Comment = (props: CommentProps) => {
  const { id, type } = props;
  const queryCommentPromise = CommentServer.index(id, type);
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CommentClient {...props} queryCommentPromise={queryCommentPromise} />
    </NextIntlClientProvider>
  );
};

export default Comment;
