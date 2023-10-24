import LinkServer from '@/src/services/link';
import { LinkStatus } from '@/src/types/link/LinkStatus';
import NoData from '@/src/components/NoData';
import Comment from '@/src/components/Comment';
import PageTitle from '@/src/components/PageTitle';
import SettingServer from '@/src/services/setting';

const Links = async () => {
  const result = await LinkServer.index({
    limit: 9999,
    status: [LinkStatus.ENABLE],
  });
  return (
    <div>
      <PageTitle>海内存知己，天涯若比邻</PageTitle>
      {result.total > 0 ? (
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
        <NoData title="暂无邻居" />
      )}
      <div className="dark:text-gray-400">
        <div className="mb-2">申请友链步骤：</div>
        <div className="p-2 bg-gray-50 dark:bg-gray-700 ">
          <div>1、在贵站加上本站友链</div>
          <div className="bg-white dark:bg-gray-800 my-1 px-1 py-1">
            <div>名称: 稻草人博客</div>
            <div>链接: https://guanwisong.com</div>
            <div>Logo: https://guanwisong.com/static/images/logo.192.png</div>
            <div>描述: 稻草人的自留地</div>
          </div>
          <div>2、在此页面留言区留下贵站信息</div>
          <div>3、本站核实信息后添加贵站友链</div>
        </div>
      </div>
      <Comment id="5349b4ddd2781d08c09890f3" />
    </div>
  );
};

export async function generateMetadata() {
  const setting = await SettingServer.indexSetting();
  const title = '比邻';

  const openGraph = {
    title,
    type: 'article',
    description: setting.siteName,
    images: ['/static/images/logo.png'],
  };

  return {
    title,
    description: setting.siteName,
    openGraph,
  };
}

export async function generateStaticParams() {
  return [];
}

export default Links;
