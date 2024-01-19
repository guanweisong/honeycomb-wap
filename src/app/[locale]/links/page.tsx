import LinkServer from '@/src/services/link';
import { LinkStatus } from '@/src/types/link/LinkStatus';
import NoData from '@/src/components/NoData';
import Comment from '@/src/components/Comment';
import PageTitle from '@/src/components/PageTitle';
import SettingServer from '@/src/services/setting';
import { getLocale, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { MenuType } from '@/src/types/menu/MenuType';
import classNames from 'classnames';

const Links = async ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('Link');
  const result = await LinkServer.index({
    limit: 9999,
    status: [LinkStatus.ENABLE],
  });
  const setting = await SettingServer.indexSetting();
  return (
    <div>
      <PageTitle>{t('slogan')}</PageTitle>
      {result?.total > 0 ? (
        <div className="py-2 lg:py-4">
          {result.list.map((item, index) => (
            <a
              href={item.url}
              target="_blank"
              className={classNames('flex items-center py-2', {
                'border-t-0.5 border-dashed border-auto-front-gray/30': index > 0,
              })}
            >
              <span
                className="inline-block w-10 h-10 bg-no-repeat bg-center bg-contain mr-2"
                style={{ backgroundImage: `url(${item.logo})` }}
              />
              <div>
                <div className="text-base">{item.name}</div>
                <div className="text-auto-front-gray/50">{item.description}</div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <NoData title={t('emptyTip')} />
      )}
      <div>
        <div className="mb-1">{t('applyStep.title')}</div>
        <div>
          <div>{t('applyStep.stepOne')}</div>
          <div className="text-xs border-0.5 border-dashed border-auto-front-gray/50 my-1 px-1 py-1">
            <div>
              {t('applyStep.nameLabel')}: {setting.siteName?.[locale]}
            </div>
            <div>{t('applyStep.linkLabel')}: https://guanweisong.com</div>
            <div>Logo: https://guanweisong.com/static/images/logo.192.png</div>
            <div>
              {t('applyStep.descLabel')}: {setting.siteSubName?.[locale]}
            </div>
          </div>
          <div>{t('applyStep.stepTwo')}</div>
          <div>{t('applyStep.stepThree')}</div>
        </div>
      </div>
      <Comment id={setting.customObjectId.link} type={MenuType.CUSTOM} />
    </div>
  );
};

export async function generateMetadata() {
  const t = await getTranslations('Link');
  const setting = await SettingServer.indexSetting();
  const locale = await getLocale();
  const title = t('title');

  const openGraph = {
    title,
    type: 'article',
    description: setting.siteName?.[locale],
    images: ['/static/images/logo.png'],
  };

  return {
    title,
    description: setting.siteName?.[locale],
    openGraph,
  };
}

export async function generateStaticParams() {
  return [];
}

export default Links;
