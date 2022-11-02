import Dep from "./observer/dep";
import { observer } from "./observer/index";
import Watcher from "./observer/watcher";
import { nextTick, proxy } from './utils';

export function initSatte (vm) {
    const opts = vm.$options;
    if(opts.props){
        initProps(vm);
    }
    if(opts.methods){
        initMethods(vm);
    }
    if(opts.data){
        initData(vm);
    }
    if(opts.computed){
        initComputed(vm);
    }
    if(opts.watch){
        initWatch(vm);
    }
}

function initData (vm) {
    let data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    // 数据的劫持方案
    observer(data);

    // 代理
    for (const key in data) {
        proxy(vm,'_data',key);
    }
}

function initProps () {

}
function initMethods () {
    
}

// 处理计算属性
function initComputed (vm) {
    let computed = vm.$options.computed;
    // 1. 需要有watcher 2.还需要通过defineProperty 3. dirty 控制执行
    const watchers = vm._computedWatchers = {}; // 用来存放计算属性的 watcher 

    for (const key in computed) {
        const userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get; // watcher 使用
        watchers[key] = new Watcher(vm , getter , () => {} , { lazy : true }); // 计算属性的watcher
        defineComputed(vm , key , userDef);
    }
}

function defineComputed (target , key , userDef){
    let sharedPropertyDefinition = {
        enumerable:true,
        configurable:true,
        get:() => {},
        set:() => {}
    };
    if(typeof userDef === 'function'){
        sharedPropertyDefinition.get = createComptedGetter( key );
    }else{
        sharedPropertyDefinition.get = createComptedGetter( key ); //需要加缓存
        sharedPropertyDefinition.set = userDef.set;
    }
    Object.defineProperty(target , key ,sharedPropertyDefinition );
}

function createComptedGetter (key){
    // 此方法是包装的计算属性方法 每次获取值调用 判断要不要执行用户传递的方法
    return function () {
        // 执行
        const watcher = this._computedWatchers[key]; //获取属性对应的 watcher
        if(watcher){
            if(watcher.dirty){
                watcher.evaluate(); // 对当前的  watcher 进行求值
            }
            if(Dep.target){
                watcher.depend();
            }
            return watcher.value; // 默认返回 watcher 的value 的值
        }
    }
}

// 获取watch 里面的值 
function initWatch (vm) {
    let watch =  vm.$options.watch;
    for (let key in watch) {
        const handler = watch[key]; // 获取值内容
        if(Array.isArray(handler)){
            handler.forEach((hand) => {
                createWatcher(vm , key , hand );
            })
        }else {
            createWatcher(vm , key , handler );
        }
    }
}

// 获取watch 值触发 $watch
function createWatcher (vm , exprOrFunction , handler , options = {}) { // options 用来标识用户watcher
    if(typeof handler == 'object'){
        options = options; 
        handler = handler.handler;
    }
    if(typeof handler == 'string'){
        handler = vm[handler];
    }

    return vm.$watch(exprOrFunction , handler , options);
}


export function stateMixin (Vue){
    Vue.prototype.$nextTick = function(callback) {
        nextTick(callback);
    }
    Vue.prototype.$watch = function(exprOrFunction, callback , options) {
        // 数据应该依赖 这个 watcher 数据变化执行
        let watcher = new Watcher(this,exprOrFunction, callback , { ...options , user:true });
        if(options.immediate){
            callback();
        }
    }
}