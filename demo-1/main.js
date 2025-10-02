"use strict";
const itemHTML = `
      <form class="relative rounded overflow-hidden group shadow">
                <input type="text" class="w-full bg-slate-200 font-medium item-input-btn" disabled>

                <button class="shadow item-delete-btn  absolute text-white bg-red-400 p-2 w-10 h-full flex items-center justify-center right-0 top-0
                    hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"
                    type="button"
                    >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </form>
`;
function generatedId() {
    let id = 1;
    return {
        getNext: function () {
            return id++;
        }
    };
}
const idGenerator = generatedId();
App({
    add: {
        inputSelector: '.todo-add-input',
        btnSelector: '.todo-add-btn'
    },
    list: {
        clearBtnSelector: '.todo-clear-btn',
        countSelector: '.todo-count',
        listSelector: '.todo-list'
    }
});
function App(selectors) {
    TodoAdd(Object.assign({}, selectors.add), onSubmitAddTodo);
    const todoList = TodoList(Object.assign({}, selectors.list));
    function onSubmitAddTodo(newContent) {
        todoList.addTodo(newContent);
    }
    function onSubmitSearchTodo(search) {
        todoList.filterTodo(search);
    }
}
function TodoAdd(selectors, onSubmit) {
    let btnEle;
    let inputEle;
    //init
    btnEle = document.querySelector(selectors.btnSelector);
    inputEle = document.querySelector(selectors.inputSelector);
    // add Event
    inputEle.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
            e.preventDefault();
            submit();
        }
    });
    btnEle.onclick = e => {
        e.preventDefault();
        submit();
    };
    // Function
    function submit() {
        const content = inputEle.value.trim();
        if (content) {
            onSubmit(content);
            inputEle.value = '';
        }
    }
}
function TodoList(selectors) {
    let count = 0;
    let countEle;
    let ele;
    let clearBtnEle;
    const todos = [];
    // init
    countEle = document.querySelector(selectors.countSelector);
    ele = document.querySelector(selectors.listSelector);
    clearBtnEle = document.querySelector(selectors.clearBtnSelector);
    setCount(0);
    // Add event
    clearBtnEle.onclick = e => clearTodo();
    //function
    function addTodo(text) {
        const item = TodoItem(text, onItemRemove);
        todos.push(item);
        ele.appendChild(item.ele);
        updateCountByDelta(1);
        runWithEffectAndAdd(item.ele);
    }
    function filterTodo(text) {
        const matchesItems = todos.filter(todo => todo.getContent().includes(text));
        setCount(matchesItems.length);
        ele.innerHTML = '';
        for (const item of matchesItems) {
            ele.appendChild(item.ele);
        }
    }
    function clearTodo() {
        for (const todo of todos) {
            runWithEffectAndDelete(todo.ele, todo.remove);
        }
    }
    // function
    function onItemRemove() {
        updateCountByDelta(-1);
    }
    function updateCountByDelta(delta) {
        count += delta;
        countEle.textContent = String(count);
    }
    function setCount(num) {
        count = num;
        countEle.textContent = String(count);
    }
    return {
        addTodo,
        filterTodo
    };
}
function TodoItem(value, onRemove) {
    const id = idGenerator.getNext();
    let text = value;
    let wrapper;
    let deleteBtnEle;
    let inputEle;
    //Init
    wrapper = document.createElement('div');
    wrapper.innerHTML = itemHTML;
    deleteBtnEle = wrapper.querySelector('.item-delete-btn');
    inputEle = wrapper.querySelector('.item-input-btn');
    inputEle.value = value;
    // Add eventListener
    deleteBtnEle.onclick = e => {
        remove();
    };
    // Function
    function remove() {
        runWithEffectAndDelete(wrapper, () => {
            wrapper.remove();
            onRemove();
        });
    }
    function getContent() {
        return text;
    }
    return {
        id,
        getContent,
        remove,
        ele: wrapper
    };
}
function runWithEffectAndAdd(ele) {
    ele.classList.add('transition-opacity', 'opacity-0', 'duration-300', 'ease-out');
    setTimeout(() => {
        ele.classList.add('opacity-1');
        ele.classList.remove('opacity-0');
    }, 100);
    setTimeout(() => {
        ele.classList.remove('transition-opacity', 'opacity-0', 'duration-300', 'ease-out');
    }, 400);
}
let elesToDelete = [];
function runWithEffectAndDelete(ele, deleteFun) {
    if (elesToDelete.some(e => e == ele)) {
        return;
    }
    elesToDelete.push(ele);
    ele.classList.add('transition-opacity', 'opacity-1', 'duration-300', 'ease-out');
    setTimeout(() => {
        ele.classList.remove('opacity-1');
        ele.classList.add('opacity-0');
    }, 100);
    setTimeout(() => {
        elesToDelete = elesToDelete.filter(e => e != ele);
        deleteFun();
    }, 400);
}
