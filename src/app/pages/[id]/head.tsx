import PageServer from '@/src/services/page';

export default async function Head(props) {
  const { params } = props;
  const { id } = params;
  const pageDetail = await PageServer.indexPageDetail(id);

  return (
    <>
      <title>{pageDetail.page_title}</title>
    </>
  );
}
