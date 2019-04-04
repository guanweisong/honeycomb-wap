import { indexPostList } from "../services/post";

export default {
  namespace: 'archives',
  state: {
    detail: null,
  },
  effects: {
    *getDetailData({ payload: values }, { put }) {
      console.log('ArchivesStore__getDetailData');
      const result = yield indexPostList(values);
      yield put({
        type: 'setDetailData',
        payload: result.list[0],
      });
    }
  },
  reducers: {
    setDetailData (state, { payload }) {
      console.log('ArchivesStore__setDetailData', payload);
      return { ...state, detail: payload };
    }
  }
}