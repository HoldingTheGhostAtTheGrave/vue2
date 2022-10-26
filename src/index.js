import { initMixin } from './init';
import { initGlobalApi } from './initGlobalApi/index';
import { lifecycleMixin } from './lifecycle';
import { renderMinin } from './vdom/index';
// 写 vue



// 第一波 创建 vue 类 es5
function Vue (options) {
    this._init(options); //入口 组件初始化入口
}


// 写成一个个的插件 对 原型进行扩展
initMixin(Vue); // init 方法
lifecycleMixin(Vue); //混合生命周期 渲染 _update
renderMinin(Vue); // _render


// 初始化全局pi 
initGlobalApi(Vue);

export default Vue;