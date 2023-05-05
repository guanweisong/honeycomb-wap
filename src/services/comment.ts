import request from '@/src/utils/request';
import { CommentCreate } from '@/src/types/comment/comment.create';
import PaginationResponse from '@/src/types/pagination.response';
import { CommentEntity } from '@/src/types/comment/comment.entity';

export default class CommentServer {
  // 根据文章id获取评论列表
  static index(id: string): Promise<PaginationResponse<CommentEntity[]>> {
    console.log('comment=>service=>index');
    return request({
      url: `/comment/${id}`,
      method: 'get',
    });
  }

  // 创建评论
  static create(params: CommentCreate): Promise<CommentEntity> {
    console.log('comment=>service=>create', params);
    return request({
      url: '/comment',
      method: 'post',
      data: params,
    });
  }
}
