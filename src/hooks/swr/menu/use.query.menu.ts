import useSWR from 'swr';
import MenuServer from '@/src/services/menu';

const useQueryMenu = () => {
  const { data, error } = useSWR(`/menus`, () => MenuServer.indexMenu());

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQueryMenu;
