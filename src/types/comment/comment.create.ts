import { Captcha } from '@/src/types/Captcha';

export interface CommentCreate {
  postId: string;
  email: string;
  content: string;
  author: string;
  captcha: Captcha;
}
