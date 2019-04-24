import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from '../../routes';
import listToTree from 'list-to-tree-lite';
import { withRouter } from 'next/router';
import styles from './index.less';
import { connect } from 'react-redux';

@withRouter
@connect(state => state)
class Menu extends Component {
  constructor(props){
    super(props)
  };
  formatCategorise = () => {
    const menu = listToTree(JSON.parse(JSON.stringify(this.props.menu.list)), {idKey: '_id', parentKey: 'category_parent'});
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
        children: [],
      }
    ];
    return [...result, ...menu];
  };
  render () {
    const data = this.formatCategorise();
    return (
      <div className={styles.menu}>
        <ul className={styles["menu-first"]}>
          <For each="firstLevel" of={data}>
            <li
              className={classNames({
                [styles["menu-first__item"]]: true,
                [styles["menu-first__item--active"]]: this.props.menu.currentCategoryPath[0] === firstLevel.category_title_en || (firstLevel.category_title_en === '' && this.props.router.pathname === '/'),
              })}
              key={firstLevel.category_title_en}
            >
              <div className={styles["menu-first__item-name"]}>
                <Link route={firstLevel.isHome ? '/' : `/category/${firstLevel.category_title_en}`}>
                  <a>{firstLevel.category_title}</a>
                </Link>
              </div>
              <If condition={firstLevel.children.length > 0}>
                <ul className={styles["menu-second"]}>
                  <For each="secondLevel" of={firstLevel.children}>
                    <li
                      className={classNames({
                        [styles["menu-second__item"]]: true,
                        [styles["menu-second__item--active"]]: this.props.menu.currentCategoryPath[1] === secondLevel.category_title_en,
                      })}
                      key={secondLevel.category_title_en}
                    >
                      <div className={styles["menu-second__item-name"]}>
                        <Link route={`/category/${firstLevel.category_title_en}/${secondLevel.category_title_en}`}>
                          <a>{secondLevel.category_title}</a>
                        </Link>
                      </div>
                    </li>
                  </For>
                </ul>
              </If>
            </li>
          </For>
        </ul>
      </div>
    )
  }
}

export default Menu;
