##### Around项目
- Geobased social network app. User can upload image or video and check neighbors' post on map. Basically this app is backended by google map API and Node js/express/mongodb. JSON web token for the login validation
- token: 不需要发user信息。只用发token就可以确认user信息。存在localStorage。放在cookie中的话那么发送请求时候都会带上cookie
- 综述 `npm install -g create-react-app`
1. single page web app, which contains login log out register and main pages网页总体分成注册，登陆，内容页面，。通过react-router进行路由管理跳转。内容页面又分成图片，视频，地图三个tab。同时顶上还有一个选择框选择是展示附近的图片还是所有图片中的人脸图片。前后端通过fetch发送ajax请求。注册/登陆表单，图片轮播图等功能是直接使用ant-design中的相应功能。显示发布位置的地图使用Google map API，因为google map API 是需要使用纯javascript调用的，所以为了方便项目中直接使用封装好react-google-map库实现。组件间的通信全部是靠props传递值(父-子)和回调函数(子-父)

2. 将页面分为不同的组件。组件间通过import class相互调用，每个组件拥有自己的css，分别写在不同的css中。通过@import引入到总的index.css中

3. 用一个constant.js储存所有的常量。便于修改
4. App.js是最顶层的一个组件.包括了顶端的固定TopBar.js和页面内容的Main.js. login状态管理放在这一层，因为这是需要被各个组件使用的，所以应当被放在最顶层的app管理。这里确认是否登陆是靠检查localStorage中是否有token确定。一旦登出就将localStorage中的token移除。同时token值也是每次请求时候加在请求头中验明身份的

5. Main.js作为显示页面内容的地方，使用switch设置路由的路径，根据apps传下来的isLoggedin判断登陆状态。决定是否要路由到Login 页面还是已经登录了直接到home。 使用<Redirect>来重定向。redirect功能就是保持路由的一致性。这里如果直接返回一个<Login>会导致路由依旧停留在home

6. Home.js里是所有内容部分的总容器。在这里写请求发布的图片视频数据的函数，同时请求来的数据也存放在这个组件的state中。因为这些数据要被子组件公用。请求需要用户的地理信息，所以`navigator.geolocation`来请求用户信息，因为是在DOM加载完之后获取用户地址没所以是在componentDidMount() 中处理

7. 发布post需要上传视频或者图片以及文字，所以使用FormData格式来上传

8. static propTypes = {}.isRequired规定了传入的对象必须是包含对象的array，且对象里面的key规定了哪些是必须有。且value是什么type

9. 后端部分
  - 由于这里使用fetch发送。为了让后端bodyParser能够识别，必须带上请求头中content-type后端才能解析
  - 由于这里用proxy转发了。所以fetch发送请求时候不需要带上绝对路径。否则会有跨域的危险
  - 使用jwt-simple来创建和解码json web token
  - 使用multer来处理上传的文件部分。因为bodyParser无法解析请求中的文件。图片等
  - 当完成开发将前端页面打包之后。在访问登陆以后的页面时，会出现刷新页面返回404的情况。这是因为路由我们开发的时候使用的是BrowserRouter。当刷新页面时，浏览器会向服务器请求example.com/home，服务器实际会去找根目录下home.html这个文件，发现找不到，因为实际上我们的服务器并没有这样的 物理路径/文件 或没有配置处理这个路由，所有内容都是通过React-Router去渲染React组件，自然会报404错误。这种情况我们可以通过配置Nginx或通过自建Node服务器来解决。
  - 上述问题的解决方案 https://www.thinktxt.com/react/2017/02/26/react-router-browserHistory-refresh-404-solution.html

##### NBA web项目
- pure frontend project, backended by nba-stats api. request data from the api and demonstarte it with D3.js. User can filter the data by its value and switch between hexbin and scatter graph. Switch data source to diff player through a autocomplete search box

- 使用D3 react 还有 ant design 实现的一个展示NBA球员得分情况的一个单页应用

- 可视化部分下方有拖拽bar。拖拽bar是用来设定图中显示点的最小频率。toolTip选择开关是用来开启或者关闭提示气球的。开启时鼠标选中点会有气球出现展示这个点的数据。图标类型radio选择是用来选择点的类型(Hexbin/Scatter)

- 通过上端的搜索栏来搜索球员。搜索栏具有自动补全(autocomplete)功能，也就是输入的时候会出现下拉列表展示所有和输入内容匹配的结果. autocomplete是直接使用的antdesign的库

- 使用lodash库来进行防抖debounce操作这里每次拖动bar都会导致一次重新请求.这么干会被nba给ban掉。所以我们这里需要一次debounce操作 操作节流。我们用lodash中的debounce来实现

- 没有路由，因为不涉及切换页面，调用stats.nba.com这个网站的API来获取数据。同时使用了nba-react库来实现请求数据

- App.js: 最外层的一层组件，里面包含了TopBar和Main两个组件

- TopBar：网页上端的装饰栏

- Main: 页面的主要内容。包含SearchBar，Profile和DataViewContainer两个组件。根据球员名称获取球员数据的函数loadPlayerInfo。函数中在请求球员信息完成之后会修改state中的playerInfo，继而触发页面重新渲染。写在这一层意义在于需要传给SearchBar里面。有searchBar传入的值来触发这个函数来重新渲染整个main页面

- Profile: 左侧栏用于展示球员信息。接受从Main中传入的this.state.playerInfo作为渲染数据

- DataViewContainer：可视化部分。包含可视化图区ShotChart和功能选择区

- CountSlider: 拖拽bar的component

- ShotChart： 和D3交互的部分， 接受从DataViewContainer传来的playerId，minCount 显示点的最少投球次数，chartType 点的类型，displayTooltip 是否展示拖拽bar。componentDidUpdate中。重新渲染时就重新请求球员数据并根据传入的参数筛选数据。 这就是用lodash给拖拽bar debounce的作用。因为理论上每次拖拽都会触发rerender造成重新请求

- SearchBar: 接受从main传下来的loadPlayerInfo函数。当用户完成选择后在回调中调用这个函数。 当用户输入的时候根据输入内容向后端发送请求。将请求结果渲染成输入框下方的提示列表

##### React 题目
- 比较Vue和React https://juejin.im/post/5b8b56e3f265da434c1f5f76#heading-4
  + Vue是类似于HTML模板而React是JSX语法
  + 数据流 Vue单向绑定v-bind 双向绑定是v-model和data中内容 React是单向数据流 通过setState的方式改变state的数值
  + 组件通信 Vue: props和子组件发送event eventBus vuex React: props传给子。callback函数作为props传给子函数用来收集子函数传来的信息
  + Redux 使用的是不可变数据，而Vuex的数据是可变的。Redux每次都是用新的state替换旧的state，而Vuex是直接修改
  + Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而Vuex其实和Vue的原理一样，是通过 getter/setter来比较的（如果看Vuex源码会知道，其实他内部直接创建一个Vue实例用来跟踪数据变化）
  
- setState: https://jsfiddle.net/8r1gpcv7/107/
  1. setState是一个异步的操作。setState之后并不一定马上改变了state。比如执行三次this.setState({cnt: this.state.cnt += 1})。最终依旧只是+1。因为前两次并没有被执行。this.state.cnt依旧是0
  2. setState也可以传入一个function。但是这里的改变就是base on previous state.也就是前一个setState中的function改变后的结果会被以prevState形式传给下一个. 但是注意，每一个函数之后真实的state也是没有改变的，只有当onClick2被调用时候才会被改变. 最终会一次性+3
- lifecycle https://jsfiddle.net/8r1gpcv7/108/
- 表单数据绑定和ref: https://jsfiddle.net/8r1gpcv7/110/
  1. 单向绑定则直接对表单使用onChange事件。触发之后获取数据可以是用传统的DOM操作，也可以是用加ref来提取. 也可以是用回调函数中传入的event object中提取。当然也可以用双向绑定的套路来
  2. 双向绑定。将表单的value设置成state中的对应值，onchange时候通过setState来改变state中对应值来达到同步更新value的作用
- Vue和React数据绑定对比 https://www.jianshu.com/p/6e124ad23c68
- react貌似因为是合成事件，不能被异步调用，所以如果像vue一样setTimeout来节流防抖的话会在console报错。下面是vue中节流方式:

```
export default {
  name: "Search",
  props: ['cities'],
  data: function(){
    return {
      input: "",
      timer: null,
      list: [],
    };
  },
  mounted() {
    //do something after mounting vue instance
    this.scroll = new BScroll(this.$refs.search);
  },
  watch: {
    input: function(){
      if (this.timer){
        clearTimeout(this.timer);
      }// 涉及计算量很大，做一个节流处理
      var self = this;
      this.timer = setTimeout(()=>{
        var result = [];
        if (this.input != ""){
          this.show = !this.show;
          for(var i in self.cities){
            self.cities[i].forEach((val)=>{
              if (val.spell.indexOf(self.input) > -1 || val.name.indexOf(self.input) > -1){
                result.push(val.name);
              }
            });
          }
          this.showSearch = true;
          this.list = result;
        }

      }, 100);
    }
  },
```
