/*
 * 生成器 Generators
 * */

/*
 生成器函数:
 与普通函数的区别：
 1、普通函数使用 function 声明,而生成器函数使用 function*声明
 2、在生成器函数内部,有一种类似 return 的语法:关键字 yield。
 二者的区别是,普通函数只可以 return 一次,而生成器函数可以 yield 多次(当然也可以只 yield 一次)。
 在生成器的执行过程中,遇到 yield 表达式立即暂停,后续可恢复执行状态。
 这就是普通函数和生成器函数之间最大的区别,普通函数不能自暂停,生成器函数 可以。
 */

function* quips(name) {
    yield "你好 " + name + "!";
    yield "希望你能喜欢这篇介绍 ES6 的译文";
    if (name.startsWith("X")) {
        yield"你的名字" + name + " 首字母是X,这很酷!";
    }
    yield "我们下次再见!";
}

var it = quips('Xharry'); // 返回一个已暂停的生成器对象
// 每当你调用生成器对象的.next()方法时,函数调用将其自身解冻并一直运行到下一 个 yield 表达式,再次暂停。
console.log(it.next());  // { value: '你好 Xharry!', done: false }
console.log(it.next());  // { value: '希望你能喜欢这篇介绍 ES6 的译文', done: false }
console.log(it.next());  // { value: '你的名字Xharry 首字母是X,这很酷!', done: false }
console.log(it.next());  // { value: '我们下次再见!', done: false }
console.log(it.next());  // { value: undefined, done: true }


/**
 * 迭代器demo
 */
/*class RangeIterator {
 constructor(start, stop) {
 this.value = start;
 this.stop = stop;
 }

 [Symbol.iterator]() {
 return this;
 }

 next() {
 var value = this.value;
 if (value < this.stop) {
 this.value++;
 return {done: false, value: value};
 } else {
 return {done: true, value: undefined};
 }
 }
 }

 // 返回一个新的迭代器,可以从 start 到 stop 计数。
 function range(start, stop) {
 return new RangeIterator(start, stop);
 }*/


//以下 4 行代码实现的生成器完全可以替代之前引入了一整个 RangeIterator 类的 23 行代码的实现。
// 原因是:生成器是迭代器。所有的生成器都有内建.next()和 [Symbol.iterator]()方法的实现。你只须编写循环部分的行为。
function* range(start, stop) {
    for (var i = start; i < stop; i++)
        yield i;
}
var iter = range(1, 3);

console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

// 假设你需要一个等效于 Array.prototype.filter 并且支持 DOM NodeLists 的方法,可以这样写:
function* filter(test, iterable) {
    for (var item of iterable) {
        if (test(item))
            yield item;
    }
}