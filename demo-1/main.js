class Todo {

    count = 0;

    idCount = 0;

    listEle = null;
    countEle = null;
    addInputEle = null;
    todoAddBtn = null;
    clearAllbtn = null;





    constructor({ todoList, todoCount, todoAddInput, todoAddBtn, todoClearAllBtn }) {
        this.queryEle(todoList, todoCount, todoAddInput, todoAddBtn, todoClearAllBtn);
        this.addEvent();
    }




    queryEle(todoList, todoCount, todoAddInput, todoAddBtn, todoClearAllBtn) {
        this.listEle = document.querySelector(todoList);
        this.countEle = document.querySelector(todoCount);
        this.addInputEle = document.querySelector(todoAddInput);
        this.todoAddBtn = document.querySelector(todoAddBtn);
        this.countEle.textContent = this.count;
        this.clearAllbtn = document.querySelector(todoClearAllBtn);
    }

    addEvent() {

        this.addInputEle.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                this.todoAddBtn.click();
            }
        })

        this.todoAddBtn.addEventListener("click", (e) => {
            const currentAddValue = this.addInputEle.value;
            if (currentAddValue.trim()) {
                const itemHtml = this.getItemHTML(currentAddValue);
                const newEle = this.createItemElement(itemHtml);
                this.addItemDeleteEvent(newEle, () => {
                    this.count--;
                    this.updateCountEle();
                });


                this.count++;
                this.updateCountEle();
                this.addInputEle.value = "";
            }
        })

        this.clearAllbtn.addEventListener("click", (e) => {
            this.count = 0;
            this.listEle.innerHTML = "";
            this.updateCountEle();
        })


    }


    createItemElement(html) {
        const newItemEle = document.createElement("div");
        newItemEle.innerHTML = html;
        this.listEle.append(newItemEle);
        return newItemEle;
    }

    addItemDeleteEvent(ele, onSuccess) {
        const btn = ele.querySelector("button");
        btn.addEventListener("click", (e) => {
            ele.remove();
            onSuccess();
        })
    }

    updateCountEle() {
        this.countEle.textContent = this.count;
    }

    getItemHTML(value) {

        return `
            
            <form class="relative rounded overflow-hidden group">
                <input type="text" class="w-full bg-slate-200 font-medium" disabled value="${value}">

                <button class="absolute text-white bg-red-400 p-2 w-10 h-full flex items-center justify-center right-0 top-0
                    hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"
                    type="button"
                    >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </form>
        `
    }
}

