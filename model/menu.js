import { indexMenu } from '../services/menu';

export default {
  namespace: 'menu',
  state: {
    list: [],
    currentCategoryPath: [],
    show: false,
  },
  effects: {
    *getMenuData({ payload: values }, { put }) {
      const result = yield indexMenu();
      yield put({
        type: 'setMenuList',
        payload: result.son,
      });
    }
  },
  reducers: {
    setMenuList(state, { payload }) {
      console.log('setMenuList', payload.length);
      return { ...state, list: payload };
    },
    setCurrentCategoryPath(state, { payload }) {
      console.log(999, payload);
      return { ...state, currentCategoryPath: payload };
    },
    setMenuShow(state, { payload }) {
      return { ...state, show: payload };
    }
  }
}
