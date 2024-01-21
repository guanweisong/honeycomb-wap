import dayjs from 'dayjs';
import SettingServer from '@/src/services/setting';
import { useLocale } from 'next-intl';
import { MultiLang } from '@/src/types/Language';

export default async function Footer() {
  const setting = await SettingServer.indexSetting();
  const locale = useLocale() as keyof MultiLang;

  return (
    <div className="text-center py-4 px-2 text-xs text-auto-front-gray/40">
      <div>{setting.siteSignature[locale]}</div>
      <div>
        ©{dayjs().format('YYYY')}&nbsp;{setting.siteCopyright[locale]}
      </div>
      <div>
        {setting.siteRecordNo ? (
          setting.siteRecordUrl ? (
            <a
              className="link-light"
              href={`${setting.siteRecordUrl}`}
              target="_blank"
              rel="nofollow"
            >
              {setting.siteRecordNo}
            </a>
          ) : (
            setting.siteRecordNo
          )
        ) : null}
      </div>
    </div>
  );
}
