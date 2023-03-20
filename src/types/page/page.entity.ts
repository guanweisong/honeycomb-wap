import { PageStatus } from '@/src/types/page/PageStatus';
import { EnableType } from '@/src/types/EnableType';

export interface PageEntity {
  id: string;
  title?: string;
  content?: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  status: PageStatus;
  commentStatus: EnableType;
  views: number;
  commentCount: number;
}
