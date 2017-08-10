import 'normalize.css';
import './scss/style.scss';

import {listCategories} from "./listCategories"

import {CategoryList} from "./categoryList-class";


// let itemIdMainCategory = listCategories.length+1;

// import { listCategories } from './data/listCategories';
// import { StorageService } from './services/storage.service';
// import { DomService } from './services/dom.service'
//
// class AppTree {
//     constructor (private storageService: StorageService, private domService: DomService ) {
//         /*Проверяем есть ли данные в LS*/
//         if(!storageService.getStorageData('listCategoriesStorage')){
//             storageService.setStorageData('listCategoriesStorage', listCategories);
//         }
//
//         let treeWrapper= document.querySelector('.tree-wrapper');
//         treeWrapper.appendChild(domService.createTree(storageService.getStorageData('listCategoriesStorage')));
//
//     }
// }
//
// let storageService = new StorageService();
// let domService = new DomService();
// let appTree = new AppTree(storageService, domService);
//
//
// let data = [
//     {itemId: 1, itemName: 'Программирование', itemParentId: 0},
//     {itemId: 2, itemName: 'Javascript', itemParentId: 1},
//     {itemId: 3, itemName: 'Angular', itemParentId: 2},
//     {itemId: 4, itemName: 'React', itemParentId: 2},
//     {itemId: 5, itemName: 'PHP', itemParentId: 1},
//     {itemId: 6, itemName: 'Python', itemParentId: 1},
//     {itemId: 7, itemName: 'Верстка', itemParentId: 0},
//     {itemId: 8, itemName: 'HTML', itemParentId: 7},
//     {itemId: 9, itemName: 'CSS', itemParentId: 7},
//     {itemId: 10, itemName: 'Дизайн', itemParentId: 0},
//     {itemId: 11, itemName: 'Photoshop', itemParentId: 10},
//     {itemId: 12, itemName: 'Руки из жопы', itemParentId: 10},
//     {itemId: 13, itemName: 'SEO', itemParentId: 0},
//     {itemId: 14, itemName: 'Разное', itemParentId: 0}
// ];
//
// function getNestedChildren(arr, parent) {
//     let out = [];
//     for(let i in arr) {
//         if(arr[i].itemParentId == parent) {
//             let children = getNestedChildren(arr, arr[i].itemId);
//
//             if(children.length) {
//                 arr[i].children = children;
//             }
//             out.push(arr[i])
//         }
//     }
//     return out;
// }
//
// let test = getNestedChildren(data, 0);
// console.log(JSON.stringify(test));
//
// function json_tree(data) {
//     let json = "<ul>";
//
//     for(let i = 0; i < data.length; ++i) {
//         json = json + "<li>" + data[i].itemName;
//         if(data[i].children && data[i].children.length) {
//             json = json + json_tree(data[i].children);
//         }
//         json = json + "</li>";
//     }
//     return json + "</ul>";
// }
//
// document.getElementById("result").innerHTML = json_tree(test);




























/*begin localStorage task*/

if(!localStorage.getItem('listCategoriesStorage')){
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


let close = <HTMLElement>document.getElementsByClassName("close")[0];
close.onclick = function() {
    document.getElementById('myModal').style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = "none";
    }
}

let pId = null;

tree.onclick = function(event: any) {
    let target = event.target;
    if(target.className.indexOf('btn-add') != -1){
        let modal = document.getElementById('myModal');
        modal.style.display = "block";
        pId = +target.closest('li').getAttribute('id');
    }

    if(target.className.indexOf('btn-remove') != -1){
        let id = +target.closest('li').getAttribute('id');

        let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
        removeDataFromArray (listCategoriesStorage, id);
        localStorage.setItem('listCategoriesStorage', JSON.stringify(listCategoriesStorage));
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

let addsubcategory = document.getElementById('add-subcategory');
addsubcategory.addEventListener('click', (event) => {
    let modal = document.getElementById('myModal');
    let inputSubcategory = <HTMLInputElement>document.getElementById('input-subcategory');
    console.log(pId);
    let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
    let name = inputSubcategory.value;
    let id:any = itemIdMainCategory++;
    listCategoriesStorage.push({itemId: id, itemName: name, itemParentId: pId});
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

    if (document.getElementById(pId).querySelector('ul')) {
        document.getElementById(pId).querySelector('ul').appendChild(li);
    } else {
        let ul = document.createElement('ul');
        ul.classList.add('tree', 'drag-item');
        ul.draggable=true;
        ul.appendChild(li);
        document.getElementById(pId).closest('li').classList.add('collapse');
        document.getElementById(pId).closest('li').appendChild(ul);
    }

    inputSubcategory.value = '';
    modal.style.display = 'none';
});

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

let dragSrc = null;

dragOnTree.addEventListener('dragstart', (event: any) => {
    dragSrc = event.target;
    event.dataTransfer.setData('element', event.target.id);
});

dropList.forEach((dropItem) => {

    dropItem.addEventListener('dragover', (event: any) => {
        if (event.preventDefault) {
            event.preventDefault(); // Necessary. Allows us to drop.
        }
        event.target.classList.add('over');

        event.dataTransfer.dropEffect = 'move';
    });

    dropItem.addEventListener('dragleave', (event: any) => {
        event.target.classList.remove('over');
    });

    dropItem.addEventListener('dragend', (event: any) => {
        event.target.classList.remove('over');
        let listCollapse  = tree.querySelectorAll('li.drag-item');
        listCollapse.forEach((listCollapseItem ) => {
            if ((listCollapseItem.classList.contains('collapse') || listCollapseItem.classList.contains('expand')) &&
                !listCollapseItem.querySelector('.tree').firstElementChild
            ) {
                listCollapseItem.querySelector('.tree').remove();
                listCollapseItem.querySelector('.state').innerHTML = '';
                listCollapseItem.classList.remove('collapse');
                listCollapseItem.classList.remove( 'expand');
            }
        });

    });

    dropItem.addEventListener('drop', (event: any) => {
        event.stopPropagation();

        if(event.currentTarget.tagName == 'LI') {
           if (event.currentTarget.id == event.dataTransfer.getData('element')) {
               event.currentTarget.classList.remove('over');
               return false;
           }

           let parentId = +event.currentTarget.id;
           let currentId = event.dataTransfer.getData('element');
           let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
           let localArr = listCategoriesStorage.map(category => {
               if(category['itemId'] == currentId) {
                   category['itemParentId'] = parentId;
               }
               return category;
           });
           localStorage.setItem('listCategoriesStorage', JSON.stringify(localArr));

           if (event.currentTarget.getElementsByClassName('tree').length !== 0) {
               event.currentTarget.getElementsByClassName('tree')[0].appendChild(dragSrc);
               event.currentTarget.classList.remove('over');

           } else {
               let ul = document.createElement('ul');
               ul.classList.add('tree');
               ul.appendChild(dragSrc);
               event.currentTarget.appendChild(ul);
               event.currentTarget.classList.remove('over');
               event.currentTarget.classList.add('collapse');
           }
        } else if (event.currentTarget.tagName == 'UL') {
            if (event.currentTarget.parentElement.tagName == 'LI') {
                let parentId = event.currentTarget.parentElement.id;
                let currentId = event.dataTransfer.getData('element');
                let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
                let localArr = listCategoriesStorage.map(category => {
                    if(category['itemId'] == currentId) {
                        category['itemParentId'] = +parentId;
                    }
                    return category;
                });
                localStorage.setItem('listCategoriesStorage', JSON.stringify(localArr));
            }
            else if ( event.currentTarget.parentElement.tagName == 'DIV') {
                let parentId = 0;
                let currentId = event.dataTransfer.getData('element');
                let listCategoriesStorage = JSON.parse(localStorage.getItem('listCategoriesStorage'));
                let localArr = listCategoriesStorage.map(category => {
                    if(category['itemId'] == currentId) {
                        category['itemParentId'] = +parentId;
                    }
                    return category;
                });
                localStorage.setItem('listCategoriesStorage', JSON.stringify(localArr));
            }
            event.currentTarget.appendChild(dragSrc);
            event.currentTarget.classList.remove('over');
        }
        return false;

    });
});

/*end drag&drop section*/

