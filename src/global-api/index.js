import { mergeOptions } from '../utils'

export function initGlobalApi (Vue){
    // 整合了 全局api
    Vue.options = {};

    // 生命周期的合并策略 [beforeCreated,beforeCreated]
    Vue.mixin = function (mixin) {
        // 如何实现两个对象的合并
        this.options = mergeOptions(this.options , mixin);
    }

}