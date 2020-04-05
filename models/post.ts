import { Effect } from 'dva-no-router';
import { Reducer } from 'redux';
import { PostType } from '@/types/post';
import { GlobalStoreType } from '@/types/globalStore';
import * as postsService from '@/services/post';

export interface PostStateType {
  list: {
    string?: {
      list: PostType [];
      loading: boolean;
      current: number;
      scrollTop: number;
    }
  };
  detail: {
    string?: PostType,
  };
  randomPostsList: {
    string?: PostType,
  };
}

export interface PostModelType {
  namespace: string;
  state: PostStateType;
  effects: {
    indexPostList: Effect;
    indexPostDetail: Effect;
    indexRandomPostByCategoryId: Effect;
  };
  reducers: {
    saveListData: Reducer<PostStateType>;
    saveDetailData: Reducer<PostStateType>;
    saveRandomPostsListData: Reducer<PostStateType>;
    saveListScrollTop: Reducer<PostStateType>;
  };
}

const Model: PostModelType = {
  namespace: 'post',
  state: {
    list: {},
    detail: {},
    randomPostsList: {},
  },
  effects: {
    * indexPostList({ payload }, { call, put, select }) {
      console.log('category=>model=>indexPostList');
      const post:PostStateType = yield select((state: GlobalStoreType) => state.post);
      const asPath = payload.asPath;
      const total = post.list[asPath]?.total || 0;
      const current = post.list[asPath]?.current || 1;
      if (current > Math.ceil(total / 10) && total !== 0) {
        return;
      }
      delete payload.asPath;
      const result = yield call(postsService.indexPostList, { ...payload, page: current });
      if (result.status === 200 ) {
        yield put({
          type: 'saveListData',
          payload: {
            asPath,
            list: result.data.list,
            total: result.data.total,
          },
        });
      }
    },
    * indexPostDetail({ payload }, { call, put }) {
      console.log('category=>model=>indexPostDtail');
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(postsService.indexPostDetail, payload);
      const post = result.data;
      // 替换图片为720P尺寸
      post.post_content = post.post_content.replace(/.jpg/g,'_720p.jpg');
      yield put({
        type: 'saveDetailData',
        payload: post,
      });
      yield put({
        type: 'switchLoading',
        payload: false,
      });
    },
    * indexRandomPostByCategoryId({ payload }, { call, put })  {
      console.log('category=>model=>indexRandomPostByCategoryId');
      const result = yield call(postsService.indexRandomPostByCategoryId, payload);
      yield put({
        type: 'saveRandomPostsListData',
        payload: {
          value: result.data,
          id: payload.post_id,
        },
      });
    },
  },
  reducers: {
    saveListData(state, { payload: { list, total, asPath} }) {
      if (state.list[asPath]) {
        return {
          ...state,
          list: {
            ...state.list,
            [asPath]: {
              ...state.list[asPath],
              total,
              list: [...state.list[asPath].list, ...list],
              current: state.list[asPath].current + 1,
              scrollTop: 0,
            }
          }
        }
      } else {
        return {
          ...state,
          list: {
            ...state.list,
            [asPath]: {
              total,
              list,
              current: 2,
              scrollTop: 0,
            }
          }
        }
      }
    },
    saveListScrollTop(state, { payload: {value, asPath } }) {
      return {...state, list: { ...state.list, [asPath] : {...state.list[asPath], scrollTop: value} }}
    },
    saveDetailData(state, { payload: value }) {
      return { ...state, detail: {...state.detail, [value._id]: value} };
    },
    saveRandomPostsListData(state, { payload: {value, id} }) {
      return { ...state, randomPostsList: {...state.randomPostsList, [id]: value} };
    },
  },
};

export default Model;
