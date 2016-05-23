/**
 * 不定参数
 */
/*
 可变参数函数 containsAll 给大家演示不定参数的用法:
 */
//传统方法来实现这个函数:
function containsAll1(haystack) {
    for (var i = 1, len = arguments.length; i < len; i++) { // 从 1 开始迭代,而不是从 0 开始,因为 arguments[0]相当于参数 haystack
        var needle = arguments[i];
        console.log(needle);
    }
}

// ES6 不定参数特性实现的 containsAll 函数:
function containsAll2(haystack, ...needles) {
    for (var needle of needles) {
        console.log(needle);
    }
}

containsAll1('a', 'b', 'c');
containsAll2('a2', 'b2', 'c2');

/*
 注意：
 在所有函数参数中,只有最后一个才可以被标记为不定参数。
 函数被调用时,不定 参数前的所有参数都正常填充,任何“额外的”参数都被放进一个数组中并赋值给不定参数。
 如果没有额外的参数,不定参数就是一个空数组,它永远不会是 undefined。
 */

/**
 * 默认参数
 */
//JavaScript 有严格的默认参数格式,未被传值的参数默认为 undefined。ES6 引入了一种新方式,可以指定任意参数的默认值。
function animalSentence(animals2 = "tigers", animals3 = "bears") {
    console.log(`Lions and ${animals2} and ${animals3}! Oh my!`);
}
animalSentence();

// 默认值表达式在函数调用时自左向右求值,也就是说，后面的参数可以使用前面的参数进行一些操作，比如判断：
function animalSentence(animals2 = "tigers", animals3 = (animals2 == "bears") ? "sealions" : "bears") {
    console.log(`Lions and ${animals2} and ${animals3}! Oh my!`);
}
animalSentence();
animalSentence("bears"); // 等同于：animalSentence(animals2="bears");

// 注：没有默认值的参数隐式默认为 undefined
// 所以： function myFunc(a=42, b) {...} 是合法的,并且等效于：function myFunc(a=42, b=undefined) {...}

// 参数是有序的
function animalSentence(animals2 = "tigers", animals3 = "bears") {
    console.log(`${animals2} and ${animals3}!`);
}
animalSentence(animals3 = "22222", animals2 = "1111"); // 22222 and 1111!