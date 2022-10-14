import { observer } from "./index";


// 获取数组上的方法
const arrayProto = Array.prototype;

// 继承该方法
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

methodsToPatch.forEach((method) => {
    // 新的方法
    arrayMethods[method] = function (...args) {
        // this 就是 observer里的value
        let inserted;
        let ob = this.__ob__;

        if(method === 'push' || method === 'unshift'){
            inserted = args;
        }
        if(method === 'splice'){
            inserted = args.slice(2);
        }
        if(inserted){
            ob.observerArray(inserted);
        }
        return arrayProto[method].apply(this,args);
    }
})                                        