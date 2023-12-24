import React from 'react';
import CommentServer from '@/src/services/comment';
import CommentClient from '@/src/components/Comment/client';
import { CommentCreate } from '@/src/types/comment/comment.create';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export interface CommentProps {
  id: string;
}

const Comment = (props: CommentProps) => {
  const { id } = props;
  const queryCommentPromise = CommentServer.index(id);
  const messages = useMessages();

  const createCommentFn = async (params: CommentCreate) => {
    'use server';
    return CommentServer.create(params);
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <CommentClient
        {...props}
        createCommentFn={createCommentFn}
        queryCommentPromise={queryCommentPromise}
      />
    </NextIntlClientProvider>
  );
};

export default Comment;
