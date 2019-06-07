import { indexPostList, indexPostByCategoryId } from '../services/post';

export default {
  namespace: 'category',
  state: {
    list: [],
    total: 0,
  },
  effects: {
    *getListData({ payload: {params, menu} }, { call, put, select }) {
      console.log('CategoryStore__getListData', params);
      const condition = {};
      let result = {};
      if (params.tagName){
        condition.tag_name = params.tagName;
        result = yield indexPostList(condition);
      } else if(params.authorName) {
        condition.user_name = params.authorName;
        result = yield indexPostList(condition);
      } else {
        const idEn = params.secondCategory || params.firstCategory;
        if (idEn) {
          condition._id = menu.list.find((item) => item.category_title_en === idEn)._id;
        }
        if (params.page) {
          condition.page = params.page;
        }
        if (params.limit) {
          condition.limit = params.limit;
        }
        result = yield indexPostByCategoryId(condition);
      }
      const data = {
        list: result.list,
        total: result.total,
      };
      yield put({
        type: 'setListData',
        payload: data,
      });
      // 设置菜单高亮
      const path = [];
      params.firstCategory && path.push(params.firstCategory);
      params.secondCategory && path.push(params.secondCategory);
      yield put({
        type: 'menu/setCurrentCategoryPath',
        payload: path,
      });
      return {};
    }
  },
  reducers: {
    setListData(state, { payload: { list, total }}) {
      console.log('CategoryStore__setListData', total);
      return { ...state, list, total };
    }
  }
}
