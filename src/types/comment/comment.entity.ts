import { CommentStatus } from '@/src/types/comment/CommentStatus';

export interface CommentEntity {
  id: string;
  postId: string;
  author: string;
  email: string;
  ip: string;
  site?: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: CommentStatus;
  userAgent: string;
  parent: string;
  avatar: string;
  children: CommentEntity[];
}
