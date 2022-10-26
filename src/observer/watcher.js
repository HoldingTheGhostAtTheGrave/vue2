import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher  {
    constructor(vm , exproOrFn , callback , options) {
        this.vm = vm;
        this.exproOrFn = exproOrFn;
        this.callback = callback;
        this.options = options;
        this.id = id++; //watcher 的唯一标识


        if(typeof exproOrFn == 'function'){
            this.getter = exproOrFn;
        }

        this.get();
        
    }
    update(){
        this.get();
    }

    get(){
        pushTarget(this); // 当前实例
        this.getter(); //渲染页面 获取值
        popTarget();
    }
}

export default Watcher;