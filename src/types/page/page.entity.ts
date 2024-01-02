import { PageStatus } from '@/src/types/page/PageStatus';
import { EnableType } from '@/src/types/EnableType';
import { MediaEntity } from '@/src/types/media/media.entity';
import { MultiLang } from '@/src/types/Language';

export interface PageEntity {
  id: string;
  title?: MultiLang;
  content?: MultiLang;
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
  imagesInContent: MediaEntity[];
}
