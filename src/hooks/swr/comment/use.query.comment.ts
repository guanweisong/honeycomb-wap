import useSWR from 'swr';
import CommentServer from '@/src/services/comment';

const useQueryComment = (id: string) => {
  const { data, error } = useSWR(`/comments/${id}`, () => CommentServer.index(id));

  return {
    data: data!,
    error,
  };
};

export default useQueryComment;
