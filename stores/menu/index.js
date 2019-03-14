import { action, observable } from 'mobx';
import { indexMenu } from '../../services/menu';

export default class MenuStore {
  @observable list = [];

  constructor(props) {
    if (typeof props !== 'undefined' && JSON.stringify(props.menuStore) !== '{}') {
      this.list = props.menuStore.list;
    }
  }

  @action getMenuData = async() => {
    const result = await indexMenu();
    this.list = result.son || [];
    return {};
  }
}
