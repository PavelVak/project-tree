import {Category} from './../model/category';

export class StorageService {

    getStorageData(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    setStorageData(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    addDataToStorage(key, categoryData) {
        let storageData = this.getStorageData(key);
        storageData.push(new Category(categoryData.itemId, categoryData.itemName, categoryData.itemParentId));
        this.setStorageData(key, storageData);
    }
}
