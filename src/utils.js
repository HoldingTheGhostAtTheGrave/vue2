export function proxy (vm , data , key) {
    Object.defineProperty(vm , key , {
        get(){
            return vm[data][key];
        },
        set(newValue){
            if(vm[data][key] === newValue) return;
            vm[data][key] = newValue;
        }
    });
}

export function defineProperty (target,key,value){
    // 判断一个对象是否被观测过 ， 判断是否存在 __ob__
    Object.defineProperty(target,key,{
        enumerable:false ,// 不可枚举的 循环获取不到这个属性
        configurable:false, // 不能修改
        value
    });
}

const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
]

let strats = {

}

function mergeHook (parentValue , childValue) {
    // 新的存在生命周期函数
    if(childValue){
        // 老的也存在
        if(parentValue){
            return parentValue.concat(childValue);
        }else{
            return [childValue];
        }
    }else{
        return parentValue;
    }
}

LIFECYCLE_HOOKS.forEach((hook) => {
    strats[hook] = mergeHook;
})

// 合并方法
export function mergeOptions (parent , child) {
    const options = {};

    for (const key in parent) {
        mergeFiled(key);
    }

    // 如果已经合并过了就不需要再合并
    for (const key in child) {
        if(!parent.hasOwnProperty(key)){
            mergeFiled(key);
        }
    }
    // 默认的合并策略
    function mergeFiled (key) {
        if(strats[key]){
            return options[key] = strats[key](parent[key] , child[key]);
        }
        if(typeof parent[key] === 'object' && typeof child[key] === 'object'){
            options[key] = {
                ...parent[key],...child[key]
            }
        }else if(child[key] == null){
            options[key] = parent[key];
        }else {
            options[key] = child[key];
        }

    }
    return options;
}