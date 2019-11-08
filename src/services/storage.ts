
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export default class Store {
    
    // JSON "set" example
    async setObject(key: string, value: object) {
      await Storage.set({
        key: key,
        value: JSON.stringify(value)
      });
    }
  
    // JSON "get" example
    async getObject(key: string) {
      const ret = await Storage.get({ key: key });
      return (ret.value==null?null:JSON.parse(ret.value));
    }
  
    async setItem(key: string, value: string) {
      await Storage.set({
        key: key,
        value: value
      });
    }
  
    async getItem(key: string) {
      return await Storage.get({ key: key });
    }
  
    async removeItem(key: string) {
      await Storage.remove({ key: 'name' });
    }
  
    async keys() {
      return await Storage.keys();
    }
  
    async clear() {
      await Storage.clear();
    }
  }