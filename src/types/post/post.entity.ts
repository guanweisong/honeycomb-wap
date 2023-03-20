import { TagEntity } from '../tag/tag.entity';
import { PostStatus } from '@/src/types/post/PostStatus';
import { PostType } from '@/src/types/post/PostType';
import { EnableType } from '@/src/types/EnableType';

export interface PostEntity {
  id: string;
  title?: string;
  content?: string;
  excerpt?: string;
  category: {
    id: string;
    title: string;
  };
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  status: PostStatus;
  commentStatus: EnableType;
  views: number;
  type: PostType;
  cover?: {
    id: string;
    url: string;
  };
  movieTime?: string;
  movieNameEn?: string;
  movieDirectors?: TagEntity[];
  movieActors?: TagEntity[];
  movieStyles?: TagEntity[];
  galleryLocation?: string;
  galleryTime?: string;
  galleryStyles?: TagEntity[];
  quoteAuthor?: string;
  quoteContent?: string;
  commentCount: number;
}
