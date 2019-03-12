import { Component } from 'react'
import Link from 'next/link';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class Archives extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(appContext) {
    await appContext.store.archivesStore.getDetailData({_id: appContext.query.id});
    return {};
  }
  render() {
    console.log('Archives', this.props);
    const { archivesStore } = this.props.store;
    console.log('render=>archivesStore', archivesStore);
    return (
      <div>
        <If condition={archivesStore.detail !== null}>
          {archivesStore.detail.post_title}
        </If>
        <div>
          <Link href="/category">
            <a>返回到列表页</a>
          </Link>
        </div>
      </div>
    )
  }
}