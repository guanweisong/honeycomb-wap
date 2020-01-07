import React from 'react';
import classNames from 'classnames';
// @ts-ignore
import { Link } from '@/routes';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import { withRouter } from 'next/router';
import { NextRouter } from 'next/dist/client/router';
import { MenuStateType } from '@/models/menu';
import styles from './index.less';

interface MenuProps {
  menu: MenuStateType;
  router: NextRouter;
}

const Menu = (props: MenuProps) => {
  const formatCategorise = () => {
    const menu = listToTree(props.menu.menu, {idKey: '_id', parentKey: 'category_parent'});
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

  const data = formatCategorise();

  return (
    <div className={styles.menu}>
      <ul className={styles["menu-first"]}>
        {
          data.map(firstLevel => (
            <li
              className={classNames({
                [styles["menu-first__item"]]: true,
                // @ts-ignore
                [styles["menu-first__item--active"]]: props.menu.currentCategoryPath[0] === firstLevel.category_title_en || (firstLevel.category_title_en === '' && props.router.asPath === '/'),
              })}
              key={firstLevel.category_title_en}
            >
              <div className={styles["menu-first__item-name"]}>
                <Link route={firstLevel.isHome ? '/' : `/category/${firstLevel.category_title_en}`}>
                  <a>{firstLevel.category_title}</a>
                </Link>
              </div>
              {
                firstLevel.children.length > 0 ? (
                  <ul className={styles["menu-second"]}>
                    {
                      // @ts-ignore
                      firstLevel.children.map(secondLevel => (
                        <li
                          className={classNames({
                            [styles["menu-second__item"]]: true,
                            // @ts-ignore
                            [styles["menu-second__item--active"]]: props.menu.currentCategoryPath[1] === secondLevel.category_title_en,
                          })}
                          key={secondLevel.category_title_en}
                        >
                          <div className={styles["menu-second__item-name"]}>
                            <Link route={`/category/${firstLevel.category_title_en}/${secondLevel.category_title_en}`}>
                              <a>{secondLevel.category_title}</a>
                            </Link>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                ) : null
              }
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default withRouter(Menu);
