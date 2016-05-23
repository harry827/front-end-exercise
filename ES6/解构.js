/*
 解构 Destructuring
 */

// 什么是解构赋值：解构赋值允许你类似数组或字面量的语法将数组和对象的属性赋给各种变量
// 比如：原来访问数组的值是这样的：
var arr = [1, 2];
var first = arr[0];
var second = arr[1];
// 使用解构赋值的特性:
var [first,second] = arr;

//数组与迭代器的解构:
// 像上面数组的例子，用变量(var)来描述，实际上并不恰当，因为你可能会对任意的嵌套格式数组进行解构，比如：
var [foo, [[bar], baz]] = [1, [[2], 3]];
console.log(foo);
console.log(bar);
console.log(baz);
// 可以在对应位留空来跳过被解构数组中的某些元素:
var [,,third] = ["foo", "bar", "baz"];
// 还可以使用“不定参数”捕获数组中后面的元素：
var [head, ...tail] = [1, 2, 3, 4];
console.log(tail); // [2, 3, 4]

// 当访问空数组或越界访问数组时,对其解构与对其索引的行为一致,最终得到的结果都是:undefined。
var array = [];
console.log(array[1]); // 越界访问 --> undefined
var [missing] = array;
console.log(missing); // 访问空数组 --> undefined

// 数组解构赋值的模式同样适用于任意迭代器:
function* fun() {
    var a = 0;
    var b = 1;

    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

var [first, second, third, fourth, fifth, sixth, seven] = fun();
console.log(sixth);// 5

// 对象的解构：
console.log(' 对象的解构：')
var obj = {name: 1};
var obj1 = {name: 2};
var { name: a } = obj;
var { name: b } = obj1;
console.log(a);// "Bender"
console.log(b);// "Flexo"

// 当属性名与变量名一致时,可以通过一种实用的句法简写:
var { foo, bar } = {foo: "lorem", bar: "ipsum"};
console.log(foo);
console.log(bar);

// 与数组解构一样,你可以随意嵌套并进一步组合对象解构:
var complicatedObj = {
    arrayProp: [
        "Zapp",
        {second: "Brannigan"}
    ]
};
var { arrayProp: [first, { second }] } = complicatedObj;
console.log(first);
console.log(second);

//当解构一个未定义的属性时,得到的值为 undefined:
var { missing } = {};
console.log(missing);

//请注意：解构对象并赋值给变量时,如果已经声明或不打算声明这些变量(即赋值语句前没有 let、const 或 var 关键字),
// 你应该注意这样一个潜在的语法错误:

try {
    //{ blowUp } = { blowUp: 10 }; // SyntaxError 语法错误
} catch (e) {
    console.log(e);
}

// 为什么会出错?
// 这是因为 JavaScript 语法通知解析引擎将任何以{开始的语句解析 为一个块语句(例如,{console}是一个合法块语句)。
// 解决方案是将整个表达式用一对 小括号包裹:
({ safe } = {safe: 'true'});
console.log(safe);

// 解构值不是对象、数组或迭代器:

// 当你尝试解构 null 或 undefined 时,你会得到一个类型错误:

try {
    var {blowUp} = null;
} catch (e) {
    console.log(e);
}

// 但是，可以解构其它原始类型,例如:布尔值、数值、字符串,但是你将得到 undefined:
var {wtf} = NaN;
console.log(wtf);

// 结论： 当使用 对象赋值模式时,被解构的值需要被强制转换为对象
// 大多数类型都可以被转换为对象, 但 null 和 undefined 却无法进行转换。
// 当使用数组赋值模式时,被解构的值一定要包含一个迭代器。


/*
 默认值
 */
// 当你要解构的属性未定义时你可以提供一个默认值:
var [missing = true] = [];
console.log(missing);
var { message: msg = "Something went wrong" } = {};
console.log(msg);
var { x = 3 } = {};
console.log(x);

/*
 解构的实际应用
 */
// 1、函数参数定义
// 为了避免使用者必须记住参数顺序的问题，可以使用对象作为参数，在方法中直接使用，比如：
function removeBreakpoint({ url, line, column }) {
    console.log(url);
}
removeBreakpoint({url: '../test'});

// 2、配置对象参数
// 需要解构的对象属性赋予默认值,避免对配置对象的每个属性都重复编写 var foo = config.foo || theDefaultFoo;。比如：
var $ = {};
$.ajax = function (url, {
    async = true,
    beforeSend = 'noop',
    cache = true,
    complete = 'noop',
    crossDomain = false,
    global = true,
    // 等等
    }) {
}

// 3、与 ES6 迭代器协议协同使用
/*var map = new Set([0, 2]);
 for (var [key, value] of map) {
 console.log(key + " is " + value);
 }*/
var map = new Map();
map.set("a", "111111111");
map.set("b", "222222222");
for (var [key, value] of map) {
    console.log(key + " is " + value);
}
//只遍历键:
for (var [key] of map) {
    console.log('key:' + key);
}
//或只遍历值:
for (var [,value] of map) {
    console.log('value:' + value);
}

// 4、多重返回值
// 你可以返回一个数组将其解构：
function returnMultipleValues() {
    return [1, 2];
}
var [foo, bar] = returnMultipleValues();

//或者可以用一个对象作为容器并为返回值命名:
function returnMultipleValues() {
    return {
        foo: 1,
        bar: 2
    };
}
var { foo, bar } = returnMultipleValues();

// 5、使用解构导入部分 CommonJS 模块:
const { SourceMapConsumer, SourceNode } = require("source-map");
