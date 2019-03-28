import { action, observable } from 'mobx';
import { indexPostList, indexPostByCategoryId } from '../../services/post';

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

  @action getListData = async(params, menuList) => {
    console.log('CategoryStore__getListData', params, menuList);
    this.loading = true;
    const condition = {};
    const idEn = params.secondCategory || params.firstCategory;
    if (idEn) {
      condition._id = menuList.find((item) => item.category_title_en === idEn)._id;
    }
    if (params.page) {
      condition.page = params.page;
    }
    if (params.limit) {
      condition.limit = params.limit;
    }
    const result = await indexPostByCategoryId(condition);
    const data = {
      list: result.list,
      total: result.total,
    };
    this.setListData(data);
    return {};
  };
  @action setListData = ({list, total}) => {
    console.log('CategoryStore__setListData', total);
    this.loading = false;
    this.list = list;
    this.total = total;
  }
}
