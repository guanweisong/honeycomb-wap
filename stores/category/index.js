import { action, observable } from 'mobx';
import { indexPostList } from '../../services/post';

export default class CategoryStore {
  @observable loading = true;
  @observable list = [];
  @observable total = 0;

  constructor(props) {
    if (typeof props !== 'undefined' && JSON.stringify(props.categoryStore) !== '{}') {
      this.list = props.categoryStore.list;
      this.total = props.categoryStore.total;
    }
  }

  @action getListData = async(params) => {
    console.log('CategoryStore__getListData');
    this.loading = true;
    const result = await indexPostList(params);
    const data = {
      list: result.data.list,
      total: result.data.total,
    };
    this.setListData(data);
    return {};
  };
  @action setListData = ({list, total}) => {
    console.log('CategoryStore__setListData', list, total);
    this.loading = false;
    this.list = list;
    this.total = total;
  }
}
