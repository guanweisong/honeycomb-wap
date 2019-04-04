import { indexSetting } from '../services/setting';

export default {
  namespace: 'setting',
  state: {
    site_name: "",
  },
  effects: {
    *getSettingData({ payload: values }, { put }) {
      const result = yield indexSetting();
      yield put({
        type: 'setSettingData',
        payload: result,
      });
    }
  },
  reducers: {
    setSettingData(state, { payload }) {
      return { ...state, ...payload };
    },
  }
}