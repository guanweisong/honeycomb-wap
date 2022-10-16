import useSWRImmutable from 'swr/immutable';
import PostServer from '@/src/services/post';
import { PostRandomListQuery } from '@/src/types/post/post.random.list.query';

const useQueryPostRandomList = (params: PostRandomListQuery) => {
  const { post_category, number = 10, post_id } = params;
  const { data, error } = useSWRImmutable(
    ['/posts/random', { post_category, number, post_id }],
    () => PostServer.indexRandomPostByCategoryId({ post_category, post_id, number }),
  );

  return {
    data: data!,
    error,
  };
};

export default useQueryPostRandomList;