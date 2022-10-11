import { PageStatus } from '@/src/types/page/PageStatus';
import { EnableType } from '@/src/types/EnableType';

export interface PageEntity {
  _id: string;
  page_title?: string;
  page_content?: string;
  page_author: {
    _id: string;
    user_name: string;
  };
  created_at: string;
  updated_at: string;
  page_status: PageStatus;
  comment_status: EnableType;
  page_views: number;
  comment_count: number;
}
