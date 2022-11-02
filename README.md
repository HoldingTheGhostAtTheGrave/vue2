vue 2.js 底层学习.....

### 虚拟 dom 和 ast 树的区别

- 不同

  1. ast 可以描述 css js html ...
  2. ast 只能是描述语法的内容 不能新增其它描述信息

  3. 虚拟 dom 描述 dom 节点
  4. 可以新增 其它属性 来进行描述

- 相同
  1. js 进行描述

### 1. 响应式原理

1. observer 方法中 对 数据进行判断 劫持
2. defineReactive 方法递归 使用 defineProperty 对 数据进行响应式拦截
3. 添加 __ob__ 属性 判断 当前数据是否为响应式数据

### 2. 编译过程

1. 初始化 数据
2. 编译模板 执行 $mount
3. 判断 render > template > $el ; 生成 ast 树 对 dom 进行描述 再将 ast 转为 render 函数
   - render 不存在就 判断 template > el
4. render 函数 转换为虚拟 dom （生成虚拟 dom 将 标签的 {{  }} 替换为数据 ）
5. 虚拟 dom 转为真实的 dom
6. 替换 dom 内容

### 3. watcher 和 dep （收集依赖 更新）

### 代码 为 $ntextick 方法

- Dep.target 为当前更新的 Whatcher 实例

- 结合代码理解 ：watcher 在初始化的时候 创建 watcher (beforeCreate 后 ) 首 触发 get 方法 调用 当前更新 吧 render 方法转为虚拟 dom 再转为 真实 dom 渲染替换 dom

1. 调用 get 方法 添加 Dep.target 为 watcher 实例
2. 调用 传入的 callback 方法 触发 \_update 让 （render 转为虚拟 dom） （patch 方法转 真实 dom） 方法更新 dom 数据
3. Object.defineProperty 对 （render）方法转 虚拟 dom 时 替换 {{ name }} 获取值时进行拦截 （Dep.target 为 watcher 实例 ）
4. Object.defineProperty 获取值 Dep.target 存在 触发 dep.depend 方法 收集依赖 添加 到 dep 类的 subs 数组中
5. Object.definePropert 更新值时 触发 dep.notify 方法 循环 subs 收集的依赖 触发 watcher.update 方法 更新 this.subs.forEach((watcher) => watcher.update());
6. watcher.update() 方法 处理 数据修改的批处理 去重 触发 nextTick 方法 callback 为 当前更新的 方法
7. nextTick 对方法进行 批处理 添加数组项
8. nextTick 进行异步更新操作处理

- 方法其实就是在 更新的循环数组中 push 一项

```js
// nextTick 方法系列
let callbacks = [];
let panding = false;
let timerFunc;
function flushCallback() {
  callbacks.forEach((cb) => cb()); // 依次执行 修改数据方法
  panding = false;
}
export function nextTick(callback) {
    callbacks.push(callback);
    // vue3 的 nexTick 方法原理就是 Promise.resolve().then(); 没有处理兼容性问题
    // Promise.resolve().then()
    // 判断兼容性
    if (Promise) {
        timerFunc = () => {
        Promise.resolve().then(flushCallback);
        };
    } else if (MutationObserver) {
        // MutationObserver  监控改变 异步更新
        let observer = new MutationObserver(flushCallback);
        let textNode = document.createTextNode(1);
        observer.observe(textNode, { characterData: true });
        timerFunc = () => {
        textNode.textContent = 2;
        };
    } else if (setImmediate) {
        timerFunc = () => {
        setImmediate(flushCallback);
        };
    } else {
        timerFunc = () => {
        setTimeout(flushCallback);
        };
    }
    if (!panding) {
        timerFunc();
        panding = true;
    }
}
```

1. 取属性值 是 会调用 get 方法 dep.depend 记录 这个渲染的 watcher （也可以理解为当前的 target ）
2. 属性值更新时 调用 dep 的 notify 方法 执行 Watcher 渲染页面数据

### 数组 更新渲染 watcher

1. 给 所有 对象类型 添加 一个 dep 属性 dep = new Dep();
2. 获取 数组的 值时 记录 当前渲染 的 Whatcher ;
3. 数组项改变 时 进入重写的 数组 方法 在 该方法里 触发 dep.notify() 方法 更新当前修改的数组 当前 更新 的 Watcher

### 生命周期

1. vue 生命周期是 在不同的处理阶段 执行不同的方法

```js
/ filecycle.js
// 掉用生命周期
export function callHook (vm , hook) {
    const handlers = vm.$options[hook];
    if(handlers){
        for (let index = 0; index < handlers.length; index++) {
            handlers[index].call(vm);
        }
    }
}
```

#### watch 方法

- new Watcher 吧 watcher 设置为 用户的 watcher
- watch 的 key value 值为 watcher 的 callback 方法
- 用户修改值是触发更新 value 函数 传入值

#### diff 解析 / vdom/patch.js

- 拿到 老的 vnode 和 新的 vnode 进行比较

1. 获取当前 oldVnode 和 newVnode 的 tag （标签名） 进行比较 不相同直接 新替换老
2. 标签一样 两个文本 虚拟节点的 tag 是相等的 替换文本 （文本标签）
3. updatePropertions 方法 处理新老属性的 对比 替换
4. 判断 当前标签的 children

### diff 核心

1. 双指针的 方式对比 （定义 old 开头指针 开始的索引项 和 && 结束指针 结束的索引项） （new 开头指针 开始的索引项 && 结束指针 结束的索引项）

```js
let oldStartIndex = 0; // 老的索引
let oldStartVnode = oldChildren[0]; // 老的索引指向 的 节点
let oldEndIndex = oldChildren.length - 1;
let oldEndVnode = oldChildren[oldEndIndex];

let newStartIndex = 0; // 新的索引
let newStartVnode = newChildren[0]; // 新的索引指向 的 节点
let newEndIndex = newChildren.length - 1;
let newEndVnode = newChildren[newEndIndex];
```

2. 判断 old && new 开头项的 vnode 是否相同 并修改其指针

```js
// 1. 老头部 和 新头去比较
if (isSameVnode(oldStartVnode, newStartVnode)) {
    // 如果两个是 一样的 元素
    patch(oldStartVnode, newStartVnode); //更新属性和再去递归更新子节点
    oldStartVnode = oldChildren[++oldStartIndex]; //重新修改开始项vnode
    newStartVnode = newChildren[++newStartIndex];
}
```

3. 判断 old && new 结束项的 vnode 是否相同 并修改其指针

```js
// 2. 老尾部 和 新尾去比较
if (isSameVnode(oldEndVnode, newEndVnode)) {
    patch(oldEndVnode, newEndVnode); //更新属性和再去递归更新子节点
    oldEndVnode = oldChildren[--oldEndIndex];
    newEndVnode = newChildren[--newEndIndex];
}
```

4. 判断 old 的开始 和 new 的尾比较 vnode 是否相同 吧新的插入到老的 dom 中 并修改其指针

```js
// 3. 老的头 和 新的尾去比
if (isSameVnode(oldStartVnode, newEndVnode)) {
    patch(oldStartVnode, newEndVnode);
    parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 插入 old 紧跟的下一个
    oldStartVnode = oldChildren[++oldStartIndex];
    newEndVnode = newChildren[--newEndIndex];
}
```

5. 判断 old 的结束 和 new 的开始比较 vnode 是否相同 吧老的插入到老的前面一项中 并修改其指针

```js
if (isSameVnode(oldEndVnode, newStartVnode)) {
    patch(oldEndVnode, newStartVnode);
    parent.insertBefore(oldEndVnode.el, oldStartVnode.el); // 插入 old 紧跟的下一个
    oldEndVnode = oldChildren[--oldEndIndex];
    newStartVnode = newChildren[++newStartIndex];
}
```

6. 暴力比对

```js
// old key 映射表
function makeIndexbyKey(oldChildren) {
    let map = {};
    oldChildren.forEach((item, index) => {
        if (item.key) {
        map[item.key] = index;
        }
    });
    return map;
}
let map = makeIndexbyKey(oldChildren);

else{
    let moveIndex = map[newStartVnode.key]; // 拿倒开头的虚拟节点的key  去老的中找
    // 不需要移动 没有复用的 key
    if (moveIndex == undefined) {
        parent.insertBefore(createEle(newStartVnode), oldStartVnode.el); // 插入 old 紧跟的下一个
    } else {
        let moveVNode = oldChildren[moveIndex]; // 这个老的虚拟节点需要移动
        oldChildren[moveIndex] = null; // 当前的old 的虚拟节点设置为 null
        parent.insertBefore(moveVNode.el, oldStartVnode.el); // 插入 old
        patch(moveVNode, newStartVnode); // 比较choldren
    }
    newStartVnode = newChildren[++newStartIndex];
}
```


### computed
1. 循环 获取 conputed 里的 对象 属性值
2. 创建 watcher 类 
```js
for (const key in computed) {
     const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get; // watcher 使用
    watchers[key] = new Watcher(vm , getter , () => {} , { lazy : true }); // 计算属性的watcher
    defineComputed(vm , key , userDef);
}
```
3. getter 为修改触发的 函数 值

4. 使用 Object.defineProperty 侦听 对象的 key 值

5. 包装 对象中的 方法
```js
function createComptedGetter (key){
    // 此方法是包装的计算属性方法 每次获取值调用 判断要不要执行用户传递的方法
    return function () {
        // 执行
        const watcher = this._computedWatchers[key]; //获取属性对应的 watcher
        if(watcher){
            // 用 dirty 控制 是否需要重新渲染
            if(watcher.dirty){
                watcher.evaluate(); // 对当前的  watcher 进行求值
            }
            // 添加 渲染 watcher
            if(Dep.target){
                watcher.depend();
            }
            return watcher.value; // 默认返回 watcher 的value 的值
        }
    }
}

```

###### vue 的更新策略 是以组件为单位的 给 每一个组件都添加 一个 watcher 属性变化 后 会重新 调用这个 watcher （渲染 watcher）
