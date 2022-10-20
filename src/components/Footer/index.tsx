import { SettingEntity } from '@/src/types/setting/setting.entity';
import dayjs from 'dayjs';

export interface FooterProps {
  setting: SettingEntity;
}

const Footer = (props: FooterProps) => {
  const { setting } = props;

  return (
    <div className="text-center py-2 px-2 text-xs text-gray-500 lg:py-4">
      <div>{setting.site_signature}</div>
      <div>
        ©{dayjs().format('YYYY')}&nbsp;{setting.site_copyright}
      </div>
      <div>
        {setting.site_record_no ? (
          setting.site_record_url ? (
            <a
              className="link-light"
              href={`${setting.site_record_url}`}
              target="_blank"
              rel="nofollow"
            >
              {setting.site_record_no}
            </a>
          ) : (
            setting.site_record_no
          )
        ) : null}
      </div>
    </div>
  );
};

export default Footer;
