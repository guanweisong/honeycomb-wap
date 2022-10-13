import useSWR from 'swr';
import SettingServer from '@/src/services/setting';

const useQuerySetting = () => {
  const { data, error } = useSWR('/settings', () => SettingServer.indexSetting());

  return {
    data: data!,
    error,
  };
};

export default useQuerySetting;
