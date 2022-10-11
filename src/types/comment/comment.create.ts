import { Captcha } from '@/src/types/Captcha';

export interface CommentCreate {
  comment_post: string;
  comment_email: string;
  comment_content: string;
  comment_author: string;
  captcha: Captcha;
}
