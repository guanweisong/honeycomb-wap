export interface CommentType {
  _id: string;
  comment_post: string;
  comment_author: string;
  comment_email: string;
  comment_ip: string;
  created_at: string;
  updated_at: string;
  comment_content: string;
  comment_status: number;
  comment_agent: string;
  comment_parent: string;
  comment_avatar: string;
  children: CommentType[];
}
