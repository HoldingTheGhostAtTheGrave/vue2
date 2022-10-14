import { arrayMethods } from "./array";
import { defineProperty } from '../utils';
class Observer {
    constructor(value){

        // 设置 __ob__
        defineProperty(value , '__ob__' , this);

        // 使用defineProperty
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods;
            // 观测数组里的对象
            this.observerArray(value);
        }else{
            this.walk(value);
        }
    }
    walk(data){
        let keys = Object.keys(data);
        keys.forEach((key) => {
            defineReactive(data , key , data[key]);
        });
    }
    observerArray(value){
        console.log(value,'valuevalue');
        value.forEach((el) => {
            observer(el);
        });
    }
}

// 数据劫持
function defineReactive (data , key ,value) {
    observer(value); // 判断当前的值如果为对象就再次进行递归
    Object.defineProperty(data , key ,{
        get(){
            console.log('用户获取值');
            return value
        },
        set(newValue){
            console.log('用户设置值');
            if(newValue === value) return ;
            observer(newValue);  // 如果用户将值改为对象 继续监控
            value = newValue;
        }
    });
}

export function observer (data) {
    if(typeof data !== 'object' || data === null){
        return
    }
    if(data.__ob__){
        return
    }
    return new Observer(data);
}