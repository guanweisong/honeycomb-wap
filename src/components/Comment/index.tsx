import React from 'react';
import CommentServer from '@/src/services/comment';
import { MenuType } from '@/src/types/menu/MenuType';
import CommentClient from '@/src/components/Comment/client';
import { CommentCreate } from '@/src/types/comment/comment.create';

export interface CommentProps {
  id: string;
  type?: MenuType;
}

const Comment = (props: CommentProps) => {
  const { id } = props;
  const queryCommentPromise = CommentServer.index(id);
  const createCommentFn = async (params: CommentCreate) => {
    'use server';
    return CommentServer.create(params);
  };

  return (
    <CommentClient
      {...props}
      createCommentFn={createCommentFn}
      queryCommentPromise={queryCommentPromise}
    />
  );
};

export default Comment;
