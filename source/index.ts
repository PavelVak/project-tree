import 'normalize.css';
import './scss/style.scss';

import {listCategories} from "./listCategories"

let treeHolder = document.createElement('div');
treeHolder.className = 'tree-holder';

let tree = createTree(listCategories);
treeHolder.appendChild(tree);
document.body.insertBefore(treeHolder, document.body.lastElementChild);

tree.ondblclick = function(event: any){
    let target = event.target;
    let parent = event.target.parentElement;
    if (target.className == 'state') {
        parent.classList.toggle("collapse");
        parent.classList.toggle("expand");
    }

};

tree.onclick = function(event: any) {
    let target = event.target;
    if(target.className.indexOf('btn-add') != -1){
        let name = 'test name';
        let id:any = listCategories.length+1;
        let parentId = target.closest('li').getAttribute('id');
        listCategories.push({itemId: id, itemName: name, itemParentId: parentId});

        let li = document.createElement('li');

        let state = document.createElement('span');
        state.className = 'state';

        let category = document.createElement('span');
        category.innerHTML = name;
        category.classList.add('item');

        let btnWrapper = document.createElement('div');
        btnWrapper.className = 'btn-wrapper';

        let btnAdd = document.createElement('button');
        btnAdd.classList.add('btn', 'btn-add')
        btnAdd.innerHTML = 'Add';

        let btnRemove = document.createElement('button');
        btnRemove.classList.add('btn', 'btn-remove')
        btnRemove.innerHTML = 'Remove';

        btnWrapper.appendChild(btnAdd).appendChild(btnRemove);

        li.innerHTML += state.outerHTML + category.outerHTML + btnWrapper.outerHTML;
        li.setAttribute('id', id);

        if (target.closest('li').querySelector('ul')) {
            target.closest('li').querySelector('ul').appendChild(li);
        } else {
            let ul = document.createElement('ul');
            ul.classList.add('tree');
            ul.appendChild(li);
            target.closest('li').classList.add('collapse');
            target.closest('li').appendChild(ul);
        }
    }
    if(target.className.indexOf('btn-remove') != -1){
        let id = +target.closest('li').getAttribute('id');
        console.log(listCategories);

    }
};

function removeDataFromArray (myArr, deleteValue) {

}


function createTree(data, parentId?){

    parentId = parentId || 0;

    let items = data.filter( el => el.itemParentId == parentId );

    if (items.length == 0) return null;

    let tree = document.createElement('ul');
    tree.className = 'tree';

    let list = items.map((item) => {
        let li = document.createElement('li');

        let state = document.createElement('span');
        state.className = 'state';

        let category = document.createElement('span');
        category.innerHTML = item.itemName;
        category.classList.add('item');
        //category.setAttribute('id', item.itemId);

        let btnWrapper = document.createElement('div');
        btnWrapper.className = 'btn-wrapper';

        let btnAdd = document.createElement('button');
        btnAdd.classList.add('btn', 'btn-add')
        btnAdd.innerHTML = 'Add';

        let btnRemove = document.createElement('button');
        btnRemove.classList.add('btn', 'btn-remove')
        btnRemove.innerHTML = 'Remove';

        btnWrapper.appendChild(btnAdd).appendChild(btnRemove);

        li.innerHTML += state.outerHTML + category.outerHTML + btnWrapper.outerHTML;
        li.setAttribute('id', item.itemId);

        let nestedTree = createTree(data, item.itemId);

        if (nestedTree !== null) {
            li.appendChild(nestedTree);
            li.className = 'collapse';
        }
        return li;

    });

    list.forEach((li) => {
        tree.innerHTML += li.outerHTML;
    });

    return tree;

}

