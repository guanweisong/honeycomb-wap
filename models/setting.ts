import * as settingService from '@/services/setting';
import { SettingType } from '@/types/setting';
import { Reducer } from 'redux';
import { Effect } from 'dva-no-router';

export interface SettingStateType {
  setting: SettingType;
}

export interface SettingModelType {
  namespace: string;
  state: SettingStateType;
  effects: {
    indexSetting: Effect;
  };
  reducers: {
    setSetting: Reducer<SettingStateType>;
  };
}

const Model: SettingModelType = {
  namespace: 'setting',
  state: {
    setting: {
      _id: '',
      site_name: '',
      site_copyright: '',
      site_signature: '',
    },
  },
  effects: {
    * indexSetting({}, { call, put }) {
      console.log('app=>model=>indexSetting');
      const result = yield call(settingService.indexSetting);
      if (result.status === 200 ) {
        yield put({
          type: 'setSetting',
          payload: result.data,
        });
      }
    },
  },
  reducers: {
    setSetting(state, { payload: values }) {
      return { ...state, setting: values };
    },
  },
}

export default Model;
