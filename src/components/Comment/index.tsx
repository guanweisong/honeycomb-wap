import React from 'react';
import CommentServer from '@/src/services/comment';
import CommentClient from '@/src/components/Comment/client';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export interface CommentProps {
  id: string;
}

const Comment = (props: CommentProps) => {
  const { id } = props;
  const queryCommentPromise = CommentServer.index(id);
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CommentClient {...props} queryCommentPromise={queryCommentPromise} />
    </NextIntlClientProvider>
  );
};

export default Comment;
