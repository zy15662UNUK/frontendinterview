##### ECMA 262标准，js基础知识，JS-web-API：W3C标准
- 浏览器js是这两者结合

##### W3C
- DOM 操作
- BOM 操作：页面宽度等
- 事件绑定
- ajax请求http协议）
- 存储
- 没有规定任何js基础
- 不管变量类型，原型，作用域
- JS 内置全局函数和对象：object array Boolean string math json
- 浏览器的document， window，当然会有更多很多未定义的浏览器内置全局变量

##### DOM：
- 本质：tree数据结构主干+分支。html是字符串，但是浏览器把它结构化成了js也能识别也能操作的模型

- DOM节点操作：
  1. 获取DOM节点

    ```
    var div1 = document.getElementById("div1"); //元素
    var divList = document.getElemensByTagName("div");  //集合array
    console.log(divList.length);
    console.log(divList[0]);
    var containerList = document.getElementByClassName("container");
    var pList = document.querySelectorAll('p'); //集合array
    ```
    获取的都是DOM对象
  2. property

    ```
    var pList = document.querySelectorAll('p');
    var p = pList[0];
    console.log(p.style.width); //获取样式
    p.style.width = '100px';  // 修改样式
    console.log(p.className); //获取class
    p.className = 'p1'; //修改class
    console.log(p.nodeName);  //获取nodeName p
    console.log(p.nodeType);  //获取nodeType。是数字。 text是3， p是1
    ```
    style，className是js object属性，就和js object.后面相同

  3. attribute

    ```
    var pList = document.querySelectorAll('p');
    var p = pList[0];
    p.getAttribute("data-name");
    p.setAttribute("data-name", "imooc");
    p.getAttribute("style");
    p.setAttribute("style", "font-size:30px");
    ```
    attribute是文档标签的属性，比如class，src之类的，并不是js对象的属性

- DOM结构操作：
  1. 新增节点

  ```
  var div1 = document.getElementById("div1"); //元素
  var p1 = document.createElement('p'); //创造一个新节点
  p1.innerHTML = "p1";
  div1.appendChild(p1); //添加新创造的p节点作为子节点
  p2 = document.getElementById('p2');
  div1.appendChild(p2); //把已经有的移动到div1之下
  ```

  2. 获取父级元素
  3. 获取子元素

  ```
  var div1 = document.getElementById('div1');
  var parent = div1.parentElement;  //集合
  var child = div1.childNodes;
  div1.removeChild(child[0]); //集合
  ```
  4. 删除节点

  ```
  div1.removeChild(child[0]);
  ```
##### DOM操作题目
- DOM是那种基本的数据结构？
  tree。

- DOM操作常用的API有哪些？
  获取DOM节点和他的property还有attr 新增节点 获取父级元素 获取子元素删除节点

- DOM节点attr和property有何区别？
  property只是一个js对象属性修改获取
  attribute是对html标签属性修改获取

##### BOM操作
- Browser Object Model
- navigator：浏览器属性
- screen：屏幕属性，宽高

  ```
  var us = navigator.userAgent; //string,浏览器特性
  var isChrome = ua.indexOf("chrome");
  console.log(isChrome);

  console.log(screen.width);
  console.log(screen.height);
  ```
- location：地址栏信息
- history：历史，前进后退

  ```
  //location
  console.log(location.href);
  console.log(location.protocol); // http: https
  console.log(location.pathname); // '/learn/199'
  console.log(location.search); //  ?后面参数
  console.log(location.hash); //  #后面内容

  //history
  location.back();
  history.forward;
  ```
##### BOM 题目
- 如何检测浏览器特性（android/iOS）

  ```
  var us = navigator.userAgent; //string,浏览器特性
  var isChrome = us.indexOf("chrome");  //字符串中找有没有浏览器关键字，但是通常只能确定浏览器类型，不能知道所有类型
  console.log(isChrome);
  ```
- 拆解url的各部分

  ```
  //location
  console.log(location.href); //全部域名
  console.log(location.protocol); // http: https
  console.log(location.pathname); // '/learn/199'
  console.log(location.search); //  ?后面参数
  console.log(location.hash); //  #后面内容
  ```

##### 通用事件绑定

```
function bindEvent(elem, type, fn) {
  elem.addEventListener(type, fn);
}

var a = document.getElementById("link1");
bindEvent(a, "click", function (e) {
  e.preventDefault(); //阻止默认行为，因为a 是一个链接，不写这句点击后会有页面跳转
  alert("click");
  });
```
- IE低版本使用的是attachEvent绑定事件，和W3C标准不一样
- 低版本使用很少，很多网站都已经不支持了
- 对低版本兼容性了解即可，不用深究
- 如果IE低版本要求苛刻的面试，果断放弃

##### 事件冒泡
- 点击一个节点，先触发它自己身上的事件，然后再触发父节点们上面事件。总之顺着DOM结构一路往上触发

```
<body>
  <div id="div1">
    <p id="p1">激活</p>
    <p id="p2">取消</p>
    <p id="p3">取消</p>
    <p id="p4">取消</p>
  </div>
  <div id="div2">
    <p id="p5">取消</p>
    <p id="p6">取消</p>
  </div>
</body>
```
```
var p1 = document.getElementById("p1");
var body = document.body;

//由于点击子节点会触发父节点的事件，而反过来不会。所以给父节点绑定的是取消事件，因为取消数目远大于激活。然后在激活的子节点上绑定激活事件，然后利用stopPropagation来防止触发父节点

bindEvent(p1, "click", function (e) {
  e.stopPropagation(); //阻止激活绑定在父元素上面的事件
  alert("激活")；
  });
bindEvent(body, "click", function () {
  alert("取消"); //点击每个取消会触发父节点body上面事件
  });
```
- 代理：代码简洁，浏览器内存少

```
<div id="div1">
  <a  href="#">a1</a>
  <a  href="#">a2</a>
  <a  href="#">a3</a>
  <a  href="#">a4</a>
  <!-- 会随时增加更多a -->
</div>
```

```
// 因为a会不断新增，所以我们直接绑定在父节点div上，点击后总会冒泡到这里

var div1 = document.getElementById('div1');
div1.addEventListener("click", function(e) {
  var target = e.target;
  if (target.nodeName === "A") {
    alert(target.innerHTML);//如果nodeName是a那么就输出里面内容
  }
  });
```
- 完善事件绑定:支持使用或者不使用代理

https://jsfiddle.net/zy15662/pdoyj6te/12/

##### 题目
- 编写一个通用的事件监听函数
  见完善事件绑定

- 描述事件冒泡流程
  DOM树形结构，事件冒泡，阻止冒泡，代理

- 对于一个无限下拉加载图片页面，如何给每个图片绑定事件
  事件冒泡

##### XMLHttpRequest: https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434499861493e7c35be5e0864769a2c06afb4754acc6000s

```
var xhr = new XMLHttpRequest();
xhr.open("GET", "/api", false); // false指异步执行
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) { //说明已经完成
    if (xhr.status === 200) {//说明获取成功
      alert(xhr.responseText);  //打印内容
    }

  }
}
xhr.send(null);

```
##### 状态码说明
- 未初始化 readyState: 0还没有调用send方法
- readyState:1 载入 已经调用send方法，正在发送请求
- readyState:2 载入完成 send（）方法执行完成，已经接受全部响应内容
- readyState:3 交互 正在解析响应内容
- readyState:4 完成 相应内容解析完成，可以在客户端使用
- 基本只用关心4
- status：2xx 表示成功处理请求，如200
- status：3xx 需要重新定向，浏览器直接跳转
- status：4xx 客户端请求错误 如404
- status：5xx 服务器错误
##### 什么是同源策略及限制
- 协议 域名 端口(http: 80, https: 443) 相同才能获取。否则就会受限
- 受限的方向： cookie localstrage indexdb无法获取，DOM，无法获得，AJAX请求不能发送
##### 前后端通信有哪些方式
- AJAX: 同源
- WebSocket: 不限同源
- CORS： 同源不同源都可以
##### 如何实现ajax请求
- 兼容性 IE
- 事件触发条件
- 事件触发顺序
- 手动编写一个ajax，不依赖第三方库 https://jsfiddle.net/zy15662/180g4emf/55/
##### 跨域
- 什么是跨域
  1. 浏览器有同源策略，不允许Ajax访问其他域接口.
  2. 跨域条件： 协议 域名 端口(http: 80, https: 443) 有一个不同就算跨域
  3. 但是有三个标签允许跨域加载资源：<img src="xxx">, <link href=xx>, <script src=xxx>
  4. <img src="xxx">用于打点统计，统计网站可能是其他域
  5. <link><script>可以使用cdn，cdn也是其他域
  6. <script>可以用于JSONP
  7. 所有跨域请求必须经过信息提供方允许
  8. 如果未经允许即可获取，那是浏览器同源策略问题
##### 跨域的几种方式
- 前四个 https://jsfiddle.net/zy15662/180g4emf/70/
- hash. url上面的hash#改变页面并不需要刷新
- postMessage, HTML5新增的跨域
- Websocket
- CORS 给ajax加一个头允许跨域ajax请求 使用fetch！！！ 但是只能fetch本地的
- JSONP
  1. https://coding.m.imooc.com/classindex.html 不一定服务器端真正有一个classindex.html文件
  2. 服务器可以根据请求，动态生成一个文件返回
  3. 同理<script src="https://coding.m.imooc.com/api.js">
  4. 假如网站要跨域访问慕课网一个接口，慕课给一个地址，返回内容格式如callback({x: 100, y: 200})(可以动态生成)

### jsonp实现的详细流程
- jsonp 的原理与实现 https://juejin.im/entry/58466c218e450a006c160870
- 首先是利用script标签的src属性来实现跨域。
- 通过将前端方法作为参数传递到服务器端，然后由服务器端注入参数之后再返回，实现服务器端向客户端通信。
- 由于使用script标签的src属性，因此只支持get方法
- 一个简单的jsonp实现，其实就是拼接url，然后将动态添加一个script元素到头部。

```
function jsonp(req){
    var script = document.createElement('script');
    var url = req.url + '?callback=' + req.callback.name;
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
```
- 前端js示例

```
window.hello = function (res){
    alert('hello ' + res.data);
}
jsonp({
    url : '',
    callback : hello
});
```
- 后端传参数就直接把json字符串插进回调函数的括号里
`var str = params.query.callback + '(' + JSON.stringify(data) + ')';`
### 服务器端设置http header
  1. 另外一个解决跨域的简洁方法，需要服务器端来做
  2. 但是作为交互方，我们必须知道这个方法
  3. 是将来解决跨域问题的一个方法
### ajax和jsonp区别
- ajax和jsonp区别 https://www.jianshu.com/p/fce33a35a0b6
1. ajax和jsonp的调用方式很像，目的一样，都是请求url，然后把服务器返回的数据进行处理，因此jquery和ext等框架都把jsonp作为ajax的一种形式进行了封装；
2. 实质不同
　　ajax的核心是通过xmlHttpRequest获取非本页内容
　　jsonp的核心是动态添加script标签调用服务器提供的js脚本
3. 区别联系
　　不在于是否跨域
　　ajax通过服务端代理一样跨域
　　jsonp也不并不排斥同域的数据的获取
4. jsonp是一种方式或者说非强制性的协议
ajax也不一定非要用json格式来传递数据
##### 题目


- 跨域的几种方式
  JSONP, http header

##### 存储
- cookie
  1. 本身用于客户端服务端通信
  2. 有本地存储功能，于是被借用
  3. 使用document.cookie=...获取和修改即可
  4. 缺点：存储量太小，只有4kb，所有HTTP请求带着，影响资源获取效率。 API简单，需要封装才能用document.cookie=...
 - sessionStorage和localStorage
  1. API简单易用
  2. localStorage.setItem(key, value); localStorage.getItem(key)
  3. 基本使用sessionStorage
  4. ios safari隐藏模式localStoarage.getItem会报错
  5. 建议统一使用try-catch封装
##### document.ready和window.onload的区别
页面加载完成有两种事件，一是ready，表示文档结构已经加载完成（不包含图片等非文字媒体文件），二是onload，指示页面包含图片等文件在内的所有元素都加载完成。

- `$(document).ready(function(){...}) or $(function(){...})`
ready事件在DOM结构绘制完成之后就会执行，这样能确保就算有大量的媒体文件没加载出来，JS代码一样可以执行。
同时它可以被原生js代替:

```
document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
});
```


- `window.onload = function(){..}`
load事件必须等到网页中所有内容全部加载完毕之后才被执行。如果一个网页中有大量的图片的话，则就会出现这种情况：网页文档已经呈现出来，但由于网页数据还没有完全加载完毕，导致load事件不能够即时被触发。

ready与load谁先执行？面试时经常会被问到这个问题：ready与load那一个先执行，那一个后执行？答案当然是ready先执行。
##### 题目
- 请描述一下cookie，sessionStorage和localStorage的区别
  1. 容量4kb VS 5M
  2. 是否携带ajax中（cookie每次都会被携带在header中。而其他的不会）
  3. API cookie不容易使用必须封装
  4. sessionStorage和localStorage区别在于前者仅存在于当前会话，刷新页面的话还在，但是关闭页面或者浏览器之后就被清空了，localStoragec除非被专门清除否则一直存在
