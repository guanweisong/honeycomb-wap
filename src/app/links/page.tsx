import LinkServer from '@/src/services/link';
import { LinkStatus } from '@/src/types/link/LinkStatus';
import NoData from '@/src/components/NoData';
import Comment from '@/src/components/Comment';

const Links = async () => {
  const result = await LinkServer.index({
    limit: 9999,
    status: [LinkStatus.ENABLE],
  });
  return (
    <div>
      <div className="text-lg">海内存知己，天涯若比邻</div>
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
      <Comment id="5349b4ddd2781d08c09890f3" />
    </div>
  );
};

export default Links;
