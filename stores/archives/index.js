import { action, observable } from 'mobx';
import {indexPostList} from "../../services/post";

export default class ArchivesStore {
  @observable detail = null;

  constructor(props) {
    if (typeof props !== 'undefined' && JSON.stringify(props.archivesStore) !== '{}') {
      this.detail = props.archivesStore.detail;
    }
  }

  @action getDetailData = async(params) => {
    console.log('ArchivesStore__getDetailData');
    const result = await indexPostList(params);
    this.setDetailData(result.data.list[0]);
    return {};
  };
  @action setDetailData = (obj) => {
    console.log('ArchivesStore__setDetailData', obj);
    this.detail = obj;
  }
}
