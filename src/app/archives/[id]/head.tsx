import PostServer from '@/src/services/post';
import { PostType } from '@/src/types/post/PostType';
import dayjs from 'dayjs';

export default async function Head({ params }: { params: { id: string } }) {
  const { id } = params;
  const postDetail = await PostServer.indexPostDetail(id);

  /**
   * 格式化文章标题
   */
  const getTitle = () => {
    return postDetail.post_type === PostType.MOVIE
      ? `${postDetail.post_title} ${postDetail.movie_name_en} (${dayjs(
          postDetail.movie_time,
        ).format('YYYY')})`
      : postDetail.post_title;
  };

  return (
    <>
      <title>{getTitle()}</title>
    </>
  );
}
