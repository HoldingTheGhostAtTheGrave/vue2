(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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

  // 获取数组上的方法
  var arrayProto = Array.prototype;

  // 继承该方法
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  methodsToPatch.forEach(function (method) {
    // 新的方法
    arrayMethods[method] = function () {
      // this 就是 observer里的value
      var inserted;
      var ob = this.__ob__;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (method === 'push' || method === 'unshift') {
        inserted = args;
      }
      if (method === 'splice') {
        inserted = args.slice(2);
      }
      if (inserted) {
        ob.observerArray(inserted);
      }
      return arrayProto[method].apply(this, args);
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

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
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
        console.log(value, 'valuevalue');
        value.forEach(function (el) {
          observer(el);
        });
      }
    }]);
    return Observer;
  }(); // 数据劫持
  function defineReactive(data, key, value) {
    observer(value); // 判断当前的值如果为对象就再次进行递归
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('用户获取值');
        return value;
      },
      set: function set(newValue) {
        console.log('用户设置值');
        if (newValue === value) return;
        observer(newValue); // 如果用户将值改为对象 继续监控
        value = newValue;
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

  function initSatte(vm) {
    var opts = vm.$options;
    if (opts.props) ;
    if (opts.methods) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) ;
    if (opts.watch) ;
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

  // ast 可以描述 dom css js (ast 描述代码)
  // 虚拟dom 只能描述 dom 层面不一样

  function compileToFunctions(template) {
    // 1. 需要将 html 转换成ast 抽象语法树

    // 前端要掌握的数据结构 (树)
    var ast = parseHTML(template); //
    console.log(ast);
    // 2. 需要将ast树重新生成 html
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
    // // 解析开始标签
    function start(tagName, attrs) {
      console.log(tagName, attrs, "解析开始标签");
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
    }

    // 结束标签
    function end(endTag) {
      console.log(endTag, "结束标签");
    }

    // //文本
    function chars(text) {
      console.log(text, "文本");
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

    // html 存在一直执行
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
      break;
    }
    // 截取字符串
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: []
        };
        advance(start[0].length);
        console.log(html);
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

  function initMixin(Vue) {
    //入口 初始化方法
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initSatte(vm); // 初始化状态

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
    };
  }

  // 写 vue

  // 第一波 创建 vue 类 es5
  function Vue(options) {
    this._init(options); //入口
  }

  // 写成一个个的插件 对 原型进行扩展
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
