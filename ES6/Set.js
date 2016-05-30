/*
 Set: 一个 Set 是一群值的集合。它是可变的,能够增删元素
 */
// Set和数组不同：
// 1、一个 Set 不会包含相同元素：
var dataset = new Set('abbc');
console.log(dataset.size); // 3
dataset.add('d');
console.log(dataset.size); // 4
dataset.add('d');
console.log(dataset.size); // 4

console.log(dataset);

// 2、Set 的数据存储结构专门为一种操作作了速度优化:包含性检测
var arr = ['hello', 'world'];
var set1 = new Set(['hello', 'world']);
console.log(set1);
console.log(arr.indexOf("hello") !== -1);  // 慢
console.log(set1.has("hello"));  // 快

// 3、Set不支持索引，比如：
console.log(arr[0]);  //hello
console.log(set1[0]); //undefined

// Set操作：
/*
 1、new Set:创建一个新的、空的 Set。
 2、new Set(iterable):从任何可遍历数据中提取元素,构造出一个新的集合。
 3、set.size:获取集合的大小,即其中元素的个数。
 4、set.has(value):判定集合中是否含有指定元素,返回一个布尔值
 5、set.add(value):添加元素。如果与已有重复,则不产生效果。
 6、set.delete(value):删除元素。如果并不存在,则不产生效果。.add()和.delete()都会返回集合自身,所以我们可以用链式语法。
 7、set[Symbol.iterator]():返回一个新的遍历整个集合的迭代器。一般这个方法不会被直接调用,
 因为实际上就是它使集合能够被遍历,也就是说,我们可以直接写 for (v of set) {...}等等。
 8、set.forEach(f):直接用代码来解释好了,它就像是 for (let value of set){ f(value, index, set); }的简写,类似于数组的.forEach()方法。
 9、set.clear():清空集合。
 10、set.keys()、set.values()和 set.entries()返回各种迭代器,它们是为了兼容Map 而提供的,在Map中查看。
 */