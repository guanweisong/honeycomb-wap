import { indexPostList } from '../services/post';

export default {
  namespace: 'category',
  state: {
    list: [],
    page: 1,
    isEnd: false,
    currentPagePath: '/',
  },
  effects: {
    *getListData({ payload: {params, menu, currentPagePath} }, { call, put, select }) {
      console.log('CategoryStore__getListData', params);
      const condition = {};
      condition.limit = 10;
      const prevCurrentPagePath = yield select(store => store.category.currentPagePath);
      if (prevCurrentPagePath !== currentPagePath) {
        condition.page = 1;
      } else {
        condition.page = yield select(store => store.category.page);
      }
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
          condition.category_id = menu.list.find((item) => item.category_title_en === idEn)._id;
        }
        result = yield indexPostList(condition);
      }
      const data = {
        list: result.list,
        isEnd: result.list.length === 0,
        currentPagePath,
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
    setListData(state, { payload: { list, isEnd, currentPagePath }}) {
      console.log('CategoryStore__setListData');
      if (currentPagePath !== state.currentPagePath) {
        return { ...state, list, page: 2, isEnd: false, currentPagePath };
      } else {
        return { ...state, list: [...state.list, ...list], page: state.page + 1, isEnd, currentPagePath };
      }
    }
  }
}
