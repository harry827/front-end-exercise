/*
 Symbols: JavaScript 的第七种原始类型
 */

// 1997 年 JavaScript 首次被标准化,那时只有六种原始类型:
// Undefined 未定义
// Null 空值
// Boolean 布尔类型 true/false
// Number 数字类型 1, 21, -10, NaN(Not a Number) ...
// String 字符串类型  ...
// Object 对象类型  对象类型值的集合是无限的

// 在ES6中symbol也是值，不是上面的任何一种，而是一种全新的 —— 第七种类型的原始值
// symbol 是程序创建并且可以用作属性键的值,并且它能避免命名冲突的风险。

var obj = {};
var symbol1 = Symbol();
obj[symbol1] = 'one';
var symbol2 = Symbol();
obj[symbol2] = 'two';
console.log(obj[symbol1]);
console.log(obj[symbol2]);

// 还可以这样：
var symbol3 = Symbol('this is three');
obj[symbol3] = 'three';
console.log(obj[symbol3]);
// Symbol("this is three")中的 "this is three" 被称作描述。你可以通过 console.log()将它 打印出来,
// 对调试非常有帮助;你也可以用.toString()方法将它转换为字符串呈现; 它也可以被用在错误信息中
console.log(symbol3);
console.log(symbol3.toString());

// 同时也可以查看属性是否存在:if (symbol in obj),也可以删除属性:delete obj[symbol]

/*
 注：在javascript中最常见的检查的特性会忽略symbol键，例如,for-in 循环只会遍历对象的字符串键,symbol 键直接跳过,
 Object.keys(obj)和 Object.getOwnPropertyNames(obj)也是一样。
 但是 symbols 也不 完全是私有的:用新的 APIObject.getOwnPropertySymbols(obj)就可以列出对象的 symbol 键。
 另一个新的 API,Reflect.ownKeys(obj),会同时返回字符串键和 symbol 键。
 */

console.log(typeof Symbol()); // symbol

// symbol 被创建后就不可变更,你不能为它设置属性
//"use strict";

symbol1['a'] = 'test';
console.log(symbol1['a']);

// 关于 symbol 的忠告:symbol 不能被自动转换为字符串,这和语言中的其它类型不同。
// 尝试拼接 symbol 与字符串将得到 TypeError 错误。
var sym = Symbol("<3");
try {
    "your symbol is " + sym;
} catch (e) {
    console.log(e);
}

try {
    console.log(`your symbol is ${sym}`);
} catch (e) {
    console.log(e);
}


/*
 获取symbol的三种方法：
 */
// 1、调用 Symbol()。正如我们上文中所讨论的,这种方式每次调用都会返回一个新的 唯一 symbol。
// 2、调用 Symbol.for(string)。这种方式会访问 symbol 注册表,其中存储了已经存在 的一系列 symbol。
// 这种方式与通过 Symbol()定义的独立 symbol 不同,symbol 注册表 中的 symbol 是共享的。
// 如果你连续三十次调用 Symbol.for("cat"),每次都会返回相 同的 symbol。
// 注册表非常有用,在多个 web 页面或同一个 web 页面的多个模块中经常 需要共享一个 symbol。

console.log('----------------');
console.log(Symbol.for('equal') == Symbol.for('equal')); // true
console.log(Symbol('equal') == Symbol('equal'));         // false
console.log('----------------');

//使用标准定义的 symbol,例如:Symbol.iterator。标准根据一些特殊用途定义了少许的几个 symbol。
// 比如：实现一个迭代器

/*
 ES6 中还有其它几处使用了 symbol 的地方:
 */
// 1、使 instanceof 可扩展。在 ES6 中,表达式 object instanceof constructor 被指定为构造函数的一个方法:
// constructor[Symbol.hasInstance](object)。这意味着它是可扩展的。

// 2、消除新特性和旧代码之间的冲突。这一点非常复杂,但是我们发现,添加某些 ES6 数组方法会破坏现有的 Web 网站。
// 其它 Web 标准有相同的问题:向浏览器中添加新方 法会破坏原有的网站。然而,破坏问题主要由动态作用域引起,所以
// ES6 引入一个特 殊的 symbol——Symbol.unscopables,Web 标准可以用这个 symbol 来阻止某些方法别加入到动态作用域中。

// 3、支持新的字符串匹配类型。在 ES5 中,str.match(myObject)会尝试将 myObject 转换 为正则表达式对象(RegExp)。
// 在 ES6 中,它会首先检查 myObject 是否有一个 myObject[Symbol.match](str)方法。
// 现在的库可以提供自定义的字符串解析类,所有支 持 RegExp 对象的环境都可以正常运行。