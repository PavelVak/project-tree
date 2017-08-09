import { Category } from './../model/category';
import * as categories from './data.json';

export let listCategories = JSON.parse(JSON.stringify(categories)).map(category => {
    return new Category(category.itemId, category.itemName, category.itemParentId);
});





