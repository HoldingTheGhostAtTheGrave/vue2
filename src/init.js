import { compileToFunctions } from './compile/index';
import {
  callHook,
  mountComponent,
} from './lifecycle';
import { initSatte } from './state';
import { mergeOptions } from './utils';

export function initMixin(Vue) {
	//入口 初始化方法
	Vue.prototype._init = function (options) {
		const vm = this;

		// 将用户传递的 全局 mixin 合并
		vm.$options = mergeOptions( vm.constructor.options ,options);

		callHook(vm , 'beforeCreate'); // 初始前生命周期

		initSatte(vm); // 初始化状态

		callHook(vm , 'created'); // 初始化状态生命周期
		// vue 响应数据的变化 讲将数据作一个初始化的劫持 （数据改变时改变视图）

		// 默认 如果当前有el属性 就渲染模板
		if (vm.$options.el) {
			vm.$mount(vm.$options.el);
		}
	};
	Vue.prototype.$mount = function (el) {
		// 1 获取el dom
		// 2 判断如果没有 render
		// 3 没render 就 将 template 转为 render

		// 挂载
		const vm = this;

		
		// 1 获取el dom
		el = document.querySelector(el);
		vm.$el = el;
		// 2 判断如果没有 render
		if (!vm.$options.render) {
			// 3 没render 就 将 template 转为 render
			let template = vm.$options.template;
			if (!template && el) {
				template = el.outerHTML;
			}
			// 将模板转换为 render 函数 就是 ast 虚拟dom树 最总渲染时用的都是render方法
			const render = compileToFunctions(template);
			console.log(render);
			vm.$options.render = render;
		}

		// 需要挂载这个元素
		mountComponent(vm,el);

	};
}
