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

let strats = {}

strats.components = function(parentVal,  childVal){
    const res = Object.create(parentVal); // res.__prop__ = parentVal；
    if(childVal){
        for (const key in childVal) {
            res[key] = childVal[key];
        }
    }
    return res;
};

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

            if(child[key]){
                options[key] = child[key];
            }else{
                options[key] = parent[key];
            }
        }

    }
    return options;
}

// nextTick 方法系列

let callbacks = [];
let panding = false;
let timerFunc ;

function flushCallback(){
    callbacks.forEach((cb) => cb()); // 依次执行 修改数据方法
    // while(callbacks.length){    
    //     let callback = callbacks.pop(0);
    //     callback();
    // }
    panding = false; 
}

export function nextTick (callback){
    callbacks.push(callback);
    // vue3 的 nexTick 方法原理就是 Promise.resolve().then(); 没有处理兼容性问题
    // Promise.resolve().then()

    // 判断兼容性
    if (Promise) {
        timerFunc = () => {
            Promise.resolve().then(flushCallback);
        }
    } else if (MutationObserver) { // MutationObserver  监控改变 异步更新
        let observer = new MutationObserver(flushCallback);
        let textNode = document.createTextNode(1);
        observer.observe(textNode, { characterData: true });
        timerFunc = () => {
            textNode.textContent = 2;
        }
    } else if (setImmediate) {
        timerFunc = () => {
            setImmediate(flushCallback);
        }
    } else {
        timerFunc = () => {
            setTimeout(flushCallback);
        }
    }

    if(!panding){
        timerFunc();
        panding = true;
    }
}

// 判断标签是不是真实标签
function makeMap (str) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return (key) => {
        return map[key];
    }
}

export const isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
      'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
      'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
      'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
      'title,tr,track,button'
  )
  