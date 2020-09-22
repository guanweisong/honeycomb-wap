import React from 'react'
import classNames from 'classnames'
import Link from 'next/link'
// @ts-ignore
import listToTree from 'list-to-tree-lite'
import styles from './index.less'
import { MenuType } from "@/src/types/menu"

interface MenuProps {
  menu: MenuType[]
  currentMenu?: string
  visible: boolean
}

const Menu = (props: MenuProps) => {

  const formatCategorise = () => {
    const menuData = listToTree(props.menu, {idKey: '_id', parentKey: 'parent'})
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
        children: [],
      }
    ];
    return [...result, ...menuData]
  };

  const data = formatCategorise()

  /**
   * 根据id寻找家族属性集合
   */
  const getCurrentPath = (id: string | undefined, familyProp: string) => {
    const path = [] as string[]
    const { menu } = props
    if (id) {
      const find = (data: MenuType[]) => {
        if (data.length === 1) {
          path.push(data[0][familyProp])
        } else {
          data.forEach(item => {
            if (item._id === id) {
              path.push(item[familyProp])
              if (item.parent !== '0') {
                find(data.filter(m => m._id === item.parent))
              }
            }
          })
        }
      }
      find(menu)
    }
    return path.reverse()
  }

  const currentPath = getCurrentPath(props.currentMenu, '_id')

  /**
   * 渲染菜单
   */
  const renderMenu = () => {
    /**
     * 获取菜单的URL
     * @param item
     */
    const getUrl = (item: MenuType) => {
      let url = ''
      if (item.isHome) {
        url = '/'
      } else {
        switch (item.type) {
          case "category":
            url = `/list/category/${getCurrentPath(item._id, "category_title_en").join("/")}`
            break
          case "page":
            url = `/pages/${item._id}`
            break
        }
      }
      return url
    }
    /**
     * 获取菜单的标题
     * @param item
     */
    const renderTitle = (item: MenuType) => {
      return (
        <Link href={getUrl(item)}>
          <a
            className={classNames({
              [styles.current]: currentPath.includes(item._id) || (currentPath.length === 0 && item.isHome)
            })}
          >
            {item.category_title || item.page_title}
          </a>
        </Link>
      )
    }
    /**
     * 渲染菜单
     * @param data
     */
    const renderUnit = (data:MenuType[]) => {
      return data.map((item) => {
        if (item.children.length === 0) {
          return <li key={item._id}>{renderTitle(item)}</li>
        } else {
          return (
            <li key={item._id}>
              {renderTitle(item)}
              <ul>
                {renderUnit(item.children)}
              </ul>
            </li>
          )
        }
      })
    }
    return renderUnit(data)
  }

  return (
    <div className={classNames(styles.menu, {
      [styles.show]: props.visible
    })}>
      <ul>
        {
          renderMenu()
        }
      </ul>
    </div>
  )
}

export default Menu;
