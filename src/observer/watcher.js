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
        this.lazy = options.lazy; // 如果watcher 的 lazy 存在 就是 计算属性
        this.dirty = this.lazy; 
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
        this.value = !this.lazy ? this.get() : void 0;
    }
    update(){
        callHook(this.vm, 'beforeUpdate');
        // 判断是否是计算属性的 watcher 
        if(this.lazy){
            this.dirty = true; // 页面重新渲染 可以获取到最新的值
        }else{
            queueWatcher(this); // 批处理 ， 暂存 方法
        }
    }

    get(){
        // watch 先获取值 触发拦截 target 已存在当前 target 
        pushTarget(this); // 当前实例
        let result = this.getter.call(this.vm); //渲染页面 获取值
        popTarget();
        return result;
    }

    addDep(dep){
        console.log(dep);
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

    depend(){
        // 通过watcher 找到所有的 的dep 让所有的 dep 记住这个渲染watcher
        let index = this.deps.length;
        console.log(this.deps);
        while(index --){
            this.deps[index].depend();
        }
    }

    evaluate(){
        // 调用 computed 的 函数 获取返回值
       this.value = this.get();
       this.dirty = false;
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