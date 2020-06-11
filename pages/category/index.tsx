import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { Link } from '@/routes';
// @ts-ignore
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { withRouter } from 'next/router';
import { NextRouter } from 'next/dist/client/router';
import { useSelector, useDispatch } from 'react-redux';
import { Result } from 'antd-mobile';
import { throttle } from 'throttle-debounce';
import { NextPage } from 'next';
import classNames from 'classnames';
import { Dispatch, AnyAction } from 'redux';
import Header from '@/components/Header';
import Tags from '@/components/Tags';
import Signature from '@/components/Signature';
import { postClass } from '@/utils/mapping';
import { SettingStateType } from '@/models/setting';
import { GlobalStoreType } from '@/types/globalStore';
import { PostStateType } from '@/models/post';
import { MenuStateType } from '@/models/menu';
import Helper from '@/utils/helper';
import styles from './index.less';
import dayjs from "dayjs";

interface CategoryProps {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
}
// @ts-ignore
const Category: NextPage<CategoryProps> = (props) => {

  const { setting } = useSelector<GlobalStoreType, SettingStateType>(state => state.setting);
  const { menu, currentCategoryPath }= useSelector<GlobalStoreType, MenuStateType>(state => state.menu);
  const post = useSelector<GlobalStoreType, PostStateType>(state => state.post);
  const dispatch = useDispatch();

  const handleScrollLoad = () => {
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - windowHeight - scrollTop < 500) {
      getList();
    }
  };

  /**
   * 绑定滚动监听加载事件
   */
  useEffect(()=> {
    const scrollEvent = addEventListener(window, 'scroll', throttle(500, () => handleScrollLoad()));
    return () => {
      scrollEvent.remove();
    }
  }, []);

  /**
   * 还原和记录滚动条位置
   */
  useEffect(() => {
    const { asPath } = props.router;
    setTimeout(() => {
      document.documentElement.scrollTop = post.list[asPath].scrollTop;
    }, 0);
    return () => {
      dispatch({
        type: 'post/saveListScrollTop',
        payload: {
          asPath: asPath,
          value: document.documentElement.scrollTop,
        }
      })
    }
  }, []);

  /**
   * 异步获取数据
   * @returns {*}
   */
  const getList = () => {
    const { query, asPath } = props.router;
    // @ts-ignore
    const condition = Helper.getConditionOfIndexPostListByParamsAndMenu(query, asPath, menu);
    dispatch({
      type: 'post/indexPostList',
      payload: condition
    });
    // 设置菜单高亮
    const path = [];
    query.firstCategory && path.push(query.firstCategory);
    query.secondCategory && path.push(query.secondCategory);
    dispatch({
      type: 'menu/setCurrentCategoryPath',
      payload: path,
    });
  };

  const getTitle = () => {
    console.log('getTitle', props);
    const user_name = props.router.query.user_name;
    const tag_name = props.router.query.tag_name;
    if (user_name) {
      return `作者“${user_name}”下的所有文章`;
    } else if (tag_name) {
      return `标签“${tag_name}”下的所有文章`;
    } else {
      return '';
    }
  };

  const generateTitle = () => {
    const currentMenu = menu.find(item => item.category_title_en === currentCategoryPath[currentCategoryPath.length - 1]);
    if (currentMenu) {
      return `${currentMenu.category_title}_${setting.site_name}`;
    }
    if (getTitle() !== '') {
      return `${getTitle()}_${setting.site_name}`
    }
    if (props.router.asPath === '/') {
      return `首页_${setting.site_name}`
    }
  };

  const currentPost = post.list[props.router.asPath] || {
    list: [],
    total: 0,
    current: 1,
  };

  return (
    <>
      <Header title={generateTitle()}/>
      {
        currentPost.list.length > 0 ? (
          <>
            <div className={styles["post-list"]}>
              {
                // @ts-ignore
                currentPost.list.map(item => (
                  <Link route={`/archives/${item._id}`} key={item._id}>
                    <div
                      className={classNames({
                        [styles["post-list__item"]]: true,
                        [styles[postClass[item.post_type]]]: true,
                      })}
                    >
                      {
                        [0, 1, 2].includes(item.post_type) ? (
                          <div className={styles["post-list__photo"]}>
                            <img src={`//${item.post_cover?.media_url_360p || item.post_cover?.media_url}`}/>
                          </div>
                        ) : null
                      }
                      <div className={styles["post-list__content"]}>
                        {
                          item.post_type === 1 ? (
                            <>
                              {item.post_title} {item.movie_name_en} ({dayjs(item.movie_time).format('YYYY')})
                            </>
                          ) : null
                        }
                        {
                          [0, 2].includes(item.post_type) ? item.post_title : null
                        }
                        {
                          item.post_type === 3 ? <>“{item.quote_content}” —— {item.quote_author}</> : null
                        }
                      </div>
                      <ul className={styles["post-list__info"]}>
                        {
                          item.post_type === 1 || item.post_type === 2 ? (
                            <li className={styles["post-list_info-item"]}>
                              <i className="iconfont icon-tag"/>&nbsp;
                              <Tags {...item}/>
                            </li>
                          ) : null
                        }
                        <li className={styles["post-list__info-item"]}><i className="iconfont icon-clock"/>&nbsp;{dayjs(item.created_at).format('YYYY-MM-DD')}</li>
                        <li className={styles["post-list__info-item"]}><i className="iconfont icon-chat"/>&nbsp;{item.comment_count} Comments</li>
                        <li className={styles["post-list__info-item"]}><i className="iconfont icon-eye"/>&nbsp;{item.post_views}&nbsp;Views</li>
                      </ul>
                    </div>
                  </Link>
                ))
              }
            </div>
            {
              currentPost.current > Math.ceil(currentPost.total / 10) ? <Signature text="到底了"/> : null
            }
          </>
        ) :
        <Result
          message="该分类暂时没有文章哦！"
        />
      }
    </>
  )
}
// @ts-ignore
Category.getInitialProps = async(props) => {
  // @ts-ignore
  const { query, asPath, dvaStore} = props;
  if (dvaStore.getState().menu.menu.length === 0) {
    await dvaStore.dispatch({ type: 'menu/indexMenu' });
  }

  const currentPost = dvaStore.getState().post.list[asPath];
  if (!currentPost) {
    // @ts-ignore
    const condition = Helper.getConditionOfIndexPostListByParamsAndMenu(query, asPath, dvaStore.getState().menu.menu);
    await dvaStore.dispatch({
      type: 'post/indexPostList',
      payload: condition,
    });
  }

  // 设置菜单高亮
  const path = [];
  query.firstCategory && path.push(query.firstCategory);
  query.secondCategory && path.push(query.secondCategory);
  dvaStore.dispatch({
    type: 'menu/setCurrentCategoryPath',
    payload: path,
  });
  return {};
}

export default withRouter(Category);
