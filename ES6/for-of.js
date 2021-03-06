/*
 *  ES5 forEach
 *  缺陷：
 *      你不能使用 break 语句中断循环，也不能使用 return 语句返回到外层函数。
 * */
var myArray = [1, 2, 'a', 4];
myArray.name = 'harry';

console.log('forEach:');
myArray.forEach(function (value) {
    if (value == 'a') {
        return;
    }
    //console.log(value);
});

/*
 *  如果for-in作用于数组的除了遍历数组元素外，还会遍历自定义属性。
 *  举个例子，如果你的数组中有一个可枚举属性 myArray.name，
 *  循环将额外执行一次，遍历到名为“name”的索引。就连数组原型链上的属性都能被访问到。
 */
console.log('for-in:');
for (var key in myArray) {
    //console.log(myArray[key]);
}

/**
 * 这个方法避开了 for-in 循环的所有缺陷
 * 与 forEach()不同的是，它可以正确响应 break、continue 和 return 语句
 */
console.log('for-of:');
for (var value of myArray) {
    //console.log(value);
}

/**
 * for-of 循环不仅支持数组，还支持大多数类数组对象，例如 DOM NodeList 对象。
 * for-of 循环也支持字符串遍历
 * 样支持 Map 和 Set 对象遍历(是 ES6 中新增的类型)。
 */
for (var chr of "abasd") {
    //console.log(chr);
}

//var uniqueWords = new Set('hello world!');
var uniqueWords = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
console.log('size: ' + uniqueWords.size);
for (var word of uniqueWords) {
    //console.log(word);
}

var obj = {
    a: 1,
    b: 2,
    c: 3
};
for (var key of Object.keys(obj)) {
    //console.log(key + ": " + obj[key]);
}

/**
 * for-of 循环语句通过方法调用来遍历各种集合。
 * 数组、Maps 对象、Sets 对象以及其它在我们讨论的对象有一个共同点,它们都有一个迭代器方法。
 * 你可以给任意类型的对象添加迭代器方法:
 *      当你向任意对象添加 myObject[Symbol.iterator]()方法,就可以遍历这个对象了
 *      比如： jQuery 对象也支持 for-of 循环
 *          jQuery.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
 *
 */
// 实现一个迭代器
var iterable = [3, 4, 5];
var $iterator = iterable[Symbol.iterator]();
var $result = $iterator.next();
while (!$result.done) {
    VAR = $result.value;

    console.log(VAR);

    $result = $iterator.next();
}
