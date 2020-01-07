import { PostStateType } from '../models/post';
import { MenuStateType } from '../models/menu';
import { SettingStateType } from '../models/setting';
import { CommentStateType } from '../models/comment';

export interface GlobalStoreType {
  post: PostStateType;
  menu: MenuStateType;
  setting: SettingStateType;
  comment: CommentStateType;
}
