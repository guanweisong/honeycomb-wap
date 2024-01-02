import LinkServer from '@/src/services/link';
import { LinkStatus } from '@/src/types/link/LinkStatus';
import NoData from '@/src/components/NoData';
import Comment from '@/src/components/Comment';
import PageTitle from '@/src/components/PageTitle';
import SettingServer from '@/src/services/setting';
import { getLocale, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

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
        <div className="divide-y divide-dashed py-2 lg:py-4">
          {result.list.map((item) => (
            <a href={item.url} target="_blank" className="flex items-center py-2">
              <span
                className="inline-block w-10 h-10 bg-no-repeat bg-center bg-contain mr-2"
                style={{ backgroundImage: `url(${item.logo})` }}
              />
              <div>
                <div className="text-base">{item.name}</div>
                <div className="text-gray-400">{item.description}</div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <NoData title={t('emptyTip')} />
      )}
      <div className="dark:text-gray-400">
        <div className="mb-1">{t('applyStep.title')}</div>
        <div className="p-2 bg-gray-50 dark:bg-gray-700 ">
          <div>{t('applyStep.stepOne')}</div>
          <div className="text-xs border border-dashed border-gray-300 dark:border-gray-900 my-1 px-1 py-1">
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
      <Comment id="5349b4ddd2781d08c09890f3" />
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
