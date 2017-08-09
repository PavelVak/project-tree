import {Category} from "./category-class"

export class CategoryList {
    private _newCategory: Category;



    public categoryArr: Category[] = [];

    addCategory(itemId, itemName, itemParentId) {
        this._newCategory = new Category(itemId, itemName, itemParentId);
    }

    saveCategory() {
        this.categoryArr.push(this._newCategory);
    }

}