import request from '@/src/utils/request';
import { PostEntity } from '@/src/types/post/post.entity';
import PaginationResponse from '@/src/types/pagination.response';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { PostRandomListQuery } from '@/src/types/post/post.random.list.query';

export default class PostServer {
  // 获取文章列表
  static indexPostList(params: PostListQuery): Promise<PostEntity[]> {
    console.log('category=>service=>indexPostList');
    return request<string, PaginationResponse<PostEntity[]>>({
      url: '/post',
      method: 'get',
      params: params,
    }).then((result) => result?.list ?? []);
  }

  // 获取文章详情
  static indexPostDetail(id: string): Promise<PostEntity> {
    console.log('post=>service=>indexPostDetail');
    return request({
      url: `/post/${id}`,
      method: 'get',
    });
  }

  // 获取随机文章列表
  static indexRandomPostByCategoryId(params: PostRandomListQuery): Promise<PostEntity[]> {
    console.log('post=>service=>indexRandomPostByCategoryId');
    const { post_category, post_id, ...rest } = params;
    return request<string, PostEntity[]>({
      url: `/post/${post_category}/random`,
      method: 'get',
      params: rest,
    }).then((result) => result?.filter((item) => item._id !== post_id) ?? []);
  }
}
