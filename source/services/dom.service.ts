export class DomService {
    constructor() {}

    public createTree(data, parentId?){

        parentId = parentId || 0;
        let items = data.filter( el => el.itemParentId == parentId );

        if (items.length == 0) return null;

        let tree = this.createElementEmptyWithClass('ul', ['tree', 'drag-item']);
        tree.draggable =true;

        let list = items.map((item) => {

            let state = this.createElementEmptyWithClass('span','state');
            let category = this.createElementWithClass('span', item.itemName, 'item');
            let btnWrapper = this.createElementEmptyWithClass('div','btn-wrapper');
            btnWrapper.appendChild(this.createBtn('Add', ['btn', 'btn-add']))
                .appendChild(this.createBtn('Remove', ['btn', 'btn-remove']));
            let li = this.createElementWithClass('li', state.outerHTML + category.outerHTML + btnWrapper.outerHTML, 'drag-item');
            li.setAttribute('id', item.itemId);
            li.draggable =true;

            let nestedTree = this.createTree(data, item.itemId);

            if (nestedTree !== null) {
                li.appendChild(nestedTree);
                li.classList.add('collapse');
            }
            return li;

        });

        list.forEach((li) => {
            tree.innerHTML += li.outerHTML;
        });

        return tree;
    }

    private createBtn(name: string, className: string[] | string) {
        let btn = document.createElement('button');
        btn.innerHTML = name;
        if(className instanceof Array) {
            btn.classList.add(...className);
        } else {
            btn.classList.add(className);
        }
        return btn;
    }

    private createElementWithClass(type: string, innerHTML: any, className: string[] | string) {
        let elem = document.createElement(type);
        elem.innerHTML = innerHTML;
        if(className instanceof Array) {
            elem.classList.add(...className);
        } else {
            elem.classList.add(className);
        }
        return elem;
    }

    private createElementEmptyWithClass(type: string, className: string[] | string) {
        let elem = document.createElement(type);
        if(className instanceof Array) {
            elem.classList.add(...className);
        } else {
            elem.classList.add(className);
        }
        return elem;
    }

}