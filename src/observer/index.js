import { arrayMethods } from "./array";
import { defineProperty } from '../utils';
import Dep from "./dep";
class Observer {
    constructor(value){
        this.dep = new Dep();

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
        value.forEach((el) => {
            observer(el);
        });
    }
}

// 数据劫持
function defineReactive (data , key ,value) {

    // 获取到数组的dep
    let childDep = observer(value); // 判断当前的值如果为对象就再次进行递归

    let dep = new Dep(); //每一个属性都有 一个dep

    // 当页面取值 说明这个值用来渲染了 将属性和watcher 对应起来
    Object.defineProperty(data , key ,{
        get(){
            if(Dep.target) { // 让属性记住 watcher 依赖收集
                dep.depend();
                if(childDep){
                    // 给数组添加了dep 属性 
                    childDep.dep.depend();
                }
            }
            return value
        },
        set(newValue){
            if(newValue === value) return ;
            observer(newValue);  // 如果用户将值改为对象 继续监控
            value = newValue;
            dep.notify(); // 依赖更新
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