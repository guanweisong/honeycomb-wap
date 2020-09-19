import { IIndexPostListParamsType } from '@/src/services/post';
import { MenuType } from '@/src/types/menu';

export default class Helper {

  /**
   * 根据菜单数据和URL参数获得文章列表查询分类ID
   * @param query
   * @param menu
   */
  static getCategoryIdByParmasAndMenu(query: IIndexPostListParamsType, menu: MenuType[]) {
    const idEn = query.secondCategory || query.firstCategory;
    let category_id = '0';
    if (idEn) {
      category_id = menu.find(item => item.category_title_en === idEn)?._id || '0';
    }
    return category_id;
  }

	/**
	 * 根据菜单数据和URL参数获得文章列表查询参数
	 * @param query
   * @param asPath
	 * @param menu
	 */
	static getConditionOfIndexPostListByParamsAndMenu({ ...query }: IIndexPostListParamsType, asPath: string, menu: MenuType[]) {
		const condition: IIndexPostListParamsType = {};
    query.tag_name && (condition.tag_name = query.tag_name);
    query.user_name && (condition.user_name = query.user_name);
    const category_id = this.getCategoryIdByParmasAndMenu(query, menu);
    if (category_id !== '0') {
      condition.category_id = category_id;
    }
    delete query.firstCategory;
    delete query.secondCategory;
    query.asPath = asPath;
		return {...condition, post_status: [0], ...query};
	}

  /**
   * 根据分类ID生成全路径分类目录path数组
   * @param menu 全量menu数组
   * @returns {array}
   */
	static getAllPathByMenu(menu: any) {
	  const paths = []
    for (const m of menu) {
      if (m.category_parent === "0") {
        paths.push({
          firstCategory: m.category_title_en
        })
      } else {
        for (const n of menu) {
          if (n._id === m.category_parent) {
            paths.push({
              firstCategory: n.category_title_en,
              secondCategory: m.category_title_en
            })
          }
        }
      }
    }
    return paths
  }
}
