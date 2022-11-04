import { mergeOptions } from '../utils'
import { initExtend } from './extend';

export function initGlobalApi (Vue){
    // 整合了 全局api
    Vue.options = {};

    // 生命周期的合并策略 [beforeCreated,beforeCreated]
    Vue.mixin = function (mixin) {
        // 如何实现两个对象的合并
        this.options = mergeOptions(this.options , mixin);
    }

    Vue.options._base = Vue; //vue的构造函数
    Vue.options.components = {};

    initExtend(Vue);

    // 注册组件
    Vue.component = function (id , definition) {
        definition.name = definition.name || id; //默认属性名
        // 用的时候 需要 new  definition.$mount
        definition = this.options._base.extend(definition);
        Vue.options.components[id] = definition;
    }
}