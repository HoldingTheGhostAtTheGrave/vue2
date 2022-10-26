vue 2.js 底层学习..... 


##### 虚拟dom 和 ast 树的区别
* 不同
    1. ast 可以描述 css js html ...
    2. ast 只能是描述语法的内容 不能新增其它描述信息

    3. 虚拟dom  描述dom节点 
    4. 可以新增 其它属性 来进行描述 
    
* 相同 
    1. js 进行描述



##### 1. 响应式原理
1. observer 方法中 对 数据进行判断 劫持
2. defineReactive 方法递归  使用 defineProperty 对 数据进行响应式拦截
3. 添加 __ ob __ 属性 判断 当前数据是否为响应式数据

##### 2. 编译过程
1. 初始化 数据 
2. 编译模板 执行 $mount 
3. 判断 render > template > $el ;  生成 ast 树 对dom进行描述 再将 ast 转为 render 函数  
    * render 不存在就 判断 template > el 
4. render 函数 转换为虚拟dom  （生成虚拟dom 将 标签的 {{  }} 替换为数据 ）
5. 虚拟dom 转为真实的dom 
6. 替换 dom 内容


###### vue 的更新策略 是以组件为单位的 给 每一个组件都添加 一个 watcher 属性变化 后 会重新 调用这个 watcher （渲染watcher） 