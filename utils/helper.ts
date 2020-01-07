import { IndexPostListParamsType } from '@/services/post';
import { MenuType } from '@/types/menu';

export default class Helper {

  /**
   * 根据菜单数据和URL参数获得文章列表查询分类ID
   * @param query
   * @param menu
   */
  // @ts-ignore
  static getCategoryIdByParmasAndMenu(query: IndexPostListParamsType, menu: MenuType[]) {
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
   *
	 */
	static getConditionOfIndexPostListByParamsAndMenu({ ...query }: IndexPostListParamsType, asPath: string, menu: MenuType[]) {
		const condition: IndexPostListParamsType = {};
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
}
