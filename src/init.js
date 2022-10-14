import { initSatte } from "./state";

export function initMixin (Vue) {

    //入口 初始化方法
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        
        initSatte(vm); // 初始化状态

        // vue 响应数据的变化 讲将数据作一个初始化的劫持 （数据改变时改变视图）
    }
}