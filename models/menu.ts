import * as menuService from '@/services/menu';
import { MenuType } from '@/types/menu';
import { Reducer } from 'redux';
import { Effect } from 'dva-no-router';

export interface MenuStateType {
  menu: MenuType [];
  currentCategoryPath: [];
  showMenu: boolean;
}

export interface MenuModelType {
  namespace: string;
  state: MenuStateType;
  effects: {
    indexMenu: Effect;
  };
  reducers: {
    setMenu: Reducer<MenuStateType>;
    setCurrentCategoryPath: Reducer<MenuStateType>;
    setMenuShow: Reducer<MenuStateType>;
  };
}

const Model: MenuModelType = {
  namespace: 'menu',
  state: {
    menu: [],
    currentCategoryPath: [],
    showMenu: false,
  },
  effects: {
    * indexMenu({}, { call, put }) {
      console.log('app=>model=>indexMenu');
      const result = yield call(menuService.indexMenu);
      if (result.status === 200) {
        yield put({
          type: 'setMenu',
          payload: result.data.list,
        });
      }
    },
  },
  reducers: {
    setMenu(state, { payload: values }) {
      return { ...state, menu: values };
    },
    setCurrentCategoryPath(state, { payload: values }) {
      return { ...state, currentCategoryPath: values };
    },
    setMenuShow(state, { payload: values }) {
      return { ...state, showMenu: values };
    },
},
}

export default Model;
