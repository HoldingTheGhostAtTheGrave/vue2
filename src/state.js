import { observer } from "./observer/index";
import { proxy } from './utils';

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
function initWatch () {
    
}