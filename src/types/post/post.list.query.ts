import { PostStatus } from '@/src/types/post/PostStatus';

export interface PostListQuery {
  category_id?: string;
  post_status?: PostStatus[];
  page?: number;
  limit?: number;
  tag_name?: string;
  user_name?: string;
  firstCategory?: string;
  secondCategory?: string;
  asPath?: string;
}
