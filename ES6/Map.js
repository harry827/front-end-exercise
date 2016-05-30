/*
 Map:一个 Map 对象由若干键值对组成
 */
// 支持：
/*
  new Map:返回一个新的、空的 Map。
  new Map(pairs):根据所含元素形如[key, value]的数组 pairs 来创建一个新的Map。
 这里提供的 pairs 可以是一个已有的 Map 对象,可以是一个由二元数组组成的数组,也可以是逐个生成二元数组的一个生成器,等等。
  map.size:返回 Map 中项目的个数。
  map.has(key):测试一个键名是否存在,类似 key in obj。
  map.get(key):返回一个键名对应的值,若键名不存在则返回 undefined,类似obj[key]。
  map.set(key, value):添加一对新的键值对,如果键名已存在就覆盖。
  map.delete(key):按键名删除一项,类似 delete obj[key]。
  map.clear():清空 Map。
  map[Symbol.iterator]():返回遍历所有项的迭代器,每项用一个键和值组成的二元数组表示。
  map.forEach(f) 类 似 for (let [key, value] of map) { f(value, key,map); }。这里诡异的参数顺序,和 Set 中一样,是对应着
 Array.prototype.forEach()。
  map.keys():返回遍历所有键的迭代器。
  map.values():返回遍历所有值的迭代器。
  map.entries():返回遍历所有项的迭代器,就像 map[Symbol.iterator]()。实际上,它们就是同一个方法,不同名字。
 */
var map = new Map([["a", 1], ["b", 2]]);
console.log(map);
console.log(map.entries());
console.log(map[Symbol.iterator]());
