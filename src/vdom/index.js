import { isNonPhrasingTag } from '../utils';

export function renderMinin (Vue){
    // 虚拟节点 用1对象来描述dom
    Vue.prototype._v = function (text) {
        return createTextVNode(text); // 虚拟文本
    }
    Vue.prototype._c = function () {
        return createElement(this,...arguments); // 虚拟节点
    }
    // 如果是对象会对对象进行取值
    Vue.prototype._s = function (val) {
        return val == null ? "" : (typeof val == 'object') ? JSON.stringify(val) : val;
    }
    Vue.prototype._render = function () {
        const vm = this;
        const render = vm.$options.render;
        let vnode = render.call(this);
        return vnode;
    }
}


function createElement (vm,tag , data = {} , ...children) {
    // 判断如果传入的是组件 我需要 new 当前组件的构造函数
    if(isNonPhrasingTag(tag)){
        return vnode(tag , data , data.key ,children);
    }else{
        let Ctor = vm.$options.components[tag];
        return createComponent(vm,tag , data , data.key ,children,Ctor);
    }
}
function createComponent (vm,tag , data , key ,children,Ctor){
    let barseCtor = vm.$options._base;
    // 有可能是对象 也有可能是 函数
    if(typeof Ctor == "object"){
        Ctor = barseCtor.extend(Ctor);
    }
    // 给组件添加生命周期
    data.hook = {
        init(vnode){
            let child = vnode.componentInstance = new Ctor({});
            child.$mount(); // 挂载逻辑 组件的 $mount 方法是不传递参数的
        }
    }
    return vnode(`vue-component-${Ctor.cid}-${tag}`,data , key , undefined ,undefined,{ Ctor , children });
}

function createTextVNode (text) {
    return vnode(undefined, undefined , undefined ,undefined , text);
}

// 用来产生虚拟dom
function vnode ( tag , data , key ,children , text , componentOptions ){
    // componentOptions 用来保存组件的 构造函数 和插槽
    return {  tag , data , key ,children , text , componentOptions };
}