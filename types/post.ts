import { TagType } from './tag';

export interface PostType {
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
  post_status: number;
  comment_status: number;
  post_views: number;
  post_type: number;
  post_cover?: {
    _id: string;
    media_url: string;
    media_url_720p?: string;
    media_url_360p?: string;
  };
  movie_time?: string;
  movie_name_en?: string;
  movie_director?: TagType [];
  movie_actor?: TagType [];
  movie_style?: TagType [];
  gallery_location?: string;
  gallery_time?: string;
  gallery_style?: TagType [];
  quote_author?: string;
  quote_content?: string;
  comment_count: number;
}
