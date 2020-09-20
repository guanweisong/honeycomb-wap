export interface  PageType {
  _id: string;
  page_title?: string;
  page_content?: string;
  page_author: {
    _id: string;
    user_name: string;
  };
  created_at: string;
  updated_at: string;
  page_status: number;
  comment_status: number;
  page_views: number;
  comment_count: number;
}
