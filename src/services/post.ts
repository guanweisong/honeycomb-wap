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
      url: '/posts',
      method: 'get',
      params: params,
    }).then((result) => result.list);
  }

  // 获取文章详情
  static indexPostDetail(id: string): Promise<PostEntity> {
    console.log('post=>service=>indexPostDetail');
    return request({
      url: `/posts/${id}`,
      method: 'get',
    });
  }

  // 获取随机文章列表
  static indexRandomPostByCategoryId(params: PostRandomListQuery): Promise<PostEntity[]> {
    console.log('post=>service=>indexRandomPostByCategoryId');
    return request<string, PostEntity[]>({
      url: '/posts/random',
      method: 'get',
      params: params,
    }).then((result) => result.filter((item) => item._id !== params.post_id));
  }
}
