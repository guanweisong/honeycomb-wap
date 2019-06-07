import { indexPostList } from "../services/post";

export default {
  namespace: 'archives',
  state: {
    detail: null,
  },
  effects: {
    *getDetailData({ payload: values }, { put, select }) {
      console.log('ArchivesStore__getDetailData');
      const result = yield indexPostList(values);
      const post = result.list[0];
      yield put({
        type: 'setDetailData',
        payload: post,
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
