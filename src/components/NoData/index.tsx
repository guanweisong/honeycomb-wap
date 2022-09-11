import React from 'react';
import styles from './index.module.less';

export interface INoData {
  title: string;
}

const NoData = (props: INoData) => {
  const { title } = props;

  return <div className={styles.noData}>{title}</div>;
};

export default NoData;
