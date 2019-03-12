import { action, observable } from 'mobx';
import { indexMenu } from '../../services/menu';

export default class MenuStore {
  @observable list = [];

  @action getMenuData = async() => {
    const result = await indexMenu();
    this.list = result.data.son;
  }
}
