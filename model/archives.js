import { indexPostList, indexRandomPostByCategoryId } from "../services/post";

export default {
  namespace: 'archives',
  state: {
    detail: null,
    randomPostsList: [],
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
    },
    *indexRandomPostByCategoryId({ payload }, { select, call, put })  {
      console.log('category=>model=>indexRandomPostByCategoryId');
      const result = yield call(indexRandomPostByCategoryId, payload);
      yield put({
        type: 'saveRandomPostsListData',
        payload: result,
      });
    },
  },
  reducers: {
    setDetailData (state, { payload }) {
      console.log('ArchivesStore__setDetailData', payload);
      return { ...state, detail: payload };
    },
    saveRandomPostsListData(state, { payload } ) {
      console.log('ArchivesStore__saveRandomPostsListData', payload);
      return { ...state, randomPostsList: payload };
    },
  }
}
