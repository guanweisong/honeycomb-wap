import { Component } from 'react';
import { Link, Router } from '../../routes';
import { withRouter } from 'next/router';
import { Pagination } from 'antd-mobile';
import { connect } from 'react-redux';
import param from "can-param";
import Header from '../../components/Header';
import styles from './index.less';

@withRouter
@connect(state => state)
class Category extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(props) {
    if (props.dvaStore.getState().menu.list.length === 0) {
      await props.dvaStore.dispatch({ type: 'menu/getMenuData' });
    }
    await props.dvaStore.dispatch({
      type: 'category/getListData',
      payload: {
        params: props.query,
        menu: props.dvaStore.getState().menu,
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
            <div className={styles["post-list"]}>
              <For each="item" index="index" of={category.list}>
                <Link route={`/archives/${item._id}`} key={index}>
                  <div className={styles["post-list__item"]}>
                    <div className={styles["post-list__photo"]}>
                      <img src={`//${item.post_cover.media_url}`}/>
                    </div>
                    <div className={styles["post-list__content"]}>
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
