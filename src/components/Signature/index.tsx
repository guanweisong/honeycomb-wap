import React from 'react';
import styles from './index.less';

interface IProps {
  text: string;
}

const Signature = (props: IProps) => {
  return (
    <div className={styles.signature}>
      <span className={styles["signature__line"]}/>
      <span className={styles["signature__text"]}>{props.text}</span>
      <span className={styles["signature__line"]}/>
    </div>
  )
}

export default Signature;
