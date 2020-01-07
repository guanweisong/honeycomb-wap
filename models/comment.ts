import * as commentsService from '@/services/comment';
import { CommentType } from '@/types/comment';
import { Toast } from 'antd-mobile';
import { Reducer } from 'redux';
import { Effect } from 'dva-no-router';

export interface ReplyToType {
  _id: string;
  comment_author: string;
}

export interface CommentStateType {
  list: CommentType [];
  total: number;
  replyTo: ReplyToType | null;
  loading: boolean;
}

export interface CommentModelType {
  namespace: string;
  state: CommentStateType;
  effects: {
    index: Effect;
    create: Effect;
  };
  reducers: {
    saveListData: Reducer<CommentStateType>;
    switchLoading: Reducer<CommentStateType>;
    setReplyTo: Reducer<CommentStateType>;
  };
}

const Model: CommentModelType = {
  namespace: 'comment',
  state: {
    list: [],
    total: 0,
    replyTo: null,
    loading: false,
  },
  effects: {
    * index({ payload }, { call, put }) {
      console.log('comment=>model=>indexCommentList');
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(commentsService.index, payload);
      if (result.status === 200 ) {
        yield put({
          type: 'saveListData',
          payload: {
            list: result.data.list,
            total: result.data.total,
          },
        });
      }
      yield put({
        type: 'switchLoading',
        payload: false,
      });
    },
    * create({ payload: values }, { call, put }) {
      console.log('comment=>model=>create', values);
      const result = yield call(commentsService.create, values);
      if (result.status === 201) {
        Toast.success('发布成功');
        yield put({
          type: 'index',
          payload: values.comment_post,
        });
      }
    },
  },
  reducers: {
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    switchLoading(state, { payload: value }) {
      return { ...state, loading: value };
    },
    setReplyTo(state, { payload: value }) {
      return { ...state, replyTo: value }
    },
  },
};


export default Model;
