import 'normalize.css';
import './scss/style.scss';

import {listCategories} from "./listCategories"

let itemIdMainCategory = listCategories.length+1;

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
        removeDataFromArray (listCategories, id);
        console.log(listCategories);
        if(target.closest('ul').children.length == 1) {
            if(target.closest('.expand')) {
                target.closest('.expand').classList.remove('expand');
            }
            target.closest('ul').remove();
        } else {
            target.closest('li').remove();
        }
    }
};

let inputCategory = <HTMLInputElement>document.getElementById("input-category");
let addCategoryBtn = <HTMLInputElement>document.getElementById("add-category");
inputCategory.onkeyup = function(event:any) {
    if(event.target.value && !event.target.value.match(/^\s+$/)) {
        addCategoryBtn.disabled = false;
    } else {
        addCategoryBtn.disabled = true;
    }
};

addCategoryBtn.onclick = function () {
    let name = inputCategory.value;
    let id:any = itemIdMainCategory++;
    let parentId = 0;
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

    document.querySelector('.tree-holder>.tree').appendChild(li);

    console.log(listCategories);

    inputCategory.value = '';
    addCategoryBtn.disabled = true;
};

function removeDataFromArray (myArr, deleteParam) {
    let tmpArr = myArr.filter((el) => { return el.itemId == deleteParam;});
    for (let i in myArr){
        for(let j in tmpArr)
        if(myArr[i]['itemParentId'] == tmpArr[j]['itemId']){
            tmpArr.push(myArr[i]);
        }
    }

    for(let j in tmpArr)
        if(myArr.indexOf(tmpArr[j]) > 0){
            myArr.splice(myArr.indexOf(tmpArr[j]), 1);
    }
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

