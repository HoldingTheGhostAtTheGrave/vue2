import { initMixin } from './init';
import { initGlobalApi } from './global-api/index';
import { lifecycleMixin } from './lifecycle';
import { renderMinin } from './vdom/index';
import { stateMixin } from './state';
// 写 vue



// 第一波 创建 vue 类 es5
function Vue (options) {
    this._init(options); //入口 组件初始化入口
}


// 写成一个个的插件 对 原型进行扩展
initMixin(Vue); // init 方法
lifecycleMixin(Vue); //混合生命周期 渲染 _update
renderMinin(Vue); // _render
stateMixin(Vue);

// 初始化全局pi 
initGlobalApi(Vue);

// 为了看到diff的整个流程 创建1两个虚拟节点进行比对
// import { compileToFunctions } from './compile/index'; 
// import { createEle , patch } from './vdom/patch';

// let render1 = compileToFunctions('<div id="a" style="background:red" class="2"><li key="li">1</li><li key="li222">2</li><span key="span" style="color:#fff;">我是傻逼</span><li key="li222222">3</li></div>');
// let vnode1 = render1.call(new Vue({ data:{ name:'我是' } }));
// document.body.appendChild(createEle(vnode1))

// let render2 = compileToFunctions('<div id="b" style="background:pink"><li key="li222222">3</li><span key="span" style="color:#fff;">我是傻逼</span><li key="li">1</li><div key="div">divdiv</div></div>');
// let vnode2 = render2.call(new Vue({ data:{ name:'我是傻逼' } }));

// setTimeout(() => patch(vnode1 ,vnode2 ) ,2000)
export default Vue;