import { PostStatus } from '@/src/types/post/PostStatus';

export interface PostListQuery {
  categoryId?: string;
  status?: PostStatus[];
  page?: number;
  limit?: number;
  tagName?: string;
  userName?: string;
  firstCategory?: string;
  secondCategory?: string;
  asPath?: string;
}
