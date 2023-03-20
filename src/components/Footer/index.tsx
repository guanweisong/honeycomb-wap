import dayjs from 'dayjs';
import SettingServer from '@/src/services/setting';

export default async function Footer() {
  const setting = await SettingServer.indexSetting();

  return (
    <div className="text-center py-2 px-2 text-xs text-gray-500 lg:py-4">
      <div>{setting.siteSignature}</div>
      <div>
        ©{dayjs().format('YYYY')}&nbsp;{setting.siteCopyright}
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
