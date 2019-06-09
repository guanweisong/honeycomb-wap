import React, { PureComponent } from 'react';
import styles from './index.less';

export default class Signature extends PureComponent {
  render () {
    return (
      <div className={styles.signature}>
        <span className={styles["signature__line"]}></span>
        <span className={styles["signature__text"]}>{this.props.text}</span>
        <span className={styles["signature__line"]}></span>
      </div>
    )
  }
}
