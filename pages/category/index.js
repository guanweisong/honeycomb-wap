import { Component } from 'react';
import { Link, Router } from '../../routes';
import { withRouter } from 'next/router';
import { Pagination } from 'antd-mobile';
import WithDva from '../../utils/store';
import param from "can-param";
import Header from '../../components/Header';
import './index.less';

@withRouter
@WithDva(store => store)
class Category extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(props) {
    // console.log(1111, props.store);
    // if (props.store.getState().menu.list.length === 0) {
    //   await props.store.dispatch({ type: 'menu/getMenuData' });
    // }
    await props.store.dispatch({
      type: 'category/getListData',
      payload: {
        params: props.query,
        menuList: props.store.getState().menu.list,
      }
    });
    return {};
  }
  paginationChange = (current) => {
    const query = {...this.props.router.query, page: current, limit: 10 };
    const asPath = [];
    if (query.firstCategory) {
      asPath.push(query.firstCategory);
      delete query.firstCategory;
    }
    if (query.secondCategory) {
      asPath.push(query.secondCategory);
      delete query.secondCategory;
    }
    Router.pushRoute(`${this.props.router.pathname}${asPath.join('/')}?${param(query)}`);
  };
  render() {
    const { category } = this.props;
    const pageSize = Math.ceil(category.total/10);
    return (
      <div>
        <Header/>
        <Choose>
          <When condition={category.total > 0}>
            <div className="post-list">
              <For each="item" index="index" of={category.list}>
                <Link route={`/archives/${item._id}`} key={index}>
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