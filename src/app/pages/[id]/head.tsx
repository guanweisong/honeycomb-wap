import PageServer from '@/src/services/page';

export default async function Head({ params }: { params: { id: string } }) {
  const { id } = params;
  const pageDetail = await PageServer.indexPageDetail(id);

  return (
    <>
      <title>{pageDetail.title}</title>
    </>
  );
}
