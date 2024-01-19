'use client';

import React, { useEffect, useState } from 'react';
import { useScroll } from 'ahooks';
import { UpOutline } from 'antd-mobile-icons';

const BackToTop = () => {
  const scroll = useScroll();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // @ts-ignore
    setShow(scroll?.top > 300);
  }, [scroll?.top]);

  const goTop = () => {
    window.scrollTo(0, 0);
  };

  return show ? (
    <a
      className="fixed text-3xl translate-x-96 transition-all bottom-10 right-1/3 bg-auto-back-gray w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-xl"
      onClick={goTop}
    >
      <UpOutline />
    </a>
  ) : (
    <></>
  );
};

export default BackToTop;
