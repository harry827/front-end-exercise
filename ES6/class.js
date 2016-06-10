/*
 类 Class
 */
// ES5的时候创建一个面向对象设计示例:Circle 类
function Circle(radius) {
    this.radius = radius;
    Circle.circlesMade++;
}
Circle.draw = function draw(circle, canvas) { /* Canvas 绘制代码 */
};
// 设置circlesMade的获取和设置方法
Object.defineProperty(Circle, "circlesMade", {
    get: function () {
        return !this._count ? 0 : this._count;
    },
    set: function (val) {
        this._count = val;
    }
});

// 添加一个计算面积的方法
Circle.prototype = {
    area: function area() {
        return Math.pow(this.radius, 2) * Math.PI;
    }
};
// 过滤半径的获取和设置方法
Object.defineProperty(Circle.prototype, "radius", {
    get: function () {
        return this._radius;
    },
    set: function (radius) {
        if (!Number.isInteger(radius))
            throw new Error("圆的半径必须为整数。");
        this._radius = radius;
    }
});

// 现在用ES6的语法来定义一个类：
class Circle {
    // constructor 方法也是可选的,对象中会默认声明一个空的构造函数 constructor() {}
    constructor(radius) {
        this.radius = radius;
        Circle.circlesMade++;
    }

    // 方法前有static关键字，表明该方法是一个静态方法，可以直接在Circle类上调用（Circle.draw()），
    // 而不是在Circle类的实例上调用
    static draw(circle, canvas) {
        // Canvas 绘制代码
    }

    static get circlesMade() {
        return !this._count ? 0 : this._count;
    }

    static set circlesMade(val) {
        this._count = val;
    }

    area() {
        return Math.pow(this.radius, 2) * Math.PI;
    }

    get radius() {
        return this._radius;
    }

    set radius(radius) {
        if (!Number.isInteger(radius))
            throw new Error("圆的半径必须为整数。");
        this._radius = radius;
    }
}

/*
 Object.setPrototypeOf():
 将一个指定的对象的原型设置为另一个对象或者null(既对象的[[Prototype]]内部属性).
 参数:
 obj: 将被设置原型的对象.
 prototype: 该对象新的原型(可以是一个对象或者null).

 注意：Object.setPrototypeOf()是ECMAScript 6最新草案中的方法，相对于 Object.prototype.__proto__ ，
 它被认为是修改对象原型更合适的方法
 */

class Shape {
    get color() {
        return this._color;
    }

    set color(c) {
        this._color = parseColorAsRGB(c);
        this.markChanged(); //稍后重绘Canvas
    }
}

// 基于Shape类生成一个子类：
class Circle {
// 与上文中代码相同
}
// 连结实例属性
Object.setPrototypeOf(Circle.prototype, Shape.prototype);
// 连结静态属性
Object.setPrototypeOf(Circle, Shape);

// 用关键词 extends 声明子类:
class Circle extends Shape { // 与上文中代码相同
}