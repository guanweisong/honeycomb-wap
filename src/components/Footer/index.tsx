import { SettingType } from '@/src/types/setting';
import dayjs from 'dayjs';
import styles from './index.module.less';

export interface FooterProps {
  setting: SettingType;
}

const Footer = (props: FooterProps) => {
  const { setting } = props;

  return (
    <div className={styles.footer}>
      <div>{setting.site_signature}</div>
      <div>
        ©{dayjs().format('YYYY')}&nbsp;{setting.site_copyright}
      </div>
      <div>
        {setting.site_record_no ? (
          setting.site_record_url ? (
            <a
              href={`${setting.site_record_url}`}
              target="_blank"
              rel="nofollow"
              className="link-light"
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
