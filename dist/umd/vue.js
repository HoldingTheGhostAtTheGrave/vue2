(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 获取数组上的方法
  var arrayProto = Array.prototype;

  // 继承该方法
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  methodsToPatch.forEach(function (method) {
    // 新的方法
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // this 就是 observer里的value
      var result = arrayProto[method].apply(this, args);
      //
      var inserted;
      var ob = this.__ob__;
      if (method === 'push' || method === 'unshift') {
        inserted = args;
      }
      if (method === 'splice') {
        inserted = args.slice(2);
      }
      if (inserted) {
        ob.observerArray(inserted);
      }
      ob.dep.notify(); // 通知数组依赖更新
      return result;
    };
  });

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        if (vm[data][key] === newValue) return;
        vm[data][key] = newValue;
      }
    });
  }
  function defineProperty(target, key, value) {
    // 判断一个对象是否被观测过 ， 判断是否存在 __ob__
    Object.defineProperty(target, key, {
      enumerable: false,
      // 不可枚举的 循环获取不到这个属性
      configurable: false,
      // 不能修改
      value: value
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};
  function mergeHook(parentValue, childValue) {
    // 新的存在生命周期函数
    if (childValue) {
      // 老的也存在
      if (parentValue) {
        return parentValue.concat(childValue);
      } else {
        return [childValue];
      }
    } else {
      return parentValue;
    }
  }
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  // 合并方法
  function mergeOptions(parent, child) {
    var options = {};
    for (var key in parent) {
      mergeFiled(key);
    }

    // 如果已经合并过了就不需要再合并
    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeFiled(_key);
      }
    }
    // 默认的合并策略
    function mergeFiled(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }
      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }
    return options;
  }

  // nextTick 方法系列

  var callbacks = [];
  var panding$1 = false;
  var timerFunc;
  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    }); // 依次执行 修改数据方法
    // while(callbacks.length){    
    //     let callback = callbacks.pop(0);
    //     callback();
    // }
    panding$1 = false;
  }
  function nextTick(callback) {
    callbacks.push(callback);
    // vue3 的 nexTick 方法原理就是 Promise.resolve().then(); 没有处理兼容性问题
    // Promise.resolve().then()

    // 判断兼容性
    if (Promise) {
      timerFunc = function timerFunc() {
        Promise.resolve().then(flushCallback);
      };
    } else if (MutationObserver) {
      // MutationObserver  监控改变 异步更新
      var observer = new MutationObserver(flushCallback);
      var textNode = document.createTextNode(1);
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function timerFunc() {
        textNode.textContent = 2;
      };
    } else if (setImmediate) {
      timerFunc = function timerFunc() {
        setImmediate(flushCallback);
      };
    } else {
      timerFunc = function timerFunc() {
        setTimeout(flushCallback);
      };
    }
    if (!panding$1) {
      timerFunc();
      panding$1 = true;
    }
  }

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.subs = [];
      this.id = id$1++;
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target);
        Dep.target.addDep(this); // 让watcher 记住 dep 让dep 记住 watcher
      }
    }, {
      key: "notify",
      value: function notify() {
        console.log(this.subs);
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }]);
    return Dep;
  }();
  function pushTarget(watcher) {
    Dep.target = watcher; //保留watcher
  }

  function popTarget() {
    Dep.target = null; // 删除watcher
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();

      // 设置 __ob__
      defineProperty(value, '__ob__', this);

      // 使用defineProperty
      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods;
        // 观测数组里的对象
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(value) {
        value.forEach(function (el) {
          observer(el);
        });
      }
    }]);
    return Observer;
  }(); // 数据劫持
  function defineReactive(data, key, value) {
    // 获取到数组的dep
    var childDep = observer(value); // 判断当前的值如果为对象就再次进行递归

    var dep = new Dep(); //每一个属性都有 一个dep

    // 当页面取值 说明这个值用来渲染了 将属性和watcher 对应起来
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          // 让属性记住 watcher 依赖收集
          dep.depend();
          if (childDep) {
            // 给数组添加了dep 属性 
            childDep.dep.depend();
          }
        }
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observer(newValue); // 如果用户将值改为对象 继续监控
        value = newValue;
        console.log(key, value, dep);
        dep.notify(); // 依赖更新
      }
    });
  }

  function observer(data) {
    if (_typeof(data) !== 'object' || data === null) {
      return;
    }
    if (data.__ob__) {
      return;
    }
    return new Observer(data);
  }

  // 将虚拟节点转换为真实节点
  function patch(oldVnode, vnode) {
    // 默认初始化时 是用虚拟节点 创建真实的节点
    if (oldVnode.nodeType == 1) {
      var el = createEle(vnode);
      var parentEl = oldVnode.parentNode;
      parentEl.insertBefore(el, oldVnode.nextSibling);
      parentEl.removeChild(oldVnode); // 删除老的节点
      return el;
    } else {
      // 更新时用老的虚拟节点 和新的 虚拟节点作对比 将不同的地方 更新真实dom 
      // 1. 比较两个 元数的 标签
      if (oldVnode.tag !== vnode.tag) {
        return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el); // 不一样替换
      }
      // 2.标签一样 两个文本 虚拟节点的 tag 是相等的
      if (!oldVnode.tag) {
        // 文本的比对
        if (oldVnode.text !== vnode.text) {
          return oldVnode.el.textContent = vnode.text;
        }
      }

      //3. 标签一样 并且需要开始比对标签属性和儿子了
      // 标签可以直接复用
      var _el = vnode.el = oldVnode.el;

      // 更新属性 用新的虚拟节点属性 和老的 比较 去更新节点 新老属性作对比
      updatePropertions(vnode, oldVnode.data);

      // 儿子的比较 步骤
      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];
      // 老的 有children 新的 也有 
      if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(oldChildren, newChildren, _el);
      } else if (oldChildren.length > 0) {
        // 新的没有 
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        // 老的没有
        for (var index = 0; index < newChildren.length; index++) {
          _el.appendChild(createEle(newChildren[index]));
        }
      }
    }
  }
  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
  }

  // 儿子的diff 比较
  function updateChildren(oldChildren, newChildren, parent) {
    // vue 中的diff 处理了很多优化

    // 循环 同时循环老的和新的 那个先结束 循环就停止 将多的删除 或者添加

    // 开头指针
    var oldStartIndex = 0; // 老的索引
    var oldStartVnode = oldChildren[0]; // 老的索引指向 的 节点
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0; // 新的索引
    var newStartVnode = newChildren[0]; // 新的索引指向 的 节点
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];
    var map = makeIndexbyKey(oldChildren);

    // 比较谁先循环完 停止
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        // oldStartVnode 当前值为null 跳过当次 
        oldStartVnode = oldStartVnode[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else
        // 1. 老头部 和 新头去比较
        if (isSameVnode(oldStartVnode, newStartVnode)) {
          // 如果两个是 一样的 元素
          patch(oldStartVnode, newStartVnode); //更新属性和再去递归更新子节点
          oldStartVnode = oldChildren[++oldStartIndex];
          newStartVnode = newChildren[++newStartIndex];
        } else
          // 2. 老尾部 和 新尾去比较
          if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode); //更新属性和再去递归更新子节点
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
          } else
            // 3. 老的头 和 新的尾去比
            if (isSameVnode(oldStartVnode, newEndVnode)) {
              patch(oldStartVnode, newEndVnode);
              parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 插入 old 紧跟的下一个
              oldStartVnode = oldChildren[++oldStartIndex];
              newEndVnode = newChildren[--newEndIndex];
            } else
              // 4. 老的尾 和 新的头去比较
              if (isSameVnode(oldEndVnode, newStartVnode)) {
                patch(oldEndVnode, newStartVnode);
                parent.insertBefore(oldEndVnode.el, oldStartVnode.el); // 插入 old 紧跟的下一个
                oldEndVnode = oldChildren[--oldEndIndex];
                newStartVnode = newChildren[++newStartIndex];
              }
              // 儿子之间没关系 暴力比对
              else {
                var moveIndex = map[newStartVnode.key]; // 拿倒开头的虚拟节点的key  去老的中找

                // 不需要移动 没有复用的 key 
                if (moveIndex == undefined) {
                  parent.insertBefore(createEle(newStartVnode), oldStartVnode.el); // 插入 old 紧跟的下一个
                } else {
                  var moveVNode = oldChildren[moveIndex]; // 这个老的虚拟节点需要移动 
                  oldChildren[moveIndex] = null;
                  parent.insertBefore(moveVNode.el, oldStartVnode.el); // 插入 old 紧跟的下一个
                  patch(moveVNode, newStartVnode); // 比较属性
                }

                newStartVnode = newChildren[++newStartIndex];
              }
    }
    if (newStartIndex <= newEndIndex) {
      // 当 oldStartIndex 或者 newStartIndex 循环结束得到结束往后的索引的值进行处理
      for (var index = newStartIndex; index <= newEndIndex; index++) {
        // parent.appendChild(createEle(newChildren[index]));
        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createEle(newChildren[index]), ele);
      }
    }

    // 老的节点剩余未处理的 说明 新的节点不存在 该节点 
    if (oldStartIndex <= oldEndIndex) {
      for (var _index = oldStartIndex; _index <= oldEndIndex; _index++) {
        var child = oldChildren[_index];
        if (child != undefined) {
          parent.removeChild(child.el);
        }
      }
    }

    // old key 映射表
    function makeIndexbyKey(oldChildren) {
      var map = {};
      oldChildren.forEach(function (item, index) {
        if (item.key) {
          map[item.key] = index;
        }
      });
      return map;
    }
  }

  // 生成真实dom
  function createEle(vnode) {
    var tag = vnode.tag;
      vnode.data;
      var children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);

      // 处理样式
      updatePropertions(vnode);
      children.forEach(function (element) {
        vnode.el.appendChild(createEle(element));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function updatePropertions(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var el = vnode.el,
      _vnode$data = vnode.data,
      newProps = _vnode$data === void 0 ? {} : _vnode$data;

    // 样式处理
    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    // 老的有 新的没有
    for (var key in oldProps) {
      if (!newProps[key]) {
        el.removeAttribute(key); // 删除真实 dom 的属性
      }
    }

    // 老的样式中有  新的没有  删除老的样式
    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style[_key] = ''; // 删除老的样式
      }
    }

    for (var _key2 in newProps) {
      // 设置样式
      if (_key2 === 'style') {
        for (var styleKey in newProps[_key2]) {
          el.style[styleKey] = newProps[_key2][styleKey];
        }
      } else if (_key2 === 'class') {
        el.className = newProps[_key2];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  // vue 渲染流程  1. 初始化数据  2. 模板编译  3. 生成 render 函数  4. 生成虚拟节点  5.生成真实节点  6.替换页面

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      // 区分首次渲染还是更新
      var prevVnode = vm._vnode;
      if (!prevVnode) {
        vm.$el = patch(vm.$el, vnode);
      } else {
        // 替换旧的元素
        vm.$el = patch(vm._vnode, vnode);
      }
      vm._vnode = vnode;
    };
  }
  function mountComponent(vm, el) {
    // 调用 render 方法 去渲染el 属性

    callHook(vm, 'beforeMount'); // 渲染前生命周期

    // 先调用render 方法 创建虚拟节点  在将虚拟节点 渲染到页面上

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    //初始化的时候 创建 watcher
    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'updated'); // 更新生命周期
    }, true);
    callHook(vm, 'mounted'); // 渲染后生命周期
  }

  // 掉用生命周期
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var index = 0; index < handlers.length; index++) {
        handlers[index].call(vm);
      }
    }
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exproOrFn, callback, options) {
      _classCallCheck(this, Watcher);
      this.vm = vm;
      this.exproOrFn = exproOrFn;
      this.callback = callback;
      this.options = options;
      this.user = options.user; // 用户watcher
      this.id = id++; //watcher 的唯一标识
      this.deps = []; //记录dep
      this.depsId = new Set();

      // getter 更新函数
      if (typeof exproOrFn == 'function') {
        this.getter = exproOrFn;
      } else {
        // exproOrFn 可能是字符串 取值获取依赖收集
        this.getter = function () {
          // 获取 属性 值
          var path = exproOrFn.split('.');
          var obj = vm;
          for (var index = 0; index < path.length; index++) {
            obj = obj[path[index]];
          }
          return obj;
        };
      }
      this.value = this.get();
    }
    _createClass(Watcher, [{
      key: "update",
      value: function update() {
        callHook(this.vm, 'beforeUpdate');
        queueWatcher(this); // 批处理 ， 暂存 方法
      }
    }, {
      key: "get",
      value: function get() {
        // watch 先获取值 触发拦截 target 已存在当前 target 
        pushTarget(this); // 当前实例
        var result = this.getter(); //渲染页面 获取值
        popTarget();
        return result;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get();
        var oldValue = this.value;
        this.value = newValue; // 替换老值
        if (this.user) {
          this.callback.call(this.vm, newValue, oldValue);
        }
      }
    }]);
    return Watcher;
  }(); // 批处理代码
  var queue = []; // 需要批量更新的 watcher 存到队列中 
  var has = {};
  var panding = false;
  function flushSchedulerQueue() {
    queue.forEach(function (watch) {
      watch.run();
      if (!watch.user) {
        watch.callback();
      }
    });
    queue = [];
    has = {};
    panding = false;
  }
  function queueWatcher(watcher) {
    // 去重
    if (!has[watcher.id]) {
      queue.push(watcher); // 存队列
      has[watcher.id] = true;
      if (!panding) {
        nextTick(flushSchedulerQueue);
        panding = true;
      }
    }
  }

  function initSatte(vm) {
    var opts = vm.$options;
    if (opts.props) ;
    if (opts.methods) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) ;
    if (opts.watch) {
      initWatch(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    // 数据的劫持方案
    observer(data);

    // 代理
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 获取watch 里面的值 
  function initWatch(vm) {
    var watch = vm.$options.watch;
    var _loop = function _loop(key) {
      var handler = watch[key]; // 获取值内容
      if (Array.isArray(handler)) {
        handler.forEach(function (hand) {
          createWatcher(vm, key, hand);
        });
      } else {
        createWatcher(vm, key, handler);
      }
    };
    for (var key in watch) {
      _loop(key);
    }
  }

  // 获取watch 值触发 $watch
  function createWatcher(vm, exprOrFunction, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    // options 用来标识用户watcher
    if (_typeof(handler) == 'object') {
      options = options;
      handler = handler.handler;
    }
    if (typeof handler == 'string') {
      handler = vm[handler];
    }
    return vm.$watch(exprOrFunction, handler, options);
  }
  function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (callback) {
      nextTick(callback);
    };
    Vue.prototype.$watch = function (exprOrFunction, callback, options) {
      // 数据应该依赖 这个 watcher 数据变化执行
      new Watcher(this, exprOrFunction, callback, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));
      if (options.immediate) {
        callback();
      }
    };
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{}} 内容

  function genProps(attrs) {
    var str = '';
    for (var index = 0; index < attrs.length; index++) {
      var attr = attrs[index];
      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (element) {
            var _element$split = element.split(':'),
              _element$split2 = _slicedToArray(_element$split, 2),
              key = _element$split2[0],
              value = _element$split2[1];
            obj[key] = value;
          });
          attr.value = obj;
        })();
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  function gen(node) {
    if (node.type == 1) {
      return generate(node); //生成元素节点
    } else {
      var text = node.text;
      // 如果是普通文本 直接返回处理
      if (defaultTagRE.test(text)) {
        var tokens = []; // 存放每一段代码
        var lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式 每次使用前都需要更改 为 0 （不然会导致匹配不到）
        var match, index;

        // defaultTagRE.exec(text) 捕获到 是否存在匹配到的值
        while (match = defaultTagRE.exec(text)) {
          index = match.index; // 保存匹配到的索引
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      } else {
        return "_v(".concat(JSON.stringify(text), ")");
      }
    }
  }
  function genChildren(children) {
    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  function generate(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length ? "".concat(genProps(ast.attrs)) : 'undefined').concat(ast.children ? ",".concat(children) : '', ")");
    return code;
  }

  var ncname = "[a-zA-Z ][\\-\\.0-9_a-zA-Z]*"; // 标签名
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // ?: 匹配但不捕获
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // // 标签开头的正则 捕获的内容是标签名
  var endTag = new RegExp("^</".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^’]*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  // 生成 ast
  function parseHTML(html) {
    var root;
    var currentParent;
    var stack = [];
    // // 解析开始标签
    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element);
    }

    // 结束标签 创建父子关系 
    function end(endTag) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1]; // 吧子元素 = currentParent
      if (currentParent) {
        element.parent = currentParent; // 标签的 父元素
        currentParent.children.push(element); // 子元素
      }
    }

    // //文本
    function chars(text) {
      text = text.trim();
      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    // html 存在一直执行 这里负责吧 html 处理成 ast 树 
    while (html) {
      var textEnd = html.indexOf("<");
      if (textEnd == 0) {
        // 肯定是标签 处理开始
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        // 处理结束
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      var text = void 0;
      // 处理文本
      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        chars(text);
      }
    }
    // 截取字符串
    function advance(n) {
      html = html.substring(n);
    }

    // 处理自定义属性 和 tagName
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: []
        };
        advance(start[0].length);
        var _end;
        var attr;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length); // 去掉属性
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }
    return root;
  }

  // ast 可以描述 dom css js (ast 描述代码)

  // 转为 render 函数
  function compileToFunctions(template) {
    // 1. 需要将 html 转换成ast 抽象语法树

    // 前端要掌握的数据结构 (树)
    var ast = parseHTML(template); //
    // 2. 需要将ast树重新生成 html
    var code = generate(ast);
    // 将字符串变成函数 限制取值范围 通过 with 来进行取值 通过改变this 让这个函数内部获取到结果
    var render = new Function("with( this ){ return ".concat(code, " }"));
    return render;
  }

  function initMixin(Vue) {
    //入口 初始化方法
    Vue.prototype._init = function (options) {
      var vm = this;

      // 将用户传递的 全局 mixin 合并
      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 初始前生命周期

      initSatte(vm); // 初始化状态

      callHook(vm, 'created'); // 初始化状态生命周期
      // vue 响应数据的变化 讲将数据作一个初始化的劫持 （数据改变时改变视图）

      // 默认 如果当前有el属性 就渲染模板
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      // 1 获取el dom
      // 2 判断如果没有 render
      // 3 没render 就 将 template 转为 render

      // 挂载
      var vm = this;

      // 1 获取el dom
      el = document.querySelector(el);
      vm.$el = el;
      // 2 判断如果没有 render
      if (!vm.$options.render) {
        // 3 没render 就 将 template 转为 render
        var template = vm.$options.template;
        if (!template && el) {
          template = el.outerHTML;
        }
        // 将模板转换为 render 函数 就是 ast 虚拟dom树 最总渲染时用的都是render方法
        var render = compileToFunctions(template);
        vm.$options.render = render;
      }

      // 需要挂载这个元素
      mountComponent(vm);
    };
  }

  function initGlobalApi(Vue) {
    // 整合了 全局api
    Vue.options = {};

    // 生命周期的合并策略 [beforeCreated,beforeCreated]
    Vue.mixin = function (mixin) {
      // 如何实现两个对象的合并
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function renderMinin(Vue) {
    // 虚拟节点 用1对象来描述dom
    Vue.prototype._v = function (text) {
      return createTextVNode(text); // 虚拟文本
    };

    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); // 虚拟节点
    };
    // 如果是对象会对对象进行取值
    Vue.prototype._s = function (val) {
      return val == null ? "" : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(this);
      return vnode;
    };
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, data, data.key, children);
  }
  function createTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  // 用来产生虚拟dom
  function vnode(tag, data, key, children, text, style) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      style: style
    };
  }

  // 写 vue

  // 第一波 创建 vue 类 es5
  function Vue(options) {
    this._init(options); //入口 组件初始化入口
  }

  // 写成一个个的插件 对 原型进行扩展
  initMixin(Vue); // init 方法
  lifecycleMixin(Vue); //混合生命周期 渲染 _update
  renderMinin(Vue); // _render
  stateMixin(Vue);

  // 初始化全局pi 
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
