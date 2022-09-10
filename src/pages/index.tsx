import { useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace('/list/category');
  }, []);

  return <></>;
};

export default Index;
