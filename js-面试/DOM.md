### DOM事件的级别
1. DOM0 element.onclick = function() {}
2. DOM2 element.addEventListener('click', function(){}, false) false是禁止冒泡
3. DOM3 element.addEventListener('keyup', function(){}, false) 增加了更多事件
### DOM事件模型是什么
- 捕获： 从上往下
- 冒泡： 从下往上
### DOM事件流
1. 捕获事件，比如点击鼠标
2. 点击鼠标传递到达目标元素阶段
3. 冒泡，事件向上直到window对象
### 描述DOM事件捕获的具体流程
- window -> document -> html标签 -> body -> DOM 各层
### event对象的常见应用
- event.prventDefault(): 阻止默认事件。比如阻止a的跳转
- event.stopPropagation()： 阻止冒泡
- event.stopImmediatePropagation()： 一个按钮两个点击事件A,B，希望A点击时候不执行B。在A中加上这个就行
- event.currentTarget: 当前绑定事件对象，也就是被委托的父级元素
- event.target: 当前被点击DOM。常用于事件委托考题
### 自定义事件

```
var eve = new Event('custome'); // 创建事件
ev.addEventListener('custome', function(){console.log('custome')}); // 绑定事件
ev.dispatchEvent(eve); // 触发事件
```
这里event不能加数据。customeEvent也可以用来做自定义事件。但是可以传入自定义参数

- http://jsfiddle.net/zy15662/az7fy2x4/77/

### Create a function that, given a DOM Element on the page, will visit the element itself and all of its descendents (not just its immediate children). For each element visited, the function should pass that element to a provided callback function.

- https://jsfiddle.net/zy15662/etgcy3rn/

### DOM 节点查找
- node.parentNode : 返回父节点
- node.childNodes : 返回子节点array
- node.contains: 查找参数节点是否存在于子孙节点中

### 原生js dom操作总结
- https://www.jianshu.com/p/874c7d99f838
- https://juejin.im/post/5ad4474e6fb9a028ba1ff230
- https://juejin.im/post/5a54210bf265da3e47444067#heading-6
- https://harttle.land/2015/10/01/javascript-dom-api.html
