import request from '@/utils/request';

interface CaptchaType {
  randstr: string;
  ticket: string;
}

interface creatCommentType extends CaptchaType {
  comment_post: string;
  comment_email: string;
  comment_content: string;
  comment_author: string;
}

export const index = (id: string) => {
  console.log('comment=>service=>index');
  return request({
    url: `/comments/${id}`,
    method: 'get',
  })
};

export const create = (params: creatCommentType) => {
  console.log('comment=>service=>create', params);
  return request({
    url: '/comments',
    method: 'post',
    data: params,
  })
};

