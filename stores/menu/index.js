import { action, observable } from 'mobx';
import { indexMenu } from '../../services/menu';

export default class MenuStore {
  @observable list = [];
  @observable currentCategoryPath = [];

  constructor(props) {
    if (typeof props !== 'undefined' && JSON.stringify(props.menuStore) !== '{}') {
      this.list = props.menuStore.list;
      this.currentCategoryPath = props.menuStore.currentCategoryPath;
    }
  }

  @action getMenuData = async() => {
    const result = await indexMenu();
    this.list = result.son || [];
    return {};
  };
  @action setCurrentCategoryPath = (values) => {
    console.log(22222222222222, values);
    this.currentCategoryPath = values;
  }
}
