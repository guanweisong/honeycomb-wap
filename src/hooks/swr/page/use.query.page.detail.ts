import useSWR from 'swr';
import PageServer from '@/src/services/page';

const useQueryPageDetail = (id: string) => {
  const { data, error } = useSWR(`/pages/${id}`, () => PageServer.indexPageDetail(id));

  return {
    data: data!,
    error,
  };
};

export default useQueryPageDetail;
