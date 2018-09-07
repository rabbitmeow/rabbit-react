'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  serious code coupling!!! but i'm not going to redesign it because it cannot make money. Q.Q pooooor rabbit
*/

// tools
Array.prototype.flatMap = function () {
  var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;

  return depth <= 0 ? this.slice() : this.reduce(function (a, b) {
    return a.concat(b instanceof Array ? b.flatMap(depth - 1) : b);
  }, []);
};

// all lifecycles are pending to implement

var Component = function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
    this.state = null;
  }

  _createClass(Component, [{
    key: 'setState',
    value: function setState(arg, callback) {
      var typeofArg = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
      if (typeofArg !== 'object' && typeofArg !== 'function' || callback && typeof callback !== 'function') {
        throw new Error('invalid type of arguments of setState(arg: object|function, callback: function?)');
      }
      React.enqueueSetStates(this, arg, callback);
      Promise.resolve().then(function () {
        React.renderState(ReactReconciler.render);
      });
    }
    // temporarily remove

  }, {
    key: 'forceUpdate',
    value: function forceUpdate() {}
    // temporarily remove

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
    }
  }, {
    key: 'render',
    value: function render() {}
    // remove

  }, {
    key: 'getSnapshotBeforeUpdate',
    value: function getSnapshotBeforeUpdate(prevProps, prevState) {
      return null;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState, snapsshot) {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }]);

  return Component;
}();
// remove


Component.getDerivedStateFromProps = function (props, state) {
  return null;
};

/**
  React Engine

  generate components and render elements
*/
var React = {
  engine: {
    // weights: new Map(),
    pendingSetStateComponents: new Map(),
    pendingRenderComponents: new Set()
  },
  Component: Component,
  Element: function Element(type, key, ref, props) {
    _classCallCheck(this, Element);

    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = props;
    this._maker = null;
  },
  createElement: function createElement(type, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    var _ref = config || {},
        _ref$key = _ref.key,
        key = _ref$key === undefined ? null : _ref$key,
        _ref$ref = _ref.ref,
        ref = _ref$ref === undefined ? null : _ref$ref,
        rest = _objectWithoutProperties(_ref, ['key', 'ref']);

    return new React.Element(type, key, ref, _extends({}, rest, { children: children }));
  },
  render: function render(component) {
    var element = component.render();
    element._maker = component;
    return element;
  },
  newComponent: function newComponent(Component, props) {
    var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    // const {weights} = React.engine
    var component = new Component(props);
    // weights.set(component, order + 1)
    return component;
  },
  enqueueSetStates: function enqueueSetStates(component, updater, callback) {
    var pendingSetStateComponents = React.engine.pendingSetStateComponents;

    var pack = null;
    if (!pendingSetStateComponents.has(component)) {
      pack = { updaters: [], callbacks: [] };
      pendingSetStateComponents.set(component, pack);
    }
    var _pack = pack,
        updaters = _pack.updaters,
        callbacks = _pack.callbacks;

    updaters.push(updater);
    if (callback) {
      callbacks.push(callback);
    }
  },
  renderState: function renderState(handler) {
    var _updateStates = React._updateStates,
        _updateRenders = React._updateRenders,
        pendingSetStateComponents = React.engine.pendingSetStateComponents;

    if (pendingSetStateComponents.size) {
      _updateStates();
      _updateRenders(handler);
    }
  },
  _updateStates: function _updateStates() {
    var _React$engine = React.engine,
        pendingSetStateComponents = _React$engine.pendingSetStateComponents,
        pendingRenderComponents = _React$engine.pendingRenderComponents;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var _step$value = _slicedToArray(_step.value, 2),
            component = _step$value[0],
            _step$value$ = _step$value[1],
            updaters = _step$value$.updaters,
            callbacks = _step$value$.callbacks;

        var state = component.state,
            props = component.props;

        var newStates = updaters.map(function (updater) {
          return (typeof updater === 'undefined' ? 'undefined' : _typeof(updater)) === 'object' ? updater : updater(state, props);
        });
        Object.assign.apply(Object, [state].concat(_toConsumableArray(newStates)));
        callbacks.forEach(function (callback) {
          return callback();
        });
        pendingRenderComponents.add(component);
      };

      for (var _iterator = pendingSetStateComponents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    pendingSetStateComponents.clear();
  },
  _updateRenders: function _updateRenders(handler) {
    var _React$engine2 = React.engine,
        pendingRenderComponents = _React$engine2.pendingRenderComponents,
        weights = _React$engine2.weights;

    var components = [].concat(_toConsumableArray(pendingRenderComponents));
    components.sort(function (a, b) {
      return weights.get(b) - weights.get(a);
    }).forEach(function (component) {
      var element = React.render(component);
      handler(element);
    });
    pendingRenderComponents.clear();
  }
};

/**
  ReactReconciler Engine

  manage component and dom-node-tree
*/
var ReactReconciler = {
  engine: {
    componentToNode: new Map()
  },
  Node: function Node(element) {
    if (typeof element === 'string') {
      return {
        type: null,
        text: element,
        domNode: null,

        nextSibling: null,
        preSibling: null,
        parent: null
      };
    }
    var type = element.type,
        props = element.props;

    if (typeof type === 'function') {
      return {
        type: type,
        ref: null,
        component: null,
        domNode: null,
        childDomNode: null,

        firstChild: null,
        nextSibling: null,
        preSibling: null,
        parent: null
      };
    }

    var _props$id = props.id,
        id = _props$id === undefined ? null : _props$id,
        _props$className = props.className,
        className = _props$className === undefined ? null : _props$className,
        _props$style = props.style,
        style = _props$style === undefined ? null : _props$style,
        candidates = _objectWithoutProperties(props, ['id', 'className', 'style']);

    var reg = /^on([A-Z][a-zA-Z]+)$/;
    var handlers = Object.keys(candidates).map(function (key) {
      var matched = reg.exec(key);
      return matched && matched[1];
    }).filter(function (key) {
      return key !== null;
    }).reduce(function (a, b) {
      a[b.toLowerCase()] = candidates['on' + b];
      return a;
    }, {});
    return {
      type: type,
      id: id,
      className: className,
      style: style,
      handlers: handlers,

      domNode: null,

      firstChild: null,
      nextSibling: null,
      preSibling: null,
      parent: null
    };
  },
  _diff: function _diff(newNode, oldNode) {
    console.log('newNode', newNode);
    console.log('oldNode', oldNode);
    var diffCollector = ReactDOM.engine.diffCollector;

    if (!newNode) {
      if (oldNode.domNode) {
        diffCollector.remove.push(oldNode);
      } else {
        ReactReconciler.engine.componentToNode.delete(oldNode._maker);
      }
      return;
    }
    if (!oldNode) {
      diffCollector.add.push(newNode);
      return;
    }
    if (newNode.type !== oldNode.type || newNode.type === null && newNode.text !== oldNode.text) {
      diffCollector.remove.push(oldNode);
      diffCollector.add.push(newNode);
      return;
    }
    var attrs = ['id', 'className', 'style'].filter(function (key) {
      return newNode[key] !== oldNode[key];
    }).reduce(function (a, b) {
      a[b] = newNode[b];
      return a;
    }, {});
    newNode.domNode = oldNode.domNode;
    diffCollector.setAttributes.push([newNode, attrs]);
  },
  _traverse: function _traverse(element, oldNode, handler, preSibling, parent) {
    var componentToNode = ReactReconciler.engine.componentToNode,
        Node = ReactReconciler.Node,
        _traverse = ReactReconciler._traverse;

    element = element || '';
    var newNode = Node(element);
    newNode.preSibling = preSibling;
    newNode.parent = parent;
    handler(newNode, oldNode);
    var _element = element,
        type = _element.type;

    if (typeof type === 'function') {
      if (parent.domNode) {
        newNode.domNode = parent.domNode;
      }
      if (oldNode && oldNode.childDomNode) {
        newNode.childDomNode = oldNode.childDomNode;
      }
      if (Object.getPrototypeOf(type) === React.Component) {
        var component = oldNode && oldNode.component || React.newComponent(type, element.props);
        component.props = element.props;
        newNode.component = component;
        componentToNode.set(component, newNode);
        newNode.firstChild = _traverse(React.render(component), oldNode && oldNode.firstChild, handler, null, newNode);
      } else {
        newNode.firstChild = _traverse(type(element.props), oldNode && oldNode.firstChild, handler, null, newNode);
      }
      return newNode;
    }

    var children = element.props && element.props.children.flatMap();
    if (Array.isArray(children)) {
      var pointer = oldNode && oldNode.firstChild;
      var memoSibling = null;
      if (children.length) {
        memoSibling = newNode.firstChild = _traverse(children[0], pointer, handler, null, newNode);
        pointer = pointer && pointer.nextSibling;
      }
      for (var i = 1; i < children.length; i++) {
        var tp = _traverse(children[i], pointer, handler, memoSibling, newNode);
        pointer = pointer && pointer.nextSibling;
        memoSibling.nextSibling = tp;
        memoSibling = tp;
      }
      while (pointer) {
        handler(null, pointer);
        pointer = pointer.nextSibling;
      }
    }
    return newNode;
  },
  render: function render(element, domNode) {
    var componentToNode = ReactReconciler.engine.componentToNode,
        _diff = ReactReconciler._diff;

    var node = element._maker && componentToNode.get(element._maker).firstChild || null;
    var newNode = ReactReconciler._traverse(element, node, _diff, node && node.preSibling, domNode ? { domNode: domNode } : node && node.parent);
    if (node) {
      newNode.parent = node.parent;
      if (node.preSibling) {
        newNode.preSibling = node.preSibling;
        node.preSibling.nextSibling = newNode;
      }
    }
    ReactDOM.renderDiff();
    return newNode;
  }
};

/**
  ReactDOM Engine

  not implement key yet, so there is no move operation (maybe i will never implement it due to no reward)
*/
var ReactDOM = {
  engine: {
    DOMtoNode: new Map(),
    diffCollector: {
      add: [],
      remove: [],
      setAttributes: [] // [node, {}]
    }
  },
  renderDiff: function renderDiff() {
    var _ReactDOM$engine = ReactDOM.engine,
        diffCollector = _ReactDOM$engine.diffCollector,
        DOMtoNode = _ReactDOM$engine.DOMtoNode;

    console.log(Object.assign({}, diffCollector));

    diffCollector.remove.map(function (node) {
      return node.domNode;
    }).forEach(function (domNode) {
      domNode.remove();
    });

    diffCollector.add.forEach(function (node) {
      if (typeof node.type === 'function') {
        node.domNode = node.parent.domNode;
        return;
      }
      var domNode = node.type !== null ? document.createElement(node.type) : document.createTextNode(node.text);
      node.domNode = domNode;

      var pointer = node.parent;
      var pre = null;
      while (typeof pointer.type === 'function') {
        pointer.childDomNode = domNode;
        pre = pointer.preSibling;
        pointer = pointer.parent;
      }

      if (pre) {
        node.parent.domNode.insertBefore(domNode, pre.domNode.sibling);
      } else if (node.preSibling) {
        var reference = typeof node.preSibling.type === 'function' ? node.preSibling.childDomNode : node.preSibling.domNode;
        node.parent.domNode.insertBefore(domNode, reference.sibling);
      } else {
        node.parent.domNode.insertBefore(domNode, node.parent.domNode.firstChild);
      }

      if (node.type !== null) {
        ['id', 'className'].filter(function (key) {
          return node[key] != null;
        }).forEach(function (key) {
          domNode.setAttribute(key === 'className' ? 'class' : key, node[key]);
        });
        if (node.style) {
          var styleStr = Object.keys(node.style).reduce(function (a, b) {
            a.push(b + ':' + node.style[b]);
            return a;
          }, []).join(';');
          domNode.setAttribute('style', styleStr);
        }
      }
    });

    diffCollector.setAttributes.forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          node = _ref3[0],
          attrs = _ref3[1];

      var style = attrs.style,
          rest = _objectWithoutProperties(attrs, ['style']);

      Object.keys(rest).forEach(function (key) {
        node.domNode.setAttribute(key === 'className' ? 'class' : key, rest[key] || '');
      });
      if (style) {
        var styleStr = Object.keys(style).reduce(function (a, b) {
          a.push(b + ':' + style[b]);
          return a;
        }, []).join(';');
        node.domNode.setAttribute('style', styleStr);
      }
    });

    diffCollector.remove = [];
    diffCollector.add = [];
    diffCollector.setAttributes = [];
  },
  render: function render(element, container, callback) {
    var node = ReactReconciler.render(element, container);
    container.innerHTML = '';
    container.append(node.firstChild.domNode);
    if (callback) {
      callback();
    }
  }
};

function Nav(props) {
  return React.createElement(
    'div',
    { id: '11111' },
    props.name,
    React.createElement(
      'span',
      { className: 'coool' },
      'Q.Q'
    ),
    props.children
  );
}

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main() {
    _classCallCheck(this, Main);

    return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
  }

  _createClass(Main, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        'yes',
        React.createElement(
          'p',
          null,
          'meow!!!'
        )
      );
    }
  }]);

  return Main;
}(React.Component);

var T = function T(_ref4) {
  var color = _ref4.color;
  return React.createElement(
    Nav,
    { name: 'rabbit', ref: function ref(a) {
        return a;
      }, onChange: function onChange() {} },
    React.createElement(
      'div',
      { className: 'q.q', onClick: function onClick() {} },
      'Q.Q'
    ),
    React.createElement(
      'span',
      { style: { width: '100px', color: color, margin: '100px' } },
      'cool'
    ),
    React.createElement(Main, null)
  );
};

var b = React.createElement(
  Main,
  null,
  React.createElement(Nav, { updater: 'hi' }),
  React.createElement('footer', null)
);

var t = React.createElement(T, { color: 'green' });

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this2.state = { name: 'oooops', color: 'red' };
    setTimeout(function () {
      _this2.setState({ name: 'rabbit', color: 'pink' });
    }, 3000);
    return _this2;
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          name = _state.name,
          color = _state.color;

      return React.createElement(
        'div',
        null,
        name,
        React.createElement(T, { color: color }),
        t,
        ['hi', 'yes', React.createElement(
          'p',
          null,
          'ending'
        )]
      );
    }
  }]);

  return App;
}(React.Component);
// stable~~~~~
// <Main what="damn it" />
// stable toooooo
// <h1>hello!!! {name}</h1>
// <p>a paragraph</p>
// {null}
// {temp1}

ReactDOM.render(React.createElement(App, null), document.body);