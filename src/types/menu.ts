export interface MenuType {
  _id: string;
  category_title?: string;
  category_title_en?: string;
  parent: string;
  category_status: number;
  created_at: string;
  updated_at: string;
  isHome?: string;
  type: 0 | 1;
  page_title?: string;
  power: number;
  children: MenuType[];
}
