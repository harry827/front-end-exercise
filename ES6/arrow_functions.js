/*
 箭头函数 Arrow Functions
 */
/*
 箭头符号在 JavaScript 诞生时就已经存在,当初第一个 JavaScript 教程曾建议在 HTML 注释内包裹行内脚本,
 这样可以避免不支持 JS 的浏览器误将 JS 代码显示为文本。 你会写这样的代码:

 <script type="text/javascript">
 <!--
 //-->
 </script>

 老式浏览器会将这段代码解析为两个不支持的标签和一条注释,只有新式浏览器才 能识别出其中的 JS 代码。

 */

// -->是一个 JS 运算符:“趋向于”运算符,比如：
function countdown(n) {
    while (n-- > 0) // "n goes to zero"
        console.log(n);
}
countdown(5);


/*
 ES6 中引入了一种编写函数的新语法：
 */
var allJobs = [1, 2, 3];
// ES5
var selected = allJobs.filter(function (job) {
    return job;
});
// ES6 语法:标识符=>表达式
var selected = allJobs.filter(job => job);

// ES5
var values = [1, 23];
var total = values.reduce(function (a, b) {
    return a + b;
}, 0);
// ES6
var total = values.reduce((a, b) => a + b, 0);

// 箭头函数还可以包含一个块语句:
// ES5
/*$("#confetti-btn").click(function (event) {
 playTrumpet();
 fireConfettiCannon();
 });*/
// ES6
/*
 $("#confetti-btn").click(event => {
 playTrumpet();
 fireConfettiCannon();
 });*/
console.log('------------------------');
// 小提示:当使用箭头函数创建普通对象时,你总是需要将对象包裹在小括号里。
var puppies = [1, 2, 3];
var chewToys = puppies.map(puppy => {
});
var chewToys = puppies.map(puppy => ({}));
//用小括号包裹空对象就可以了。 不幸的是,一个空对象{}和一个空的块{}看起来完全一样。ES6中
// puppy => {}这段代码就被解析 为没有任何行为并返回 undefined 的箭头函数。

/*
 作用域 -- this
 */
// 普通 function 函数和箭头函数的行为有一个微妙的区别,箭头函数没有它自己的 this 值,
// 箭头函数内的 this 值继承自外围作用域。比如：
console.log('作用域 -- this:');
var $ = jQuery = {
    each: function (arr, fun) {
        arr.forEach(function () {
            fun.apply(this, arguments);
        });
    }
};
var obj = {
    add: function (piece) {
        console.log('add:' + piece);
    },
    addAll: function addAll(pieces) {
        $.each(pieces, piece => this.add(piece)); // 这里this，指向外围obj
    }
};
/*
    还可以去掉functoin关键字，用更简洁的方式：
     var obj = {
        add(piece) {
            console.log('add:' + piece);
        },
        addAll(pieces) {
            $.each(pieces, piece => this.add(piece)); // 这里this，指向外围obj
        }
     };
 */
obj.addAll([1, 2, 3]);

// 注意：箭头函数与非箭头函数间还有一个细微的区别,箭头函数不会获取它们自己的 arguments 对象。
// 诚然,在 ES6 中,你可能更多地会使用不定参数和默认参数值这些新 特性。
var test = aa=>{
    console.log(aa);
    console.log(arguments);
}
test(11);
