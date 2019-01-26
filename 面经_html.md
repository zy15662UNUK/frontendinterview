### 对html语义化有什么了解吗？有那些语义化的新标签？
当时就答了一些语义化的标签。总结一下：
语义化标签即标签本身的内容就能表示这个元素的意义给浏览者或者开发者。比如<div>和<span>就是没有语义的元素。而<form>表示一个表单或者<table>表示表格就是语义化的标签。
H5中提供了很多新的语义元素，比如：

- <header> <nav> <aside> <footer>几个标签用来表示页面的头部、导航和侧边栏等不同部分。
- <article>元素表示文档、页面、应用或网站中的独立结构，其意在成为可独立分配的或可复用的结构，如在发布中，它可能是论坛帖子、杂志或新闻文章、博客、用户提交的评论、交互式组件，或者其他独立的内容项目。
- <section>包含了一组内容及其标题。
- <figure>规定独立的流内容如图像图表照片代码等，<figcaption>定义<figure>的标题。
##### What are some of the key new features in HTML5?
Key new features of HTML5 include:
- Improved support for embedding graphics, audio, and video content via the new <canvas>, <audio>, and <video> tags.
- Extensions to the JavaScript API such as geolocation and drag-and-drop as well for storage and caching.
- Introduction of “web workers”.
- Several new semantic tags were also added to complement the structural logic of modern web applications. - These include the <main>, <nav>, <article>, <section>, <header>, <footer>, and <aside> tags.
- New form controls, such as <calendar>, <date>, <time>, <email>, <url>, and <search>.
##### 页面加载
- 加载资源形式：
  输入url或者跳转页面加载html
  加载html中静态资源：js，css

- 加载资源过程:
  1. 浏览器根据DNS服务器得到域名ip
  2. 向这个ip机器发送http请求
  3. 服务器收到并处理http
  4. 浏览器得到返回内容

- 渲染页面过程
  1. 根据HTML结构生成DOM tree
  2. 根据css生成cssom。css要放在head中，在渲染body时就已经考虑过样式了，避免反复渲染
  3. 将dom和cssom整合形成rendertree: rendertree每个节点中包含样式
  4. 根据rendertree开始渲染展示
  5. 遇到script会执行并阻塞渲染。需要把js放在body最下面，不会阻塞渲染，同时script能拿到所有标签

##### 题目
##### 输入url到得到html的详细过程
  1. 浏览器根据DNS服务器得到域名ip
  2. 向这个ip机器发送http请求
  3. 服务器收到并处理http
  4. 浏览器得到返回内容

##### window.onload 和 DOMContentLoaded区别
  window.onload：页面全部内容加载完才行，包括图片视频 `window.addEventListener("load", function () {})`
  DOMContentLoaded：DOM渲染完就好了，此时图片视频可能没有加载完
##### http和https的区别和特点?
- 详细解析 HTTP 与 HTTPS 的区别 https://juejin.im/entry/58d7635e5c497d0057fae036
- HTTP：是互联网上应用最为广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。
- HTTPS：是以安全为目标的HTTP通道，简单讲是HTTP的安全版，即HTTP下加入SSL层，HTTPS的安全基础是SSL（Secure Sockets Layer），因此加密的详细内容就需要SSL。
- HTTPS协议的主要作用可以分为两种：一种是建立一个信息安全通道，来保证数据传输的安全；另一种就是确认网站的真实性。
- HTTPS和HTTP的区别主要如下：
  1、https协议需要到ca申请证书，一般免费证书较少，因而需要一定费用。
  2、http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
  3、http和https使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。
  4、http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。
##### 性能优化
  - 原则：
    多使用内存缓存或者其他办法
    减少cpu计算，减少网络

  - 加载页面和静态资源
    1. 静态资源合并压缩：三个js合并成一个，减少请求次数，并压缩
    2. 静态资源缓存:通过链接名称控制缓存，只有内容改变时候链接名称才会改变
    3. 使用cdn让资源加载更快：cdn会转到地理近资源（bootcdn）
    4. 使用ssr后端渲染，数据直接输出到html:
      vue react 提出这样概念。jsp php aso都属于后端渲染

  - 渲染优化
    1. css放前面。js后面
    2. 图片懒加载，下拉加载更多

      ```
      //懒加载
      <img id="img1" src="preview.png" data-realsrc="abc.png"/>

      <script>
      //先放个预览图贼小的，等需要用的时候再把src换成data-realsrc中真图链接
        var img1 = document.getElementById("id1");
        img1.src = img1.getAttribute("data-realsrc");
      </script>
      ```
    3. 减少DOM操作，多个操作合并在一起执行：缓存DOM查询+合并DOM插入

      ```
      //缓存DOM查询

      var pList = document.getElementsByTagName("p");//一次全部查出来
      var i;
      for (i=0; i< pList.length; i++) {}

      //合并DOM插入
      var listNode = document.getElementById("list");
      //要插入10个list标签
      var frag = document.createDocumentFragment(); //定义片段
      var x, li;
      for (x=0; x<10;x++) {
        li = document.createElement("li");
        li.innerHTML = "list elem" + x;
        frag.appendChild(li);// 先插入到这个fragment里，然后将fragment一次性插入listNode
      }
      listNode.appendChild(frag);
      ```
    4. 事件节流

    ```
    //采集输入框的内容，直接等0.1秒再执行change函数

    var text = document.getElementById("text");
    var timeout;
    text.addEventListener("keyup", function () {
      if (timeout) {  //每次输入（keyup）看有没有timeout，有则清空。这说明之前也有输入。
        clearTimeout(timeout);
      }
      // 每次keyup后都等100ms再操作
      // 这样结果就是等最后一次keyup后100ms再操作
      timeout = setTimeout(function () {//change}, 100);
      })

    ```
    5. 尽早执行操作（如DOMContentLoaded）

##### 安全性 xss
##### xss跨站请求攻击
  新浪博客写入文章，同时偷偷插入一段script
  攻击代码中获取cookie，发送自己服务器。通常有账户信息
  发布博客，有人查看
  会把查看者cookie发送到攻击者服务器

- 预防
  前端替换关键字。例如替换<为&lt
  通常后端替换

##### xsrf跨站请求伪造
  你已经登陆一个购物网站，正在浏览商品
  该网站付费接口是。。但是没有任何验证
  然后你收到一个邮件，隐藏<img src=..>
  你查看邮件是偶，就已经悄悄付费购买了
- 跨站请求伪造（攻击者盗用你的身份，以你的身份发送恶意请求），一次CSRF攻击的步骤：
    登录受信任的网站A，并在本地生成cookie
    在不登出A的情况下，访问危险网站B
- 解决：增加验证流程指纹密码短信验证码
##### 问题
- 常见前端安全性问题有哪些
##### http并发请求资源数
- 理解浏览器允许的并发请求资源数 https://segmentfault.com/a/1190000016369295
- 对每一个host限制个数2、4或8
- 先说结论：
  1. 浏览器的网络请求资源数是针对单一域名的。
  2. 不同浏览器，不同http协议版本允许的网络请求资源数是不一样的（具体自行百度），不过总的来说在2-8个之间。
- 对页面加载的影响：
  假如一个页面有120个静态资源（css、js、img），并且所有资源都在一个域名下，使用的浏览器最大网络并行请求资源数是6，假设理想一些：所有请求时间都是一样的，每个文件加载需要500ms，则所有资源加载完成需要 120/6 * 0.5 = 10s 的时间。
- 针对性的优化方案
  1. 减少网络请求数：
  （1）使用css spirit，将图标合成在一张图中，减少图片数量，减少http请求数
  （2）使用打包工具合并css和js，减少文件数量，减少http请求数
  2. 增加静态资源来源
  （1）将静态资源分布在不同的服务器中，使用多个域名，加大并发量
  （2）将静态资源和html文档分放在不用的域名下也有另一个原因，每次页面请求都会将相同域名下的cookie带给服务器端，实际上静态资源带上cookie是没必要的。
  跟缓存相关的HTTP请求头中有三个字段：Cache-control、Expires（指定具体过期日期）、Last-Modified（验证资源是否过期）。

##### http缓存机制流程
- HTTP缓存机制详解 https://juejin.im/entry/599afbe5f265da247c4ee6e3

关于优先级，Cache-Control比Expires可以控制的多一些， 而且Cache-Control会重写Expires的规则Cache-Control比Expires可以控制的多一些， 而且Cache-Control会重写Expires的规则，Cache-Control是关于浏览器缓存的最重要的设置，因为它覆盖其他设置，比如 Expires 和 Last-Modified

Mainfest可以缓存一个应用，pwa中有Mainfest和Service Worker可以实现缓存

##### css雪碧图可以优化http请求数，减少请求数，但具体如何节省了时间
这样做有什么好处呢？我们做一个简单的实验：
假设我需要有一个列表，每一行列表都需要一个自己的修饰符。如果使用普通的img来放置这些图片：
使用chrome开发者工具来监视网页载入时的情况就会发现，浏览器在载入每一张图片的时候都会发起一个HTTP请求。过多的HTTP请求显然对后台是一个额外的开销。
出现了5个HTTP请求
如果使用CSS Sprites技术，将所有的图片合成一张图片，那么，这5个HTTP请求会被合成一个HTTP请求。
合并成1个HTTP请求了
这样就能大大降低后台服务器的开销。
- 首先将几个小图片合成一张大图片，保存为bg-group.gif
- 此时将img元素全部去掉。
- css中设置所有li的background-img都是这张图
- 对于每一个不同的li标签。使用background-position属性调整背景图的显示部分
##### 面试技巧
- 简历：
 简洁明了，重点突出项目经历和解决方案
 把个人博客放在简历中，并且定期维护更新博客
 把个人开源项目放在简历中，并维护开源项目
 简历不要造假，要保持能力和经历上真实性

- 过程中
  如何看待加班：加班就像借钱，救急不救穷
  不要挑战面试官，不要反考面试官
  给面试官惊喜。多答一点。但是不要太多
  遇到不会回答的问题，说出知道的就可以
  谈谈你的缺点：说一下最近你在学的东西
