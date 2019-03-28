import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import { Pagination } from 'antd-mobile';
import param from "can-param";
import Header from '../../components/Header';
import './index.less';

@withRouter
@inject('store')
@observer
class Category extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(appContext) {
    if (appContext.store.menuStore.list.length === 0) {
      await appContext.store.menuStore.getMenuData();
    }
    await appContext.store.categoryStore.getListData(appContext.query, appContext.store.menuStore.list);
    return {};
  }
  paginationChange = (current) => {
    const query = {...this.props.router.query, page: current, limit: 10 };
    const asPath = [];
    const asQuery = JSON.parse(JSON.stringify(query));
    if (query.firstCategory) {
      asPath.push(query.firstCategory);
      delete asQuery.firstCategory;
    }
    if (query.secondCategory) {
      asPath.push(query.secondCategory);
      delete asQuery.secondCategory;
    }
    Router.push({
      pathname: this.props.router.pathname,
      query,
    }, {
      as: `${this.props.router.pathname}/${asPath.join('/')}?${param(asQuery)}`
    })
  };
  render() {
    const { categoryStore } = this.props.store;
    const pageSize = Math.ceil(categoryStore.total/10);
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
            <If condition={pageSize > 1}>
              <Pagination
                total={pageSize}
                current={this.props.router.query.page * 1 || 1}
                onChange={this.paginationChange}
              />
            </If>
          </When>
          <Otherwise>
            <div>没有内容</div>
          </Otherwise>
        </Choose>
      </div>
    )
  }
}

export default Category;