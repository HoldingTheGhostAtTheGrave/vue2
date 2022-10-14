1. Observer 这个类主要是用来 处理响应式的 关键方法 是 defineReactive 方法 设置响应式 
    判断 当前值是否为对象再进行递归处理  observer/index.js

2. 数组不进行响应式 Object.defineProperty 处理 observer/array.js 文件进行处理
    劫持数组的方法 对数组的项进行响应式处理 
    
3. observer 添加 __ob__ 这个值 不可枚举  用来判断 当前对象是否是响应式 是否进行响应式处理

4. 添加代理 吧 vm._data 的值代理到 vm 上