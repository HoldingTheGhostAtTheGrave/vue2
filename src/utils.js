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