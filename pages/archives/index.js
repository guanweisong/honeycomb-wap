import { Component } from 'react'
import Link from 'next/link';
import Header from '../../components/Header';
import WithDva from "../../utils/store";

@WithDva(store => store)
class Archives extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(props) {
    await props.store.dispatch({
      type: 'archives/getDetailData',
      payload: {
        _id: props.query.id
      }
    });
    return {};
  }
  render() {
    const { archives } = this.props;
    console.log('render=>archivesStore', archives);
    return (
      <div>
        <Header/>
        <If condition={archives.detail !== null}>
          {archives.detail.post_title}
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