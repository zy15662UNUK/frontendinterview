##### 去哪儿网的项目
1. 主要页面有三个：首页，城市列表页，旅游详情页，这三个组件的地址在vue-router中分别设置，其中旅游详情页是一个动态路由，每个的地址后面都加上了详情页的id
2. 首页由上到下分为五个组件：顶部搜索栏，图片轮播区，图标区，热销推荐，周末去哪儿。五个组件包含在Home.vue这个总的组件中
3. 五个组件的数据均为在Home.vue中请求本地的index.json数据获得，然后通过父子组件传值的方法将请求数据分别发送到这五个组件
4. 在config/index.js中加上模拟端口，将本地的static路径模拟到/api这个路径，用于模仿真实网站的url, i.e. http://localhost:8080/api = http://localhost:8080/static/mock
5. 图片轮播区和图标区都使用了swiper，特别注意下图标区设置。swiper功能是vueawesomeswiper这个库实现的
6. 顶部搜索栏和热销推荐都有使用router-link链接到城市列表页和详情页
7. 城市列表页分成了四个组件：顶部，搜索栏，城市列表，侧边字母索引。可以通过手指在字母索引上面滑动来使列表滚动到指定的位置。
8. 所有的滚动效果都由betterscroll这个库完成
9. 当手指在字母列表上面滑动时候，通过计算接触点到页面顶端距离（e.touches[0].clientY），-页面顶端栏高度，-字母A到列表顶端距离(this.$refs["A"][0].offsetTop;)，然后就得到触摸点到A顶端距离，然后除以每个字母高度就能得到手指触摸的是哪个字母
10. 得到是哪个字母后将字母通过eventbus传递给兄弟组件---列表组件，然后通过betterscroll的scrollto功能转到这个首字母开头的列表
11. 当选中所在的当前城市后，将选中的城市传入vuex中，并使用html的localstorage缓存当前城市
12. Home顶端的当前城市和城市列表中的当前城市均由vuex的mapState获得。vuex的state每次会检查是否有缓存内容，然后获取缓存，如果没有缓存，则为默认值北京
13. 搜索栏是一个inputbox，底下有一个z-index=10的列表以实现动态显示搜索结果。输入内容和所有城市名进行匹配，然后匹配项会被显示在这个列表里。点击每个结果会更改当前城市
14. 详情页使用递归组件。点击图片后会让画廊组件显示，里面是一个轮播图
15. 顶端随着滑动渐变效果由document.documentElement.scrollTop测距得来，让顶端bar的opacity随距离增大来达到渐变效果
16. 但是这个测距是window.addEventListener("scroll", this.handleScroll);绑定在全局上，所以需要在deactivated时候window.removeEventListener("scroll", this.handleScroll);
##### 说说Vue框架，对于对象引用的情况呢？
说了双向绑定、vue-router、vue-resource，关于对象引用的情况说了数组的两种情况下的处理（设定值和改变长度）

#### vue知识点
- 组件传值
  1. v-bind 一个prop值在子组件名称上。子组件中由props接收。子组件通过`this.$emit('eventName', valToPass)`触发一个事件来传值。父组件通过`@eventName="handleFunc"`. 单向数据流规定，父组件可以给子随便传，但是子不能改传进来的值，一定要修改只能是拷贝。 props可以参数校验
  2. 非父子组件传值 bus/发布订阅模式/观察者模式/总线机制

  ```
  Vue.prototype.bus = new Vue();
  // 在组件中，发出信息：
  this.bus.$emit('change', this.content);
  // 在另一个组件中接受信息.mounted 是组件被挂载时候
  mounted: function () {
    var self = this;
    this.bus.$on('change', function (msg) {this.content = msg})
  }
  ```
  3. vuex

  ```
  export default new Vuex.Store ({
    state: {},
    actions: {}, //执行时候调用mutation. 使用dispatch调用
    mutations: {}, // 使用commit 调用


    })
  ```
  - 生命周期函数，vue实例在某一个时间点会自动执行的函数。 熟记对应的几个节点，熟记每个节点触发的时机，多演练
    1. beforeCreate: 创建vue实例时候
    2. created： 完成了双向绑定
    3. beforeMount: 模板和页面结合，即将挂载到页面上的一瞬间, 模板内容还没有被渲染
    4. Mounted: 页面挂载之后执行。只有在这一步以及之后才能拿到DOM上的东西。这一步时候首次渲染已经完成了。通常监控在这里
    5. beforeDestory: 销毁前
    6. distory: 销毁实例
    7. beforeUpdate: 数据发生改变，但是还没有重新渲染。 diff函数对比virtue dom之前执行
    8. updated: 重新渲染之后， diff函数对比virtue dom之后执行。 测某一块性能这一步会比较合适

- 计算属性和侦听器
  1. 不希望在页面模板上面有逻辑。也不希望data中有冗余
  2. computed内置缓存，在依赖的变量没有改变时候就不会再被调用。相对于使用方法性能更高
  3. watch: 分别监听依赖的变量，如果有一个改变就重新计算。这时data不可避免还是需要冗余

###### MVVM框架类问题

### 了解MVVM框架嘛，谈谈你对MVVM的认识
- Vue, react, Angular。 想好到底回答哪一个。 收住优点，攒着下面说，开启引导模式
- 先聊MVC(model view controller) 再来MVVM(Model, ViewModel, View). ViewModel就是双向绑定核心
### 双向绑定的原理
- 双向：前端页面是根据后台数据渲染(正)，用户对页面修改反应到后端(反)
- 绑定：以前是手动，现在是自动就搞定了
- 原理：`Object.defineProperty` 返回的是修改后的obj.所有的都是基于这个es5的API。它能监听到data的变化， 定义时候会有一个回调函数， 在回调函数中写好view和某一个data的关系就好。 这个是解决了正向的问题。 而view 到data的反向，就是用的input事件。 `reflect.defineProperty`返回的是布尔值
- 根据`Object.defineProperty` 简易双向绑定实现 https://www.jianshu.com/p/07ba2b0c8fca
- `Object.defineProperty` get方法返回绑定dom的值， set方法将绑定dom的值设为新value值
- 代码 https://jsfiddle.net/zy15662/180g4emf/51/
- 设计模式
