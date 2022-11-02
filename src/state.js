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

function initComputed () {
    
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