/*!
 * merge-descriptors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module exports.
 * @public
 */

module.exports = merge

/**
 * Module variables.
 * @private
 *
 * hasOwnProperty():
 *    用于指示一个对象自身(不包括原型链)是否具有指定名称的属性。如果有，返回true，否则返回false。
 */

var hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Merge the property descriptors of `src` into `dest`
 * 合并‘src’的属性描述符（比如：{writable: false,configurable: true}）到‘dest’，
 *
 * @param {object} dest Object to add descriptors to
 * @param {object} src Object to clone descriptors from
 * @param {boolean} [redefine=true] Redefine `dest` properties with `src` properties
 * @returns {object} Reference to dest
 * @public
 *
 *
 * Object.getOwnPropertyNames():
 *      返回一个对象的所有自身属性的属性名（非原型继承的属性）组成的数组。
 *      https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
 *
 * Object.getOwnPropertyNames和Object.keys区别:
 *      Object.keys只适用于可枚举的属性(enumerable:true)，
 *      Object.getOwnPropertyNames返回对象自动的全部属性名称,包括不可枚举属性(enumerable:false)。
 *
 *  注：
 *      JavaScript中对象的property有三个属性：
 *          1.writable。该property是否可写。
 *          2.enumerable。当使用for/in语句时，该property是否会被枚举。
 *          3.configurable。该property的属性是否可以修改，property是否可以删除。
 *
 * Object.getOwnPropertyDescriptor:
 *      获取指定对象的自身属性描述符，自身属性描述符是指直接在对象上定义（而非从对象的原型继承）的描述符。
 *      比如：{
 *              value: "abc",
 *              writable: false,
 *              enumerable: true,
 *              configurable: true
 *            }
 *
 */

function merge(dest, src, redefine) {
    if (!dest) {
        throw new TypeError('argument dest is required')
    }

    if (!src) {
        throw new TypeError('argument src is required')
    }

    if (redefine === undefined) {
        // Default to true
        redefine = true
    }

    Object.getOwnPropertyNames(src).forEach(function forEachOwnPropertyName(name) {
        if (!redefine && hasOwnProperty.call(dest, name)) {
            // Skip desriptor
            return
        }

        // Copy descriptor
        var descriptor = Object.getOwnPropertyDescriptor(src, name)
        Object.defineProperty(dest, name, descriptor)
    })

    return dest
}
