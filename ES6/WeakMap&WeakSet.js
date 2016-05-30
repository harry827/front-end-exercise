/*
  WeakMap 只支持 new、has、get、set 和 delete。
  WeakSet 只支持 new、has、add 和 delete。
  WeakSet 的值和 WeakMap 的键必须是对象。
 */
// 注意：这两种弱集合都不可迭代,除非专门查询或给出你感兴趣的键,否则不能获得一个弱集合中的项。
/*
 var wMap = new WeakMap();
 wMap.set(Symbol(), 1);
 wMap.set(Symbol(), 2);
 console.log(wMap);*/
