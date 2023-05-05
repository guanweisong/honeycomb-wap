import { MenuType } from '@/src/types/menu/MenuType';

export interface MenuEntity {
  id: string;
  title?: string;
  titleEn?: string;
  parent: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  isHome?: string;
  type: MenuType;
  power: number;
  children: MenuEntity[];
}
