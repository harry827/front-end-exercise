/*
 Query String:
 这个模块提供一些处理 query string 的工具
 */

/*
 querystring.stringify(obj, [sep], [eq]):

 序列化一个对象到一个 query string。可以选择是否覆盖默认的分割符（'&'）和分配符（'='）
 */

var qs = require('querystring');

var str = qs.stringify({foo: 'bar', baz: 'qux'});
console.log(str);  //foo=bar&baz=qux
var str = qs.stringify({foo: 'bar', baz: 'qux'}, ';', ':');
console.log(str);  //foo:bar;baz:qux

/*
 querystring.parse(str, [sep], [eq], [options])
 将一个 query string 反序列化为一个对象。可以选择是否覆盖默认的分割符（'&'）和分配符（'='）。
 注意：options对象可能包含maxKeys属性(默认为1000),它可以用来限制处理过的键(key)的数量.设为0可以去除键(key)的数量限制.
 */
var str = qs.parse('foo=bar&baz=qux&baz=quux&corge');
console.log(str); //{ foo: 'bar', baz: [ 'qux', 'quux' ], corge: '' }

var str = qs.parse('foo@bar#baz@qux#baz@quux#corge', '#', '@');
console.log(str); //{ foo: 'bar', baz: [ 'qux', 'quux' ], corge: '' }

/*
 querystring.escape
 供 querystring.stringify 使用的转义函数，在必要的时候可被重写。
 */
console.log(qs.escape('转义函数'));  // %E8%BD%AC%E4%B9%89%E5%87%BD%E6%95%B0
/*
 querystring.unescape
 供 querystring.parse 使用的反转义函数，在必要的时候可被重写。
 */
console.log(qs.unescape('%E8%BD%AC%E4%B9%89%E5%87%BD%E6%95%B0')); // 转义函数
