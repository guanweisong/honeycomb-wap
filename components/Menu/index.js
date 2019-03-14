import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import listToTree from 'list-to-tree-lite';
import  './index.less';
import {inject, observer} from "mobx-react/index";

@inject('store')
@observer
class Menu extends PureComponent {
  constructor(props){
    super(props)
  };
  formatCategorise = () => {
    const menu = listToTree(JSON.parse(JSON.stringify(this.props.store.menuStore.list)), {idKey: '_id', parentKey: 'category_parent'});
    const result = [
      {
        category_title: '首页',
        category_title_en: 'category',
        isHome: true,
        children: [],
      }
    ];
    return [...result, ...menu];
  };
  render () {
    const data = this.formatCategorise();
    return (
      <div className={classNames({
        'menu': true,
        'hc-show': !!this.props.show,
      })}>
        <ul className="menu-first">
          <For each="firstLevel" of={data}>
            <li
              className={classNames({
                "menu-first__item": true,
                // "menu-first__item--active": this.props.app.currentCategoryPath[0] === firstLevel.category_title_en || (firstLevel.category_title_en === '' && this.props.location.pathname === '/'),
              })}
              key={firstLevel.category_title_en}
            >
              <div className="menu-first__item-name">
                <Link href={`${firstLevel.isHome === true ? '': '/category'}/${firstLevel.category_title_en}`}><a>{firstLevel.category_title}</a></Link>
              </div>
              <If condition={firstLevel.children.length > 0}>
                <ul className="menu-second">
                  <For each="secondLevel" of={firstLevel.children}>
                    <li
                      className={classNames({
                        "menu-second__item": true,
                        // "menu-second__item--active": this.props.app.currentCategoryPath[1] === secondLevel.category_title_en,
                      })}
                      key={secondLevel.category_title_en}
                    >
                      <div className="menu-second__item-name">
                        <Link href={`/category/${firstLevel.category_title_en}/${secondLevel.category_title_en}`}><a>{secondLevel.category_title}</a></Link>
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
