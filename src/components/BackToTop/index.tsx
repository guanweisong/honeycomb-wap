import React, { useEffect, useState } from 'react';
import { useScroll } from 'ahooks';
import { UpOutline } from 'antd-mobile-icons';
import styles from './index.module.less';

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
    <div className={styles['back-to-top']} onClick={goTop}>
      <UpOutline />
    </div>
  ) : (
    <></>
  );
};

export default BackToTop;
