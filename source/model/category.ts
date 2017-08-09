export class Category {
    itemId: number;
    itemName: string;
    itemParentId: number;

    constructor(itemId, itemName, itemParentId) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemParentId = itemParentId;
    }
}