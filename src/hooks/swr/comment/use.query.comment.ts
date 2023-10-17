import useSWR from 'swr';
import CommentServer from '@/src/services/comment';

const useQueryComment = (id: string) => {
  const { data, error, mutate } = useSWR(`/comments/${id}`, () => CommentServer.index(id));

  return {
    comment: data,
    mutate,
    error,
  };
};

export default useQueryComment;
