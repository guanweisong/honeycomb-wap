import { Component } from 'react';
import { Link, Router } from '../../routes';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import debounce from 'debounce';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import Header from '../../components/Header';
import Signature from '../../components/Signature';
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
        currentPagePath: props.asPath,
      }
    });
    return {};
  }
  componentDidMount() {
    // 绑定滚动监听加载事件
    this.scrollEvent = addEventListener(window, 'scroll', debounce(this.handleScrollLoad, 200));
  }
  componentWillUnmount() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  }
  /**
   * 滚动加载事件
   */
  handleScrollLoad = () => {
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - windowHeight - scrollTop < 100 && !this.props.category.isEnd) {
      this.getList();
    }
  };
  /**
   * 异步获取数据
   * @returns {*}
   */
  getList = () => {
    this.props.dispatch({
      type: 'category/getListData',
      payload: {
        params: this.props.router.query,
        menu: this.props.menu,
        currentPagePath: this.props.router.asPath,
      }
    });
  };
  getTitle = () => {
    console.log('getTitle', this.props);
    const authorName = this.props.router.query.authorName;
    const tagName = this.props.router.query.tagName;
    if (authorName) {
      return `作者“${authorName}”下的所有文章`;
    } else if (tagName) {
      return `标签“${tagName}”下的所有文章`;
    } else {
      return '';
    }
  };
  generateTitle = () => {
    const currentMenu = this.props.menu.list.find(item => item.category_title_en === this.props.menu.currentCategoryPath[this.props.menu.currentCategoryPath.length - 1]);
    if (currentMenu) {
      return `${currentMenu.category_title}_${this.props.setting.site_name}`;
    }
    if (this.getTitle() !== '') {
      return `${this.getTitle()}_${this.props.setting.site_name}`
    }
    if (this.props.router.asPath === '/') {
      return `首页_${this.props.setting.site_name}`
    }
  };
  render() {
    const { category } = this.props;
    return (
      <div>
        <Header title={this.generateTitle()}/>
        <Choose>
          <When condition={category.list.length > 0}>
            <div className={styles["post-list"]}>
              <For each="item" index="index" of={category.list}>
                <Link route={`/archives/${item._id}`} key={index}>
                  <a className={styles["post-list__item"]}>
                    <div className={styles["post-list__photo"]}>
                      <img src={`//${item.post_cover.media_url_360p || item.post_cover.media_url}`}/>
                    </div>
                    <div className={styles["post-list__content"]}>
                      {item.post_title}
                    </div>
                  </a>
                </Link>
              </For>
            </div>
            <If condition={category.isEnd}>
              <Signature text="到底了"/>
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
