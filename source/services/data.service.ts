import { StorageService } from './storage.service'
import { Category } from './../model/category';
import * as categories from './data.json';

export class DataService {

    constructor(private storageService: StorageService) {}


}

let storageService = new StorageService();