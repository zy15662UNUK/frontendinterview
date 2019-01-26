### inline和block的区别；然后问了为什么img是inline还可以设置宽高
  - display:block

    block元素会独占一行，多个block元素会各自新起一行。默认情况下，block元素宽度自动填满其父元素宽度。
    block元素可以设置width,height属性。块级元素即使设置了宽度,仍然是独占一行。
    block元素可以设置margin和padding属性。
  - display:inline

    inline元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
    inline元素设置width,height属性无效。
    inline元素的margin和padding属性，水平方向的padding-left, padding-right, margin-left, margin-right都产生边距效果；
    但竖直方向的padding-top, padding-bottom, margin-top, margin-bottom不会产生边距效果。

  - display:inline-block
    简单来说就是将对象呈现为inline对象，但是对象的内容作为block对象呈 现。之后的内联对象会被排列在同一行内。比如我们可以给一个link（a元素）inline-block属性值，使其既具有block的宽度高度特性又具有inline的同行特性。

  面试官告诉我这是替换元素决定的，还有textarea也是inline可以设置宽高

### Position的四种值的作用及影响，主要relative和absolute是否脱离文档流以及相对位置
1. static（静态定位）：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。

2. relative（相对定位）：定位为relative的元素脱离正常的文本流中，但其在文本流中的位置依然存在。生成相对定位的元素，通过top,bottom,left,right的设置相对于其正常（原先本身）位置进行定位。可通过z-index进行层次分级。　　relative定位的层总是相对于其最近的父元素，无论其父元素是何种定位方式

3. absolute（绝对定位）：定位为absolute的层脱离正常文本流，但与relative的区别是其在正常流中的位置不再存在。生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过z-index进行层次分级。

4. fixed（固定定位）：生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 "left", "top", "right" 以及 "bottom" 属性进行规定。可通过z-index进行层次分级。

static与fixed的定位方式较好理解，在此不做分析。下面对应用的较多的relative和absolute进行分析：
https://www.cnblogs.com/theWayToAce/p/5264436.html
### 什么是文档流？
- 将窗体自上而下分成一行行, 并在每行中按从左至右的顺序排放元素,即为文档流。
- 只有三种情况会使得元素脱离文档流，分别是：浮动绝对定位和相对定位。
### flex布局介绍:
http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
http://www.ruanyifeng.com/blog/2015/07/flex-examples.html
- flex多行布局时候默认是将元素均分在box中，也就是`align-content: stretch; ` 此时需要用`align-content: start;`来使之犒赏布局。垂直方向没有间隙
### 对flex了解有多少？flex有哪些基本的属性？
就答了一下基本的
- justify-content: flex-start(左对齐) | flex-end(右对齐) | center(居中) | space-between(两端对齐，项目之间的间隔都相等) | space-around(每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍);
属性定义了项目在主轴上的对齐方式
- align-items: flex-start(交叉轴的起点对齐) | flex-end(交叉轴的终点对齐) | center(交叉轴的中点对齐) | baseline(项目的第一行文字的基线对齐) | stretch(（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度)
属性定义项目在交叉轴上如何对齐。
- flex-direction: row(主轴为水平方向，起点在左端) | row-reverse(主轴为水平方向，起点在右端) | column(主轴为垂直方向，起点在上沿) | column-reverse(主轴为垂直方向，起点在下沿);
属性决定主轴的方向（即项目的排列方向
- flex-wrap: nowrap | wrap | wrap-reverse;
### 假设高度已知，请写出三栏布局，其中左右宽度各为300px。中间自适应

- https://jsfiddle.net/zy15662/d5h748y2/35/
1. float
- 优缺点 脱离文档流。但是兼容性好
- 高度未知时候能不能起作用 不能
- 兼容性
2. 绝对定位
- 优缺点 脱离文档流，后面的都得适应它。但是快捷
- 高度未知时候能不能起作用 不能
- 兼容性
3. flex-box。也就是container是display flex 中间是flex：1
- 优缺点 最完美
- 高度未知时候能不能起作用 ok
- 兼容性 好
4. display table-cell https://www.jianshu.com/p/2479665ee1f8
- 优缺点 不足：如果某一个高度超出，其他的也得增高
- 高度未知时候能不能起作用 ok
- 兼容性 好
5. grid布局 这个必须掌握
- 优缺点 新技术 简单
- 高度未知时候能不能起作用 不能
- 兼容性

```
display: grid;
grid-template-rows: 100px;
grid-template-columns: 300px auto 300px;
```

- 注意语义化标签。不要通篇div
- 衍生问题：
1. 三栏布局
  - 左右宽度固定 中间自适应
  - 上下高度固定 中间自适应 https://jsfiddle.net/zy15662/d5h748y2/77/
2. 两栏布局
  - 左宽度固定 右自适应 https://jsfiddle.net/zy15662/d5h748y2/39/
  - 右宽度固定 左自适应 https://jsfiddle.net/zy15662/d5h748y2/39/
  - 上高度固定 下自适应 https://jsfiddle.net/zy15662/d5h748y2/59/
  - 下高度固定 上自适应 https://jsfiddle.net/zy15662/d5h748y2/59/

### CSS 盒子模型(Box Model)
- CSS 盒子模型(Box Model) http://www.runoob.com/css/css-boxmodel.html
- 所有HTML元素可以看作盒子，在CSS中，"box model"这一术语是用来设计和布局时使用。CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：边距，边框，填充，和实际内容。盒模型允许我们在其它元素和周围元素边框之间的空间放置元素
- 顺序是margin border padding content
- 设置的height合并width都是针对content。所以整个盒子的实际宽度还要加上border padding margin `box-sizing: content-box;`
- IE的诡异盒模型idth和height包括了出margin所有内容

### margin 折叠问题
https://www.cnblogs.com/leolai/archive/2012/09/18/2690838.html

### 问题： 谈谈你对盒模型的概念
#### 谈谈基本概念(border margin padding content) IE模型 标准模型， 两者区别 如何在两者转换
- 标准盒模型宽高就只有content部分 `box-sizing: content-box;` 默认
- IE的诡异盒模型idth和height包括了除了margin所有内容 `box-sizing: border-box;`

#### JS 如何设置获取盒模型的宽高
- dom.style.width/height。 这种只能获取内联样式的宽高。写在style标签或者css中取不到
- dom.currentStyle.width/heig 获取真实渲染的高度，缺点是只有IE支持
- window.getComputedStyle(dom).width/height 同上
- dom.getBoundingClientRect().width/height 经常用于计算元素绝对位置。相较视窗左顶点。拿到left top
#### 实例题。根据盒模型解释边距重叠
- 重叠原则就是取最大值
- 父子元素边距重叠，兄弟元素边距重叠。空元素margin-top margin-bottom取较大值
- 计算父元素的高度，子元素高度100，margin-top：10px。父元素加overflow：hidden则其高度为110px，否则为100px http://jsfiddle.net/zy15662/az7fy2x4/15/
### BFC：块级格式化上下文。 IFC： 内联元素格式化上下文
- 原理： 就是渲染规则: 1. BFC垂直方向的margin会发生重叠 2. BFC区域不会和浮动元素区域重叠 3. BFC在页面上是一个独立的容器，外面的不会影响里面的 4. BFC高度时候浮动元素也会参与计算
### 如何创建BFC?
- 给父元素加如下属性
  - display为flex inline-block inline-flex table-cell的元素.
  - overflow为visible之外的元素, 比如auto
  - position为absolute或fixed的元素
  - float为none之外的元素
### BFC使用场景
- http://jsfiddle.net/zy15662/az7fy2x4/46/
1. 消除重叠 让margin-top和margin-bottom能叠加起来
2. BFC不和float重叠。消除左右排版，高度不一致时入侵浮动元素区域情况
3. 清除浮动 子元素float，父元素要变成BFC才能让子元素的高度参与父元素高度的计算
#### 九宫格问题
### 如何实现水平垂直居中

  1.flex布局justify-content+align-items

  '''
  .container{
        display:flex;
        justify-content:center;
        align-items: center;
        height: 400px;
        background-color: green;

    }
  '''

  2.若已知子元素宽高，用absolute+负margin
  '''
    .content{
      position: absolute;
      width:400px;
      height:400px;
      top:50%;
      left:50%;
      margin:-200px 0 0 -200px;
      border:1px solid #008800;
    }
  '''
  3.不知宽高，用absolute+translate或者left:0,right:0,top:0,bottom:0,margin:auto;
  '''
    .container{
    position:relative;
  }

  .#center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }



### 如何将文字超出元素的部分变成省略号（...）

```
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```
### 如何清除浮动？
- CSS清除浮动float的三种方法总结，为什么清浮动？浮动会有: https://segmentfault.com/a/1190000004237437
- 但是当内层元素浮动后，就出现了一下影响：1）：背景不能显示 （2）：边框不能撑开 （3）：margin, padding 设置值不能正确显示
- 原理：清除浮动主要的原理就是在浮动元素的父元素上创建块格式化上下文（Block Formatting Context，BFC），一个BFC中所有的元素都会包含在其中包括浮动元素。很多方式都可以创建一个BFC，所以只要在float元素的父元素上应用以下属性即可在父元素上创建BFC以清除浮动。：
    - display为flex inline-block inline-flex table-cell的元素.
    - overflow为visible之外的元素, 比如auto
    - position为absolute或fixed的元素
    - float为none之外的元素
- 另外，使用clear:both也可以清除浮动：
  - 最好的方法是在父元素上使用伪类:after添加这个用于清除浮动的元素

  ```
  .parent:after {
    clear:both;
    content:'';
    display:block;
    visibility:hidden;
  }
  ```
  - 其次hi再添加一个尺寸为0的子元素，和那些浮动元素平行。然后给这个元素加: `.clear{clear:both; height: 0; line-height: 0; font-size: 0}`


### css中单位em和rem有什么区别？
- rem是相对于根的em，rem即root的em，相对于html根元素
- em是相对长度单位，相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。事实上，根据W3标准，em单位是相对于使用em单位的元素的字体大小。父元素的字体大小可以影响em值是因为继承。
- 总结：rem单位翻译为像素值是由html元素的字体大小决定的。此字体大小会被浏览器中字体大小的设置影响，除非显式重写一个具体单位。
em单位转为像素值，取决于他们使用的字体大小。 此字体大小受从父元素继承过来的字体大小，除非显式重写与一个具体单位。

### 几种方法生成三个并排的大小相等的元素
  1. 三个元素都用百分比控制
    ```
    *{
    margin: 0;
    padding: 0;
    }
    .left,.right,.middle{
      float:left;
      width:33.3%
    }
    ```

  2. container用 display: flex， 然后每个元素用flex:1
### 实现一个页面布局, 左侧栏右边主页面，主页面分上中下三个栏
https://juejin.im/post/5adc5d2f51882567183eb4a9

```
<div class="container">
  <div class="left">aaaaaa0</div>
  <div class="right">
      <div class="test">aaaaaa1</div>
      <div class="test">aaaaaa2</div>
      <div class="test">aaaaaa3</div>
  </div>
</div>
```

```
.test{
  width: 100%;
  background-color: pink;
  border: 2px solid black;

}
.container{
  display: flex;
  flex-wrap: wrap-reverse;
  background-color: blue;
  height: 800px;
}
.left {
  background-color: green;
  flex: 1;
}
.right {
  flex: 3;
  display: flex;
  flex-wrap: wrap;
}
```

### 怎么用CSS实现一个正方形
- css实现宽高动态变化，生成正方形div的2种方式 https://blog.csdn.net/nb7474/article/details/79311792
  两种方法,最常见是：
  1. 使用padding属性来实现.当padding使用%时规定基于父元素的宽度的百分比的内边距。

  ```
  .square1{
    width: 50%;
    padding-bottom: 50%;
    height: 0;
  }
  ```
  注意height必须设为0，让内容自然溢出，然后用padding撑大。同时padding-bottom和width百分比数值要相同
  2. 和第一种类似，使用vw来设置height
### 怎么用CSS实现一个固定宽高的长方形
- 思路和上一题相同，只不过将width和height百分比设置成需要的比例数值
### css3有哪些东西，新特性用过哪些
  1. border-radius，让圆角成为方便的存在。 border-radius:50%;将圆角成为方便的存在
  2. box-shadow， 设置水平、垂直的位移，阴影的模糊、尺寸还有颜色，就可以为元素添加阴影

### transition、transform和animation的区别
transform是指转换，可以将元素移动、旋转、倾斜、拉伸。

translate()，从当前位置移动到由给定left和top值的位置。这个例子中，div向右下移动，如果想要往左上移动，则要设置为负值。

```
div{
    transform: translate(50px,100px);
    -ms-transform: translate(50px,100px);        /* IE 9 */
    -webkit-transform: translate(50px,100px);    /* Safari and Chrome */
    -o-transform: translate(50px,100px);        /* Opera */
    -moz-transform: translate(50px,100px);        /* Firefox */
}

```
rotate()，将元素旋转到给定角度，单位为deg（degree角度），在这个例子中为顺时针30度。负值的话为逆时针旋转

```
div{
    transform: rotate(30deg);
    -ms-transform: rotate(30deg);        /* IE 9 */
    -webkit-transform: rotate(30deg);    /* Safari and Chrome */
    -o-transform: rotate(30deg);        /* Opera */
    -moz-transform: rotate(30deg);        /* Firefox */
}
```
skew() ，将元素倾斜到给定角度，单位也是deg，分别围绕着X轴和Y轴翻转。这个例子中，在X轴顺时针翻转30度，Y轴顺时针翻转20度，负值为逆时针翻转。

```
div{
    transform: skew(30deg,20deg);
    -ms-transform: skew(30deg,20deg);    /* IE 9 */
    -webkit-transform: skew(30deg,20deg);    /* Safari and Chrome */
    -o-transform: skew(30deg,20deg);    /* Opera */
    -moz-transform: skew(30deg,20deg);    /* Firefox */
}
```

scale()，将元素拉伸到指定的倍数，同样设定了X与Y两个方向。这个例子中把宽度拉伸2倍，高度拉伸4倍。有意思的是，负值不是缩小，而是翻转，既水平翻转和垂直翻转。

```
div{
    transform: scale(2,4);
    -ms-transform: scale(2,4);    /* IE 9 */
    -webkit-transform: scale(2,4);    /* Safari 和 Chrome */
    -o-transform: scale(2,4);    /* Opera */
    -moz-transform: scale(2,4);    /* Firefox */
}
```
transform并没有变化的过程，而是直接生成最终效果。transform还有3D方法，就是多了一个Z轴（Opera不支持）

transition是指过渡，可以动画般显示出一个从样式到样式之间的过渡。

上面说过transform没有变化的过程，这样一来就可以动画显示出各种酷炫的效果。
transform的属性包括一个你设定过渡的CSS属性，持续时间，时间曲线还有过渡开始的时间。简单的写法就是将属性都写在transition中

```
div{
    width:100px;
    height:100px;
    background:lavender;
    transition:width 2s, height 2s, background 2s;
    -moz-transition:width 2s, height 2s, -moz-transform 2s; /* Firefox 4 */
    -webkit-transition:width 2s, height 2s, -webkit-transform 2s, background 2s; /* Safari and Chrome */
    -o-transition:width 2s, height 2s, background 2s, -o-transform 2s; /* Opera */
}

div:hover{
    width:200px;
    height:200px;
    background:LightSeaGreen;
    transform:rotate(180deg);
    -moz-transform:rotate(180deg); /* Firefox 4 */
    -webkit-transform:rotate(180deg); /* Safari and Chrome */
    -o-transform:rotate(180deg); /* Opera */
}
```
animation，用@keyframes规则做动画效果。

如果说transition是过渡中的动画效果，那么animation就是专门做动画的。transition是animation的简化，是当属性发生变化的时候，触发过渡动画。就是上面例子中hover的时候，css的属性变化了，那么在transition里面绑定过得属性动画过渡过去。
animation就复杂多了：@keyframes可以有from to，也可以是百分比表示时间帧。
from-to

```
@keyframes myfirst{
    from {background: lavender;}
    to {background: LightSeaGreen;}
}
```
百分比

```
@keyframes myfirst{
    0%   {background: purple;}
    25%  {background: lavender;}
    50%  {background: cyan;}
    75% {background: LightSeaGreen;}
    100% {background:purple;}
}
```
然后再将这个@keyframes绑定到一个元素上。
animation提供了更多属性，包括@keyframes名字、持续时间、速度曲线、开始时间、播放次数等。

```
div{
    animation: myfirst 5s linear 2s infinite alternate;
    /* Firefox: */
    -moz-animation: myfirst 5s linear 2s infinite alternate;
    /* Safari 和 Chrome: */
    -webkit-animation: myfirst 5s linear 2s infinite alternate;
    /* Opera: */
    -o-animation: myfirst 5s linear 2s infinite alternate;
}
```

##### css雪碧图
- https://segmentfault.com/a/1190000007686042
- 不同图标请求的同一个url，但是background-position设置成不同的

```
background-image: url("sprite.png");
background-position: -60px 0px;
width:48px;
height:48px;
```

### CSS样式权重的优先级
http://chenhaizhou.github.io/2015/01/16/css-weight.html

A：如果规则是写在标签的style属性中（内联样式），则A=1，否则，A=0. 对于内联样式，由于没有选择器，所以B、C、D的值都为0，即A=1, B=0, C=0, D=0（简写为1,0,0,0，下同）。

B：计算该选择器中ID的数量。如果有则B=1，没有B=0（例如，#header 这样的选择器，计算为0, 1, 0, 0）。

C：计算该选择器中伪类及其它属性的数量（包括class、属性选择器等，不包括伪元素）。（例如， .logo[id='site-logo'] 这样的选择器，计算为0, 0, 2, 0）（后面将进一解释为什么会是0,0,2,0）。

D：计算该选择器中伪元素及标签的数量。（例如，p:first-letter 这样的选择器，计算为0, 0, 0, 2）。

按照四组计算的正确方法，上面例子中的样式一权重值应该是0, 0, 0, 11，样式二的权重值是0, 0, 1, 0。

根据规范，计算权重值时，A,B,C,D四组值，从左到右，分组比较，如果A相同，比较B，如果B相同，比较C，如果C相同，比较D，如果D相同，后定义的优先。

样式二和样式一的A、B相同，而样式二的C大于样式一，所以，不管D的值如何，样式二权重值都大于样式一。

important 用于单独指定某条样式中的单个属性。对于被指定的属性，有 !important 指定的权重值大于所有未用 !important 指定的规则。

### 伪类和伪元素

伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定的元素时，我们可以通过:hover来描述这个元素的状态。虽然它和普通的css类相似，可以为已有的元素添加样式，但是它只有处于dom树无法描述的状态下才能为元素添加样式，所以将其称为伪类。

伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

(PS: 伪类VS伪元素: http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/ 伪类例子: :first-child 伪元素例子: :first-line)

### 看过哪些Bootstrap源码，Bootstrap有什么特性

### CSS值的解析过程（不是页面，是CSS值），喵喵喵。。。说这个东西在标准里是有的，平时可以看看

### 让我用css实现一个硬币旋转的效果
- https://jsfiddle.net/zy15662/fdxb0me4/11/
- 注意使用border-radius画圆形的时候要先用宽高设置成一个正方形，然后radius长度应该是正方形边长的一半

### 纯css实现parallax scrolling image的效果
- 背景不动 https://www.w3schools.com/howto/howto_css_parallax.asp
- 背景以慢于主体速度运动 https://medium.com/@johnearle/all-in-perspective-2996ee463509

### 使用纯css画上下左右箭头
- 本质上是利用padding撑开一个正方形。然后用border显示剪头的边。最后再通过旋转来控制剪头的指向
- https://www.w3schools.com/howto/howto_css_arrows.asp

### css裁剪图片给图片调色
- 裁剪 http://www.webhek.com/post/css-clip-path.html
- 调色 http://www.cssaaa.com/css3/123.html

### 一个div垂直居中. 其距离屏幕左右两边各10px. 其高度始终是宽度的50%. div中有文本'A'. 其font—size:20px文本水平垂直居中
- 长宽比靠padding-top: 50%; + width: 100%;
- 内部文字绝对定位
- 水平居中靠text-align
- 垂直居中靠 top: 50%; + transform: translateY(-50%);
- https://jsfiddle.net/zy15662/s1v8cjeu/54/
