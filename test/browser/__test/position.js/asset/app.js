/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 195);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * basic types
 */

let truth = () => true;

let isUndefined = v => v === undefined;

let isNull = v => v === null;

let isFalsy = v => !v;

let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

let isArray = v => Array.isArray(v);

let isString = v => typeof v === 'string';

let isObject = v => !!(v && typeof v === 'object');

let isFunction = v => typeof v === 'function';

let isNumber = v => typeof v === 'number' && !isNaN(v);

let isBool = v => typeof v === 'boolean';

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

let isRegExp = v => v instanceof RegExp;

let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

/**
 * check type
 *
 * types = [typeFun]
 */
let funType = (fun, types = []) => {
    if (!isFunction(fun)) {
        throw new TypeError(typeErrorText(fun, 'function'));
    }

    if (!likeArray(types)) {
        throw new TypeError(typeErrorText(types, 'array'));
    }

    for (let i = 0; i < types.length; i++) {
        let typeFun = types[i];
        if (typeFun) {
            if (!isFunction(typeFun)) {
                throw new TypeError(typeErrorText(typeFun, 'function'));
            }
        }
    }

    return function() {
        // check type
        for (let i = 0; i < types.length; i++) {
            let typeFun = types[i];
            let arg = arguments[i];
            if (typeFun && !typeFun(arg)) {
                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
            }
        }
        // result
        return fun.apply(this, arguments);
    };
};

let and = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (!typeFun(v)) {
                return false;
            }
        }
        return true;
    };
};

let or = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }

    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (typeFun(v)) {
                return true;
            }
        }
        return false;
    };
};

let not = (type) => {
    if (!isFunction(type)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => !type(v);
};

let any = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'list'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (!type(list[i])) {
            return false;
        }
    }
    return true;
};

let exist = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'array'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (type(list[i])) {
            return true;
        }
    }
    return false;
};

let mapType = (map) => {
    if (!isObject(map)) {
        throw new TypeError(typeErrorText(map, 'obj'));
    }

    for (let name in map) {
        let type = map[name];
        if (!isFunction(type)) {
            throw new TypeError(typeErrorText(type, 'function'));
        }
    }

    return (v) => {
        if (!isObject(v)) {
            return false;
        }

        for (let name in map) {
            let type = map[name];
            let attr = v[name];
            if (!type(attr)) {
                return false;
            }
        }

        return true;
    };
};

let listType = (type) => {
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    return (list) => any(list, type);
};

let typeErrorText = (v, expect) => {
    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
};

module.exports = {
    isArray,
    likeArray,
    isString,
    isObject,
    isFunction,
    isNumber,
    isBool,
    isNode,
    isPromise,
    isNull,
    isUndefined,
    isFalsy,
    isRegExp,
    isReadableStream,
    isWritableStream,

    funType,
    any,
    exist,

    and,
    or,
    not,
    mapType,
    listType,
    truth
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(104);

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'test1',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('test1').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(19);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse, overArgs
} = __webpack_require__(56);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact,
    reverse,
    overArgs
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(76);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(0);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        parent = parent[part];
        // avoid exception
        if (!isObject(parent)) return null;
    }

    parent[parts[parts.length - 1]] = value;
    return true;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    let v = fun && fun.apply(context, params);
    if (stopV && v === stopV) {
        return Promise.resolve(stopV);
    }
    return Promise.resolve(v).then(() => {
        return runSequence(list.slice(1), params, context, stopV);
    });
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// expression type
const EXPRESSION_TYPES = ['variable', 'data', 'abstraction', 'predicate'];

const [VARIABLE, JSON_DATA, ABSTRACTION, PREDICATE] = EXPRESSION_TYPES;

const DATA_TYPES = ['number', 'boolean', 'string', 'json', 'null'];

const [NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL] = DATA_TYPES;

const INLINE_TYPES = [NUMBER, BOOLEAN, STRING, NULL];

const DEFAULT_DATA_MAP = {
    [NUMBER]: 0,
    [BOOLEAN]: true,
    [STRING]: '',
    [JSON_TYPE]: {},
    [NULL]: null
};

module.exports = {
    EXPRESSION_TYPES,
    VARIABLE,
    JSON_DATA,
    ABSTRACTION,
    PREDICATE,

    DATA_TYPES,
    NUMBER,
    BOOLEAN,
    STRING,
    JSON_TYPE,
    NULL,
    INLINE_TYPES,

    DEFAULT_DATA_MAP
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(37);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(101);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(21);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(61);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(28);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(80);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    dsl, interpreter
} = __webpack_require__(16);

let {
    PREDICATE, VARIABLE, JSON_DATA, ABSTRACTION, APPLICATION,
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL, DEFAULT_DATA_MAP
} = __webpack_require__(4);

let {
    reduce, get, forEach, map
} = __webpack_require__(2);

let {
    isFunction, isObject
} = __webpack_require__(0);

let getLambdaUiValue = __webpack_require__(129);

let {
    v, r, method, getJson
} = dsl;

/**
 * get lambda from lambda-ui value
 *
 * lambda ui value = {
 *     path,
 *
 *     expression,    // for abstraction
 *
 *     currentVariables,    // for abstraction
 *
 *     params,    // predicate
 *
 *     value    // json data
 * }
 */

let getLambda = (value) => {
    let expressionType = getExpressionType(value.path);
    let predicatePath = getPredicatePath(value.path);

    switch (expressionType) {
        case VARIABLE:
            return v(getVariableName(value.path));
        case ABSTRACTION:
            if (value.expression === undefined) return new Error('expression is not defined in abstraction');
            if (value.expression instanceof Error) return value.expression;
            return r(...value.currentVariables, getLambda(value.expression));
        case PREDICATE:
            return method(predicatePath)(...map(value.params, getLambda));
        case JSON_DATA:
            return value.value;
        case APPLICATION:
            // TODO
    }
};

let runner = (predicates) => {
    let run = interpreter(predicates);

    return (v) => {
        let ret = getLambda(v);
        if (ret instanceof Error) {
            return ret;
        }
        try {
            return run(getJson(ret));
        } catch (err) {
            return err;
        }
    };
};

let getVariableName = (path) => {
    let parts = path.split('.');
    parts.shift();
    return parts.join('.');
};

let getExpressionType = (path = '') => {
    return path.split('.')[0];
};

let getPredicatePath = (path = '') => path.split('.').slice(1).join('.');

let expressionTypes = ({
    predicates,
    variables,
    funs
}) => {
    let types = {
        [JSON_DATA]: {
            [NUMBER]: 1,
            [BOOLEAN]: 1,
            [STRING]: 1,
            [JSON_TYPE]: 1,
            [NULL]: 1
        }, // declare json data
        [PREDICATE]: predicates, // declare function
        [ABSTRACTION]: 1, // declare function
        [APPLICATION]: 1
    };

    if (variables.length) {
        types.variable = reduce(variables, (prev, cur) => {
            prev[cur] = 1;
            return prev;
        }, {});
    }

    return reduce(funs, (prev, name) => {
        if (types[name]) {
            prev[name] = types[name];
        }
        return prev;
    }, {});
};

let infixTypes = ({
    predicates
}) => {
    return {
        [PREDICATE]: predicates
    };
};

let getPredicateMetaInfo = (predicatesMetaInfo, predicatePath) => {
    return get(predicatesMetaInfo, predicatePath) || {};
};

let getContext = ({
    predicates,
    predicatesMetaInfo,
    variables,
    funs,
    pathMapping,
    nameMap
}) => {
    return {
        predicates,
        predicatesMetaInfo,
        variables,
        funs,
        pathMapping,
        nameMap
    };
};

let getDataTypePath = (path = '') => path.split('.').slice(1).join('.');

let completeDataWithDefault = (data) => {
    data.value = data.value || {};
    data.value.currentVariables = data.value.variables || [];
    data.variables = data.variables || [];
    data.funs = data.funs || [JSON_DATA, PREDICATE, ABSTRACTION, VARIABLE];
    data.onchange = data.onchange || id;
    data.predicates = data.predicates || {};
    data.predicatesMetaInfo = data.predicatesMetaInfo || {};

    data.predicates.UI = {};
    // add UI predicates
    appendUIAsIds(data.predicates.UI, data.UI);

    completePredicatesMetaInfo(data.predicates, data.predicatesMetaInfo);

    // predicate meta info viewer
    transitionPredicateMetaViewer(data.predicates, data.predicatesMetaInfo);

    // make title
    let expresionType = getExpressionType(data.value.path);
    if (expresionType === PREDICATE) {
        let predicatePath = getPredicatePath(data.value.path);
        let {
            title
        } = getPredicateMetaInfo(data.predicatesMetaInfo, predicatePath) || {};
        if (title) {
            data.title = title;
        }
    }

    return data;
};

let transitionPredicateMetaViewer = (predicates, predicatesMetaInfo) => {
    forEach(predicates, (v, name) => {
        let meta = predicatesMetaInfo[name];
        if (isFunction(v)) {
            forEach(meta.args, (item) => {
                if (item && item.viewer) {
                    let viewer = item.viewer;
                    item.viewer = (_) => viewer(_, item);
                }
            });
        } else if (isObject(v)) {
            transitionPredicateMetaViewer(v, meta);
        }
    });
};

let appendUIAsIds = (predicates, UI = {}) => {
    forEach(UI, (v, name) => {
        if (isFunction(v)) {
            predicates[name] = id;
        } else if (isObject(v)) {
            predicates[name] = {};
            appendUIAsIds(v, predicates[name]);
        }
    });
};

let completePredicatesMetaInfo = (predicates, predicatesMetaInfo) => {
    forEach(predicates, (v, name) => {
        if (isFunction(v) && v.meta) {
            predicatesMetaInfo[name] = predicatesMetaInfo[name] || v.meta;
        }

        predicatesMetaInfo[name] = predicatesMetaInfo[name] || {};
        predicatesMetaInfo[name].args = predicatesMetaInfo[name].args || [];
        if (isFunction(v)) {
            forEach(new Array(v.length), (_, index) => {
                predicatesMetaInfo[name].args[index] = predicatesMetaInfo[name].args[index] || {};
            });
        } else if (v && isObject(v)) {
            completePredicatesMetaInfo(v, predicatesMetaInfo[name]);
        }
    });
};

let completeValueWithDefault = (value) => {
    let expresionType = getExpressionType(value.path);
    if (expresionType === JSON_DATA) {
        let type = getDataTypePath(value.path);
        value.value = value.value === undefined ? DEFAULT_DATA_MAP[type] : value.value;
    } else if (expresionType === PREDICATE) {
        value.params = value.params || [];
        value.infix = value.infix || 0;
    }
    return value;
};

let isUIPredicate = (path) => {
    return /^predicate\.UI\./.test(path);
};

let getUIPredicatePath = (path) => {
    let ret = path.match(/^predicate\.UI\.(.*)$/);
    return ret && ret[1];
};

let id = v => v;

module.exports = {
    completeDataWithDefault,
    getLambda,
    runner,
    getExpressionType,
    getPredicatePath,
    getVariableName,
    expressionTypes,
    infixTypes,
    getPredicateMetaInfo,
    getContext,
    getDataTypePath,
    completeValueWithDefault,

    getLambdaUiValue,

    isUIPredicate,
    getUIPredicatePath
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function HSL(color) {
    color.use(__webpack_require__(42));

    color.installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
        hsv: function () {
            // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
            var l = this._lightness * 2,
                s = this._saturation * ((l <= 1) ? l : 2 - l),
                saturation;

            // Avoid division by zero when l + s is very small (approaching black):
            if (l + s < 1e-9) {
                saturation = 0;
            } else {
                saturation = (2 * s) / (l + s);
            }

            return new color.HSV(this._hue, saturation, (l + s) / 2, this._alpha);
        },

        rgb: function () {
            return this.hsv().rgb();
        },

        fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
            return this.hsv().hsl();
        }
    });
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let getBoundRect = (node) => {
    if (node.nodeType === 3) {
        let range = document.createRange();
        range.selectNode(node);
        let clientRects = range.getClientRects();
        clientRects = Array.prototype.slice.call(clientRects);

        if (!clientRects.length) return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            right: 0,
            bottom: 0
        };

        let {
            lefts, rights, tops, bottoms, widths
        } = clientRects.reduce((prev, {
            left, right, bottom, top, width, height
        }) => {
            prev.lefts.push(left);
            prev.rights.push(right);
            prev.bottoms.push(bottom);
            prev.tops.push(top);
            prev.widths.push(width);
            prev.heights.push(height);

            return prev;
        }, {
            lefts: [],
            rights: [],
            tops: [],
            bottoms: [],
            widths: [],
            heights: []
        });

        let rect = {
            left: Math.min(...lefts),
            top: Math.min(...tops),
            width: Math.max(...widths),
            height: clientRects.reduce((prev, {
                height
            }) => prev + height, 0),
            right: Math.max(...rights),
            bottom: Math.max(...bottoms)
        };
        rect.leftOffset = clientRects[0].left - rect.left;
        range.detach();
        return rect;
    } else {
        return node.getBoundingClientRect();
    }
};

let getFontSize = (node) => {
    if (node.nodeType === 3) {
        return window.getComputedStyle(node.parentNode).getPropertyValue('font-size');
    } else if (node.nodeType === 1) {
        return window.getComputedStyle(node).getPropertyValue('font-size');
    }
};

let getColor = (node) => {
    if (node.nodeType === 3) {
        return window.getComputedStyle(node.parentNode).getPropertyValue('color');
    } else if (node.nodeType === 1) {
        return window.getComputedStyle(node).getPropertyValue('color');
    }
};

let ImageInnerNode = function(imageNode) {
    this.imageNode = imageNode;
    this.nodeType = 'imageInnerNode';
};

ImageInnerNode.prototype.getBoundingClientRect = function() {
    let rect = this.imageNode.getBoundingClientRect();
    let imageStyle = window.getComputedStyle(this.imageNode);
    let paddingLeft = pxToInt(imageStyle.getPropertyValue('padding-left'));
    let paddingRight = pxToInt(imageStyle.getPropertyValue('padding-right'));
    let paddingTop = pxToInt(imageStyle.getPropertyValue('padding-top'));
    let paddingBottom = pxToInt(imageStyle.getPropertyValue('padding-bottom'));

    let rec = {
        width: rect.width - paddingLeft - paddingRight,
        height: rect.height - paddingTop - paddingBottom,
        left: rect.left + paddingLeft,
        right: rect.right - paddingRight,
        top: rect.top + paddingTop,
        bottom: rect.bottom - paddingBottom
    };

    return rec;
};

ImageInnerNode.prototype.getImageUrl = function() {
    return this.imageNode.getAttribute('src');
};

let pxToInt = (px) => {
    return px.indexOf('px') !== -1 ? Number(px.substring(0, px.length - 2)) : Number(px);
};

module.exports = {
    getBoundRect,
    ImageInnerNode,
    pxToInt,
    getFontSize,
    getColor
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(1);

module.exports = (expView, expandor) => {
    return n('div class="expandor-wrapper"', [
        // expression
        n('div class="expression-wrapper"', [expView]),

        // expandor
        expandor
    ]);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(149);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = __webpack_require__(72);

let startMomenter = __webpack_require__(73);

let getX = (elem) => {
    var x = 0;
    while (elem) {
        x = x + elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return x;
};

let getY = (elem) => {
    var y = 0;
    while (elem) {
        y = y + elem.offsetTop;
        elem = elem.offsetParent;
    }
    return y;
};

let getClientX = (elem) => {
    return getX(elem) - window.scrollX;
};

let getClientY = (elem) => {
    return getY(elem) - window.scrollY;
};

let removeChilds = (node) => {
    while (node && node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

let once = (node, type, handler, useCapture) => {
    let fun = function(e) {
        let ret = handler.apply(this, [e]);
        node.removeEventListener(type, fun, useCapture);
        return ret;
    };

    node.addEventListener(type, fun, useCapture);
};

let getAttributeMap = (attributes = []) => {
    let map = {};
    for (let i = 0; i < attributes.length; i++) {
        let {
            name, value
        } = attributes[i];
        map[name] = value;
    }
    return map;
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

module.exports = {
    getX,
    getY,
    getClientX,
    getClientY,
    removeChilds,
    once,
    shadowFrame,
    getAttributeMap,
    startMomenter,
    getClasses
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(5);
let {
    isObject, isNode
} = __webpack_require__(0);

let parseArgs = __webpack_require__(106);

const KABANERY_NODE = 'kabanery_node';

// TODO general proxy n way

let cn = (elementType) => {
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        if (isKabaneryNode(attributes)) {
            childs = [attributes];
            attributes = {};
        }

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        return {
            tagName,
            attrMap,
            eventMap,
            elementType,
            type: KABANERY_NODE, childNodes: childs,
        };
    };
};

let isKabaneryNode = (v) => isObject(v) && v.type === KABANERY_NODE;

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

// TODO svg
let toHTML = (node) => {
    if (isNode(node)) {
        return node.outerHTML;
    } else if (isKabaneryNode(node)) {
        let {
            tagName, attrMap, childNodes
        } = node;
        let attrStr = map(attrMap, (value, key) => `${key}="${value}"`).join(' ');
        attrStr = attrStr ? ' ' + attrStr : '';
        return `<${tagName}${attrStr}>${map(childNodes, toHTML).join('')}</${tagName}>`;
    } else {
        return node + '';
    }
};

module.exports = {
    n: cn('html'),
    svgn: cn('svg'),
    bindPlugs,
    isKabaneryNode,
    toHTML,
    parseArgs
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement
} = __webpack_require__(108);

let {
    bindEvents
} = __webpack_require__(38);

let {
    map
} = __webpack_require__(5);

let {
    isKabaneryNode
} = __webpack_require__(14);

let reduceNode = (node) => {
    if (isKabaneryNode(node)) {
        let tarNode = null;
        if (node.elementType === 'html') {
            tarNode = createElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        } else {
            tarNode = createSvgElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        }

        bindEvents(tarNode, node.eventMap);
        return tarNode;
    } else {
        return node;
    }
};

module.exports = reduceNode;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * ח calculus
 *
 * e ::=    x       a variable
 *   |      חx.e    an abstracton (function)
 *   |      e₁e₂    a (function) application
 *
 *
 * using lambda to transfer data
 *  1. using apis to construct a lambda
 *  2. translate lambda to json
 *  3. sending json
 *  4. accept json and execute lambda
 *
 *
 *
 * language: (P, ח, J)
 *
 *  1. J meta data set. The format of meta data is json
 *  2. P: predicate set
 *
 * eg: חx.add(x, 1)
 *      meta data: 1
 *      variable: x
 *      predicate: add
 */

let dsl = __webpack_require__(40);
let interpreter = __webpack_require__(146);

module.exports = {
    dsl,
    interpreter
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(153)
    .use(__webpack_require__(43))
    .use(__webpack_require__(152))
    .use(__webpack_require__(42))
    .use(__webpack_require__(9))
    .use(__webpack_require__(151))

    // Convenience functions
    .use(__webpack_require__(160))
    .use(__webpack_require__(154))
    .use(__webpack_require__(155))
    .use(__webpack_require__(156))
    .use(__webpack_require__(157))
    .use(__webpack_require__(158))
    .use(__webpack_require__(159))
    .use(__webpack_require__(161))
    .use(__webpack_require__(162))
    .use(__webpack_require__(163))
    .use(__webpack_require__(164))
    .use(__webpack_require__(165));


/***/ }),
/* 18 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
} = __webpack_require__(0);

/**
 * @param opts
 *      preidcate: chose items to iterate
 *      limit: when to stop iteration
 *      transfer: transfer item
 *      output
 *      def: default result
 */
let iterate = funType((domain, opts = {}) => {
    domain = domain || [];
    if (isPromise(domain)) {
        return domain.then(list => {
            return iterate(list, opts);
        });
    }
    return iterateList(domain, opts);
}, [
    or(isPromise, isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateList = (domain, opts) => {
    opts = initOpts(opts, domain);

    let rets = opts.def;
    let count = 0; // iteration times

    if (isReadableStream(domain)) {
        let index = -1;

        return new Promise((resolve, reject) => {
            domain.on('data', (chunk) => {
                // TODO try cache error
                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
                rets = itemRet.rets;
                count = itemRet.count;
                if (itemRet.stop) {
                    resolve(rets);
                }
            });
            domain.on('end', () => {
                resolve(rets);
            });
            domain.on('error', (err) => {
                reject(err);
            });
        });
    } else if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let item = domain[i];
            let itemRet = iterateItem(item, domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let item = domain[name];
            let itemRet = iterateItem(item, domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
};

let initOpts = (opts, domain) => {
    let {
        predicate, transfer, output, limit
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);
    return opts;
};

let iterateItem = (item, domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = {
    iterate
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @param direction string
 *  direction = up | down | left | right
 */
module.exports = ({
    left = 0, right = 0, top = 0, bottom = 0, color = 'black', direction = 'up'
}) => {
    if (direction === 'up') {
        return {
            width: 0,
            height: 0,
            'border-left': `${left}px solid transparent`,
            'border-right': `${right}px solid transparent`,
            'border-bottom': `${bottom}px solid ${color}`
        };
    } else if (direction === 'down') {
        return {
            width: 0,
            height: 0,
            'border-left': `${left}px solid transparent`,
            'border-right': `${right}px solid transparent`,
            'border-top': `${top}px solid ${color}`
        };
    } else if (direction === 'left') {
        return {
            width: 0,
            height: 0,
            'border-top': `${top}px solid transparent`,
            'border-bottom': `${bottom}px solid transparent`,
            'border-right': `${right}px solid ${color}`
        };
    } else if (direction === 'right') {
        return {
            width: 0,
            height: 0,
            'border-top': `${top}px solid transparent`,
            'border-bottom': `${bottom}px solid transparent`,
            'border-left': `${left}px solid ${color}`
        };
    } else {
        throw new Error(`unexpeced direction ${direction}`);
    }
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(64);

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('a').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(63);

let {
    listenEventType,
    attachDocument
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node.__eventMap = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement, parseArgs, nodeGener
} = __webpack_require__(12);

let {
    bindEvents
} = __webpack_require__(23);

// TODO general proxy n way

let cn = (create) => {
    let nodeGen = nodeGener(create);
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        // TODO delay node gen operations
        let node = nodeGen(tagName, attrMap, childs);

        // tmp solution
        bindEvents(node, eventMap);

        return node;
    };
};

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

module.exports = {
    n: cn(createElement),
    svgn: cn(createSvgElement),
    bindPlugs
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let dynamicList = __webpack_require__(78);

let {
    map, mergeMap
} = __webpack_require__(2);

let {
    n
} = __webpack_require__(1);

let plus = __webpack_require__(79);

let line = __webpack_require__(27);

let Input = ({
    value = '', onchange, type = 'text', style, placeholder = ''
}) => {
    return n(`input type="${type}" placeholder="${placeholder}"`, {
        value,
        style,
        oninput: (e) => {
            onchange && onchange(e.target.value);
        }
    });
};

module.exports = ({
    value,
    defaultItem,
    title,
    itemOptions = {}, onchange = id, itemRender = Input
}) => {
    return dynamicList({
        // append or delete items happend
        onchange: () => onchange(value),

        value,

        defaultItem,

        render: ({
            appendItem, deleteItem, value
        }) => {
            return n('div', {
                style: {
                    display: 'inline-block'
                }
            }, [
                n('span', [
                    n('span', title), n('span', {
                        style: {
                            cursor: 'pointer',
                            paddingLeft: 15,
                            fontWeight: 'bold'
                        },
                        onclick: appendItem
                    }, n('div', {
                        style: {
                            display: 'inline-block'
                        }
                    }, plus({
                        width: 10,
                        height: 10,
                        bold: 3,
                        color: 'black'
                    })))
                ]),

                map(value, (item, index) => {
                    return n('fieldset', [
                        itemRender(mergeMap(
                            itemOptions, {
                                value: item,
                                onchange: (v) => {
                                    value[index] = v;
                                    onchange(value);
                                }
                            }
                        )),

                        n('span', {
                            style: {
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            },
                            onclick: () => deleteItem(item, index)
                        }, n('div', {
                            style: {
                                display: 'inline-block',
                                marginLeft: 5
                            }
                        }, [
                            line({
                                length: 10,
                                bold: 3,
                                color: 'black',
                                direction: 'horizontal'
                            })
                        ]))
                    ]);
                })
            ]);
        }
    });
};

const id = v => v;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(29);

module.exports = ({
    color = 'black', bold = 3, length = 20, direction = 'vertical'
} = {}) => {
    return direction === 'vertical' ?
        n('div', {
            style: {
                width: bold,
                height: length,
                backgroundColor: color
            }
        }) : n('div', {
            style: {
                height: bold,
                width: length,
                backgroundColor: color
            }
        });
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(83);

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('a').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(82);

let {
    listenEventType,
    attachDocument
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node.__eventMap = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement, parseArgs, nodeGener
} = __webpack_require__(12);

let {
    bindEvents
} = __webpack_require__(30);

// TODO general proxy n way

let cn = (create) => {
    let nodeGen = nodeGener(create);
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        // TODO delay node gen operations
        let node = nodeGen(tagName, attrMap, childs);

        // tmp solution
        bindEvents(node, eventMap);

        return node;
    };
};

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

module.exports = {
    n: cn(createElement),
    svgn: cn(createSvgElement),
    bindPlugs
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

/**
 * data = {
 *    hide,
 *    head,
 *    body
 * }
 */
module.exports = view((data, {
    update
}) => {
    if (data.hide === undefined) data.hide = true;

    let hide = () => update('hide', true);
    let show = () => update('hide', false);
    let toggle = () => update('hide', !data.hide);
    let isHide = () => data.hide;

    let ops = {
        hide, show, toggle, isHide
    };

    return n('div', [
        data.head(ops), !isHide() && data.body(ops)
    ]);
});


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(92);

let {
    n, view
} = __webpack_require__(1);

/**
 * @readme-quick-run
 *
 * ## test tar=js r_c=Select env=browser
 *
 * let {mount} = require('kabanery');
 *
 * let view = Select({
 *   options: [['a', 'option a'], ['b', 'option b']],
 *   selected: 'a',
 *   onchange: (selectItem) => {
 *   }
 * });
 *
 * mount(view, document.body);
 *
 * console.log(document.body.innerHTML);
 */

/**
 * {
 *
 *      options: [[name, description]],
 *
 *      selected
 * }
 */

module.exports = view((data) => {
    data.selected = data.selected || data.options[0][0];

    let onchange = data.onchange;

    return n('select', {
        onchange: (e) => {
            data.selected = e.target.value;
            onchange && onchange(data.selected);
        }
    }, map(data.options, ([name, description]) => {
        let selectStr = '';
        if (data.selected === name) {
            selectStr = 'selected="selected"';
        }

        if (description === undefined) {
            description = name;
        }

        return n(`option value=${name} ${selectStr}`, description);
    }));
});


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n, mount
} = __webpack_require__(1);

let {
    map, compact, mergeMap
} = __webpack_require__(2);

let {
    isObject
} = __webpack_require__(0);

let {
    getWindowWidth, getWindowHeight
} = __webpack_require__(95);

let {
    hasOwnProperty
} = __webpack_require__(98);

let idgener = __webpack_require__(74);

let triangle = __webpack_require__(94);

/**
 * @param data Object
 *  data is a normal js object without circle
 */

let renderMap = view(({
    data,
    hidden,
    onselected,
    targetPosition,
    maxShowItemNum = 10, selectedPath = '', parentPath = '', nameMap = {}
}, {
    update
}) => {
    let selectedName = selectedPath.split('.')[0];
    let restPath = selectedPath.substring(selectedName.length + 1);
    let itemWidth = 164,
        itemHeight = 16;
    if (hidden) return null;

    let expandedItem = (item, name) => {
        let left = 0,
            top = 0,
            windowWidth = getWindowWidth(),
            windowHeight = getWindowHeight();

        if (targetPosition) {
            left = targetPosition.left - left + itemWidth;
            top = targetPosition.top + top;
            if (targetPosition.right + itemWidth > windowWidth) {
                // show in left
                left = left - 2 * itemWidth;

                if (targetPosition.left - itemWidth < 0) {
                    left = targetPosition.left + 10;
                }
            }
            let h = itemHeight * Object.keys(item).length;
            if (targetPosition.bottom + h > windowHeight) {
                // show in top
                top = Math.max(top - h, 10);
            }
        }

        return n('div', {
            style: {
                position: targetPosition ? 'fixed' : 'relative',
                left,
                top,
                zIndex: 1000
            }
        }, renderMap({
            data: item,
            selectedPath: restPath,
            onselected,
            parentPath: getPath(name, parentPath),
            nameMap
        }));
    };

    return n('ul', {
        style: {
            width: itemWidth,
            maxHeight: maxShowItemNum * itemHeight,
            overflow: 'scroll',
            'display': 'inline-block',
            'margin': 0,
            'padding': '3 0',
            border: '1px solid rgba(80, 80, 80, 0.3)',
            borderRadius: 4,
            boxShadow: '0px 0px 2px #888888',
            backgroundColor: 'rgba(244, 244, 244, 0.95)'
        }
    }, map(data, (item, name) => {
        return n('li', {
            style: {
                position: 'relative',
                listStyle: 'none',
                cursor: 'pointer',
                minWidth: 100,
                padding: '5 10',
                backgroundColor: name === selectedName ? '#3879d9' : 'none',
                color: name === selectedName ? 'white' : 'black'
            },

            'class': SELECT_ITEM_HOVER_CLASS,

            onclick: () => {
                update('hidden', true);
            }
        }, [
            n('div', {
                style: {
                    height: 16,
                    lineHeight: 16
                }
            }, [
                n('div', {
                    style: {
                        'float': 'left',
                        position: 'relative',
                        width: '95%',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }
                }, [
                    n('span', hasOwnProperty(nameMap, getPath(name, parentPath)) ? nameMap[getPath(name, parentPath)] : name)
                ]),

                isObject(item) && [
                    n('div', {
                        style: {
                            'float': 'right',
                            position: 'relative',
                            width: '5%',
                            height: itemHeight
                        }
                    }, [
                        n('div', {
                            style: mergeMap({
                                position: 'relative',
                                top: (itemHeight - 10) / 2
                            }, triangle({
                                direction: 'right',
                                top: 5,
                                bottom: 5,
                                left: 10
                            }))
                        }),
                        name === selectedName && expandedItem(item, name),
                    ])
                ],
                n('div', {
                    style: {
                        clear: 'both'
                    }
                })
            ]),

            n('div', {
                style: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0
                },

                onclick: (e) => {
                    if (isObject(item)) {
                        e.stopPropagation();
                        // expand it
                        update([
                            ['selectedPath', name === selectedName ? '' : name],
                            ['targetPosition', e.target.getBoundingClientRect()]
                        ]);
                    } else {
                        onselected && onselected(item, getPath(name, parentPath));
                        update('hidden', true);
                    }
                }
            })
        ]);
    }));
});

let getPath = (name, parentPath) => {
    return compact([parentPath, name]).join('.');
};

const SELECT_ITEM_HOVER_CLASS = 'select-item-' + idgener().replace(/\./g, '-');

module.exports = (data) => {
    mount(n('style', {
        type: 'text/css'
    }, `.${SELECT_ITEM_HOVER_CLASS}:hover{background-color: #118bfb}`), document.getElementsByTagName('head')[0]);

    return renderMap(data);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(103);

let {
    listenEventType,
    attachDocument
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node.__eventMap = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * dsl used to contruct lambda json
 *
 * ח based on predicates and json expansion
 *
 * e ::= json                    as meta data, also a pre-defined π expression
 *   |   x                       variable
 *   |   predicate               predicate is a pre-defined abstraction
 *   |   חx.e                    abstraction
 *   |   e1e2                    application
 *
 * ## translate lambda to json
 *
 * 1. meta data
 *
 *  j ←→ ['d', j]
 *
 * 2. predicate
 *
 *  f(x, y, z) ←→ ['p', 'f', [t(x), t(y), t(z)]]
 *
 * 3. variable
 *
 *  x ←→ ['v', 'x']
 *
 * 4. abstraction
 *
 *  חx₁x₂...x.e ←→ ['l', ['x₁', 'x₂', ...], t(e)]
 *
 * 5. an application
 *
 *  e₁e₂e₃... ←→ ['a', [t(e₁), t(e₂), ...]]
 *
 * ## usage
 *
 * 1. import predicate set
 *
 * let add = c.require('add');
 * let sub = c.require('sub');
 *
 * 2. construct lambda
 *
 *  - meta
 *
 *    just itself
 *
 *    e = j
 *
 *  - varibale
 *
 *    e = c.v('x')
 *
 *  - predicate
 *
 *    e = add(1, c.v('x'))
 *
 *  - abstraction
 *
 *    e = c.r(['x'], add(1, c.v('x'))
 *
 *  - an application
 *
 *    e = e₁(e₂)
 *
 *  expression = () => expression
 *  expression.json
 */

let {
    map, contain
} = __webpack_require__(2);

let {
    isFunction, likeArray, funType
} = __webpack_require__(0);

let unique = {};

const EXPRESSION_PREFIXES = ['a', 'p', 'f', 'v', 'd', 'l'];
const [
    APPLICATION_PREFIX,
    PREDICATE_PREFIX,
    PREDICATE_VARIABLE_PREFIX,
    VARIABLE_PREFIX,
    META_DATA_PREFIX,
    ABSTRACTION_PREFIX
] = EXPRESSION_PREFIXES;

/**
 * get expression
 */
let exp = (json) => {
    // application
    let e = (...args) => {
        return exp([APPLICATION_PREFIX, getJson(e), map(args, getJson)]);
    };
    e.unique = unique;
    e.json = json;
    return e;
};

/**
 * import predicate
 */
let requirePredicate = (...args) => {
    if (args.length > 1) {
        return map(args, genPredicate);
    } else {
        return genPredicate(args[0]);
    }
};

let genPredicate = (name = '') => {
    let predicate = (...args) => {
        /**
         * predicate
         */
        return exp([PREDICATE_PREFIX, name.trim(), map(args, getJson)]);
    };
    predicate.unique = unique;
    predicate.json = [PREDICATE_VARIABLE_PREFIX, name];

    return predicate;

};

/**
 * define variable
 *
 * TODO type
 */
let v = (name) => exp([VARIABLE_PREFIX, name]);

/**
 * e → חx₁x₂...x . e
 */
let r = (...args) => exp([ABSTRACTION_PREFIX, args.slice(0, args.length - 1), getJson(args[args.length - 1])]);

let isExp = v => isFunction(v) && v.unique === unique;

let getJson = (e) => isExp(e) ? e.json : [META_DATA_PREFIX, e];

let getExpressionType = funType((json) => {
    let type = json[0];
    if (!contain(EXPRESSION_PREFIXES, type)) {
        throw new Error(`unexpected expression type ${json[0]}. The context json is ${JSON.stringify(json, null, 4)}`);
    }
    return type;
}, [likeArray]);

let destruct = (json) => {
    let type = getExpressionType(json);

    switch (type) {
        case META_DATA_PREFIX:
            return {
                type,
                metaData: json[1]
            };
        case VARIABLE_PREFIX:
            return {
                type,
                variableName: json[1]
            };
        case ABSTRACTION_PREFIX:
            return {
                abstractionArgs: json[1],
                abstractionBody: json[2],
                type,
            };
        case PREDICATE_PREFIX:
            return {
                predicateName: json[1],
                predicateParams: json[2],
                type,
            };
        case APPLICATION_PREFIX:
            return {
                applicationFun: json[1],
                applicationParams: json[2],
                type
            };
        case PREDICATE_VARIABLE_PREFIX:
            return {
                type,
                predicateName: json[1]
            };
    }
};

module.exports = {
    require: requirePredicate,
    method: requirePredicate,
    r,
    v,
    getJson,

    getExpressionType,

    APPLICATION_PREFIX,
    PREDICATE_PREFIX,
    PREDICATE_VARIABLE_PREFIX,
    VARIABLE_PREFIX,
    META_DATA_PREFIX,
    ABSTRACTION_PREFIX,

    EXPRESSION_PREFIXES,

    destruct
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = function HSV(color) {
    color.installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
        rgb: function () {
            var hue = this._hue,
                saturation = this._saturation,
                value = this._value,
                i = Math.min(5, Math.floor(hue * 6)),
                f = hue * 6 - i,
                p = value * (1 - saturation),
                q = value * (1 - f * saturation),
                t = value * (1 - (1 - f) * saturation),
                red,
                green,
                blue;
            switch (i) {
            case 0:
                red = value;
                green = t;
                blue = p;
                break;
            case 1:
                red = q;
                green = value;
                blue = p;
                break;
            case 2:
                red = p;
                green = value;
                blue = t;
                break;
            case 3:
                red = p;
                green = q;
                blue = value;
                break;
            case 4:
                red = t;
                green = p;
                blue = value;
                break;
            case 5:
                red = value;
                green = p;
                blue = q;
                break;
            }
            return new color.RGB(red, green, blue, this._alpha);
        },

        hsl: function () {
            var l = (2 - this._saturation) * this._value,
                sv = this._saturation * this._value,
                svDivisor = l <= 1 ? l : (2 - l),
                saturation;

            // Avoid division by zero when lightness approaches zero:
            if (svDivisor < 1e-9) {
                saturation = 0;
            } else {
                saturation = sv / svDivisor;
            }
            return new color.HSL(this._hue, saturation, l / 2, this._alpha);
        },

        fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
            var red = this._red,
                green = this._green,
                blue = this._blue,
                max = Math.max(red, green, blue),
                min = Math.min(red, green, blue),
                delta = max - min,
                hue,
                saturation = (max === 0) ? 0 : (delta / max),
                value = max;
            if (delta === 0) {
                hue = 0;
            } else {
                switch (max) {
                case red:
                    hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta / 6 + 1 / 3;
                    break;
                case blue:
                    hue = (red - green) / delta / 6 + 2 / 3;
                    break;
                }
            }
            return new color.HSV(hue, saturation, value, this._alpha);
        }
    });
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = function XYZ(color) {
    color.installColorSpace('XYZ', ['x', 'y', 'z', 'alpha'], {
        fromRgb: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=02#text2
            var convert = function (channel) {
                    return channel > 0.04045 ?
                        Math.pow((channel + 0.055) / 1.055, 2.4) :
                        channel / 12.92;
                },
                r = convert(this._red),
                g = convert(this._green),
                b = convert(this._blue);

            // Reference white point sRGB D65:
            // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
            return new color.XYZ(
                r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
                r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
                r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
                this._alpha
            );
        },

        rgb: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
            var x = this._x,
                y = this._y,
                z = this._z,
                convert = function (channel) {
                    return channel > 0.0031308 ?
                        1.055 * Math.pow(channel, 1 / 2.4) - 0.055 :
                        12.92 * channel;
                };

            // Reference white point sRGB D65:
            // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
            return new color.RGB(
                convert(x *  3.2404542 + y * -1.5371385 + z * -0.4985314),
                convert(x * -0.9692660 + y *  1.8760108 + z *  0.0415560),
                convert(x *  0.0556434 + y * -0.2040259 + z *  1.0572252),
                this._alpha
            );
        },

        lab: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=07#text7
            var convert = function (channel) {
                    return channel > 0.008856 ?
                        Math.pow(channel, 1 / 3) :
                        7.787037 * channel + 4 / 29;
                },
                x = convert(this._x /  95.047),
                y = convert(this._y / 100.000),
                z = convert(this._z / 108.883);

            return new color.LAB(
                (116 * y) - 16,
                500 * (x - y),
                200 * (y - z),
                this._alpha
            );
        }
    });
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let insideBox = __webpack_require__(179);

let matchContent = __webpack_require__(180);

let matchStyle = __webpack_require__(181);

let {
    any, map
} = __webpack_require__(2);

let {
    getBoundRect
} = __webpack_require__(10);

let match = (node, {
    position,
    content,
    style
}, {
    gridScope
} = {}) => {
    let {
        bottom, height, left, right, top, width, leftOffset
    } = getBoundRect(node);
    let rect = {
        bottom, height, left, right, top, width, leftOffset
    };

    return insideBox(rect, position, gridScope) && any(content, (item) => {
        return matchContent.match(matchContent.getContent(node, item), item);
    }) && any(style, (item) => {
        return matchStyle.match(matchStyle.getContent(node, item), item);
    });
};

let collectMatchInfos = (node, {
    position,
    content = [], style = []
}, {
    gridScope
} = {}) => {
    let {
        bottom, height, left, right, top, width, leftOffset
    } = getBoundRect(node);
    let rect = {
        bottom, height, left, right, top, width, leftOffset
    };

    return {
        position: [
            insideBox(rect, position, gridScope),
            rect,
            gridScope
        ],

        content: map(content, (item) => {
            let cnt = matchContent.getContent(node, item);
            return [
                matchContent.match(cnt, item),
                cnt
            ];
        }),

        style: map(style, (item) => {
            let cnt = matchStyle.getContent(node, item);
            return [
                matchStyle.match(cnt, item),
                cnt
            ];
        })
    };
};

module.exports = {
    insideBox,
    matchContent,
    matchStyle,
    match,
    collectMatchInfos
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNumber
} = __webpack_require__(0);

let around = (percent) => (pattern, content) => {
    if (!isNumber(pattern) || !isNumber(content)) {
        return false;
    }

    if (pattern === 0) {
        if (content === 0) return true;
        return false;
    }

    let distance = Math.abs(pattern - content);
    let pre = distance / Math.abs(pattern);

    return pre <= percent;
};

let buildAroundPatterns = (step) => {
    let count = Math.floor(100 / step);
    let map = {};
    for (let i = 1; i < count; i++) {
        let name = `around_${i * step}Percent`;
        map[name] = around(i * step / 100);
    }

    return map;
};

module.exports = buildAroundPatterns(10);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    YUVSimilarity
} = __webpack_require__(57);

let color = __webpack_require__(17);

let matchSimilarity = (similarity) => (pattern, content) => {
    let patternColor = color(pattern);
    let contentColor = color(content);

    let alphaOffset = patternColor.alpha() - contentColor.alpha();
    let alphaSimilarity = 1 - (Math.sqrt(alphaOffset * alphaOffset) / 1);

    let realSimilarity = alphaSimilarity * YUVSimilarity([
        patternColor.red() * 255,
        patternColor.green() * 255,
        patternColor.blue() * 255
    ], [
        contentColor.red() * 255,
        contentColor.green() * 255,
        contentColor.blue() * 255
    ]);

    return realSimilarity >= similarity;
};

let buildSimilarityPatterns = (step) => {
    let count = Math.floor(100 / step);
    let map = {};
    for (let i = 1; i < count; i++) {
        let name = `color_similarity_ge_${i * step}`;
        map[name] = matchSimilarity(i * step / 100);
    }

    return map;
};

module.exports = buildSimilarityPatterns(10);


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let urlPattern = __webpack_require__(48);

let colorSimilarityPattern = __webpack_require__(46);

let aroundPercentPattern = __webpack_require__(45);

let mathPattern = __webpack_require__(188);

let {
    mergeMap, reduce
} = __webpack_require__(2);

let equal = (v1, v2) => v1 === v2;

let contain = (pattern, content) => {
    if (pattern === '' && content === '') return true;
    if (!content) return false;
    return content.indexOf(pattern) !== -1;
};

let regExp = (pattern, content) => {
    let reg = new RegExp(pattern);
    return reg.test(content);
};

let trimEqual = (pattern = '', content = '') => {
    if (pattern === null && content !== null) return false;
    if (pattern !== null && content === null) return false;
    return pattern.trim() === content.trim();
};

module.exports = reduce([
    colorSimilarityPattern,
    urlPattern,
    aroundPercentPattern,
    mathPattern,

    {
        equal,
        contain,
        regExp,
        trimEqual
    }
], (prev, cur) => mergeMap(prev, cur), {});


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let url = __webpack_require__(171);

let {
    reduce, mergeMap
} = __webpack_require__(2);

let patternProp = (match) => (prop) => (pattern, content) => {
    if (pattern === '' && content === '') return true;
    if (!content) return false;
    return match(url.parse(content)[prop], pattern);
};

let equalProp = patternProp((propV, pattern) => {
    return propV === pattern;
});

let regProp = patternProp((propV, pattern) => {
    let reg = new RegExp(pattern);
    return reg.test(propV);
});

let containProp = patternProp((propV, pattern) => {
    return propV.indexOf(pattern) !== -1;
});

let getPropPatterns = (prop) => {
    let map = {};

    map[`url_${prop}_equal`] = equalProp(prop);
    map[`url_${prop}_regExp`] = regProp(prop);
    map[`url_${prop}_contain`] = containProp(prop);

    return map;
};

module.exports = reduce(['protocol', 'hostname', 'query', 'pathname', 'path', 'href', 'hash'], (prev, cur) => {
    return mergeMap(prev, getPropPatterns(cur));
}, {});


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let searchIn = __webpack_require__(50);

/**
 * search target nodes accroding to the description of UI
 *
 * @param nodes array
 *   all nodes used to filter
 */
module.exports = (nodes, {
    position,
    content,
    style
}, options) => {
    let doSearch = searchIn(nodes);

    return doSearch({
        position,
        content,
        style
    }, options);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    filter
} = __webpack_require__(2);

let {
    match
} = __webpack_require__(44);

let expandNodes = __webpack_require__(190);

/**
 * search target nodes accroding to the description of UI
 *
 * @param nodes array
 *   all nodes used to filter
 */
module.exports = (nodes) => {
    // expand nodes first
    nodes = expandNodes(nodes);

    return (rule, options) => {
        let rets = filter(nodes, (node) => match(node, rule, options));

        return rets;
    };
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

module.exports = view(({
    left, top, width, height
}) => {
    return n('div', {
        style: {
            position: 'fixed',
            left,
            top,
            width,
            height,
            backgroundColor: 'rgba(200, 100, 100, 0.6)',
            zIndex: 100000
        }
    });
});


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

module.exports = view(({
    position = [], gridScope
}) => {
    let [grid, area] = position;
    grid = grid || [0, 0];
    let [horizontalGrid, verticalGrid] = grid;

    let unitWidth = gridScope.width / horizontalGrid,
        unitHeight = gridScope.height / verticalGrid;

    let grids = [];

    for (let i = 0; i < horizontalGrid; i++) {
        for (let j = 0; j < verticalGrid; j++) {
            let backgroundColor = isItemChosen(i, j, area[0], area[1]) ? 'rgba(100,200,100,0.5)' : 'rgba(200, 200, 200, 0.1)';

            grids.push(n('div', {
                style: {
                    width: unitWidth,
                    height: unitHeight,
                    borderLeft: i > 0 ? 0 : '1px solid rgba(100, 100, 100, 0.3)',
                    borderRight: '1px solid rgba(100, 100, 100, 0.3)',
                    borderTop: j > 0 ? 0 : '1px solid rgba(100, 100, 100, 0.3)',
                    borderBottom: '1px solid rgba(100, 100, 100, 0.3)',
                    position: 'absolute',
                    left: unitWidth * i,
                    top: unitHeight * j,
                    boxSizing: 'border-box',
                    backgroundColor
                }
            }));
        }
    }

    return n('div', {
        style: {
            position: 'fixed',
            boxSizing: 'border-box',
            left: gridScope.x,
            top: gridScope.y,
            width: gridScope.width,
            height: gridScope.height
        }
    }, [grids]);
});

let isItemChosen = (i, j, lt, rb) => {
    if (!lt || !rb) return false;
    let [x1, y1] = lt, [x2, y2] = rb;
    return (x1 <= i && i <= x2) && (y1 <= j && j <= y2);
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// hack console.log used to pipe log from web client

/**
 * 1. loading testing code
 *
 * 2. run testing code
 *
 * 3. get the result of testing code and send it back to server
 */

// TODO log stream

let passData = null;

let oldLog = console.log; // eslint-disable-line

const reportPath = '/__api/__reportData';
const logPath = '/__api/__log';

console.log = function(...args) { // eslint-disable-line
    fetch(logPath, {
        method: 'POST',
        body: JSON.stringify(args)
    });

    // send log to server
    return oldLog.apply(this, args);
};

try {
    // TODO exception when require?
    let retp = __webpack_require__(194);

    passData = Promise.resolve(retp).then((ret) => {
        try {
            return JSON.stringify({
                result: ret,
                type: 'normal'
            });
        } catch (err) {
            return JSON.stringify({
                errorMsg: `The result of js code can not be json stringified. Result is ${ret}.`,
                type: 'error'
            });
        }
    }).catch((err) => {
        return JSON.stringify({
            errorMsg: err.toString(),
            stack: err.stack,
            type: 'error'
        });
    });
} catch (err) {
    passData = JSON.stringify({
        errorMsg: err.toString(),
        stack: err.stack,
        type: 'error'
    });
}

/**
 * TODO ACK
 */
Promise.resolve(passData).then((passData) => {
    return fetch(reportPath, {
        method: 'POST',
        body: passData
    }).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json); // eslint-disable-line
        // TODO option to keep window
        if (!json.keep) {
            window.close();
        }
    });
});


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(178);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(175);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    iterate
} = __webpack_require__(19);

let {
    isFunction
} = __webpack_require__(0);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = isFunction(item) ? item : (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let reverse = (list) => reduce(list, (prev, cur) => {
    prev.unshift(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

let overArgs = (func, transform) => {
    return (...args) => {
        let newArgs = transform(...args);
        return func(...newArgs);
    };
};

module.exports = {
    overArgs,
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact,
    reverse
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculate the similarity of colors.
 *
 * There are many color space definitions.
 *
 * The color input format: [r, g, b]
 */

let euclideanDistanceSquare = (list1, list2) => {
    let sum = 0;
    for (let i = 0; i < list1.length; i++) {
        let offset = list1[i] - list2[i];
        sum += offset * offset;
    }

    return sum;
};

/**
 *
 * ## test
 * [
 *      [[[0,0,0]], [0,0,0]]
 * ]
 */
let toYUV = ([r, g, b]) => {
    return [
        0.299 * r + 0.587 * g + 0.114 * b,

        (-0.14713) * r + (-0.28886) * g + 0.436 * b,

        0.615 * r + (-0.51499) * g + (-0.10001) * b
    ];
};

const RGB_MAX_DISTANCE_SQUARE = euclideanDistanceSquare([255, 255, 255], [0, 0, 0]); // white to black

const YUV_MAX_DISTANCE_SQUARE = euclideanDistanceSquare(toYUV([255, 255, 255]), toYUV([0, 0, 0]));

/**
 * RGB distance in the euclidean space is not very "similar to avarage human perception"
 * http://stackoverflow.com/questions/5392061/algorithm-to-check-similarity-of-colors
 *
 * ## test
 * [
 *      [[[255,255,255],[0,0,0]], 0],
 *      [[[10, 20, 30], [47, 60, 20]], 0.8745710933982787],
 *      [[[10, 20, 30], [147, 160, 20]], 0.5559267216899502],
 *      [[[10, 20, 30], [255, 255, 255]], 0.07787528945273836],
 *      [[[100, 200, 130], [0, 0, 0]], 0.4143849206639969],
 *      [[[13, 25, 58], [13, 25, 58]], 1]
 * ]
 */
let rgbSimilarity = (rgb1, rgb2) => {
    return 1 - Math.sqrt(euclideanDistanceSquare(rgb1, rgb2) / RGB_MAX_DISTANCE_SQUARE);
};

/**
 * YUV color space: https://en.wikipedia.org/wiki/YUV
 *
 * luma (Y') + two chrominance (UV) components
 *
 * ## test
 * [
 *      [[[255,255,255],[0,0,0]], 0],
 *      [[[10,10,10],[10,10,10]], 1],
 *      [[[30, 40, 69], [10,10,10]], 0.8641405520635254],
 *      [[[130, 140, 69], [10,10,10]], 0.5195287815428749]
 * ]
 */
let YUVSimilarity = (rgb1, rgb2) => {
    return 1 - Math.sqrt(YUVDistance(rgb1, rgb2) / YUV_MAX_DISTANCE_SQUARE);
};

/**
 * ## test
 * [
 *      [[[0,0,0], [0,0,0]], 0],
 *      [[[255,255,255], [0,0,0]], 65025.0000065025],
 *      [[[255,255,255], [0,255,0]], 33762.903244425]
 * ]
 */
let YUVDistance = (rgb1, rgb2) => {
    return euclideanDistanceSquare(toYUV(rgb1), toYUV(rgb2));
};

// TODO CIE L*a*b color space

module.exports = {
    rgbSimilarity,
    YUVSimilarity
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let line = __webpack_require__(60);
let {
    n
} = __webpack_require__(22);

module.exports = ({
    length = 10, bold = 1, color = 'black', angle = 0, direction
} = {}) => {
    if (direction === 'left') {
        angle = 45;
    } else if (direction === 'top') {
        angle = 135;
    } else if (direction === 'right') {
        angle = 225;
    } else if (direction === 'bottom') {
        angle = 315;
    }
    return n('div', {
        style: {
            display: 'inline-block',
            transform: `rotate(${angle}deg)`
        }
    }, [
        line({
            color,
            bold,
            length
        }),

        n('div', {
            style: {
                marginLeft: length / 2 - bold / 2,
                marginTop: -1 * length / 2 - bold / 2
            }
        }, [
            line({
                color,
                bold,
                length,
                angle: 90
            })
        ])
    ]);
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(22);

module.exports = ({
    color = 'black', bold = 3, length = 20, direction = 'vertical', angle = 0
} = {}) => {
    return direction === 'vertical' ?
        n('div', {
            style: {
                width: bold,
                height: length,
                backgroundColor: color,
                transform: `rotate(${angle}deg)`
            }
        }) : n('div', {
            style: {
                height: bold,
                width: length,
                backgroundColor: color,
                transform: `rotate(${angle}deg)`
            }
        });
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(21);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(24);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(6);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(6);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    doc.addEventListener(type, listener(type));
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            doc.addEventListener(type, listener(type));
        }
    };

    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e.__stopPropagation = true;
            return oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target.__eventMap;
        return eventMap && eventMap[type];
    };

    return {
        listenEventType,
        attachDocument
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `__event_type_id_${type}`;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, svgn, bindPlugs
} = __webpack_require__(24);

let {
    parseArgs
} = __webpack_require__(12);

let plugs = __webpack_require__(67);

let view = __webpack_require__(71);

let mount = __webpack_require__(65);

let N = __webpack_require__(62);

module.exports = {
    n,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,

    parseArgs
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(23);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(6);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);
    forEach(kabaneryRoots, (item) => {
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(68);
let eventError = __webpack_require__(66);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(3);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(13);

let {
    hasOwnProperty
} = __webpack_require__(3);

let {
    forEach
} = __webpack_require__(6);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(3);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(6);

let applyAttibutes = __webpack_require__(69);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode.__eventMap) {
        node.__eventMap = newNode.__eventMap;
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(3);

let {
    isObject, isFunction, likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(6);

let replace = __webpack_require__(70);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view, afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view, afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view, afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        if (!args.length) return replaceView();
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
            return replaceView();
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
            return replaceView();
        }
    };

    let append = (item, viewFun) => {
        if (node) {
            node.appendChild(viewFun(item));
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        append,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = () => {
    let div = document.createElement('div');
    let sr = div.createShadowRoot();
    sr.innerHTML = '<div id="shadow-page"></div>';

    let frame = null;

    let create = () => {
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(div);

        return sr.getElementById('shadow-page');
    };

    let start = () => {
        if (frame) {
            return frame;
        }
        frame = new Promise(resolve => {
            if (document.body) {
                resolve(create());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(create());
                });
            }
        });
        return frame;
    };

    let close = () => {
        frame.then(() => {
            let parent = div.parentNode;
            parent && parent.removeChild(div);
        });
    };

    return {
        start,
        close,
        sr,
        rootDiv: div
    };
};

module.exports = shadowFrame;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isDomReady = (doc) => doc.readyState === 'complete' ||
    (!doc.attachEvent && doc.readyState === 'interactive');

let startMomenter = (doc = document) => {
    let loadedFlag = false;

    let resolves = [];

    let docReady = () => {
        let ready = () => {
            if (loadedFlag) return;
            loadedFlag = true;
            for (let i = 0; i < resolves.length; i++) {
                resolves[i]();
            }
            resolves = [];
        };
        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', ready);
            doc.addEventListener('DOMContentLoaded', ready);
        } else {
            doc.attachEvent('onreadystatechange', () => {
                if (document.readyState === 'complete') {
                    ready();
                }
            });
        }
    };

    docReady();

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime = 0, startTimeout = 10000
    } = {}) => new Promise((resolve, reject) => {
        if (loadedFlag || isDomReady(doc)) { // already ready
            setTimeout(resolve, generalWaitTime);
        } else { // wait for ready
            resolves.push(resolve);
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(75);


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let count = 0;

module.exports = ({
    timeVisual = false
} = {}) => {
    count++;
    if (count > 10e6) {
        count = 0;
    }
    let rand = Math.random(Math.random()) + '';

    let time = timeVisual ? getTimeStr() : new Date().getTime();

    return `${time}-${count}-${rand}`;
};

let getTimeStr = () => {
    let date = new Date();
    let month = completeWithZero(date.getMonth() + 1, 2);
    let dat = completeWithZero(date.getDate(), 2);
    let hour = completeWithZero(date.getHours(), 2);
    let minute = completeWithZero(date.getMinutes(), 2);
    let second = completeWithZero(date.getSeconds(), 2);
    let ms = completeWithZero(date.getMilliseconds(), 4);
    return `${date.getFullYear()}_${month}_${dat}_${hour}_${minute}_${second}_${ms}`;
};

let completeWithZero = (v, len) => {
    v = v + '';
    if (v.length < len) {
        v = repeatLetter('0', len - v.length) + v;
    }
    return v;
};

let repeatLetter = (letter, len) => {
    let str = '';
    for (let i = 0; i < len; i++) {
        str += letter;
    }
    return str;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(25);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(77);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(25);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view
} = __webpack_require__(1);

let {
    isFunction
} = __webpack_require__(0);

/**
 * dynamic list,
 *   (1) add item
 *   (2) delete item
 *   (3) show list
 *   (4) maintain list data
 *
 * @param render function
 *  render dom by value
 */
module.exports = view(({
    value,
    defaultItem = '', render, onchange = id,
}, {
    update
}) => {
    let appendItem = () => {
        let item = defaultItem;
        if (isFunction(defaultItem)) {
            item = defaultItem();
        } else {
            item = JSON.parse(JSON.stringify(defaultItem));
        }
        value.push(item);
        onchange({
            value, type: 'append', item
        });
        // update view
        update();
    };

    let deleteItem = (item, index) => {
        if (index !== -1) {
            value.splice(index, 1);
            // update view
            onchange({
                item, index, type: 'delete', value
            });
            update();
        }
    };

    return render({
        value,
        appendItem,
        deleteItem
    });
});

const id = v => v;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(29);

let line = __webpack_require__(27);

module.exports = ({
    width,
    height,
    color,
    bold
}) => {
    return n('div', {
        style: {
            width,
            height,
            margin: 0, padding: 0
        }
    }, [
        n('div', {
            style: {
                position: 'relative',
                left: 0,
                top: (height - bold) / 2
            }
        }, [
            line({
                length: width,
                bold,
                color,
                direction: 'horizontal'
            })
        ]),

        n('div', {
            style: {
                position: 'relative',
                top: -1 * bold,
                left: (width - bold) / 2
            }
        }, [
            line({
                length: height,
                bold,
                color
            })
        ])
    ]);
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(28);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(31);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(7);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(7);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    doc.addEventListener(type, listener(type));
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            doc.addEventListener(type, listener(type));
        }
    };

    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e.__stopPropagation = true;
            return oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target.__eventMap;
        return eventMap && eventMap[type];
    };

    return {
        listenEventType,
        attachDocument
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `__event_type_id_${type}`;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, svgn, bindPlugs
} = __webpack_require__(31);

let {
    parseArgs
} = __webpack_require__(12);

let plugs = __webpack_require__(86);

let view = __webpack_require__(90);

let mount = __webpack_require__(84);

let N = __webpack_require__(81);

module.exports = {
    n,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,

    parseArgs
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(30);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(7);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);
    forEach(kabaneryRoots, (item) => {
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(87);
let eventError = __webpack_require__(85);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(3);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(13);

let {
    hasOwnProperty
} = __webpack_require__(3);

let {
    forEach
} = __webpack_require__(7);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(3);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(7);

let applyAttibutes = __webpack_require__(88);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode.__eventMap) {
        node.__eventMap = newNode.__eventMap;
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(3);

let {
    isObject, isFunction, likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(7);

let replace = __webpack_require__(89);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view, afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view, afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view, afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        if (!args.length) return replaceView();
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
            return replaceView();
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
            return replaceView();
        }
    };

    let append = (item, viewFun) => {
        if (node) {
            node.appendChild(viewFun(item));
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        append,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(1);

let angle = __webpack_require__(59);

module.exports = (ops) => {
    return n('span', {
        style: {
            display: 'inline-block',
            paddingRight: 8
        }
    }, angle({
        direction: ops.isHide() ? 'bottom' : 'top',
        length: 5,
        color: '#666666'
    }));
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(34);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(93);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(34);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @param direction string
 *  direction = up | down | left | right
 */
module.exports = ({
    left = 0, right = 0, top = 0, bottom = 0, color = 'black', direction = 'up'
}) => {
    if (direction === 'up') {
        return {
            width: 0,
            height: 0,
            'border-left': `${left}px solid transparent`,
            'border-right': `${right}px solid transparent`,
            'border-bottom': `${bottom}px solid ${color}`
        };
    } else if (direction === 'down') {
        return {
            width: 0,
            height: 0,
            'border-left': `${left}px solid transparent`,
            'border-right': `${right}px solid transparent`,
            'border-top': `${top}px solid ${color}`
        };
    } else if (direction === 'left') {
        return {
            width: 0,
            height: 0,
            'border-top': `${top}px solid transparent`,
            'border-bottom': `${bottom}px solid transparent`,
            'border-right': `${right}px solid ${color}`
        };
    } else if (direction === 'right') {
        return {
            width: 0,
            height: 0,
            'border-top': `${top}px solid transparent`,
            'border-bottom': `${bottom}px solid transparent`,
            'border-left': `${left}px solid ${color}`
        };
    } else {
        throw new Error(`unexpeced direction ${direction}`);
    }
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = __webpack_require__(96);

let startMomenter = __webpack_require__(97);

let getX = (elem) => {
    var x = 0;
    while (elem) {
        x = x + elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return x;
};

let getY = (elem) => {
    var y = 0;
    while (elem) {
        y = y + elem.offsetTop;
        elem = elem.offsetParent;
    }
    return y;
};

let getClientX = (elem) => {
    return getX(elem) - window.scrollX;
};

let getClientY = (elem) => {
    return getY(elem) - window.scrollY;
};

let removeChilds = (node) => {
    while (node && node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

let once = (node, type, handler, useCapture) => {
    let fun = function(e) {
        let ret = handler.apply(this, [e]);
        node.removeEventListener(type, fun, useCapture);
        return ret;
    };

    node.addEventListener(type, fun, useCapture);
};

let getAttributeMap = (attributes = []) => {
    let map = {};
    for (let i = 0; i < attributes.length; i++) {
        let {
            name, value
        } = attributes[i];
        map[name] = value;
    }
    return map;
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

let isMobile = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
};

let getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

let getWindowHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

module.exports = {
    getX,
    getY,
    getClientX,
    getClientY,
    getWindowWidth,
    getWindowHeight,
    removeChilds,
    once,
    shadowFrame,
    getAttributeMap,
    startMomenter,
    getClasses,
    isMobile
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = () => {
    let div = document.createElement('div');
    let sr = div.createShadowRoot();
    sr.innerHTML = '<div id="shadow-page"></div>';

    let frame = null;

    let create = () => {
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(div);

        return sr.getElementById('shadow-page');
    };

    let start = () => {
        if (frame) {
            return frame;
        }
        frame = new Promise(resolve => {
            if (document.body) {
                resolve(create());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(create());
                });
            }
        });
        return frame;
    };

    let close = () => {
        frame.then(() => {
            let parent = div.parentNode;
            parent && parent.removeChild(div);
        });
    };

    return {
        start,
        close,
        sr,
        rootDiv: div
    };
};

module.exports = shadowFrame;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isDomReady = (doc) => doc.readyState === 'complete' ||
    (!doc.attachEvent && doc.readyState === 'interactive');

let startMomenter = (doc = document) => {
    let loadedFlag = false;

    let resolves = [];

    let docReady = () => {
        let ready = () => {
            window.removeEventListener('load', ready, false);
            doc.removeEventListener('DOMContentLoaded', ready, false);

            if (loadedFlag) return;
            loadedFlag = true;
            for (let i = 0; i < resolves.length; i++) {
                resolves[i]();
            }
            resolves = [];
        };

        doc.addEventListener('DOMContentLoaded', ready, false);
        window.addEventListener('load', ready, false);
    };

    docReady();

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime = 0, startTimeout = 10000
    } = {}) => new Promise((resolve, reject) => {
        if (loadedFlag || isDomReady(doc)) { // already ready
            setTimeout(resolve, generalWaitTime);
        } else { // wait for ready
            resolves.push(resolve);
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(99);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(0);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        let next = parent[part];
        if (!isObject(next)) {
            next = {};
            parent[part] = next;
        }
        parent = next;
    }

    parent[parts[parts.length - 1]] = value;
    return sandbox;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    try {
        let v = fun && fun.apply(context, params);

        if (stopV && v === stopV) {
            return Promise.resolve(stopV);
        }
        return Promise.resolve(v).then(() => {
            return runSequence(list.slice(1), params, context, stopV);
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(36);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(100);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(36);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(37);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(14);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(5);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(5);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    doc.addEventListener(type, listener(type));
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            doc.addEventListener(type, listener(type));
        }
    };

    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e.__stopPropagation = true;
            return oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target.__eventMap;
        return eventMap && eventMap[type];
    };

    return {
        listenEventType,
        attachDocument
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `__event_type_id_${type}`;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, svgn, bindPlugs, toHTML, parseArgs
} = __webpack_require__(14);

let plugs = __webpack_require__(110);

let view = __webpack_require__(114);

let mount = __webpack_require__(105);

let N = __webpack_require__(102);

let reduceNode = __webpack_require__(15);

module.exports = {
    n,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,
    toHTML,
    reduceNode,

    parseArgs
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(38);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(5);

let reduceNode = __webpack_require__(15);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);

    forEach(kabaneryRoots, (item) => {
        item = reduceNode(item);
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parseAttribute = __webpack_require__(107);

let {
    isString, isObject, isNode, likeArray, isNumber, isBool
} = __webpack_require__(0);

let parseArgs = (args) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    tagName = tagName.toLowerCase().trim();

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr);

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp);
    }
    return ret;
};

module.exports = parseArgs;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isObject
} = __webpack_require__(0);

let {
    mergeMap
} = __webpack_require__(5);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style) {
        attributes.style = getStyleString(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = getStyleString(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

let getStyleString = (attr = '') => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let styles = [];
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        styles.push(`${key}: ${value}`);
    }
    return styles.join(';');
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};

module.exports = parseAttribute;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNode
} = __webpack_require__(0);

const svgNS = 'http://www.w3.org/2000/svg';

let applyNode = (node, attributes, childs) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isNode(child)) {
            node.appendChild(child);
        } else {
            node.textContent = child + '';
        }
    }
};

let createElement = (tagName, attributes, childs) => {
    let node = document.createElement(tagName);
    applyNode(node, attributes, childs);
    return node;
};

let createSvgElement = (tagName, attributes, childs) => {
    let node = document.createElementNS(svgNS, tagName);
    applyNode(node, attributes, childs);
    return node;
};

module.exports = {
    createElement,
    createSvgElement
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(111);
let eventError = __webpack_require__(109);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(3);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(13);

let {
    hasOwnProperty
} = __webpack_require__(3);

let {
    forEach
} = __webpack_require__(5);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(3);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(5);

let applyAttibutes = __webpack_require__(112);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode.__eventMap) {
        node.__eventMap = newNode.__eventMap;
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(3);

let {
    isObject, isFunction, likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(5);

let replace = __webpack_require__(113);

let reduceNode = __webpack_require__(15);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view, afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view, afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view, afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        if (!args.length) return replaceView();
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
            return replaceView();
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
            return replaceView();
        }
    };

    let append = (item, viewFun) => {
        if (node) {
            node.appendChild(viewFun(item));
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();
        newNode = reduceNode(newNode);

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        append,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    PREDICATE
} = __webpack_require__(4);

let PassPredicateUI = ({
    getSuffixParams
}) => {
    return getSuffixParams(0);
};

PassPredicateUI.detect = ({
    expressionType
}) => {
    return expressionType === PREDICATE;
};

module.exports = PassPredicateUI;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(1);

let {
    map
} = __webpack_require__(2);

let {
    PREDICATE
} = __webpack_require__(4);

let form = ({
    value,
    expressionType,
    getSuffixParams
}, {
    title,
    inline = true
} = {}) => {
    let parts = value.path.split('.');
    title = title || parts[parts.length - 1];

    return n('form class="expression-wrapper"', {
        onclick: (e) => {
            e.preventDefault();
        }
    }, [
        n('h3', title),

        map(getSuffixParams(0), (item) => {
            return n('div', {
                style: {
                    padding: 8,
                    display: inline ? 'inline-block' : 'block'
                }
            }, item);
        })
    ]);
};

form.detect = ({
    expressionType
}) => {
    return expressionType === PREDICATE;
};

module.exports = form;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let InputList = __webpack_require__(26);

let {
    JSON_DATA
} = __webpack_require__(4);

let {
    n
} = __webpack_require__(1);

let {
    mergeMap
} = __webpack_require__(2);

let simpleList = ({
    value,
    onchange
}, {
    defaultItem,
    title,
    itemRender,

    itemOptions = {}
}) => {
    let onValueChanged = (v) => {
        value.value = v;
        onchange(value);
    };

    return InputList({
        onchange: onValueChanged,

        value: value.value,
        defaultItem,
        itemRender,
        itemOptions: mergeMap({
            style: {
                marginLeft: 10
            }
        }, itemOptions),

        title: n('span', {
            style: {
                paddingLeft: 12,
                color: '#666666'
            }
        }, [title])
    });
};

simpleList.detect = ({
    expresionType
}) => expresionType === JSON_DATA;

module.exports = simpleList;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(122);


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getPredicateMetaInfo,
    getPredicatePath,
    infixTypes
} = __webpack_require__(8);

let {
    get
} = __webpack_require__(2);

module.exports = ({
    data,
    onExpand,
    onselected,

    ExpandorView
}) => {
    let {
        predicates
    } = data;

    let options = infixTypes({
        predicates
    });

    return ExpandorView({
        hide: data.hideExpressionExpandor,

        options,

        onExpand: (hide) => {
            data.hideExpressionExpandor = hide;
            data.infixPath = null;
            onExpand && onExpand();
        },

        onselected: (v, path) => {
            data.infixPath = path;
            data.title = get(getPredicateMetaInfo(data.predicatesMetaInfo, getPredicatePath(path)), 'args.0.name');
            data.hideExpressionExpandor = true;
            onselected && onselected(v, path);
        }
    });
};



/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getPredicatePath, getPredicateMetaInfo
} = __webpack_require__(8);

let {
    map, mergeMap
} = __webpack_require__(2);

let getArgs = ({
    value,
    predicatesMetaInfo
}) => {
    let predicatePath = getPredicatePath(value.path);
    let {
        args
    } = getPredicateMetaInfo(predicatesMetaInfo, predicatePath) || {};
    return args || [];
};

const id = v => v;

let getParamer = (data, {
    itemRender
}) => (index) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    let opts = args[index] || {};

    return itemRender(mergeMap(opts, {
        title: opts.name,

        value: mergeMap(value.params[index] || {}, opts.value || {}),

        onchange: (itemValue) => {
            // update by index
            value.params[index] = itemValue;
            onchange(value);
        }
    }));
};

let getPrefixParamser = (data, {
    itemRender
}) => (infix = 0) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    let params = value.params.slice(0, infix);

    return map(args.slice(0, infix), (opts, index) => {
        opts = opts || {};

        return itemRender(mergeMap(opts, {
            title: opts.name,

            value: mergeMap(params[index] || {}, opts.value || {}),

            onchange: (itemValue) => {
                params[index] = itemValue;
                value.params = params.concat(value.params.slice(infix));
                onchange(value);
            }
        }));
    });
};

let getSuffixParamser = (data, {
    itemRender
}) => (infix = 0) => {
    let {
        value,
        onchange = id
    } = data;

    let args = getArgs(data);

    let params = value.params.slice(infix);

    return map(args.slice(infix), (opts, index) => {
        opts = opts || {};

        return itemRender(mergeMap(opts, {
            title: opts.name,

            value: mergeMap(params[index] || {}, opts.value || {}),

            onchange: (itemValue) => {
                params[index] = itemValue;
                value.params = value.params.slice(0, infix).concat(params);
                onchange(value);
            }
        }));
    });
};

module.exports = {
    getPrefixParamser,
    getSuffixParamser,
    getParamer
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EmptyExpressionView = __webpack_require__(124);

let JsonDataView = __webpack_require__(125);

let AbstractionView = __webpack_require__(123);

let PredicateView = __webpack_require__(126);

let VariableView = __webpack_require__(127);

let {
    getExpressionType,
    getPredicatePath,
    getPredicateMetaInfo
} = __webpack_require__(8);

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE
} = __webpack_require__(4);

/**
 * choose the viewer to render expression
 *
 * @param viewer
 *  pre-defined render function
 *  TODO add test function for viewer as graceful degradation
 */
module.exports = ({
    value, viewer, predicatesMetaInfo
}, options) => {
    // exists pre-defined viewer
    if (viewer) {
        if (!viewer.detect) {
            return viewer;
        } else {
            // detect
            if (viewer.detect(options)) {
                return viewer;
            }
        }
    }

    let expressionType = getExpressionType(value.path);

    if (expressionType === PREDICATE) {
        // find pre-defined predicate function level viewer
        let metaInfo = getPredicateMetaInfo(predicatesMetaInfo, getPredicatePath(value.path));
        if (metaInfo.viewer) {
            return (expOptions) => metaInfo.viewer(expOptions, metaInfo);
        }
    }

    // choose the default expresion viewer
    switch (expressionType) {
        case PREDICATE:
            return PredicateView;
        case JSON_DATA:
            return JsonDataView;
        case VARIABLE:
            return VariableView;
        case ABSTRACTION:
            return AbstractionView;
        default:
            return EmptyExpressionView;
    }
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let LetaUIView = __webpack_require__(128);

let {
    runner, getLambdaUiValue
} = __webpack_require__(8);

let {
    dsl
} = __webpack_require__(16);

let {
    mergeMap
} = __webpack_require__(2);

let meta = __webpack_require__(133);

let {
    getJson, method, v, r
} = dsl;

let LetaUI = (...args) => {
    let data = getData(args);
    let runLeta = runner(data.predicates);

    return LetaUIView(mergeMap(data, {
        onchange: (v) => {
            data.onchange && data.onchange(v, {
                runLeta
            });
        },

        runLeta
    }));
};

let getData = (args) => {
    let data = null;
    if (args.length === 1) {
        data = args[0];
    } else if (args.length === 2) {
        data = args[1];
        data.value = getLambdaUiValue(
            getJson(args[0])
        ); // convert lambda json
    } else {
        throw new Error(`unexpected number of arguments. Expect one or two but got ${args.length}`);
    }

    data = data || {};

    return data;
};

let RealLetaUI = (...args) => {
    let data = getData(args);
    data.onchange = data.onchange || realOnchange;
    return LetaUI(data);
};

let realOnchange = (v, {
    runLeta
}) => {
    runLeta(v);
};

module.exports = {
    method,
    v,
    r,
    meta,
    runner,

    LetaUI,
    RealLetaUI
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

let VariableDeclareView = __webpack_require__(142);

let expandorWrapper = __webpack_require__(11);

let {
    VARIABLE
} = __webpack_require__(4);

module.exports = view(({
    value,
    variables,
    getOptionsView,
    getExpandor,
    onchange,
    expressionBody
}, {
    update
}) => {
    return () => expandorWrapper(n('div', [
        getOptionsView(),

        n('div', {
            style: {
                marginLeft: 15,
                marginTop: 5,
                padding: 5
            }
        }, [
            n('div', {
                style: {
                    border: '1px solid rgba(200, 200, 200, 0.4)',
                    borderRadius: 5,
                    padding: 5
                }
            }, [
                VariableDeclareView({
                    onchange: (v) => {
                        value.currentVariables = v;
                        expressionBody.updateVariables(variables.concat(value.currentVariables));
                        onchange(value);
                        update();
                    },

                    variables: value.currentVariables,
                    prevVariables: variables,
                    title: VARIABLE,
                })
            ]),

            n('div', {
                style: {
                    marginTop: 5
                }
            }, [
                expressionBody.getView()
            ])
        ])
    ]), getExpandor());
});


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let expandorWrapper = __webpack_require__(11);

module.exports = ({
    getOptionsView,
    getExpandor
}) => {
    return expandorWrapper(getOptionsView(), getExpandor());
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

let {
    contain
} = __webpack_require__(2);

let fold = __webpack_require__(32);

let foldArrow = __webpack_require__(91);

let {
    isObject
} = __webpack_require__(0);

let InputView = __webpack_require__(136);

let expandorWrapper = __webpack_require__(11);

const {
    INLINE_TYPES, DEFAULT_DATA_MAP
} = __webpack_require__(4);

let {
    getDataTypePath
} = __webpack_require__(8);

/**
 * used to define json data
 */
module.exports = view(({
    value, onchange = id, getOptionsView, getExpandor
}) => {
    let type = getDataTypePath(value.path);

    let onValueChanged = (v) => {
        value.value = v;
        onchange(value);
    };

    let renderInputArea = () => {
        return InputView({
            content: value.value || DEFAULT_DATA_MAP[type],
            type: value.type,
            placeholder: value.placeholder,
            onchange: onValueChanged
        }, type);
    };

    return expandorWrapper(n('div', {
        style: {
            border: contain(INLINE_TYPES, type) ? '0' : '1px solid rgba(200, 200, 200, 0.4)',
            minWidth: 160
        }
    }, [
        getOptionsView(),

        n('div', {
            style: {
                display: !type ? 'block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
            }
        }),

        !contain(INLINE_TYPES, type) ? fold({
            head: (ops) => n('div', {
                style: {
                    textAlign: 'right',
                    cursor: 'pointer'
                },
                'class': 'lambda-ui-hover',
                onclick: () => {
                    ops.toggle();
                }
            }, [
                ops.isHide() && n('span', {
                    style: {
                        color: '#9b9b9b',
                        paddingRight: 60
                    }
                }, abbreText(value.value)),

                foldArrow(ops)
            ]),

            body: renderInputArea,
            hide: false
        }) : renderInputArea()
    ]), getExpandor());
});

let abbreText = (data) => {
    let str = data;
    if (isObject(data)) {
        str = JSON.stringify(data);
    }
    if (str.length > 30) {
        return str.substring(0, 27) + '...';
    }
    return str;
};

const id = v => v;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

let {
    map
} = __webpack_require__(2);

let expandorWrapper = __webpack_require__(11);

module.exports = view(({
    value,
    getOptionsView,
    getExpandor,
    getPrefixParams,
    getSuffixParams
}) => {
    return expandorWrapper(n('div', [
        arrangeItems(getPrefixParams(value.infix)),

        getOptionsView(),

        n('div', {
            style: {
                display: value.infix ? 'inline-block' : 'block'
            }
        }, [
            arrangeItems(getSuffixParams(value.infix))
        ])
    ]), getExpandor());
});

let arrangeItems = (itemViews) => n('div', {
    'class': 'lambda-params',
    style: {
        display: 'inline-block'
    }
}, [
    map(itemViews, (itemView) => {
        return n('fieldset', {
            style: {
                padding: '4px'
            }
        }, itemView);
    })
]);


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

let expandorWrapper = __webpack_require__(11);

module.exports = view(({
    getOptionsView, getExpandor
}) => {
    return () => expandorWrapper(n('div', [getOptionsView()]), getExpandor());
});


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

let ExpandorComponent = __webpack_require__(119);

let TreeOptionView = __webpack_require__(141);

let Expandor = __webpack_require__(134);

let {
    getPrefixParamser,
    getSuffixParamser,
    getParamer
} = __webpack_require__(120);

let {
    mergeMap, get, map
} = __webpack_require__(2);

let getExpressionViewer = __webpack_require__(121);

const style = __webpack_require__(132);

let {
    JSON_DATA,
    ABSTRACTION,
    VARIABLE,
    PREDICATE
} = __webpack_require__(4);

let {
    getExpressionType,
    completeDataWithDefault,
    completeValueWithDefault,
    expressionTypes,
    isUIPredicate,
    getUIPredicatePath
} = __webpack_require__(8);

/**
 * lambda UI editor
 *
 * π calculus
 *
 * e ::= x              a variable
 *   |   חx.e           an abstraction (function)
 *   |   e₁e₂           a (function) application
 *
 * 1. meta data
 *    json
 *
 * 2. predicate
 *    f(x, ...)
 *
 * 3. variable
 *    x
 *
 * 4. abstraction
 *    חx₁x₂...x.e
 *
 * 5. application
 *    e₁e₂e₃...
 *
 * ח based on predicates and json expansion
 *
 * e ::= json                    as meta data, also a pre-defined π expression
 *   |   x                       variable
 *   |   predicate               predicate is a pre-defined abstraction
 *   |   חx.e                    abstraction
 *   |   e1e2                    application
 */

/**
 * expression user interface
 *
 * 1. user choses expression type
 * 2. define current expression type
 *
 * data = {
 *      predicates,
 *      predicatesMetaInfo: {
 *          ... {
 *              args: [{
 *                  name,
 *                  defaultValue: value
 *              }]
 *          }
 *      },
 *
 *      value: {
 *          path
 *      }
 * }
 *
 * TODO: application option
 */
module.exports = view((data = {}) => {
    style({
        style: data.styleStr
    });

    return n('div', {
        'class': 'lambda-ui'
    }, [
        expressionView(data)
    ]);
});

let expressionView = view((data, {
    update
}) => {
    data = completeDataWithDefault(data);

    return () => {
        let {
            value,
            infixPath,

            // events
            onchange,

            runLeta
        } = data;

        completeValueWithDefault(value);

        if (isUIPredicate(value.path)) {
            //
            let render = get(data.UI, getUIPredicatePath(value.path));
            return expressionView(mergeMap(data, {
                viewer: (expOptions) => render(expOptions, ...map(value.params.slice(1), (item) => {
                    return runLeta(item);
                })),
                value: value.params[0]
            }));
        }

        if (data.infixPath) {
            return expressionView(mergeMap(data, {
                infixPath: null,
                value: {
                    path: infixPath,
                    params: [value],
                    infix: 1
                }
            }));
        }

        onchange(value);

        let expressionOptions = getExpressionViewOptions(data, update);
        return getExpressionViewer(data, expressionOptions)(expressionOptions);
    };
});

let getExpressionViewOptions = (data, update) => {
    let {
        value,
        variables,

        // global config
        predicates,
        predicatesMetaInfo,
        UI,
        nameMap,

        // ui states
        title,
        guideLine,
        showSelectTree,

        // events
        onchange,

        runLeta
    } = data;

    let globalConfig = {
        predicates,
        runLeta,
        UI,
        predicatesMetaInfo,
        nameMap
    };

    let getOptionsView = (OptionsView = TreeOptionView) => OptionsView({
        path: value.path,
        data: expressionTypes(data),
        title,
        guideLine,
        showSelectTree,
        nameMap,
        onselected: (v, path) => {
            update([
                ['value.path', path],
                ['showSelectTree', false]
            ]);
        }
    });

    let getExpandor = (ExpandorView = Expandor) => data.value.path && ExpandorComponent({
        onExpand: (hide) => {
            update();
            data.onexpandchange && data.onexpandchange(hide, data);
        },

        onselected: () => {
            update();
        },

        data,

        ExpandorView
    });

    let getAbstractionBody = () => {
        let expressionViewObj = mergeMap(globalConfig, {
            title: 'expression',
            value: value.expression,
            variables: variables.concat(value.currentVariables),
            onchange: (lambda) => {
                value.expression = lambda;
                onchange && onchange(value);
            }
        });

        return {
            getView: () => {
                return expressionView(expressionViewObj);
            },

            updateVariables: (vars) => {
                expressionViewObj.variables = vars;
            }
        };
    };

    let prefixParamItemRender = (opts) => expressionView(
        mergeMap(mergeMap(globalConfig, {
            variables,
            onexpandchange: (hide, data) => {
                // close infix mode
                update([
                    ['infixPath', null],
                    ['value', data.value],
                    ['title', '']
                ]);
            }
        }), opts)
    );

    let suffixParamItemRender = (opts) => expressionView(
        mergeMap(mergeMap(globalConfig, {
            variables
        }), opts)
    );

    let expressionType = getExpressionType(value.path);

    switch (expressionType) {
        case PREDICATE:
            return {
                getPrefixParams: getPrefixParamser(data, {
                    // prefix param item
                    itemRender: prefixParamItemRender
                }),

                value,

                getSuffixParams: getSuffixParamser(data, {
                    // suffix param item
                    itemRender: suffixParamItemRender
                }),

                getParam: getParamer(data, {
                    // suffix param item
                    itemRender: suffixParamItemRender
                }),

                getOptionsView,

                getExpandor,

                expressionType
            };
        case JSON_DATA:
            return {
                value,
                onchange,
                getOptionsView,
                getExpandor,

                expressionType
            };
        case VARIABLE:
            return {
                value,
                getOptionsView,
                getExpandor,

                expressionType
            };
        case ABSTRACTION:
            return {
                value,
                variables,

                getOptionsView,
                getExpandor,

                onchange,
                expressionType,
                expressionBody: getAbstractionBody(),
            };
        default:
            return {
                value,
                getOptionsView,
                getExpandor,

                expressionType
            };
    }
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    dsl
} = __webpack_require__(16);

let {
    destruct,

    APPLICATION_PREFIX,
    PREDICATE_PREFIX,
    PREDICATE_VARIABLE_PREFIX,
    VARIABLE_PREFIX,
    META_DATA_PREFIX,
    ABSTRACTION_PREFIX
} = dsl;

let {
    JSON_DATA,
    VARIABLE,
    ABSTRACTION,
    PREDICATE,

    NUMBER,
    BOOLEAN,
    STRING,
    NULL,
    JSON_TYPE
} = __webpack_require__(4);

let {
    compact, map
} = __webpack_require__(2);

let {
    isString, isNumber, isBool, isNull, isObject
} = __webpack_require__(0);

/**
 * lambda ui value = {
 *     path,
 *
 *     expression,    // for abstraction
 *
 *     variables,    // for abstraction
 *
 *     params,    // predicate
 *
 *     value    // json data
 * }
 */

let getLambdaUiValue = (lambdaJson) => {
    let {
        type,
        metaData,

        variableName,

        abstractionArgs,
        abstractionBody,

        predicateName,
        predicateParams
    } = destruct(lambdaJson);

    switch (type) {
        case META_DATA_PREFIX:
            return {
                path: compact([JSON_DATA, getMetaType(metaData)]).join('.'),
                value: metaData
            };
        case VARIABLE_PREFIX:
            return {
                path: [VARIABLE, variableName].join('.')
            };
        case ABSTRACTION_PREFIX:
            return {
                path: ABSTRACTION,
                expression: getLambdaUiValue(abstractionBody),
                variables: abstractionArgs
            };
        case PREDICATE_PREFIX:
            return {
                path: compact([PREDICATE, predicateName]).join('.'),
                params: map(predicateParams, getLambdaUiValue)
            };
        case APPLICATION_PREFIX:
            // TODO
            break;
        case PREDICATE_VARIABLE_PREFIX:
            // TODO
            break;
    }
};

let getMetaType = (data) => {
    if (isString(data)) return STRING;

    else if (isNumber(data)) return NUMBER;

    else if (isBool(data)) return BOOLEAN;

    else if (isNull(data)) return NULL;

    else if (isObject(data)) return JSON_TYPE;
};

module.exports = getLambdaUiValue;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let formStyle = __webpack_require__(131);

module.exports = `
.lambda-ui {
    font-size: 14px;
}

.lambda-variable fieldset{
    display: inline-block;
    border: 1px solid rgba(200, 200, 200, 0.4);
    border-radius: 5px;
    padding: 3px 4px;
}

.lambda-variable input{
    width: 30px !important;
    min-width: 30px !important;
    outline: none;
} 

.lambda-params fieldset{
    padding: 1px 4px;
    border: 0;
}

.lambda-ui-hover:hover{
    background-color: #f5f5f5 !important;
}

.lambda-ui .expandor-wrapper {
    position: relative;
    display: inline-block;
    border-radius: 5px;
}

.lambda-ui .expression-wrapper {
    display: inline-block;
    padding: 8px;
    border: 1px solid rgba(200, 200, 200, 0.4);
    border-radius: 5px
}

` + formStyle;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = `
.lambda-ui input[type=text]{
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui input[type=text]:focus{
    border: 0;
    height: 27px;
    border-bottom: 2px solid #3f51b5;
}

.lambda-ui input[type=password]{
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui input[type=password]:focus{
    border: 0;
    height: 27px;
    border-bottom: 2px solid #3f51b5;
}

.lambda-ui input[type=number]{
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui input[type=number]:focus{
    border: 0;
    height: 27px;
    border-bottom: 2px solid #3f51b5;
}

.lambda-ui .input-style {
    border: 0;
    display: inline-block;
    border-bottom: 1px solid rgba(0,0,0,.12);
    outline: none;
    height: 28px;
    min-width: 160px;
}

.lambda-ui label {
    font-size: 14px;
    margin-right: 8px;
    color: #666666;
}

.lambda-ui fieldset {
    border: 0;
}

.lambda-ui button {
    min-width: 100px;
}

.lambda-ui button {
    min-width: 40px;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 20px;
    background-color: #3b3a36;
    color: white;
    border: none;
    text-decoration: none;
}
 
.lambda-ui button:hover {
    background-color: #b3c2bf;
    cursor: pointer;
}

.lambda-ui button:focus {
    outline: none;
}

.lambda-ui button:active {
    background-color: #e9ece5;
}
`;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const LAMBDA_STYLE = __webpack_require__(130);

let {
    n, mount
} = __webpack_require__(1);

module.exports = ({
    styleStr = LAMBDA_STYLE
} = {}) => {
    let $style = document.getElementById('lambda-style');
    if (!$style) {
        $style = n('style id="lambda-style" type="text/css"', styleStr);
        mount($style, document.getElementsByTagName('head')[0]);
    }
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isFunction, funType, isObject
} = __webpack_require__(0);

/**
 * define meta info at a function
 *
 * info = {
 *    viewer,
 *    args: [{}, {}, ..., {}]
 * }
 */

module.exports = funType((fun, meta) => {
    fun.meta = meta;
    return fun;
}, [isFunction, isObject]);


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

let fold = __webpack_require__(32);

let triangle = __webpack_require__(20);

let TreeSelect = __webpack_require__(35);

let {
    mergeMap
} = __webpack_require__(2);

/**
 * @param options Array
 *  options used to select
 * @param onExpand
 * @param onselected
 *
 */
module.exports = view(({
    options,
    onExpand,
    onselected,
    hide
}) => {
    return n('div', {
        style: {
            display: 'inline-block'
        }
    }, [
        fold({
            head: (ops) => {
                return n('div', {
                    style: mergeMap(
                        ops.isHide() ? triangle({
                            direction: 'right',
                            top: 5,
                            bottom: 5,
                            left: 5,
                            color: '#737373'
                        }) : triangle({
                            direction: 'left',
                            top: 5,
                            bottom: 5,
                            right: 5,
                            color: '#737373'
                        }), {
                            position: 'absolute',
                            bottom: 0,
                            marginLeft: 5,
                            cursor: 'pointer'
                        }
                    ),

                    onclick: () => {
                        ops.toggle();
                        onExpand && onExpand(ops.isHide());
                    }
                });
            },

            hide,

            body: () => {
                return n('div', {
                    style: {
                        display: 'inline-block',
                        marginLeft: 15,
                        position: 'absolute',
                        bottom: 0
                    }
                }, TreeSelect({
                    data: options,
                    onselected: (v, path) => {
                        onselected && onselected(v, path);
                    }
                }));
            }
        })
    ]);
});


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view
} = __webpack_require__(1);

let SelectView = __webpack_require__(33);

module.exports = view((data) => {
    let {
        content,
        onchange
    } = data;

    return SelectView({
        options: [
            ['true'],
            ['false']
        ],
        selected: content === true ? 'true' : 'false',
        onchange: (v) => {
            let ret = false;
            if (v === 'true') {
                ret = true;
            }
            data.content = ret;
            onchange && onchange(v);
        }
    });
});


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let boolInput = __webpack_require__(135);

let numberInput = __webpack_require__(139);

let textInput = __webpack_require__(140);

let jsonCodeInput = __webpack_require__(137);

let nullInput = __webpack_require__(138);

let {
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL
} = __webpack_require__(4);

let inputViewMap = {
    [NUMBER]: numberInput,
    [STRING]: textInput,
    [BOOLEAN]: boolInput,
    [JSON_TYPE]: jsonCodeInput,
    [NULL]: nullInput
};

module.exports = (data, type) => {
    let v = inputViewMap[type];

    return v && v(data);
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

module.exports = view((data) => {
    let {
        content,
        onchange
    } = data;

    return n('div', {
        style: {
            marginLeft: 15,
            width: 600,
            height: 500
        }
    }, [
        n('textarea', {
            value: JSON.stringify(content, null, 4) || '{}',
            oninput: (e) => {
                let v = e.target.value;
                try {
                    let jsonObject = JSON.parse(v);
                    data.content = jsonObject;
                    onchange && onchange(jsonObject);
                } catch (err) {
                    onchange(err);
                }
            }
        })
    ]);
});


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(1);

module.exports = () => {
    return n('span', 'null');
};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

module.exports = view((data) => {
    let {
        content,
        placeholder,
        onchange
    } = data;

    return n(`input type="number" placeholder="${placeholder||''}"`, {
        style: {
            marginTop: -10
        },
        value: content,
        oninput: (e) => {
            let num = Number(e.target.value);
            data.content = num;
            onchange && onchange(num);
        }
    });
});


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

module.exports = view((data) => {
    let {
        type,
        placeholder,
        content,
        onchange
    } = data;

    return n(`input type="${type || 'text'}" placeholder="${placeholder || ''}"`, {
        style: {
            marginTop: -10
        },

        value: content,

        oninput: (e) => {
            data.content = e.target.value;
            onchange && onchange(e.target.value);
        }
    });
});


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

let {
    mergeMap
} = __webpack_require__(2);

let {
    isFunction
} = __webpack_require__(0);

let TreeSelect = __webpack_require__(35);

let triangle = __webpack_require__(20);

let {
    PREDICATE, VARIABLE
} = __webpack_require__(4);

const DEFAULT_TITLE = 'please select';

module.exports = view(({
    path,
    data,
    showSelectTree,
    onselected,
    title,
    guideLine,
    nameMap
}, {
    update
}) => {
    return n('label', {
        style: {
            color: '#9b9b9b',
            fontSize: 12,
            position: 'relative',
            display: 'inline-block'
        }
    }, [
        path && title && n('div', {
            style: {
                fontSize: 14
            }
        }, title),

        n('div', {
            style: {
                paddingRight: 8,
                cursor: 'pointer',
                backgroundColor: showSelectTree ? 'rgba(200, 200, 200, .12)' : 'none'
            },

            'class': 'lambda-ui-hover',

            onclick: () => {
                update('showSelectTree', !showSelectTree);
            }
        }, path ? (guideLine === false ? null : (!guideLine ? renderGuideLine(path) : guideLine)) : n('div class="input-style"', {
            style: {
                color: '#9b9b9b',
                overflow: 'auto'
            }
        }, [
            n('span', {
                style: {
                    fontSize: 12
                }
            }, title || DEFAULT_TITLE),

            n('div', {
                style: mergeMap(triangle({
                    direction: 'down',
                    top: 5,
                    left: 5,
                    right: 5,
                    color: '#737373'
                }), {
                    display: 'inline-block',
                    'float': 'right',
                    position: 'relative',
                    top: 5
                })
            })
        ])),

        n('div', {
            style: {
                position: 'absolute',
                backgroundColor: 'white',
                zIndex: 10000,
                fontSize: 14
            }
        }, [
            showSelectTree && data && TreeSelect({
                data: isFunction(data) ? data() : data,
                onselected: (v, p) => {
                    onselected && onselected(v, p);
                    update([
                        ['path', p],
                        ['showSelectTree', false]
                    ]);
                },
                nameMap
            })
        ])
    ]);
});

/**
 * @param path string
 */
let renderGuideLine = (path) => {
    let parts = path.split('.');
    let last = parts.pop();
    let type = parts[0];

    return n('span', [
        n('span', {
            style: {
                fontWeight: (type === PREDICATE || type === VARIABLE) ? 'bold' : 'inherit',
                fontSize: 12,
                color: '#b4881d',
                padding: '0 5px'
            }
        }, last),

        (type === PREDICATE || type === VARIABLE) && parts.length && n('span', {
            style: {
                paddingLeft: 10
            }
        }, `(${parts.join(' > ')})`)
    ]);
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

let InputList = __webpack_require__(26);

let {
    reduce, map
} = __webpack_require__(2);

// used to define variables
// TODO variables detect
module.exports = view((data) => {
    let {
        title,
        variables = [], onchange = v => v
    } = data;

    return n('div', {
        'class': 'lambda-variable'
    }, [
        InputList({
            value: map(variables, (variable) => {
                return variable || '';
            }),

            title: n('span', {
                style: {
                    color: '#9b9b9b',
                    fontSize: 14
                }
            }, title),

            onchange: (v) => {
                // TODO check variable definition
                onchange(reduce(v, (prev, item) => {
                    item && prev.push(item.trim());
                    return prev;
                }, []));

                data.variables = v;
            }
        })
    ]);
});


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(144);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(0);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        let next = parent[part];
        if (!isObject(next)) {
            next = {};
            parent[part] = next;
        }
        parent = next;
    }

    parent[parts[parts.length - 1]] = value;
    return sandbox;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    try {
        let v = fun && fun.apply(context, params);

        if (stopV && v === stopV) {
            return Promise.resolve(stopV);
        }
        return Promise.resolve(v).then(() => {
            return runSequence(list.slice(1), params, context, stopV);
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(39);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(145);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(39);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map, reduce
} = __webpack_require__(2);

let {
    funType, isObject, isFunction
} = __webpack_require__(0);

let {
    hasOwnProperty, get
} = __webpack_require__(143);

let {
    APPLICATION_PREFIX,
    PREDICATE_PREFIX,
    PREDICATE_VARIABLE_PREFIX,
    VARIABLE_PREFIX,
    META_DATA_PREFIX,
    ABSTRACTION_PREFIX,

    destruct
} = __webpack_require__(40);

/**
 * used to interpret lambda json
 *
 * TODO
 *
 * basic operation:
 *  - α conversion (renaming) חx.e ←→ חy.[y/x]e
 *  - β reduction (application) (חx.e₁)e₂ → [e₂/x]e₁
 *  - Ŋ reduction     חx.ex → e
 */

/**
 * d: meta data
 * v: variable
 * l: abstraction
 * p: predicate
 * a: application
 * f: predicate as variable
 *
 * TODO
 *
 * 1. name capture
 * 2. reduce
 *
 * @param predicateSet Object
 *  a map of predicates
 */

module.exports = (predicateSet) => {
    return (data) => {
        // TODO check data format
        let translate = funType((json, ctx) => {
            let translateWithCtx = (data) => translate(data, ctx);

            let error = (msg) => {
                throw new Error(msg + ' . Context json is ' + JSON.stringify(json));
            };

            let {
                type,
                metaData,

                variableName,

                predicateName,
                predicateParams,

                abstractionArgs,
                abstractionBody,

                applicationFun,
                applicationParams
            } = destruct(json);

            switch (type) {
                case META_DATA_PREFIX: // meta data
                    return metaData;

                case VARIABLE_PREFIX: // variable
                    var context = ctx;
                    while (context) {
                        if (hasOwnProperty(context.curVars, variableName)) {
                            return context.curVars[variableName];
                        }
                        context = context.parentCtx;
                    }

                    return error(`undefined variable ${variableName}`);

                case ABSTRACTION_PREFIX: // abstraction
                    return (...args) => {
                        // update variable map
                        return translate(abstractionBody, {
                            curVars: reduce(abstractionArgs, (prev, name, index) => {
                                prev[name] = args[index];
                                return prev;
                            }, {}),
                            parentCtx: ctx
                        });
                    };

                case PREDICATE_PREFIX: // predicate
                    var predicate = get(predicateSet, predicateName);
                    if (!isFunction(predicate)) {
                        return error(`missing predicate ${predicateName}`);
                    }
                    return predicate(...map(predicateParams, translateWithCtx));

                case APPLICATION_PREFIX: // application
                    var abstraction = translateWithCtx(applicationFun);
                    if (!isFunction(abstraction)) {
                        return error(`expected function, but got ${fun} from ${applicationFun}.`);
                    }
                    return abstraction(...map(applicationParams, translateWithCtx));

                case PREDICATE_VARIABLE_PREFIX: // predicate as a variable
                    var fun = get(predicateSet, predicateName);
                    if (!isFunction(fun)) {
                        return error(`missing predicate ${predicateName}`);
                    }
                    return fun;
            }
        }, [
            isObject, isObject
        ]);

        return translate(data, {
            curVars: {}
        });
    };
};


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(41);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(148);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(41);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isObject, isNode, likeArray, isNumber, isBool
} = __webpack_require__(0);

let parseAttribute = __webpack_require__(150);

const svgNS = 'http://www.w3.org/2000/svg';

let cn = (create) => {
    let nodeGen = nodeGener(create);
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);
        return nodeGen(tagName, attributes, childs);
    };
};

let nodeGener = (create) => (tagName, attributes, childs) => {
    let node = create(tagName);
    applyNode(node, attributes, childs);

    return node;
};

let parseArgs = (args) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    tagName = tagName.toLowerCase().trim();

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr);

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let applyNode = (node, attributes, childs) => {
    setAttributes(node, attributes);
    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isString(child)) {
            node.textContent = child;
        } else {
            node.appendChild(child);
        }
    }
};

let setAttributes = (node, attributes) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp.toString());
    }
    return ret;
};

let createElement = (tagName) => document.createElement(tagName);

let createSvgElement = (tagName) => document.createElementNS(svgNS, tagName);

module.exports = {
    svgn: cn(createSvgElement),
    n: cn(createElement),
    parseArgs,
    nodeGener,
    createElement,
    createSvgElement,
    cn
};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString, isObject
} = __webpack_require__(0);

let {
    mergeMap
} = __webpack_require__(147);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style) {
        attributes.style = getStyleString(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = getStyleString(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

let getStyleString = (attr = '') => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let style = '';
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        style = `${style};${key}: ${value}`;
    }
    return style;
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};

module.exports = parseAttribute;


/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = function CMYK(color) {
    color.installColorSpace('CMYK', ['cyan', 'magenta', 'yellow', 'black', 'alpha'], {
        rgb: function () {
            return new color.RGB((1 - this._cyan * (1 - this._black) - this._black),
                                     (1 - this._magenta * (1 - this._black) - this._black),
                                     (1 - this._yellow * (1 - this._black) - this._black),
                                     this._alpha);
        },

        fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
            // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
            var red = this._red,
                green = this._green,
                blue = this._blue,
                cyan = 1 - red,
                magenta = 1 - green,
                yellow = 1 - blue,
                black = 1;
            if (red || green || blue) {
                black = Math.min(cyan, Math.min(magenta, yellow));
                cyan = (cyan - black) / (1 - black);
                magenta = (magenta - black) / (1 - black);
                yellow = (yellow - black) / (1 - black);
            } else {
                black = 1;
            }
            return new color.CMYK(cyan, magenta, yellow, black, this._alpha);
        }
    });
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function LAB(color) {
    color.use(__webpack_require__(43));

    color.installColorSpace('LAB', ['l', 'a', 'b', 'alpha'], {
        fromRgb: function () {
            return this.xyz().lab();
        },

        rgb: function () {
            return this.xyz().rgb();
        },

        xyz: function () {
            // http://www.easyrgb.com/index.php?X=MATH&H=08#text8
            var convert = function (channel) {
                    var pow = Math.pow(channel, 3);
                    return pow > 0.008856 ?
                        pow :
                        (channel - 16 / 116) / 7.87;
                },
                y = (this._l + 16) / 116,
                x = this._a / 500 + y,
                z = y - this._b / 200;

            return new color.XYZ(
                convert(x) *  95.047,
                convert(y) * 100.000,
                convert(z) * 108.883,
                this._alpha
            );
        }
    });
};


/***/ }),
/* 153 */
/***/ (function(module, exports) {

var installedColorSpaces = [],
    undef = function (obj) {
        return typeof obj === 'undefined';
    },
    channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
    percentageChannelRegExp = /\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/,
    alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/,
    cssColorRegExp = new RegExp(
                         '^(rgb|hsl|hsv)a?' +
                         '\\(' +
                             channelRegExp.source + ',' +
                             channelRegExp.source + ',' +
                             channelRegExp.source +
                             '(?:,' + alphaChannelRegExp.source + ')?' +
                         '\\)$', 'i');

function color(obj) {
    if (Array.isArray(obj)) {
        if (typeof obj[0] === 'string' && typeof color[obj[0]] === 'function') {
            // Assumed array from .toJSON()
            return new color[obj[0]](obj.slice(1, obj.length));
        } else if (obj.length === 4) {
            // Assumed 4 element int RGB array from canvas with all channels [0;255]
            return new color.RGB(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255);
        }
    } else if (typeof obj === 'string') {
        var lowerCased = obj.toLowerCase();
        if (color.namedColors[lowerCased]) {
            obj = '#' + color.namedColors[lowerCased];
        }
        if (lowerCased === 'transparent') {
            obj = 'rgba(0,0,0,0)';
        }
        // Test for CSS rgb(....) string
        var matchCssSyntax = obj.match(cssColorRegExp);
        if (matchCssSyntax) {
            var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                alpha = undef(matchCssSyntax[8]) ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                hasHue = colorSpaceName[0] === 'H',
                firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
            if (undef(color[colorSpaceName])) {
                throw new Error('color.' + colorSpaceName + ' is not installed.');
            }
            return new color[colorSpaceName](
                parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                alpha
            );
        }
        // Assume hex syntax
        if (obj.length < 6) {
            // Allow CSS shorthand
            obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
        }
        // Split obj into red, green, and blue components
        var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
        if (hexMatch) {
            return new color.RGB(
                parseInt(hexMatch[1], 16) / 255,
                parseInt(hexMatch[2], 16) / 255,
                parseInt(hexMatch[3], 16) / 255
            );
        }

        // No match so far. Lets try the less likely ones
        if (color.CMYK) {
            var cmykMatch = obj.match(new RegExp(
                             '^cmyk' +
                             '\\(' +
                                 percentageChannelRegExp.source + ',' +
                                 percentageChannelRegExp.source + ',' +
                                 percentageChannelRegExp.source + ',' +
                                 percentageChannelRegExp.source +
                             '\\)$', 'i'));
            if (cmykMatch) {
                return new color.CMYK(
                    parseFloat(cmykMatch[1]) / 100,
                    parseFloat(cmykMatch[2]) / 100,
                    parseFloat(cmykMatch[3]) / 100,
                    parseFloat(cmykMatch[4]) / 100
                );
            }
        }
    } else if (typeof obj === 'object' && obj.isColor) {
        return obj;
    }
    return false;
}

color.namedColors = {};

color.installColorSpace = function (colorSpaceName, propertyNames, config) {
    color[colorSpaceName] = function (a1) { // ...
        var args = Array.isArray(a1) ? a1 : arguments;
        propertyNames.forEach(function (propertyName, i) {
            var propertyValue = args[i];
            if (propertyName === 'alpha') {
                this._alpha = (isNaN(propertyValue) || propertyValue > 1) ? 1 : (propertyValue < 0 ? 0 : propertyValue);
            } else {
                if (isNaN(propertyValue)) {
                    throw new Error('[' + colorSpaceName + ']: Invalid color: (' + propertyNames.join(',') + ')');
                }
                if (propertyName === 'hue') {
                    this._hue = propertyValue < 0 ? propertyValue - Math.floor(propertyValue) : propertyValue % 1;
                } else {
                    this['_' + propertyName] = propertyValue < 0 ? 0 : (propertyValue > 1 ? 1 : propertyValue);
                }
            }
        }, this);
    };
    color[colorSpaceName].propertyNames = propertyNames;

    var prototype = color[colorSpaceName].prototype;

    ['valueOf', 'hex', 'hexa', 'css', 'cssa'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : function () {
            return this.rgb()[methodName]();
        });
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (undef(epsilon)) {
            epsilon = 1e-10;
        }

        otherColor = otherColor[colorSpaceName.toLowerCase()]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this['_' + propertyNames[i]] - otherColor['_' + propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = function () {
        return [colorSpaceName].concat(propertyNames.map(function (propertyName) {
            return this['_' + propertyName];
        }, this));
    };

    for (var propertyName in config) {
        if (config.hasOwnProperty(propertyName)) {
            var matchFromColorSpace = propertyName.match(/^from(.*)$/);
            if (matchFromColorSpace) {
                color[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
            } else {
                prototype[propertyName] = config[propertyName];
            }
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype[colorSpaceName.toLowerCase()] = function () {
        return this;
    };
    prototype.toString = function () {
        return '[' + colorSpaceName + ' ' + propertyNames.map(function (propertyName) {
            return this['_' + propertyName];
        }).join(', ') + ']';
    };

    // Generate getters and setters
    propertyNames.forEach(function (propertyName) {
        var shortName = propertyName === 'black' ? 'k' : propertyName.charAt(0);
        prototype[propertyName] = prototype[shortName] = function (value, isDelta) {
            // Simple getter mode: color.red()
            if (typeof value === 'undefined') {
                return this['_' + propertyName];
            } else if (isDelta) {
                // Adjuster: color.red(+.2, true)
                return new this.constructor(propertyNames.map(function (otherPropertyName) {
                    return this['_' + otherPropertyName] + (propertyName === otherPropertyName ? value : 0);
                }, this));
            } else {
                // Setter: color.red(.2);
                return new this.constructor(propertyNames.map(function (otherPropertyName) {
                    return (propertyName === otherPropertyName) ? value : this['_' + otherPropertyName];
                }, this));
            }
        };
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj[sourceColorSpaceName.toLowerCase()] = function () {
            return this.rgb()[sourceColorSpaceName.toLowerCase()]();
        };
        color[sourceColorSpaceName].propertyNames.forEach(function (propertyName) {
            var shortName = propertyName === 'black' ? 'k' : propertyName.charAt(0);
            obj[propertyName] = obj[shortName] = function (value, isDelta) {
                return this[sourceColorSpaceName.toLowerCase()]()[propertyName](value, isDelta);
            };
        });
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && color[targetColorSpaceName].prototype[prop] === undefined) {
                color[targetColorSpaceName].prototype[prop] = obj[prop];
            }
        }
    }

    installedColorSpaces.forEach(function (otherColorSpaceName) {
        installForeignMethods(colorSpaceName, otherColorSpaceName);
        installForeignMethods(otherColorSpaceName, colorSpaceName);
    });

    installedColorSpaces.push(colorSpaceName);
    return color;
};

color.pluginList = [];

color.use = function (plugin) {
    if (color.pluginList.indexOf(plugin) === -1) {
        this.pluginList.push(plugin);
        plugin(color);
    }
    return color;
};

color.installMethod = function (name, fn) {
    installedColorSpaces.forEach(function (colorSpace) {
        color[colorSpace].prototype[name] = fn;
    });
    return this;
};

color.installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
    hex: function () {
        var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
        return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
    },

    hexa: function () {
        var alphaString = Math.round(this._alpha * 255).toString(16);
        return '#' + '00'.substr(0, 2 - alphaString.length) + alphaString + this.hex().substr(1, 6);
    },

    css: function () {
        return 'rgb(' + Math.round(255 * this._red) + ',' + Math.round(255 * this._green) + ',' + Math.round(255 * this._blue) + ')';
    },

    cssa: function () {
        return 'rgba(' + Math.round(255 * this._red) + ',' + Math.round(255 * this._green) + ',' + Math.round(255 * this._blue) + ',' + this._alpha + ')';
    }
});

module.exports = color;


/***/ }),
/* 154 */
/***/ (function(module, exports) {

module.exports = function clearer(color) {
    color.installMethod('clearer', function (amount) {
        return this.alpha(isNaN(amount) ? -0.1 : -amount, true);
    });
};


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function darken(color) {
    color.use(__webpack_require__(9));

    color.installMethod('darken', function (amount) {
        return this.lightness(isNaN(amount) ? -0.1 : -amount, true);
    });
};


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function desaturate(color) {
    color.use(__webpack_require__(9));

    color.installMethod('desaturate', function (amount) {
        return this.saturation(isNaN(amount) ? -0.1 : -amount, true);
    });
};


/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports = function grayscale(color) {
    function gs () {
        /*jslint strict:false*/
        var rgb = this.rgb(),
            val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;

        return new color.RGB(val, val, val, rgb._alpha);
    }

    color.installMethod('greyscale', gs).installMethod('grayscale', gs);
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function lighten(color) {
    color.use(__webpack_require__(9));

    color.installMethod('lighten', function (amount) {
        return this.lightness(isNaN(amount) ? 0.1 : amount, true);
    });
};


/***/ }),
/* 159 */
/***/ (function(module, exports) {

module.exports = function mix(color) {
    color.installMethod('mix', function (otherColor, weight) {
        otherColor = color(otherColor).rgb();
        weight = 1 - (isNaN(weight) ? 0.5 : weight);

        var w = weight * 2 - 1,
            a = this._alpha - otherColor._alpha,
            weight1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
            weight2 = 1 - weight1,
            rgb = this.rgb();

        return new color.RGB(
            rgb._red * weight1 + otherColor._red * weight2,
            rgb._green * weight1 + otherColor._green * weight2,
            rgb._blue * weight1 + otherColor._blue * weight2,
            rgb._alpha * weight + otherColor._alpha * (1 - weight)
        );
    });
};


/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports = function namedColors(color) {
    color.namedColors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '0ff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000',
        blanchedalmond: 'ffebcd',
        blue: '00f',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '0ff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgrey: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkslategrey: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dimgrey: '696969',
        dodgerblue: '1e90ff',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'f0f',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        grey: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred: 'cd5c5c',
        indigo: '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgray: 'd3d3d3',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslategray: '789',
        lightslategrey: '789',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '0f0',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'f0f',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        rebeccapurple: '639',
        red: 'f00',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        slategrey: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        wheat: 'f5deb3',
        white: 'fff',
        whitesmoke: 'f5f5f5',
        yellow: 'ff0',
        yellowgreen: '9acd32'
    };
};


/***/ }),
/* 161 */
/***/ (function(module, exports) {

module.exports = function negate(color) {
    color.installMethod('negate', function () {
        var rgb = this.rgb();
        return new color.RGB(1 - rgb._red, 1 - rgb._green, 1 - rgb._blue, this._alpha);
    });
};


/***/ }),
/* 162 */
/***/ (function(module, exports) {

module.exports = function opaquer(color) {
    color.installMethod('opaquer', function (amount) {
        return this.alpha(isNaN(amount) ? 0.1 : amount, true);
    });
};


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function rotate(color) {
    color.use(__webpack_require__(9));

    color.installMethod('rotate', function (degrees) {
        return this.hue((degrees || 0) / 360, true);
    });
};


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function saturate(color) {
    color.use(__webpack_require__(9));

    color.installMethod('saturate', function (amount) {
        return this.saturation(isNaN(amount) ? 0.1 : amount, true);
    });
};


/***/ }),
/* 165 */
/***/ (function(module, exports) {

// Adapted from http://gimp.sourcearchive.com/documentation/2.6.6-1ubuntu1/color-to-alpha_8c-source.html
// toAlpha returns a color where the values of the argument have been converted to alpha
module.exports = function toAlpha(color) {
    color.installMethod('toAlpha', function (color) {
        var me = this.rgb(),
            other = color(color).rgb(),
            epsilon = 1e-10,
            a = new color.RGB(0, 0, 0, me._alpha),
            channels = ['_red', '_green', '_blue'];

        channels.forEach(function (channel) {
            if (me[channel] < epsilon) {
                a[channel] = me[channel];
            } else if (me[channel] > other[channel]) {
                a[channel] = (me[channel] - other[channel]) / (1 - other[channel]);
            } else if (me[channel] > other[channel]) {
                a[channel] = (other[channel] - me[channel]) / other[channel];
            } else {
                a[channel] = 0;
            }
        });

        if (a._red > a._green) {
            if (a._red > a._blue) {
                me._alpha = a._red;
            } else {
                me._alpha = a._blue;
            }
        } else if (a._green > a._blue) {
            me._alpha = a._green;
        } else {
            me._alpha = a._blue;
        }

        if (me._alpha < epsilon) {
            return me;
        }

        channels.forEach(function (channel) {
            me[channel] = (me[channel] - other[channel]) / me._alpha + other[channel];
        });
        me._alpha *= a._alpha;

        return me;
    });
};


/***/ }),
/* 166 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(176)(module), __webpack_require__(18)))

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(168);
exports.encode = exports.stringify = __webpack_require__(169);


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(167);
var util = __webpack_require__(172);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(170);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 173 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 174 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(174);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(173);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18), __webpack_require__(166)))

/***/ }),
/* 176 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let gridHelperView = __webpack_require__(52);
let search = __webpack_require__(49);
let blinkView = __webpack_require__(51);
let {
    getBoundRect
} = __webpack_require__(10);

let lightupSearch = (parent, gridScope, topNode) => {
    gridScope = gridScope || wndsize();
    let hintGrid = gridHelperView({
        gridScope
    });
    parent.appendChild(hintGrid);

    return (rule) => {
        hintGrid.ctx.update('position', rule.position);
        let nodes = search(topNode, rule, {
            gridScope
        });

        // light up chosen nodes
        nodes.map((node) => {
            let bv = blinkView(getBoundRect(node));
            parent.appendChild(bv);

            // bink a while in the node's face
            setTimeout(() => {
                parent.removeChild(bv);
            }, 2000);
        });

        return nodes;
    };
};

function wndsize() {
    var w = 0;
    var h = 0;
    //IE
    if (!window.innerWidth) {
        if (!(document.documentElement.clientWidth === 0)) {
            //strict mode
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        } else {
            //quirks mode
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        }
    } else {
        //w3c
        w = window.innerWidth;
        h = window.innerHeight;
    }
    return {
        width: w,
        height: h,
        x: 0,
        y: 0
    };
}

module.exports = {
    lightupSearch
};


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * UI assertion, a simple UI DSL, used to describe the restraint of some UI elements
 *
 * after description a ui element, we can try to search in the page to find some elements which conform to these descriptions.
 */

let udView = __webpack_require__(191);

let search = __webpack_require__(49);

let searchIn = __webpack_require__(50);

let gridHelperView = __webpack_require__(52);

let blinkView = __webpack_require__(51);

let debugTooler = __webpack_require__(177);

let {
    match,
    collectMatchInfos
} = __webpack_require__(44);

let {
    getBoundRect, ImageInnerNode, getFontSize, getColor
} = __webpack_require__(10);

module.exports = {
    udView,
    search,
    gridHelperView,
    blinkView,

    getBoundRect,
    getFontSize,
    getColor,
    ImageInnerNode,

    debugTooler,
    searchIn,

    match,
    collectMatchInfos
};


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * ## test
 *
 * [
 *  [[
 *      {left: 60, right: 74, top: 797, bottom: 859, height: 32, width: 14},
 *      [[85, 27], [[4, 24], [5, 25]]],
 *      {height: 874, width: 1200, x: 0, y: 0}],
 *  true]
 * ]
 */
let inside = ({
    left, top, right, bottom
}, position, gridScope) => {
    gridScope = gridScope || wndsize();

    let [grid, area] = position;
    let [leftGrid, topGrid] = area[0];
    let [rightGrid, bottomGrid] = area[1];
    let leftTopCoord = getGridCoord(gridScope, grid, [leftGrid, topGrid]);
    let rightBottomCoord = getGridCoord(gridScope, grid, [rightGrid + 1, bottomGrid + 1]);

    return insideBox([left, top], leftTopCoord, rightBottomCoord) && insideBox([right, bottom], leftTopCoord, rightBottomCoord);
};

let insideBox = ([x, y], [l, t], [r, b]) => {
    return x >= l && y >= t && x <= r && y <= b;
};

/**
 * ## test
 * [
 *    [[{width:1200,height:874,x:0,y:0}, [85, 27], [5 + 1, 25 + 1]], [84.70588235294117,841.6296296296297]]
 * ]
 */
let getGridCoord = (scope, [m, n], [t, r]) => {
    return [
        (scope.width / m) * t + scope.x, (scope.height / n) * r + scope.y
    ];
};

function wndsize() {
    var w = 0;
    var h = 0;
    //IE
    if (!window.innerWidth) {
        if (!(document.documentElement.clientWidth === 0)) {
            //strict mode
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        } else {
            //quirks mode
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        }
    } else {
        //w3c
        w = window.innerWidth;
        h = window.innerHeight;
    }
    return {
        width: w,
        height: h,
        x: 0,
        y: 0
    };
}

module.exports = inside;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let contentExtractorMap = __webpack_require__(185);

let patternMap = __webpack_require__(47);

let match = (content, rule) => {
    if (rule.active === false) return true;

    // extract content from node
    if (content === undefined) return false;

    let pattern = getPattern(rule);

    let patternWay = getPatternWay(rule);

    return patternWay(pattern, content);
};

let getContent = (node, {
    extractorType
}) => {
    let extractor = contentExtractorMap[extractorType];
    if (!extractor) {
        throw new Error(`missing content extractor ${extractorType}`);
    }

    // extract content from node
    return extractor(node);
};

let getPatternWay = ({
    patternType
}) => {
    let patternWay = patternMap[patternType];
    if (!patternWay) {
        throw new Error(`missing pattern ${patternType} in content matching`);
    }

    return patternWay;
};

let getPattern = (rule) => rule.pattern;

module.exports = {
    match,
    getContent
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let styleExtractorMap = __webpack_require__(189);

let patternMap = __webpack_require__(47);

let onecolor = __webpack_require__(17);

let {
    pxToInt
} = __webpack_require__(10);

let match = (content, rule) => {
    if (rule.active === false) return true;

    if (content === undefined || content === null) return false; // using undefined as the fail situation

    let pattern = getPattern(rule);
    if(pattern === undefined) return false;

    let patternWay = getPatternWay(rule);


    return patternWay(pattern, content);
};

let getPatternWay = ({
    patternType
}) => {
    let patternWay = patternMap[patternType];
    if (!patternWay) {
        throw new Error(`missing pattern ${patternType} in style matching.`);
    }

    return patternWay;
};

let getContent = (node, {
    extractorType
}) => {
    let extractor = styleExtractorMap[extractorType];
    if (!extractor) {
        throw new Error(`missing style extractor ${extractorType}.`);
    }

    return extractor(node);
};

let getPattern = ({
    extractorType, pattern
}) => {
    if (extractorType === 'background-color' || extractorType === 'color') {
        let color = onecolor(pattern);
        if (!color) {
            return undefined;
        }
        pattern = color.cssa();
    } else if (extractorType === 'font-size') {
        pattern = pxToInt(pattern);
    }

    return pattern;
};

module.exports = {
    match,
    getContent
};


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let urlPatterns = __webpack_require__(48);
let colorSimilarityPattern = __webpack_require__(46);
let aroundPercentPattern = __webpack_require__(45);

module.exports = {
    contentPatternMap: {
        'textContent': ['contain', 'equal', 'regExp', 'trimEqual'],
        'imgUrl': ['contain', 'equal', 'regExp', 'trimEqual'].concat(Object.keys(urlPatterns)),
        'inputValue': ['contain', 'equal', 'regExp', 'trimEqual'],
        'containImgUrl': ['contain', 'regExp', 'equal', 'trimEqual'],
        'placeholder': ['contain', 'equal', 'regExp', 'trimEqual'],
        'textLength': ['>=', '<=', '>', '<', '=']
    },

    stylePatternMap: {
        'background-color': ['equal'].concat(Object.keys(colorSimilarityPattern)),
        'font-size': ['equal'].concat(Object.keys(aroundPercentPattern)),
        'color': ['equal'].concat(Object.keys(colorSimilarityPattern))
    }
};


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(2);

// TODO inside or not
module.exports = (node) => {
    if (node.nodeType === 'imageInnerNode') {
        return node.getImageUrl();
    }
    let urls = getImgUrlsIncludeChildren(node);
    if (!urls.length) return null;
    return urls.join('\n');
};

let getImgUrlsIncludeChildren = (node) => {
    let imgUrls = [];
    let url = getImgUrl(node);
    if (url) {
        imgUrls.push(url);
    }

    return reduce(node.childNodes, (prev, child) => {
        return prev.concat(getImgUrlsIncludeChildren(child));
    }, imgUrls);
};

let getImgUrl = (node) => {
    if (node.tagName && node.tagName.toLowerCase() === 'img') {
        return node.getAttribute('src');
    }
};


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (node) => {
    if (node.nodeType === 'imageInnerNode') {
        return node.getImageUrl();
    }

    return getImgUrl(node);
};

let getImgUrl = (node) => {
    if (node.tagName && node.tagName.toLowerCase() === 'img') {
        return node.getAttribute('src');
    }
};


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let textContent = __webpack_require__(187);
let containImgUrl = __webpack_require__(183);
let imgUrl = __webpack_require__(184);
let inputValue = __webpack_require__(186);
let {
    isString
} = __webpack_require__(0);

let getAttributeAsContent = (type) => (node) => {
    return node.getAttribute(type);
};

let getPlaceholder = getAttributeAsContent('placeholder');

let placeholder = (node) => {
    let nodeName = node.nodeName && node.nodeName.toLowerCase();
    if (nodeName !== 'input' && nodeName !== 'textarea') {
        return undefined; // using undefined as the fail situation
    }

    return getPlaceholder(node) || '';
};

let textLength = (node) => {
    let text = node && node.textContent;
    if (isString(text)) {
        return text.length;
    } else {
        return 0;
    }
};

module.exports = {
    textContent,
    containImgUrl,
    imgUrl,
    placeholder,
    inputValue,
    textLength
};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (node) => {
    let tagName = node.nodeName && node.nodeName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
        return node.value;
    }
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (node) => {
    return node.textContent;
};


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    '>=': (pattern, content) => Number(content) >= Number(pattern),
    '<=': (pattern, content) => Number(content) <= Number(pattern),
    '>': (pattern, content) => Number(content) > Number(pattern),
    '<': (pattern, content) => Number(content) < Number(pattern),
    '=': (pattern, content) => Number(content) === Number(pattern)
};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let onecolor = __webpack_require__(17);

let {
    getFontSize, getColor, pxToInt
} = __webpack_require__(10);

let getStyle = (styleName) => (node) => {
    if ((node.nodeType === 1 || node.nodeType === 3) && styleName === 'font-size') {
        return pxToInt(getFontSize(node));
    }
    if ((node.nodeType === 1 || node.nodeType === 3) && styleName === 'color') {
        return onecolor(getColor(node)).cssa();
    }

    if (node.nodeType !== 1) return null;

    let ret = window.getComputedStyle(node).getPropertyValue(styleName);
    if (styleName === 'background-color') {
        ret = onecolor(ret).cssa();
    }
    return ret;
};

module.exports = {
    'background-color': getStyle('background-color'),
    'font-size': getStyle('font-size'),
    'color': getStyle('color')
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce, filter
} = __webpack_require__(2);

let {
    ImageInnerNode
} = __webpack_require__(10);

let expandNodes = (nodes) => {
    nodes = reduce(nodes, (prev, node) => {
        // append text node
        prev = prev.concat(filter(node.childNodes, (childNode) => {
            return childNode.nodeType === 3;
        }));

        return prev;
    }, Array.prototype.slice.call(nodes));

    let ret = reduce(nodes, (prev, node) => {
        if (node.nodeName.toLowerCase() === 'img') {
            prev.push(new ImageInnerNode(node));
        }

        return prev;
    }, nodes);

    return ret;
};

module.exports = expandNodes;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * view used to describe a UI
 * step1: describe the position of element
 *
 * step2: describe the content of element
 *
 * step3: describe the style of element
 *
 * step4: describe inner UI elements
 *
 * eg: There exists a ui element,
            in area (0, 0) in m X n grid,
            contain content 'test',
            has border,
            background color is white.

 *
 *
 * TODO consider inner UI elements or related elements?
 */

let {
    view, n, N
} = __webpack_require__(1);
let {
    meta, method, RealLetaUI
} = __webpack_require__(118);

let SimpleForm = __webpack_require__(116);
let SimpleList = __webpack_require__(117);
let PassPredicateUI = __webpack_require__(115);

let AreaChosen = __webpack_require__(192);
let ExtractorPatternViewer = __webpack_require__(193);
let {
    contentPatternMap, stylePatternMap
} = __webpack_require__(182);

let completeData = (data) => {
    data.position = data.position || [
        [3, 3],
        [
            [0, 0],
            [0, 0]
        ]
    ];

    data.contentExtractorPatternsMap = data.contentExtractorPatternsMap || contentPatternMap;

    data.styleExtractorPatternsMap = data.styleExtractorPatternsMap || stylePatternMap;

    data.content = data.content || [];
    data.style = data.style || [];
};

module.exports = view((data) => {
    completeData(data);

    let describeUI = method('describeUI'),

        describePosition = method('position.describePosition'),

        describeContent = method('describeContent'),
        describeStyle = method('describeStyle');

    let {
        lang = id, contentExtractorPatternsMap, styleExtractorPatternsMap
    } = data;

    let defContentKey = Object.keys(contentExtractorPatternsMap)[0];
    let defaultContentItem = {
        extractorType: defContentKey,
        patternType: contentExtractorPatternsMap[defContentKey][0],
        pattern: '',
        active: true
    };

    let defStyleContentKey = Object.keys(styleExtractorPatternsMap)[0];
    let defaultStyleItem = {
        extractorType: defStyleContentKey,
        patternType: styleExtractorPatternsMap[defStyleContentKey][0],
        pattern: '',
        active: true
    };

    let ContentView = ExtractorPatternViewer({
        lang,
        extractorPatternsMap: contentExtractorPatternsMap
    });

    let StyleView = ExtractorPatternViewer({
        lang,
        extractorPatternsMap: styleExtractorPatternsMap
    });

    let letaUI = RealLetaUI(
        describeUI(
            describePosition(data.position),
            describeContent(data.content),
            describeStyle(data.style)
        ),

        {
            predicates: {
                describeUI: meta((position, content, style) => {
                    data.onchange && data.onchange({
                        position,
                        content,
                        style
                    });
                }, {
                    viewer: SimpleForm,
                    inline: false,
                    title: lang('describe a UI element')
                }),

                position: {
                    describePosition: meta((position) => {
                        return position;
                    }, {
                        viewer: N('div', [
                            n('h3', lang('position')),
                            N('div style="padding:8px"', [PassPredicateUI])
                        ]),
                        args: [{
                            viewer: AreaChosen
                        }]
                    }),
                },

                describeContent: meta((content) => {
                    return content;
                }, {
                    viewer: N('div', [
                        n('h3', lang('content')),
                        PassPredicateUI
                    ]),
                    args: [{
                        viewer: SimpleList,
                        itemRender: ContentView,
                        defaultItem: defaultContentItem
                    }]
                }),

                describeStyle: meta((style) => {
                    return style;
                }, {
                    viewer: N('div', [
                        n('h3', lang('style')),
                        PassPredicateUI
                    ]),
                    args: [{
                        viewer: SimpleList,
                        itemRender: StyleView,
                        defaultItem: defaultStyleItem
                    }]
                }),
                // TODO other like tag name, attribute values
            }
        });

    return n('div', [
        letaUI
    ]);
});

const id = v => v;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, view
} = __webpack_require__(1);

let isItemChosen = (i, j, lt, rb) => {
    if (!lt || !rb) return false;
    let [x1, y1] = lt, [x2, y2] = rb;
    return (x1 <= i && i <= x2) && (y1 <= j && j <= y2);
};

let connectArea = (point1, point2) => {
    if (!point2) return [
        point1,
        point1
    ];

    return [
        [
            Math.min(point1[0], point2[0]),
            Math.min(point1[1], point2[1]),
        ],
        [
            Math.max(point1[0], point2[0]),
            Math.max(point1[1], point2[1]),
        ]
    ];
};

let GridView = view((data, {
    update
}) => {
    let width = data.width || 150,
        height = data.height || 240;

    let chosenPoint1 = null,
        chosenPoint2 = null;

    return () => {
        let {
            grid,
            area,
            onchange
        } = data;

        let [horizontalGrid, verticalGrid] = grid;

        let unitWidth = width / horizontalGrid,
            unitHeight = height / verticalGrid;

        let grids = [];
        for (let i = 0; i < horizontalGrid; i++) {
            for (let j = 0; j < verticalGrid; j++) {
                let bgcolor = isItemChosen(i, j, area[0], area[1]) ? 'green' : null;

                grids.push(n('div', {
                    style: {
                        width: unitWidth,
                        height: unitHeight,
                        borderLeft: i > 0 ? 0 : '1px solid gray',
                        borderRight: '1px solid gray',
                        borderTop: j > 0 ? 0 : '1px solid gray',
                        borderBottom: '1px solid gray',
                        position: 'absolute',
                        left: unitWidth * i,
                        top: unitHeight * j,
                        backgroundColor: bgcolor,
                        boxSizing: 'border-box'
                    },

                    onclick: () => {
                        if (!chosenPoint1 || chosenPoint2) {
                            area[0] = null;
                            area[1] = null;
                            chosenPoint1 = [i, j];
                            let newArea = connectArea(chosenPoint1, chosenPoint2);
                            onchange && onchange(newArea);
                            update('area', newArea);
                        } else {
                            chosenPoint2 = [i, j];
                            let newArea = connectArea(chosenPoint1, chosenPoint2);
                            onchange && onchange(newArea);
                            update('area', newArea);
                            chosenPoint1 = null;
                            chosenPoint2 = null;
                        }
                    }
                }));
            }
        }

        // draw a n * m grids
        return n('div', [
            n('div', {
                style: {
                    boxSizing: 'border-box',
                    width,
                    height,
                    position: 'relative'
                }
            }, [
                grids
            ]),

            area[0] && n('span', {
                style: {
                    color: 'gray',
                    fontSize: 12,
                    padding: 5
                }
            }, `(${area[0][0]}, ${area[0][1]}) - (${area[1][0]}, ${area[1][1]})`)
        ]);
    };
});

let PositionView = view(({
    value, onchange
}, {
    update
}) => {
    let grid = value.value[0];
    // TODO why without div wrapper, won't update in the gridview
    return n('div', [
        n('label', 'grid'),

        n(`input type=number value=${grid[0]}`, {
            style: {
                width: 100,
                minWidth: 100,
                marginRight: 10
            },
            oninput: (e) => {
                let m = Number(e.target.value);
                if (m !== grid[0]) {
                    grid[0] = m;
                    value.value[1] = [
                        [0, 0],
                        [0, 0]
                    ];
                    update();
                    onchange && onchange(value);
                }
            }
        }),
        n(`input type=number value=${grid[1]}`, {
            style: {
                width: 100,
                minWidth: 100
            },

            oninput: (e) => {
                let n = Number(e.target.value);
                if (n !== grid[1]) {
                    grid[1] = n;
                    value.value[1] = [
                        [0, 0],
                        [0, 0]
                    ];
                    update();
                    onchange && onchange(value);
                }
            }
        }),

        n('br'),
        n('br'),

        GridView({
            area: value.value[1],
            grid,
            onchange: (newArea) => {
                value.value[1] = newArea;
                onchange && onchange(value);
            }
        })
    ]);
});

/**
 * chosen a area from n * m view
 *
 * area: [leftTopCoord, rightBottomCoord]
 *
 * coord: [x, y]
 */
module.exports = ({
    value,
    onchange
}, {
    grid
}) => {
    return PositionView({
        value, onchange, grid
    });
};


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view, n
} = __webpack_require__(1);

let {
    map
} = __webpack_require__(2);

let Select = __webpack_require__(33);

/**
 * content description
 *
 * 1. content extractor
 *
 * 2. pattern matching
 *
 *
 * extractor type -> pattern types
 * pattern type -> pattern
 *
 * user action
 *
 * 1. select extractor type, like text Content, like image url
 * 2. select pattern type, like equal, regular expression
 * 3. input pattern content
 *
 * data = {
 *     value,
 *     onchange,
 *     lang,
 *     extractorPatternsMap,
 *     patternInputMap
 * }
 *
 * value = {
 *   extractorType,
 *   patternType,
 *   pattern
 * };
 *
 * extratorPatternsMap = {
 *   [extractor type]: [pattern type]
 * }
 */

module.exports = ({
    lang,
    extractorPatternsMap
}) => {
    let options = map(extractorPatternsMap, (_, key) => [key, lang(key)]);

    return view((data, {
        update
    }) => {
        let defExtractorType = options[0][0];
        data.value = data.value || {
            extractorType: defExtractorType,
            patternType: extractorPatternsMap[defExtractorType][0],
            pattern: '',
            active: true
        };

        return n('div style="display: inline-block;padding-left: 10px;"', [
            n(`input type="checkbox" ${data.value.active? 'checked="checked"': ''}`, {
                onclick: () => {
                    update('value.active', !data.value.active);
                    data.onchange && data.onchange(data.value);
                }
            }),

            // select extractor
            Select({
                selected: data.value.extractorType,
                options,
                onchange: (v) => {
                    data.value = {
                        extractorType: v,
                        patternType: extractorPatternsMap[v][0],
                        pattern: '',
                        active: true
                    };
                    data.onchange && data.onchange(data.value);
                    update();
                }
            }),

            // select pattern type
            Select({
                options: map(extractorPatternsMap[data.value.extractorType], (v) => [v, lang(v)]),
                selected: data.value.patternType,
                onchange: (v) => {
                    data.value.pattern = '';
                    data.value.patternType = v;
                    data.onchange && data.onchange(data.value);
                    update();
                }
            }),

            // write simple pattern
            n(`input type="text" value="${data.value.pattern}"`, {
                oninput: (e) => {
                    data.value.pattern = e.target.value;
                    data.onchange && data.onchange(data.value);
                }
            })
        ]);
    });
};


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    search
} = __webpack_require__(54);

let assert = __webpack_require__(55);

let {
    n, mount
} = __webpack_require__(1);

mount(n('div', {
    style: {
        width: 300,
        height: 300,
        position: 'fixed',
        left: 0,
        top: 0
    }
}, [
    n('div', {
        style: {
            position: 'fixed',
            left: 0,
            top: 0,
            width: 120,
            height: 120,
            fontSize: 5,
            textAlign: 'left'
        }
    }, '1234'),
    n('span', 'ok!')
]), document.body);

let content = [{
    active: true,
    extractorType: 'textContent',
    pattern: '1234',
    patternType: 'contain'
}];

let nodes = document.body.querySelectorAll('*');

let gridScope = {
    x: 0,
    y: 0,
    width: 300,
    height: 300
};

assert.equal(search(nodes, {
    position: [
        [3, 3],
        [
            [2, 2],
            [2, 2]
        ]
    ],
    content,
    style: []
}, {
    gridScope
}).length, 0);

assert(search(nodes, {
    position: [
        [3, 3],
        [
            [0, 0],
            [1, 1]
        ]
    ],
    content,
    style: []
}, {
    gridScope
}).length > 1);

assert.equal(search(nodes, {
    position: [
        [3, 3],
        [
            [0, 0],
            [0, 0]
        ]
    ],
    content,
    style: []
}, {
    gridScope
}).length, 1);


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(53);


/***/ })
/******/ ]);