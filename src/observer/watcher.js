import { callHook } from "../lifecycle";
import { nextTick } from "../utils";
import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher  {
    constructor(vm , exproOrFn , callback , options) {
        this.vm = vm;
        this.exproOrFn = exproOrFn;
        this.callback = callback;
        this.options = options;
        this.user = options.user; // 用户watcher
        this.id = id++; //watcher 的唯一标识
        this.deps = []; //记录dep
        this.depsId = new Set();

        // getter 更新函数
        if(typeof exproOrFn == 'function'){
            this.getter = exproOrFn;
        }else{
            // exproOrFn 可能是字符串 取值获取依赖收集
            this.getter = function () { // 获取 属性 值
                let path = exproOrFn.split('.');
                let obj = vm;
                for (let index = 0; index < path.length; index++) {
                    obj = obj[path[index]] ;
                }
                return obj;
            }
        }
        this.value = this.get();
    }
    update(){
        callHook(this.vm, 'beforeUpdate');
        queueWatcher(this); // 批处理 ， 暂存 方法
    }

    get(){
        // watch 先获取值 触发拦截 target 已存在当前 target 
        pushTarget(this); // 当前实例
        let result = this.getter(); //渲染页面 获取值
        popTarget();
        return result;
    }

    addDep(dep){
        let id = dep.id;
        if(!this.depsId.has(id)){
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }

    run() {
        let newValue = this.get();
        let oldValue = this.value;
        this.value = newValue; // 替换老值
        if(this.user){
            this.callback.call(this.vm , newValue , oldValue);
        }
    }
}

// 批处理代码
let  queue = []; // 需要批量更新的 watcher 存到队列中 
let has = {};
let panding = false;


function flushSchedulerQueue (){
    queue.forEach((watch) => {
        watch.run();
        if(!watch.user){
            watch.callback();
        }
    });
    queue = [];
    has = {};
    panding = false;
}

function queueWatcher(watcher) {
    // 去重
    if(!has[watcher.id]){
        queue.push(watcher); // 存队列
        has[watcher.id] = true;
        if(!panding){
            nextTick(flushSchedulerQueue);
            panding = true;
        }
    }
}

export default Watcher;