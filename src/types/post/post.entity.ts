import { TagEntity } from '../tag/tag.entity';
import { PostStatus } from '@/src/types/post/PostStatus';
import { PostType } from '@/src/types/post/PostType';
import { EnableType } from '@/src/types/EnableType';

export interface PostEntity {
  _id: string;
  post_title?: string;
  post_content?: string;
  post_excerpt?: string;
  post_category: {
    _id: string;
    category_title: string;
  };
  post_author: {
    _id: string;
    user_name: string;
  };
  created_at: string;
  updated_at: string;
  post_status: PostStatus;
  comment_status: EnableType;
  post_views: number;
  post_type: PostType;
  post_cover?: {
    _id: string;
    media_url: string;
  };
  movie_time?: string;
  movie_name_en?: string;
  movie_director?: TagEntity[];
  movie_actor?: TagEntity[];
  movie_style?: TagEntity[];
  gallery_location?: string;
  gallery_time?: string;
  gallery_style?: TagEntity[];
  quote_author?: string;
  quote_content?: string;
  comment_count: number;
}
