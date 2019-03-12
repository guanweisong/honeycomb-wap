import { useStaticRendering } from 'mobx-react';
import CategoryStore from './stores/category';
import ArchivesStore from './stores/archives';
import SettingStore from './stores/setting';
import MenuStore from './stores/menu';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

class Store {
  constructor(initialData) {
    this.categoryStore = new CategoryStore(initialData);
    this.archivesStore = new ArchivesStore(initialData);
    this.settingStore = new SettingStore(initialData);
    this.menuStore = new MenuStore(initialData);
  }
}

let store = null;
export function initializeStore(initialData) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return new Store(initialData);
  }
  if (store === null) {
    store = new Store(initialData);
  }
  return store;
}
