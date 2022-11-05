
//render 方法生成虚拟dom


export function renderMinin (Vue){
    // 虚拟节点 用1对象来描述dom
    Vue.prototype._v = function (text) {
        return createTextVNode(text); // 虚拟文本
    }
    Vue.prototype._c = function () {
        return createElement(...arguments); // 虚拟节点
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


function createElement (tag , data = {} , ...children) {
    return vnode(tag , data , data.key ,children);
}

function createTextVNode (text) {
    return vnode(undefined, undefined , undefined ,undefined , text);
}

// 用来产生虚拟dom
function vnode ( tag , data , key ,children , text , style){
    return {  tag , data , key ,children , text , style };
}