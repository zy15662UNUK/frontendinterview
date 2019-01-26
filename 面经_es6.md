### 箭头函数
箭头函数表达式的语法比函数表达式更短，并且没有自己的this，arguments，super或 new.target。这些函数表达式更适用于那些本来需要匿名函数的地方，并且它们不能用作构造函数。
什么时候你不能使用箭头函数？： https://zhuanlan.zhihu.com/p/26540168
但某些方面的优势在另外一些方面可能就变成了劣势，在需要动态上下文的场景中使用箭头函数你要格外的小心，这些场景包括：定义对象方法、定义原型方法、定义构造函数、定义事件回调函数

### 使用过ES6哪些新特性，js的基本数据类型是哪些？ES6中有新的数据类型吗？

- 箭头函数
- Map
- Set
- Map和Set http://es6.ruanyifeng.com/#docs/set-map
- Symbol这个新的原始数据类型，以前没怎么使用过，没有答上来。然后在提到Promise的时候问了Promise的问题 https://zhuanlan.zhihu.com/p/22652486

### Promise是如何实现的？能不能自己写一个函数实现Promise？

### 谈谈你对webpack的理解
是一个对资源进行模块化和打包的工具，处理每个模块的 import 和 export
追问：资源是指什么？
回答：Js,css,png图片等
追问：如果有个二进制文件，它是资源么？webpack怎么使它模块化？
回答：是。需要有一个对应的loaders来处理（我是想到了vue-loader等)

### 这篇是ECMAScript 2016、2017和2018中所有新特性的示例！
- https://segmentfault.com/a/1190000017285373
### class 和继承问题
- http://es6.ruanyifeng.com/#docs/class
- https://jsfiddle.net/zy15662/ejpmf8ns/42/

```
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

var obj = new Square(3); // 输出 false
```
### Promise
- 你真的完全掌握了promise么？ https://juejin.im/post/5af29a62f265da0b8f628973
- https://jsfiddle.net/8r1gpcv7/93/
- 每一个 promise 都会提供给你一个 then() 函数 (或是 catch()，实际上只是 then(null, ...) 的语法糖)。当我们在 then() 函数内部时, 我们可以做三件事情
  1. return 另一个 promise
  2. return 一个同步的值 (或者 undefined)
  3. throw 一个同步异常
- setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise. resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出

```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```
- 用了 promises 后怎么用 forEach? Promise.all. 大体来说，Promise.all()会以一个 promises 数组为输入，并且返回一个新的 promise。这个新的 promise 会在数组中所有的 promises 都成功返回后才返回。他是异步版的 for 循环。 并且 Promise.all() 会将执行结果组成的数组返回到下一个函数，比如当你希望从 PouchDB 中获取多个对象时，会非常有用。此外一个更加有用的特效是，一旦数组中的 promise 任意一个返回错误，Promise.all() 也会返回错误

```
db.allDocs({include_docs: true}).then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    return db.remove(row.doc);
  }));
}).then(function (arrayOfResults) {
  // All docs have really been removed() now!
});

```
- 判断以下输出顺序

```
async function a1 () {
    console.log('a1 start') // async 和 promise的定义函数是立即执行的
    await a2()
    console.log('a1 end')
}
async function a2 () {
    console.log('a2')
}

console.log('script start'); // 最先执行。

setTimeout(() => { // setTimeout会在Promise之后执行。因此setTimeout中内容最后执行
    console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
    console.log('promise1')
})

a1()

let promise2 = new Promise((resolve) => {
    resolve('promise2.then')
    console.log('promise2') // async 和 promise的定义函数是立即执行的
})

promise2.then((res) => {
    console.log(res)
    Promise.resolve().then(() => {
        console.log('promise3')
    })
})
console.log('script end')
```
输出结果:

```
script start
a1 start
a2
promise2
script end
promise1
promise2.then
promise3
a1 end
setTimeout
```
- https://segmentfault.com/a/1190000015057278
### import export

```

    // lib/math.js
    export function sum(x, y) {
        return x + y;
    }
    export var pi = 3.141593;

    // app.js
    import * as math from "lib/math";
    alert("2π = " + math.sum(math.pi, math.pi));

    // otherApp.js
    import {sum, pi} from "lib/math";
    alert("2π = " + sum(pi, pi));
    // Some additional features include export default and export *:

    // lib/mathplusplus.js
    export * from "lib/math";
    export var e = 2.71828182846;
    export default function(x) {
        return Math.log(x);
    }

    // app.js
    import ln, {pi, e} from "lib/mathplusplus";
    alert("2π = " + ln(e)*pi*2);
```

- babel网站里面可以翻译es6变成es5
- es6 声明变量
  - let: 和var非常相似，但是是一个block变量。也就是说如果在if/for中声明那么在if/for外面没法收到的
  - const: block变量且不能改的。声明了不能改，类似于Java里面的final
- 模板：方便用变量拼接字符。同时支持多行写字符串

  ```
  //变量拼接字符
  function ex1() {
   const firstName = 'John';
   const lastName = 'Doe';
   const fullName = `${firstName} ${lastName}`;
   console.log(fullName); // John Doe
  }

  ```

  ```
  //字符串换行
  function ex2() {
   const str = `multiple line
  string`;
   console.log(str); // multiple line
                     // string
  }

  ```
- 对象可以缩写，并且可以类似array一样可以方括号访问：

```
// ES5
function getCar(make, model, price) {
 return {
   make: make,
   model: model,
   price: price,
 };
}
console.log(getCar('BMW', 'X5', 60000));

// ES6
function getCar2(make, model, price) {
 return {
   make,
   model,
   price,
 };
}
console.log(getCar2('BMW', 'X5', 60000));
//ES6
function getCar3(make, model, price) {
 return {
   make,
   model,
   price,
   [`madeBy${make}`]: true,
 };
}
console.log(getCar3('BMW', 'X5', 60000));
//ES6
function getCar4(make, model, price) {
 return {
   make,
   model,
   price,
   [`madeBy${make}`]: true,
   depreciate() { this.price -= 1000; } // 声明method 函数的简写
 };
}
const car = getCar4('BMW', 'X5', 60000)
car.depreciate();
console.log(car);
//或者
car[`madeBy${car.make}`] = "zzz";
```

- object删除key
  `delete obj.key`

- 和python一样可以参数默认值

```
function f(x, y=12) {
 return x + y;
}
f(3)// 15
f(3, undefined) //15 undefined等同于没传
```
- 参数不限个数，打包在array里面

```
// y is an Array。x之外的所有参数会被打包在y这个array中
function f(x, ...y) {
 return x * y.length;
}
f(3, "hello", true)
```
- 将两个集合合并到一个集合中
合并array

```
// spread array ex2
const arr = [1, 2, 3, 4];
const arr1 = [5, 6, 7, 8];
const arr2 = [...arr, 111, 222, ...arr1];
console.log(arr2); // [1, 2, 3, 4, 111, 222, 5, 6, 7, 8]
```
把array1和2都装到array中

合并对象

```
const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3};
console.log(obj2); // {a: 1, b: 2, c: 3};
```

- Destructuring
Destructuring allows binding using pattern matching, with support for matching arrays and objects. Destructuring is fail-soft, similar to standard object lookup foo["bar"], producing undefined values when not found.
array可以这么搞

```
[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]
```
object也能这么搞

```
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x) // 1
console.log(y) // 2
console.log(z) // {a: 3, b: 4}
```
函数参数也能这么搞

```
function g({a, b}) {
  console.log(a + b);
}
// renaming
function g1({name: x}) {
  console.log(x);
}
g({a: 5, b:4}) // 9
g1({name: 5}) // 5
```

- 剑头函数

```

// add, add1, add2 are equivalent
const add = function(a, b) {
 return a + b;
}

const add1 = (a, b) => {
 return a + b;
}

const add2 = (a, b) => a + b;

// double, double1, double2, double3 are equivalent
const arr = [1, 2, 3, 4];
const double = arr.map(function(n) {
 return n * 2;
});

const double1 = arr.map((n) => {
 return n * 2
});

const double2 = arr.map((n) => n * 2);
const double3 = arr.map(n => n * 2);

```

解决this丢失问题

```
{
  sayLikes1() {
    // ES5 解决方法
   let self = this;
   this.likes.forEach(function(like) {
     console.log(`${self.name} like ${like}`);
   });
 },
 sayLikes2() {
   // ES6 解决方法
   this.likes.forEach((like) => {
     console.log(`${this.name} like ${like}`);
   });
 }

}
```
error function的特殊功效是可以自动给bind当前this给这个函数

- 类。很像java的constructor

```
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }

  static walk() {
    console.log('walk');
  }
}

class Dog extends Animal {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  speak() {
    console.log(this.name + ' barks at age ' + this.age);
  }
}

var d = new Dog('Mitzie', 10);
d.speak(); // Mitzie barks.
Dog.walk(); // walk
Animal.walk(); // walk
d.walk(); // d.walk is not a function
```
注意static method在js中是不可以在instance中调用
