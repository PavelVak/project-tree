import 'normalize.css';
import './scss/style.scss';

import {listCategories} from "./listCategories"

//let itemIdMainCategory = listCategories.length+1;


/*begin localStorage task*/

if(!localStorage.getItem('listCategoriesStorage')) {
    localStorage.setItem('listCategoriesStorage', JSON.stringify(listCategories));
}


let itemIdMainCategory = JSON.parse(localStorage.getItem('listCategoriesStorage')).length+1;


/*end localStorage task*/

let treeHolder = document.createElement('div');
treeHolder.className = 'tree-holder';

let tree = createTree(JSON.parse(localStorage.getItem('listCategoriesStorage')));  //localStorage
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
        let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
        let name = 'test name';
        let id:any = listCategoriesStorage.length+1;

        let parentId = target.closest('li').getAttribute('id');
        listCategoriesStorage.push({itemId: id, itemName: name, itemParentId: parentId});
        localStorage.setItem('listCategoriesStorage', JSON.stringify(listCategoriesStorage));

        let li = document.createElement('li');

        let state = document.createElement('span');
        state.className = 'state';

        let category = document.createElement('span');
        category.innerHTML = name;
        category.classList.add('item');

        let btnWrapper = document.createElement('div');
        btnWrapper.className = 'btn-wrapper';

        let btnAdd = document.createElement('button');
        btnAdd.classList.add('btn', 'btn-add');
        btnAdd.innerHTML = 'Add';

        let btnRemove = document.createElement('button');
        btnRemove.classList.add('btn', 'btn-remove');
        btnRemove.innerHTML = 'Remove';

        btnWrapper.appendChild(btnAdd).appendChild(btnRemove);

        li.innerHTML += state.outerHTML + category.outerHTML + btnWrapper.outerHTML;
        li.setAttribute('id', id);
        li.draggable=true;
        li.classList.add('drag-item');

        if (target.closest('li').querySelector('ul')) {
            target.closest('li').querySelector('ul').appendChild(li);
        } else {
            let ul = document.createElement('ul');
            ul.classList.add('tree', 'drag-item');
            ul.draggable=true;
            ul.appendChild(li);
            target.closest('li').classList.add('collapse');
            target.closest('li').appendChild(ul);
        }
    }

    if(target.className.indexOf('btn-remove') != -1){
        let id = +target.closest('li').getAttribute('id');

        let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
        removeDataFromArray (listCategoriesStorage, id);
        localStorage.setItem('listCategoriesStorage', JSON.stringify(listCategoriesStorage));
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

    let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
    listCategoriesStorage.push({itemId: id, itemName: name, itemParentId: parentId});
    localStorage.setItem('listCategoriesStorage', JSON.stringify(listCategoriesStorage));
    console.log(JSON.parse(localStorage.getItem('listCategoriesStorage')));

    let li = document.createElement('li');

    let state = document.createElement('span');
    state.className = 'state';

    let category = document.createElement('span');
    category.innerHTML = name;
    category.classList.add('item');

    let btnWrapper = document.createElement('div');
    btnWrapper.className = 'btn-wrapper';

    let btnAdd = document.createElement('button');
    btnAdd.classList.add('btn', 'btn-add');
    btnAdd.innerHTML = 'Add';

    let btnRemove = document.createElement('button');
    btnRemove.classList.add('btn', 'btn-remove');
    btnRemove.innerHTML = 'Remove';

    btnWrapper.appendChild(btnAdd).appendChild(btnRemove);

    li.innerHTML += state.outerHTML + category.outerHTML + btnWrapper.outerHTML;
    li.setAttribute('id', id);
    li.draggable=true;
    li.classList.add('drag-item');

    document.querySelector('.tree-holder>.tree').appendChild(li);


    inputCategory.value = '';
    addCategoryBtn.disabled = true;
};

function removeDataFromArray (myArr, deleteParam) {
    let tmpArr = myArr.filter((el) => { return el.itemId == deleteParam;});
    for (let i in myArr) {
        for(let j in tmpArr)
        if(myArr[i]['itemParentId'] == tmpArr[j]['itemId']) {
            tmpArr.push(myArr[i]);
        }
    }

    for(let j in tmpArr)
        if(myArr.indexOf(tmpArr[j]) != -1) {
            myArr.splice(myArr.indexOf(tmpArr[j]), 1);
    }
}


function createTree(data, parentId?){

    parentId = parentId || 0;

    let items = data.filter( el => el.itemParentId == parentId );

    if (items.length == 0) return null;

    let tree = document.createElement('ul');
    tree.draggable =true;
    tree.classList.add('tree', 'drag-item');

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
        btnAdd.classList.add('btn', 'btn-add');
        btnAdd.innerHTML = 'Add';

        let btnRemove = document.createElement('button');
        btnRemove.classList.add('btn', 'btn-remove');
        btnRemove.innerHTML = 'Remove';

        btnWrapper.appendChild(btnAdd).appendChild(btnRemove);

        li.innerHTML += state.outerHTML + category.outerHTML + btnWrapper.outerHTML;
        li.setAttribute('id', item.itemId);
        li.draggable =true;
        li.classList.add('drag-item');

        let nestedTree = createTree(data, item.itemId);

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

/*begin drag&drop section*/
let dragOnTree = document.querySelector('.tree-holder .tree');
let dropList = document.querySelectorAll('.tree-holder .drag-item');
console.log(dropList);
console.log(dragOnTree);
let dragSrc = null;

dragOnTree.addEventListener('dragstart', (event: any) => {
    dragSrc = event.target;
    event.dataTransfer.setData('element', event.target.id);
    console.log(dragSrc);
});

dragOnTree.addEventListener('dragover', (event: any) => {
    event.preventDefault();
});

dropList.forEach((dropItem) => {
    dropItem.addEventListener('drop', (event: any) => {
        event.stopPropagation();
        if(event.currentTarget.tagName == 'LI') {
            console.log('Li')
        } else if(event.currentTarget.tagName == 'UL') {
            event.currentTarget.appendChild(dragSrc);
        }
        return false;

    })
});

// dragOnTree.addEventListener('drop', (event: any) => {
//     event.preventDefault();
//     console.log('drop', event.target.nodeName);
// });







/*end drag&drop section*/

