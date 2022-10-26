import  Watcher  from "./observer/watcher";
import { patch } from "./vdom/patch";

export function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode) {
        const vm =  this;

        // 替换旧的元素
        vm.$el = patch(vm.$el , vnode);
    }
}


export function mountComponent (vm,el) {
    // 调用 render 方法 去渲染el 属性

    callHook(vm , 'beforeMount'); // 渲染前生命周期

    // 先调用render 方法 创建虚拟节点  在将虚拟节点 渲染到页面上


    let updateComponent = function () {
        vm._update(vm._render());
    }

    //初始化的时候 创建 watcher
    new Watcher(vm , updateComponent , () => {
        // callHook(vm , 'beforeUpdate'); // 更新生命周期
    } , true );

    callHook(vm , 'mounted'); // 渲染后生命周期
}

// 掉用生命周期
export function callHook (vm , hook) {
    const handlers = vm.$options[hook];
    if(handlers){
        for (let index = 0; index < handlers.length; index++) {
            handlers[index].call(vm);
        }
    }
}