import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { Button } from 'antd-mobile';
import Header from '../../components/Header';
import './index.less';

@inject('store')
@observer
class Category extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(appContext) {
    await appContext.store.categoryStore.getListData();
    return {};
  }
  render() {
    console.log('Category=>render', this.props);
    const { categoryStore } = this.props.store;
    return (
      <div>
        <Header/>
        <Choose>
          <When condition={categoryStore.total > 0}>
            <div className="post-list">
              <For each="item" index="index" of={categoryStore.list}>
                <Link href={`/archives?id=${item._id}`} key={index}>
                  <div className="post-list__item">
                    <div className="post-list__photo">
                      <img src={`//${item.post_cover.media_url}`}/>
                    </div>
                    <div className="post-list__content">
                      {item.post_title}
                    </div>
                  </div>
                </Link>
              </For>
            </div>
          </When>
          <Otherwise>
            <If condition={!categoryStore.loading}>
              没有内容
            </If>
          </Otherwise>
        </Choose>
        <div>
          {categoryStore.total}
        </div>
        <Button type="primary">按钮</Button>
      </div>
    )
  }
}

export default Category;