import useSWR from 'swr';
import PostServer from '@/src/services/post';

const useQueryPostDetail = (id: string) => {
  const { data, error } = useSWR(`/posts/${id}`, () => PostServer.indexPostDetail(id));

  return {
    data: data!,
    error,
  };
};

export default useQueryPostDetail;
