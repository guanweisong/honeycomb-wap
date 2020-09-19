import request from '@/src/utils/request';

export interface CaptchaType {
  randstr: string;
  ticket: string;
}

export interface creatCommentType {
  comment_post: string;
  comment_email: string;
  comment_content: string;
  comment_author: string;
  captcha: CaptchaType;
}

export default class CommentServer {
  // 根据文章id获取评论列表
  static index(id: string){
    console.log('comment=>service=>index');
    return request({
      url: `/comments/${id}`,
      method: 'get',
    })
  };

  // 创建评论
  static create(params: creatCommentType) {
    console.log('comment=>service=>create', params);
    return request({
      url: '/comments',
      method: 'post',
      data: params,
    })
  };
}
