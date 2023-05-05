import request from '@/src/utils/request';
import { PostEntity } from '@/src/types/post/post.entity';
import PaginationResponse from '@/src/types/pagination.response';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { PostRandomListQuery } from '@/src/types/post/post.random.list.query';
import { cache } from 'react';

export default class PostServer {
  // 获取文章列表
  static indexPostList = cache((params: PostListQuery): Promise<PostEntity[]> => {
    console.log('category=>service=>indexPostList');
    return request<string, PaginationResponse<PostEntity[]>>({
      url: '/post',
      method: 'get',
      params: params,
    }).then((result) => result?.list ?? []);
  });

  // 获取文章详情
  static indexPostDetail = cache((id: string): Promise<PostEntity> => {
    console.log('post=>service=>indexPostDetail');
    return request({
      url: `/post/${id}`,
      method: 'get',
    });
  });

  // 获取随机文章列表
  static indexRandomPostByCategoryId = cache(
    (params: PostRandomListQuery): Promise<PostEntity[]> => {
      console.log('post=>service=>indexRandomPostByCategoryId');
      const { postCategory, postId, ...rest } = params;
      return request<string, PostEntity[]>({
        url: `/post/${postCategory}/random`,
        method: 'get',
        params: rest,
      }).then((result) => result?.filter((item) => item.id !== postId) ?? []);
    },
  );
}
