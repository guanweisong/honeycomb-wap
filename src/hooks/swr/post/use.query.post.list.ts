import useSWRInfinite from 'swr/infinite';
import PostServer from '@/src/services/post';
import { PostListQuery } from '@/src/types/post/post.list.query';
import { PostEntity } from '@/src/types/post/post.entity';

const useQueryPostList = (params: PostListQuery, initData: PostEntity[]) => {
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (index) => ['/posts', { ...params, page: index + 1 }],
    (url, props) => PostServer.indexPostList(props),
    { fallbackData: [initData] },
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    size,
    setSize,
  };
};

export default useQueryPostList;
