import useSWRImmutable from 'swr/immutable';
import ViewServer from '@/src/services/view';
import { UpdateView } from '@/src/types/view/update.view';

const useUpdateViews = (params: UpdateView) => {
  const { data, error } = useSWRImmutable(`/${params.type}/${params.id}/views`, () =>
    ViewServer.updateViews({ ...params }),
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUpdateViews;
