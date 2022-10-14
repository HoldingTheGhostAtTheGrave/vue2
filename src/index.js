import { initMixin } from './init';
// 写 vue



// 第一波 创建 vue 类 es5
function Vue (options) {
    this._init(options); //入口
}


// 写成一个个的插件 对 原型进行扩展
initMixin(Vue);




export default Vue;