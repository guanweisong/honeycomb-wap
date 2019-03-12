import { action, observable } from 'mobx';
import { indexSetting } from '../../services/setting';

export default class SettingStore {
  @observable setting = {
    site_name: '',
  };

  constructor(props) {
    if (typeof props !== 'undefined' && JSON.stringify(props.settingStore) !== '{}') {
      this.setting = props.settingStore.setting;
    }
  }

  @action getSettingData = async() => {
    const result = await indexSetting();
    this.setting = result.data;
    return {};
  }
}
