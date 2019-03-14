import { Component } from 'react'
import Link from 'next/link';
import { inject, observer } from 'mobx-react';
import Header from '../../components/Header';

@inject('store')
@observer
class Archives extends Component {
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
        <Header/>
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

export default Archives;