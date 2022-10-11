import useSWR from 'swr';
import PostServer from '@/src/services/post';

const useQueryPostDetail = (id: string) => {
  const { data, error } = useSWR(`/posts/${id}`, () => PostServer.indexPostDetail(id));

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQueryPostDetail;
