/*
 代理 Proxies
 */
// demo:
var obj = new Proxy({}, {
    get: function (target, key, receiver) {
        console.log(`getting ${key}`);
        return Reflect.get(target, key, receiver);
    },
    set: function (target, key, receiver) {
        console.log(`setting ${key}`);
        return Reflect.set(target, key, receiver);
    }
});
obj.count = 1;
obj.count++;

//适用于所有对象的通用接口:
// 1、obj.[[Get]](key, receiver) —— 获取属性值
//  当 JS 代码执行以下方法时被调用:obj.prop 或 obj[key]。
//  obj 是当前被搜索的对象,receiver 是我们首先开始搜索这个属性的对象。
//  有时我们必须要搜索几个对象,obj 可能是一个在 receiver 原型链上的对象。
// 2、obj.[[Set]](key, value, receiver) —— 为对象的属性赋值。
//  当 JS 代码执行以下方法时被调用:obj.prop = value 或 obj[key] = value。
//  执行类似 obj.prop += 2 这样的赋值语句时,首先调用[[Get]]方法,然后调用[[Set]]方法。对于++和--操作符来说亦是如此。
// 3、obj.[HasProperty] —— 检测对象中是否存在某属性。
//  当 JS 代码执行以下方法时被调用:key in obj。
// 4、obj.[Enumerate] ——列举对象的可枚举属性。
//  当 JS 代码执行以下方法时被调用:for (key in obj) ...
//  这个内部方法会返回一个可迭代对象,for-in 循环可通过这个方法得到对象属性的名称。
// 5、obj.[GetPrototypeOf] —— 返回对象的原型。
//  当 JS 代码执行以下方法时被调用:obj.[__proto__]或Object.getPrototypeOf(obj)。
// 6、functionObj.[[Call]](thisValue, arguments) —— 调用一个函数。
//  当 JS 代码执行以下方法时被调用:functionObj()或 x.method()。可选的。不是每一个对象都是函数。
// 7、constructorObj.[[Construct]](arguments, newTarget) —— 调用一个构造函数。
//  当 JS 代码执行以下方法时被调用:举个例子,new Date(2890, 6, 2)。 可选的。不是每一个对象都是构造函数。


/*
 ES6 规范定义了一个全新的全局构造函数:代理(Proxy)
 它可以接受两个参数: 目标对象(target)与句柄对象(handler)。
 */
// 比如：
var target = {}, handler = {};
var proxy = new Proxy(target, handler);

// 代理的行为很简单:将代理的所有内部方法转发至目标。简单来说,如果调用 proxy.[[Enumerate]](),
// 就会返回 target.[[Enumerate]]()。
// 比如触发一个 proxy.[[Set]]()的语句：
proxy.color = "pink";
// 上面proxy.[[Set]]()应该调用 target.[[Set]]()方法,然 后在目标上创建一个新的属性。
console.log(target.color); // pink

// 注意：proxy !== target
// 有时也有目标能够通过 类型检测而代理无法通过的情况发生,举个例子,如果代理的目标是一个 DOM 元素,
// 相应的代理就不是,此时类似 document.body.appendChild(proxy)的操作会触发类型错误(TypeError)。

/*
 代理句柄:
 句柄对象的方法可以覆写任意代理的内部方法。
 */
// 比如：
var target = {};
var handler = {
    set: function (target, key, value, receiver) {
        throw new Error("请不要为这个对象设置属性。");
    }
};
var proxy = new Proxy(target, handler);
//proxy.name = "harry";  // throw new Error("请不要为这个对象设置属性。");

/*
 demo1:“不可能实现的”自动填充对象
 */
console.log('Tree:-----------------------');
function Tree() {

    var handler = {
        get: function (target, key, receiver) {
            if (!(key in target)) {
                target[key] = Tree(); // 自动创建一个子树 }
            }
            return Reflect.get(target, key, receiver);
        }
    };

    return new Proxy({}, handler);
}
// 这样实现了一个很神奇的功能：
var tree = Tree();
console.log(tree);
tree.branch1.branch2.twig = "green";
console.log(tree);
tree.branch1.branch3.twig = "yellow";
console.log(tree);

/*
 demo2:创建只读视图
 */
function NOPE() {
    throw new Error("can't modify read-only view");
}
var handler = {
// 覆写所有五种可变方法。 set: NOPE, defineProperty: NOPE,
    set: NOPE,
    defineProperty: NOPE,
    deleteProperty: NOPE,
    preventExtensions: NOPE,
    setPrototypeOf: NOPE,
    get: function (target, key, receiver) {
        // 从执行默认行为开始。
        var result = Reflect.get(target, key, receiver); // 确保返回一个不可变对象!
        if (Object(result) === result) {
            // result 是一个对象。
            return readOnlyView(result);
        }
        // result 是一个原始原始类型,所以已经具备不可变的性质。
        return result;
    },
};
function readOnlyView(target) {
    return new Proxy(target, handler);
}

var newMath = readOnlyView(Math);
console.log(newMath.min(54, 40)); //40 
newMath.max = function () {  // throw new Error("can't modify read-only view");
};

