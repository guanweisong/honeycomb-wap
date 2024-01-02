import { MultiLang } from '@/src/types/Language';

export interface SettingEntity {
  id: string;
  siteName: MultiLang;
  siteSubName: MultiLang;
  siteCopyright: MultiLang;
  siteSignature: MultiLang;
  siteRecordNo: string;
  siteRecordUrl: string;
}
