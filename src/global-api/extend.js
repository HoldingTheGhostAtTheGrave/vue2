import { mergeOptions } from '../utils';

export function initExtend (Vue) {
    let cid = 0;
    Vue.extend = function (extendOptions) {
        const Super = this;
        const sub = function vueComponent (options) {
            this._init(options);
        }
        sub.cid = cid++;
        // 子类要继承父类的原型方法
        sub.prototype = Object.create(Super.prototype);
        sub.prototype.constructor = sub;
        
        sub.options = mergeOptions(Super.options , extendOptions);
        sub.component = Super.component;
        return sub;
    }
}


// 组件的渲染流程

// 1. 调用 Vue.componen
// 2. 用Vue.extend 创建一个子类继承父类
// 3. 创建子类的实例时 会调用父类的init 方法 再去 $mount
// 4. 组件的初始化 实际上就是 new 这个组件的构造函数 并且 调用 $mount 方法
// 5. 创建虚拟节点 根据标签名找到对应组件 ， 生成虚拟节点 
// 6. 组件创建真实dom时 ， 先渲染的是父组件 遇到是组件的虚拟节点时 调用 init 方法 让组件初始化 并挂载 
// 组件的 $mount 不 传参数 会把渲染后的dom 放到vm.$el 上 => vnode.componentInstance 上 这样渲染时就会获取对象 的 $el 属性来渲染