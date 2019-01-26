1. 这是一个部门内部的管理系统，类似于trello+google callender的效果。因为证券公司的运维部经常要安排交易环境测试，所以希望这个系统能够支持任务发起(安排某人某天值班测试)，领导可以审批，然后分配好的测试任务会在日历上显示为待办事项，同时测试人员也需要在系统上填写测试反馈。但是leader希望把它开发的炫酷一点，首先希望开发一个单页应用类型的网站，其次希望满足前后端双向通信功能，比如分配了某人这周一值班测试，服务器会主动给这个人发送1个消息提醒，系统上就会有一个新消息提醒。然后开发技术是仅限于JQuery和bootstrap，因为leader希望用现有的他掌握的成熟技术来处理，前后端通信是使用的websocket和ajax结合的方式。
2. 使用web socket的原因是希望实现前后端双向通信。这样服务器也可以对用户主动发送消息。而仍需要使用ajax的原因是websocket只有在进入主页面之后才会建立链接，所以登陆还是需要ajax。同时，因为工作系统中
涉及很多表单的填写，而出于布局的考虑，表单是以页面弹窗的形式出现的。而我们弹窗效果是依靠layui.js这个库，普通弹窗(非iframe)只能传入HTML字符串，对于我们这种复杂的表单并不合适。所以只能使用layui的iframe页面。
由于iframe相当于新开的一个页面，当前主页面上面已经建立的websocket 链接无法在iframe中使用，所以表单内容的上传还是得使用ajax
3. 使用了很多第三方库来实现各种页面交互效果，比如说使用了dropzone.js实现拖拽上传功能，使用fullcalendar.js实现工作日历的功能，summernote实现表单中文本编辑的功能。 Footable实现具有动态搜索功能的列表
4. 难点：没有使用成熟的框架解决方案，而使用jquery去暴力破解
  - 页面内容更换是依靠请求写好的html文件，以html字符串的格式接受，然后利用Jquery直接替换掉当前内容。这个页面的交互函数是写在html中的，随html一同加载。这样性能上就不如react vue这种值更新已经改变的值
  - 由于各种js最终都会被加载在同一个页面上。所以需要把公用的函数封装在一个命名空间中(也就是一个大的全局对象中，这样值占用了对象名称这一个命名空间)，避免命名空间冲突
  - 代码复用性的问题。因为html都在这一个页面上，所以要尽可能的复用代码。由于没有用框架，所以只能手动封装组件。在这个系统中就封装一个展示列表组件。根据传入json数据来生成表格。表格每个格子都是绑定了点击事件。如果只是简单的复用内容，那么就直接复用一段html字符串
    取表格的数据依靠的是自定义html标签属性
  - iframe页面和主页面的数据通信问题，因为实际上iframe已经是一个独立的页面，存储在session storage中的用户信息是没有办法被获取的。这个时候就只能依靠服务端渲染html时候在页面上插入一个变量来达到通信的目的
  - 没有路由管理
  - 没有node.js的本地服务器，有跨域的问题
  - 这么一套弄下来，最终效果不说，代码可读性就低了


//----------------------------------------------------------------------------------------------------------]

##### 6.11
完成了搭建服务器，trello，git（bitbucket）,vpn
下载了sourcetree, gitextension(git界面), RESTclient, filezella(给服务器传文件)，xshell(操作linux服务器)

lazyload使用websocket直连

- 需要复习
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
http mime
页面的增删改查用数据表格的方式写上

- 需要准备:
private
public key是什么
linux常用命令
git 命令复习，以及熟悉使用操作界面而不是命令行

页面lazyload:
  1.underscore.js知道功能即可
  2.zepto

- ajax封装，
cascade级联函数的写法，可能需要将ajax做成一个大的，同时callback函数是传入的
可能就是写一个对象？

##### 6.12
- 使用ajax写出对后端增删改查四个操作
- promise解决异步顺序问题并实现链式操作

1. https://segmentfault.com/a/1190000008486570
2. https://borninsummer.com/2015/06/02/using-promise-to-carry-out-multi-ajax-procedure/

```
var getAjaxPromise = function(option){
  if (option.data) {
      var d = JSON.stringify(option.data);
  }
    return new Promise(function(resolve, reject){
      var defaultPara = {
          url: option.url,
          type: option.type,
          data: JSON.stringify(option.data) || '',
          contentType: 'application/json',
          datatype: 'json',
          success: function(data){
            if (data.errno === 0) {
                resolve(data);
              } else {
                reject(data);
              }
          },
          error: function(error){
              console.log(JSON.parse(error.responseText).error);
              reject(error);
          }};
      var para = $.extend(true, {}, defaultPara, option);
      if (d) {
        para.data = d;
      }
      $.ajax(para);
    });
};

/* 启动第1个异步任务 */
var p1 = getAjaxPromise({
    url: 'http://192.168.41.230:5000/rest/v0.1/modules',
    type: 'GET',
});

p1.then(function(data1){
    /* 处理第1个异步任务的结果 */
    console.log(data1);
    /* 然后启动第2个异步任务 */
    return getAjaxPromise({
      url: 'http://192.168.41.230:5000/rest/v0.1/modules',
      type: 'POST',
      data: {
          "category": 1,
          "name": "zzzzzzz",
          "url": "xxx",
        },
      contentType: 'application/json'
    });
})
.then(function(data2){
    /* 处理第2个异步任务的结果 */
    console.log(data2);
    /* 然后启动第2个异步任务 */
    return getAjaxPromise({
        url: 'http://192.168.41.230:5000/rest/v0.1/modules',
        type: 'GET',
    });
}).then(function(data3) {
  console.log(data3);
});

```
- 原本链式操作对象解决方案:
是无法实现的，因为没有办法在return this的方式下保证ajax按照顺序执行

```
function AJAX(url) {
  this.url = url;
}
AJAX.prototype.get = function (successCB, errorCB, id=null) {
  if (id) {
    this.url += '/' + id;
  }
  var para = {
      url: this.url,
      type: 'GET',
      datatype: "json",
      success: successCB,
      error: errorCB,
  };
  $.ajax(para);
  return this
}
AJAX.prototype.post = function (successCB, errorCB, data=null) {
  var self = this;
  var para = {
      url: self.url,
      datatype: "json",
      contentType: "application/json",//这个是必须加上的，因为要让服务器知道传入的数据类型
      type: 'POST',
      success: successCB,
      error: errorCB
  };
  // console.log("data");
  // console.log(data);
  if (data) {
    para.data = JSON.stringify(data);
  }
  // console.log("para");
  // console.log(para);

 $.ajax(para);
 return this;
}
function successCB (callback) {
  if (callback.errno === 0) {
    console.log(callback);
  } else {
    console.log(callback);
  }
}
function errorCB (err) {
  console.log(err);
  console.log(JSON.parse(err.responseText).error);
}
var ajax = new AJAX('http://192.168.41.230:5000/rest/v0.1/users');

```
- 预习内容
- websocket前端内容
- 推送到rest分支上

##### 6.14
- 用websocket完成6.13中的增删改查四种操作
1. 让json字符串更易读
  https://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript

2. zepto ".class"如果获取的只有一个那么就是zepto对象。但是如果这个class对应许多个对象。那么返回的结果就是一个数组，切记里面的每一项都是 DOM对象而不是zepto 不能用zepto的属性方法

3. 原计划是增删改查直接把json数据写在textarea中发送，但是后来更改成了填在input内。然后获取到

4. 原本每个fc对应的input们是写死在html中的。下午变为了从json数据创造DOM。json数据为一个数组。数组中包含对象。每个对象包含一个FC 值，还有一个field数组用于装对象。数组中每个对象包含名称和input box 的类型

5. 原生JS的DOM创造的方式 createElement, setAttribute, appendChild;

6. 功能号(function code): 因为websocket不能像restful api那样在url的"/"后面加id或者其他信息。因此对不同对象进行不同操作需要用fc来区别，也就是一个fc表示对一个对象的一种操作。

7. id class 是可以用数字的

##### 6.15
1. 移走字符串中的所有空格：https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text/6623263

2. 如果希望将websocket有关的内容在AJAX请求DOM内容完成后(也就是loadPage执行完成之后再执行)。可以将websoecket内容包在函数中，并且先于loadPage加载。然后在loadPage中ajax请求的success回掉函数中执行websocket函数

3. 前端实现页面跳转的几种方法: http://qianduandu.com/277.html

4. try-catch用来处理有报错危险但是又不能完全避免的情况

5. disable button
http://www.w3school.com.cn/tags/att_button_disabled.asp

- 周末研究:
前端向后端发送文件的方式？
websocket VS。 RESTful
研究两种方式分别如何实现并做比较

##### 6.19
- 根据后端对function code修改在前端进行对应修改
- 在json中补上了后端新加上的fc
- 修改了fc选择框, 把每个fc对应的名称也加了上去
- 研究懒加载ajax VS. vue

问题；
输入用户名1，时候，正常显示，localStorage有值
输入用户名qq邮箱时候，不能显示，localStorage为null，没有东西
这里是因为localStorage没有成功储存内容
因为原本的页面跳转是由form的action驱动的。它会越过绑定事件直接执行跳转。
因此放在绑定事件中的localStorage无法被执行
解决方案是删掉form中的action并button中的type为button、而不是submit
跳转页面用window.href

- 页面懒加载的想法:
左边菜单栏的点击事件中绑定ajax请求
根据菜单栏的id确认需要请求的页面部分
根据token和登陆返回的信息确认权限返回对应部分
对应部分的json包括插入值，插入DOM的id
交互事件，比如点击一个DOM元素后样式改变/取值，在ajax后的success回调函数中进行绑定

##### 6.20
1. 整理index.html的页面内容
2. 实现页面的懒加载
  当页面打开的时候就开始加载页面所有内容，如果用户点击菜单时候
  这时候就用先判断对应有没有加载好，如果没有就异步加载
  - 页面已经预留好了模板填充位置，id名和server里面的文件名相同
  - 填充这个页面数据的函数名称为id+"loadPage"
3. 已经实现异步加载.html文件，但是对应的css和js怎么办? 目前的处理方法是全部放在被插入页面中。页面插入后回调函数就

4. htmlString末尾的script在这一部分被插入之后会被执行，且在其中可以调用全局变量

5. 全局变量如果非常多的话就需要封装在一个变量中，相见to_review中的common.js
各个公用函数或者变量都封装在二级甚至多级命名空间中，也就是mx.二级.三级

6. websocket遵循的规律是在commonjs中规定好公用的 建立连接绑定回调的函数：

```
api.initWebsocketConn = function(url, on_open, on_close, on_msg, on_error) {
  // url: 'ws://192.168.41.230:8000'
  ws_conn = new WebSocket(url);

  ws_conn.onopen = on_open;
  ws_conn.onmessage = function(evt) {
    var data = JSON.parse(evt.data);
    // If it's a response
    if(data.cref) {
      api.popCallbackWithRef(data.cref).function(data.content);
    }
    on_msg(data);
  };
  ws_conn.onerror = on_error;
  ws_conn.onclose = on_close;
}
```
同时规定好附在每个需要插入的模板页面之后，用于发送信息的，通用函数

```
api.invoke = function(opcode, params, func) {
  var ref = mx.utils.uuid();
  var msg = {
    "fc": opcode,
    "content": params,
    "ref": ref
  };

  var ws = api.getConn();
  if(ws) {
    ws.send(JSON.stringify(msg));
    api.pushCallback({
      "ref": ref,
      "function": func
    });
  }
  else{
    alert('ws 没准备好');
  }
};
```

7. 同理其它类型的操作，例如ajax的公用模板，也包含在命名空间中，然后在页面分别调用

 ```
 async.get = function(data_type, url, success_handler, error_handler) {
   $.ajax({
     url: url,
     type: 'GET',
     dataType: data_type,
     success: success_handler,
     error: error_handler
   });
 };
 ```
8. 注释掉inspinia.js中的   // $('#side-menu').metisMenu();
否则下拉菜单的动画消失

9. chrome允许本地ajax请求：
Cross origin requests are only supported for HTTP? - 王石石石的回答 - 知乎
https://www.zhihu.com/question/20948649/answer/256887902

10. 全局中创建一个对象，当首次加载完页面的一个部分之后，将页面的html string，包括后面的script进行存储。 每次点击加载一个部分时前就先查询这个对象里面有没有对应url，如果有就部加载直接拿对象里的html string

11. 对于每个加载页后面除websocket以外的操作，都注册进一个列表，然后每个task完成都有一个回调函数移除列表中该task，然后检查列表长度是否为0，是的话就代表这个页面彻底加载完了。可以把DOM中旋转菊花移除
##### 6.21

1. 完成加载页面时候的等待图标：
  - style=position: absolute; width: 100%;right: 0; bottom: 0; top: 0; z-index: 100;background-color:white; display: none
  - 在点击左边菜单的回调函数中让它显示
  - 在commonJS的ui.regPartialPageInitTask函数中的`if(_task_queue.length == 0)`，也就是判断页面操作完成了，中让它隐藏

并修改了页面缩放到155px高度时候高度无法改变的问题
需要修改inspinia.js中fix_height()函数
2. JS动态改变header中link内容:https://segmentfault.com/q/1010000007032993
3. 完成了菜单管理的页面加载（通过功能号请求所有菜单并加载）

##### 6.22
1. tree_view中的tree节点无法绑定点击事件?
jquery 禁止鼠标右键并监听右键事件: https://blog.csdn.net/kissxia/article/details/41512281

```
$("#using_json").bind("contextmenu",function(e){
    return false;
});
```
2. 怎么知道点击的是哪个菜单?
将菜单的信息作为标签插在dom中，直接通过attr性质就知道他的所有data内容了，这样就很容易通过数据中的id属性得知我们点击的是哪一个?

3. http://www.maiziedu.com/article/664/
JS中事件绑定是叠加的，因此如果同一个dom被绑定了两次click事件，那么每次点击时候就会触发两次绑定的事件
所以不要重复绑定

4. 菜单管理页点击"确认修改"按钮的逻辑:
  1. 获取操作的模式名称,和对应功能号, 比如修改/新增/删除
  2. 根据操作方式获取所需的参数/ i.e. display不是none的
  3. 用websocket发送获取的信息
  4. 在第一次callback中判断errr number是不是0，是的话就发送一次100101的请求来获取全部菜单
     并且在这个第二次callback中执行cb_load来重新填充数据，但是切记不要再执行cb_bind, 因为重复绑定的事件会被一次执行

5.

6. reInitPartialPageContainer()每次加载partial page时候都要调用它

##### 6.26
- 今日事项
  1. 用户管理页面的排版和css
  2. 点击菜单后将用户页面插入index.html中
- 填充页面逻辑
   1. 获取data后，分别执行渲染列表，渲染详情，渲染更改块的函数
   2. 搜索框输入目前是用户的id，点击搜索后地调用100201和100207分别对该id的用户信息和权限信息进行请求，因此对这两部分信息的渲染也是分别写在不同的函数中的
   3. 每次搜索后会清空信息详情框中的内容，然后根据返回值重新渲染
   4. 用户信息操作台内容固定，因此仅在首次加载页面时候 根据tgt_val内容渲染
   5. 点击确认修改后根据model选择相应的功能号发送请求。然后如果回调函数error message == 0 时候就再执行一个100201 100207请求来得到更新后的用户信息和权限，并刷新页面内容


1. input仅显示内容不能输入: http://www.w3school.com.cn/tags/att_input_readonly.asp
2. 如何获得select被选中option的value和text:https://blog.csdn.net/ityang521/article/details/70217320
3. 100203修改用户这个功能号和100204删除用户这个功能号 有bug？疑似后端问题
4. 需要一个查询全部用户的功能号，否则否则列表无内容渲染
5. 发送请求的feedback格式不一：有时叫id（例如100202新增用户），有时叫user_id(例如100205增加权限)
6. jQuery实现动态搜索显示功能: https://www.cnblogs.com/linjiqin/archive/2011/03/18/1988464.html

##### 6.27
- 交互要求
  1. 修改用户登陆页面的css
  2. 表格silmscroll
  3. 点击表格本身弹出框显示详细信息
  4. 点击修改按钮弹出修改的界面
  5. 修改界面的交互，需要放在layer.open 的回调中绑定
1. 给tr绑定点击事件：
 https://stackoverflow.com/questions/9642776/click-event-listener-on-a-tr
2. layer弹窗：http://www.layui.com/doc/modules/layer.html#closeBtn
3. layer中向弹窗传值并改变内容： https://blog.csdn.net/ReturningProdigal/article/details/53541337
- 待办:
1.  还需要封装layer函数?必要性
2. 加上请求全部用户的功能号功能

##### 6.28
- 交互要求
    1. 点击搜索，左侧栏更新（请求全部用户并渲染），修改弹窗关闭，列表数据更新
    2. 首次打开页面时候请求并渲染所有用户
1.  采用粘贴页面测试方案的时候记得将init的调用放在main.js中的onopen中，确保其在websocket连接成功之后执行
2. 页面交互函数都放在manager这个对象里面作为方法
3. 决定开始封装组件。把列表封装成一个组件，根据传入数据自动渲染绑定数据。
   封装组件：因为列表会反复使用，避免以后反复写同样的内容
   封装好之后，对于每个列表，只用传入对应的列表数据和绑定事件然后自动生成
4. 采集用户输入数据时候，有诸如user_id这种需要parseInt的输入框值。所以渲染输入框的json数据里面要带上dataType这个属性，来区别收集数据的格式
5. 同时对每种功能号还需要一个json数据来渲染输入框，因为每种功能号需要的参数种类都是不同的

- 下一步计划：
 1. 等待组件封装好再基于组件开发列表
 2. 完成右下角的链接状态更新，断开链接出现弹窗
 3. 完成日历的作用

###### 6.29
-  日历需求:
  1. 事件按照等级有不同的颜色
  2. 点击按钮出现弹窗，在弹窗上填写日期之后点击确认前往指定日期
  3. 待办事项日期，事情的等级都储存在json数据中
  4. 在发送calendar数据时候，要防止输入无效数据报错:
    ```
    try {
      $('#calendar').fullCalendar("gotoDate", m);
    } catch (e) {
      layer.alert("请输入有效的日期");
    }
    ```

- 待办事项
  1. 研究封装了的列表组件，读封装源码

1. fullcallendar: https://www.cnblogs.com/mycoding/archive/2011/05/20/2052152.html
2. 显示为中文: https://blog.cnbattle.com/archives/51.html

3. 异步的坑: 异步操作中修改数据，使用这个数据的时候必须是在异步后面的.done()中执行，不能直接写在异步这段代码的下面，因为这时候已经是一个多线程操作了，不是说上面一行执行完再执行下面一行，而是很可能在执行完修改变量之前就使用了这个变量。这样会产生很多奇怪的错误

##### 7.2
- ui日历部分和服务器的数据交互
  1. 每次打开日历都从服务器取一次日历数据，因为可能会有待办事项更新
  2. 取到的数据存在一个变量中，点击每个事件时候根据id从里面取事件细节
- 批量向服务端添加测试用例：
  1. 写一个链式的发送send（）的函数，用于发送测试用例---commonJS.chain_invoke。必须有一个链式调用的功能，因为有一个测试gg，测试就是失败。后面的就都不用执行了
  2. 创建一个测试用例的列表，运用这个promise——invoke向服务器发送
  3. 中断或者取消promise链 https://blog.csdn.net/cwzhsi/article/details/51137809
  4. 我的解法(错误的)：

    ```
    // promise chain invoke
    api.chain_invoke = function (opcode, params, func) {
      var ref = mx.utils.uuid();
      var msg = {
        "fc": opcode,
        "content": params,
        "ref": ref
      };
      var p = new Promise( function (resolve, reject) {
        var ws = api.getConn();
        if(ws) {
          ws.send(JSON.stringify(msg));
          api.pushCallback({
            "ref": ref,
            "function": func
          });
        }
        else{
          alert('ws 没准备好');
        }
      });
      return p;
    };
    ```
    这里不正确的点在于，chain_invoke内相当于发送了请求并把对应的cb函数放进了一个cb的queue中
    仅仅只是执行了一段操作，无论如何都会success的，不会有failure的问题。这样做不到（执行完第一个异步视结果决定是否执行下一个异步）的效果
  5. 问题的难点在于，异步执行的内容只能在onmessage中调用，执行结果无法在chain_invoke中知道，相当于在chain_invoke中又执行了一段异步。而onmessage中又无法return promise，return了没有办法传出。所以思路是在chain_invoke中setInterval来不停检查cb_queue中那个cb有没有执行完，执行完了就clearInterval然后返回新promise

  ```
  (function (api) {

      // onmessage时候检测cref的长度，16位是普通的异步请求，pop出任务执行即可，20位是需要用promise的请求，
      // 仅执行但是不pop出去，并记录执行结果
      ws_conn.onmessage = function(evt) {
        var data = JSON.parse(evt.data);
        // If it's a response
        if(data.cref) {
          if(data.cref.length == 16) {
            api.popCallbackWithRef(data.cref).function(data.content);
          }
          else {
            api.executeCallbackWithRef(data.cref, data.content);
          }
        }
        on_msg(data);
      };
      ws_conn.onerror = on_error;
      ws_conn.onclose = on_close;
    };


    api.chainInvoke = function(opcode, params, func) {
      var ref = 'sync' + mx.utils.uuid();
      var msg = {
        "fc": opcode,
        "content": params,
        "ref": ref
      };
      // 绑定cb并发送
      var ws = api.getConn();
      if(ws) {
        ws.send(JSON.stringify(msg));
        api.pushCallback({
          "ref": ref,
          "function": func
        });
      }
      else{
        alert('ws 没准备好');
      }

      // 返回一个新的promise，其中setInterval检测之前绑定了的cb的返回结果，
      // 如果没有执行完返回的是none，执行完返回的是errno。此时clearInterval，并根据errno决定是resolve还是reject

      return new Promise(function(resolve, reject) {
        var handler = setInterval(function(){
          var exec_result = api.checkCallbackType(ref);
          if(!exec_result) {console.info('这里在循环监测');}
          else {
            clearInterval(handler);
            if(exec_result == 0) {
              resolve();
            }
            else {
              reject();
            }
          }
        }, 100);
      });

    };


    //找到queue对应的ref的cb，返回执行结果
    api.checkCallbackType = function(ref) {
      var i = callback_queue.length;
      while(--i >= 0) {
          if(callback_queue[i].ref == ref) {
              return callback_queue[i].exec_result;
          }
      }
      return null;
    };

    //对于promise类型的请求，仅执行但是不pop出去，并记录执行结果
    api.executeCallbackWithRef = function(ref, params) {
      var i = callback_queue.length;
      while(--i >= 0) {
          if(callback_queue[i].ref == ref) {
            callback_queue[i].function(params);
            console.info(params);
            console.info(params.errno);
            callback_queue[i].exec_result = params.errno;
          }
      }
      return null;
    };

  }(mx.api || mx.createNS('mx.api')));

  ```
  6. resolve(para),和reject(para)中的参数会分别被当做后续then和catch中回调函数的参数,可见6.12的日记



##### 7.3
- 尝试动态加载css和js，发现加上标签之后的js并不一定按照标签顺序运行。推测其中存在异步流程。因此尝试使用promise来使之顺序异步执行
  ，失败。于是暂时依旧将js标签挂在子页面上面然后动态加载css。因为css并没有顺序依赖关系，所以即使由于异步加载顺序不是我们想要的也没有关系

- 任务
  完成了添加/修改的ui

##### 7.4
- 增删改查日历任务的显示
  1. 任务发起人的id如果要从sessionStorage中获取: `JSON.parse(sessionStorage.menu)[0].user_id.id`
  2. 打开页面时候先获取可供选择的任务接收人的列表，渲染到任务接收人的option中
  3. 新的iframe页面无法从旧的中获取sessionStorage，也无法利用websocket。所以发哦是那个请求是用ajax，userid则由主页面发送给服务器，然后服务器将收到的值直接传入iframe，这样打开就能直接调用
  4. 点击保存修改后关不掉iframe，日期选择下拉框被不明遮挡.... 前者解决方案有跨域问题，后者未解决

##### 7.5
- 增删日历任务的完善
  1. 任务接收人的渲染
  2. 点击删除出现确认框


- 日历完善
a.日历自定义控件：
  1.下拉复选框：可以勾选/勾除某类型的工作任务

b.日历partial page的重新布局
  1.新增右侧panel，以列表形式展示所有工作任务
  2.页面初始化时参考window的size，尽可能避免滚动条出现。浏览器resize时能否动态调整大小（在partial page中写resize事件）？

- 元数据管理页面 -- 使用DataTable组件
  .数据典管理
  2.交易日管理
  3.交易市场管理
  4.测试环境管理

1. 判断选择框是否被选中：https://www.cnblogs.com/hubing/p/4816993.html
2. Bootstrap Multiselect插件使用步骤以及常见参数配置介绍: https://blog.csdn.net/fangzilixia/article/details/51265112
https://blog.csdn.net/u012149181/article/details/79914473
3. 获取multiselect的值: `$("#example-multiple").change(function(e){console.log($(this).val())})`
 什么都没选就是null返回


##### 7.6
- 日历完善
  1. 完成下拉复选框
  2. 右侧panel，以列表形式展示当月所有工作任务，并且随着复选框类型改变而改变。
1. 修改日历内容
`    
    $("#calendar").fullCalendar("removeEvents");
    $("#calendar").fullCalendar('addEventSource', event_list );
`
2. 给prev和next按钮绑定事件

```
viewRender: function(view, element) {
  date_range = [
  $('#calendar').fullCalendar('getView').dateProfile.activeUnzonedRange.startMs,
   $('#calendar').fullCalendar('getView').dateProfile.activeUnzonedRange.endMs
   ];

  collect_task(event_list);

},
```
options中的viewRender是每次渲染完成当前页面之后能执行的

- 待办，完成工单部分
  1. 工单案例： http://www.wo-shdc.com/osshelp/ossWorksHelp/index.html?change_issue_create.htm


###### 7.9
- 事项
  1. 继续完成工单页面UI
  2. 研究summernote如何上传文件
  3. 上传文件之后将上传以后的链接放在描述的末尾，在上传成功的回调函数中删除框中的文件图标并将链接加到summernote的鼠标点击区
  4. 反馈页，发起页， 确认页都在这个页面中，到时候按需display
1. summernote参数，图片上传:
https://blog.csdn.net/qing_gee/article/details/51027040

https://segmentfault.com/a/1190000005124524

2. dropzone 使用:
https://blog.csdn.net/shao508/article/details/47038919

https://www.cnblogs.com/Jhon-Mr/p/7483468.html

https://blog.csdn.net/yangxujia/article/details/36672917
- 待办:
  1. render_inputs
  2. submit完善，将每种的cb都写好
  3. 判断是三种中的哪一种，并正确展示页面
  4. 检查class名称，能否准确display: none
  5. 整理函数


###### 7.10
- 完成工单页面逻辑
  1.  发起工单：--->点击任务列表中的新增按钮时候出现
    a. 初始化dropzone和summernote，拖拽页面上传后删除图标，填充option
    b. 获取用户填写内容
    c. 判断是否有效发送
  2. 只读展示: --->点击任务列表中的任意任务时候出现
    a. 请求页面的工单内容
    b. 填充内容，翻译user内容

  3. 确认页面: --->点击页面右上角消息提示时候出现
    a. 请求页面的工单内容
    b. 填充内容，翻译user内容
    c. 绑定确认拒绝两个按钮的事件

  4. 反馈页面: --->点击日历对应任务时候出现
    a. 请求页面的工单内容
    b. 填充内容，翻译user内容
    c. 收集任务反馈的参数信息和文本信息

  5. 工单和任务分开，新增工单和新增任务的概念不同，被接受的新增工单会被系统自动分配成任务
  6. 由后端直接插入变量

    ```
    var initiator_id = parseInt('{{ initiator_initiator_id }}');//int,发起人id
    var user_list = JSON.parse('{{ user_list | tojson  }}');//list, 接受任务人员名单
    var task_info = JSON.parse('{{ task_info | tojson  }}');//obj, 由后端直接插入的任务列表信息，用于只读，确认，发送
    var page_type; //str，由后端直接插入的页面种类，例如发起页面，只读页面，反馈页面
    var ticket_id;
    ```

1. 前后端介绍:https://github.com/cssmagic/blog/issues/76


##### 7.11
-  完成iframe的元数据-交易市场新增
  1. 动态生成input和select，便于其他元数据复用
  2. 配套根据input和select分类编写获取用户填写的值，对于输入类型单一的效率更高且容易复用

- 完成元数据-交易市场的列表
  1. 依据上周的工作列表修改得来

- 完成工作管理的列表
  1. 依据上周的工作列表修改得来


##### 7.12
- 完成交易市场系统日历, 并制成元数据管理通用模板
  1.  通用函数放在模板中，每个也面使用的inputs和selects，以及启动函数，都写在各自的，只有一个script标签的模板中，加载时先插入script模板然后再使用
- 完成系统测试的列表配置和增删代码


##### 7.13
- 昨天的第一条复用计划被推翻，因为发现没有意义，这样做每次服务器发送给客户端的信息量并没有减少，交易市场系统日历拥有自己的iframe，点击后弹出自己的iframe，不需要共用模板拼接
- 修改交易日标识的功能号尚缺。 后端插入iframe所需的日期变量的代码也是尚缺
- 完成了系统测试的添加部分。这几天进度低迷的主要原因是后端没有进展
   1. testing(iframe)中由服务器直接插入的变量为ctx，里面包含了各种所需的变量。
   2. 同时每个页面的不同阶段ctx中的内容是不同的。
   3. 同时服务器是根据请求iframe页面时候输入的url来判定究竟是何种页面（系统测试还是别的），哪个阶段（新增工单还是接受/拒绝工单）
   4. 工单只有在被接受之后才会在列表中出现
   5. 每一种工作（系统测试，值班清算）拥有自己的工单模板页面
   6. 每一种工作（系统测试，值班清算）拥有自己的功能号（查询，新增），同时也拥有自己的一张表来记录每条工单的数据

- 接受/拒绝工单展示页面（页面右上角下拉菜单）:
  1. 作为一段通过请求得来的外部html，点击右上角图标后请求并插入这段html，再次点击后清空这段html

  2. 内容由html中script的函数动态加载。请求所有的待接受工单（此处需要一个功能号来请求这个用户的待确认工单?）, 并且绑定点击事件:点击每一项弹出iframe的确认页。通过url来告知服务器需要加载确认页，通过？后面的task_id来告诉服务器加载的工单内容

  3. 每一项中应该包括: 发起人， 时间，工单标题

  4. 下拉列表的关闭打开只能通过点击右上角图标完成

  5. 通知用户有新消息的功能应当写在单独的函数/组件中，和下拉列表应该没有关系，每次下拉列表渲染的时候都重新请求服务器的待确认工单然后渲染

  6. 底端有清除全部的按钮

##### 7.16
-  修复登陆页面的bug，修改了服务器user.py和serve_web.py
- 下拉列表
  1. 拿到的待接受工单列表的数据格式需要商榷
  2. 目前是通过传入ticket_id给服务器来让服务器判定返回模板的何种状态。而模板的类型则由url的地址确定
  3. 下拉列表弹出框的'right-sidebar-toggle' class是绑定了模板中函数，使我们自己的函数无法被执行

- 待解决
  1. 按钮的位置问题

##### 7.17
- Vue 和 AST http://hcysun.me/vue-design/art/81vue-lexical-analysis.html
- 企业微信管理要求
  1. 两张表，公众号管理 信息发送查询
  2. 公众号管理：
    a. 所有公众号的列表，增删改查操作
    b. 内容: name名称, agent_id编号, agent_secret密钥, crop_id公司id, enabled是否启用, time创建时间
  3. 信息发送查询
    a. footable 可以只显示特定一个或者几个公众号的信息。
    b. 信息发送两个流向，一是从企业微信客户端发到公众号，二是从公众号发到具体客户端
    c. 信息内容


- 自动化任务管理
  1. 任务配置
  2. 定时执行配置
  3. 任务模板配置，指明有哪些可配置任务
  4. 使用自动化任务管理对微信工作信息提醒作配置，企业微信可以定时发送，也可以由第三方程序互动调用api功能号

- 已完成
  1. 公众号管理的列表页面
  2. 公众号管理--新增公众号


明天要用的footable相关
http://fooplugins.github.io/FooTable/docs/examples/component/filtering.html

```
function append_footable() {
  $("table").attr("data-filtering","true")
  $('table').footable();
  $(".form-inline").addClass("text-left");
  $(".form-inline").find("button.btn-primary").remove();
  $("table").attr("class","table");
  $(".form-inline").find("input").attr("placeholder", "搜索表格内容")
}
```

##### 7.18
- 完成公众号修改页面
- 发送信息查询页面
- 日期时间输入框
  1. "2018-01-02T01:02"输入值的格式，可以直接放进 Date中
  2. input的type是datetime-local
  3. 转换成数据库格式:
    `value.slice(0,4)+value.slice(5,7)+value.slice(8,10) + value.slice(10);`
  4. 转换回来
    `value.slice(0, 4)+"-"+value.slice(4, 6)+"-"+value.slice(6, 8) + value.slice(8)`

- 待办：
  自动化任务管理
  这个页面就是一个select选择任务类型，一个input输入定时发送的时间，
  然后一个textarea放脚本


##### 7.19
- 后台待办
  1. 主页右上角下拉菜单点击时候，需要专门功能号请求该用户的全部待确认任务。

  2. 主页右上角下拉菜单，接受全部和拒绝全部是否需要专门功能号，还是循环所有的待确认消息，逐个发送拒绝

  3. 加上 确认是否接受工单的iframe页面 的地址，同时这个iframe需要选择性展示页面，服务器需要插入ctx的值

  4. 微信公众号增删改列表，请求全部公众号信息，删除公众号信息，修改公众号信息的功能号

  5. 微信公众号增删改列表，新增和修改两个iframe的url



  8. 微信公众号发送信息查询页面，请求全部公众号信息的功能号，以及表格具体内容和json数据中变量命名

  9. 自动化任务管理页面，上传配置好任务 的功能号， 具体任务类型选项的渲染方式？写在本地or服务器获取

  10. 工作台Following field missing: ['name', 'category', 'filename', 'receiver_role_id']

  11. 元数据管理，修改交易日标识 iframe的url

- 完成
  1. 修改系统测试中错误的变量名，修复bug
  2. 修改下拉菜单的数据格式和对应代码，使之符合请求工单之后返回数据的格式
  3.


##### 7.20
- 待办：
  1. 左侧菜单增加新增工单模板

- 坑
  1. summernote内的html string末尾会自带一个/n换行符, 这段内容在json stringify时候不会有问题，但是在jsonparse时候会报错



##### 7.23
http://es6.ruanyifeng.com/
http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html

- 剩余任务:
  1. 请求该登陆用户的被分配工单的功能号
  2. 确认页面的url
  3. 填写反馈页面的url


  4. 修改交易日 iframe中插入字段
  5. 页面状态管理，需要一个变量集中储存当前页面在哪
  6. 日历完成的事情就变成灰色，请求两种状态（接受，完成的）
  7. 工单生成时候打标签
  8. 工单分配任务时候多选指定人

1. 修复日历上面的问题，主要由于数据库字段变化引起
2. 完成confirm feedback
3. 完成批量确认/拒绝
4. 点击页面其他地方打开的


##### 7.25
- Web 研发模式的演变 https://mail.qq.com/cgi-bin/frame_html?sid=wUpp8zjwjz5p82w3&t=newwin_frame&url=%2fcgi-bin%2freadmail%3fmailid%3dZL2025-83gcHdYGT_6pviF6podzI87%26need_textcontent%3dtrue%26s%3dnotify%26newwin%3Dtrue%26t%3dreadmail&r=362bfaaf08cc8c36ba7051aac933180c
