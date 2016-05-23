/**
 * 模板字符串
 */

// 反撇号(`)基础知识
// 下面的${user.name}和${action}被称为模板占位符,JavaScript 将把 user.name 和 action 的值插入到最终生成的字符串中,
function authorize(user, action) {
    // 与普通字符串不同的是,模板字符串可以多行书写(打印出来也是多行的):
    console.log(`用户 ${user.name}

    未被授权执行 ${action} 操作。`);
}

authorize({name: 'harry'}, 'test');

// 反撇号的未来:
// 模板字符串不会为你自动转义特殊字符,为了避免跨站脚本漏洞,你应当像拼接普通字符串时做的那样对非置信数据进行特殊处理。

/*
 标签模板：突破模板字符串（``）的诸多限制
 */
//第一个限制:自动转义特殊字符
var bonk = {};
bonk.sender = '$';
//var message = SaferHTML`<p>${bonk.sender} 向你示好。</p>`;

