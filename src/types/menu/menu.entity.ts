import { MenuType } from '@/src/types/menu/MenuType';
import { MultiLang } from '@/src/types/Language';

export interface MenuEntity {
  id: string;
  title?: MultiLang;
  path: string;
  parent?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  isHome?: boolean;
  type?: MenuType;
  power?: number;
  url?: string;
  children: MenuEntity[];
}
