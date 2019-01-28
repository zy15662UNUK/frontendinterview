##### 总结
- 对webpack做了哪些配置？
  + 主题是使用create-react-app来配置的
  + 在package.json中plugin中加上import ant mobile的css的内容。这样就会自动引入它css内容。
  + 在package.json中plugin中加上babel-plugin-transform-decorators-legacy。支持@来表示装饰器的方法
  + 在package.json中scripts中加上同时使用nodemon和babel-node启动server的语句`"server": "set NODE_ENV=test&&nodemon --exec babel-node -- ./server/server.js"`
  + 因为前端运行在3000端口上, 后端运行在9093端口上。所以需要在package.json中加上"proxy": "http://localhost:9093" 来配置。目的是将所有请求转到9093这个端口
  + 在package.json中调整eslint的提示范围

- redux中有哪些state
  + user: 用户信息相关的
  + chatuser: 聊天列表相关的
  + chat: 聊天信息相关的
  + 用redux中的combineReducers合并

- 路由是如何设置的？
  + 所有的路由控制都在最上层的index.js这一层。不过为了后端ssr时候的代码复用。所有的<Route/>路由有关的组件都被抽离到一个专门的App.js组件中了
    
    ```
    <div>
        <AuthRouter/>
        <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/bossinfo" component={BossInfo}></Route>
            <Route path="/geniusinfo" component={GeniusInfo}></Route>
            <Route path="/chat/:user" component={Chat}></Route>
            <Route component={Dashboard}></Route>
        </Switch>
    </div>
    ```
    
  + 用<Switch>套住所有的路由 /login /register /bossinfo /geniusinfo /chat/:uer 分别有专门的路由导向对应的组件。最后再放置一个接受所有剩余路由的导向dashboard的组件
  + 和<Switch>平行的还有一个验证登陆的普通组件(被withRouter装饰器装饰)。在componentDidMount时候向后端发送请求验证用户的登录状态。如果已经登陆了则向redux中填充用户信息，如果没有则用`this.props.history.push('/login')`
  + Dashboard组件中还有一层路由。用于导向/boss /genius /me /message 这几个组件。根据当前用户输入的路由来选择组件.由于index.js这个组件的设置。用户输入上述这些的任意一个之后都会被送到Dashboard这个组件中来。由于Dashboard被withRouter装饰过了，所以可以获取当前用户输入的路由。根据用户输入的路由来渲染出和输入匹配的<Route/>组件

    ```
    const searchResult = navList.find(v => v.path === pathname);
    return (
        <div>
            <NavBar mode='dark'>{searchResult?searchResult.title:null}</NavBar>
            <QueueAnim type='scaleX' duration={100}>
                {searchResult?<Route path={searchResult.path} component={searchResult.component} key={searchResult.path}/>: this.props.history.push('/login')}
            </QueueAnim>
            <NavLink data={navList}/>
        </div>
    );
    ```
- Socket.io具体怎么用的
  + Websocket是用来处理用户的聊天信息的
  + 后端在websocket连接之后绑定on('sendmsg')这个事件。也就是一旦前端发送了信息，后端向数据库添加这条信息并触发'receiveMsg'这个事件，将新的聊天信息广播给前端
  + 前端在redux中绑定'receiveMsg'这个事件，一旦被触发就更新消息列表中的数据和未读信息条数。由于redux的state被更新。所以前端的消息列表和未读信息条数会被重新渲染

- 后端数据库是怎么设计的，schema是怎样的

```
// 集合的schema
const model = {
    user: {
        user: {
            type: String,
            required: true // 必须有
        },
        password: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
        },
        avatar: {
            type: String
        },
        desc: { // 个人或者职位简介
            type: String
        },
        title: {// 职位名
            type: String
        },
        company: { // boss才有
            type: String
        },
        money: {
            type: String
        }

    },
    chat: {
        chatid: { // from和to拼起来作为某一个聊天的唯一标志便于查询
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
            default: ''
        },
        read: {
            type: Boolean,
            default: false
        },
        create_time: {
            type: Number,
            default: (new Date()).getTime()
        }
    }
};
```

##### 后端设置了哪些API?
- get:
  + 查询全部的用户：前端传来的get参数为用户类型。根据用户类型来在数据库中查找
  + 查询用户聊天信息：验证用户登录状态并获取用户的id。然后找出所有的用户，获取用户名和头像信息用于前端获取对话(极端情况是和所有用户都有聊天，所以需要查询全部)。然后使用`Chat.find({'$or': [{from: userId}, {to: userId}]})`来查找这个用户发出的和发给这个用户的信息。将查到的信息和全部用户都发给前端
  + 验证登陆: 获取cookies。cookies中储存的就是mongoDB生成的id。用这个id去数据库中查有没有对应用户
- post:
  + 登陆
  + 注册
  + 注册登录后附加完善个人信息。`findOneAndUpdate`来更新用户信息。然后使用object.assign来拼成更新后的信息传给前端。
  + 标记已读信息。首先读出前端发来的发出人信息。从cookies中找到当前用户的信息。然后将数据库中所有的从该发出人发给当前用户信息的read字段都改为true。然后把修改的数据条数返回给前端
##### 2-1 搭建react环境
- `npm run eject` 弹出配置文件，允许自定义配置。如果命令不好使。那么执行`git add .` `git comm``it -am "Save before ejecting"`

##### 3-7 antd-mobile使用
- 在package.json中找babel，然后在里面加上

```
"plugins": [
    ["import", { libraryName: "antd-mobile", style: "css" }] // `style: true` 会加载 less 文件
  ]
```
- 然后只需从 antd-mobile 引入模块即可，无需单独引入样式

```
// babel-plugin-import 会帮助你加载 JS 和 CSS
import { DatePicker } from 'antd-mobile';
```

##### 4-1 redux基本API
- http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html

##### 4-3 redux解耦
- redux集中状态管理，一个redux对应一个view。一个组件的redux配置在带有组件名的js文件里，例如index.redux.js
- redux文件中定义reducer(一个函数，定义每种action type的处理方案), action creater (函数，返回某种action， action中必须有type属性标定action的类别)
- createStore. `import {createStore} from 'redux';` 用于创建一个store
- reducer, action creater createStore都应该在index.js中import, 然后通过props传入子组件中 app.js.
- store.subscribe(fn). 订阅redux中的state变化，一旦state发生变化则执行fn。fn可以是重新渲染组件的函数
- store.dispatch(actionCreater()): 触发某种action。先调用actionCreater。返回具体的action对象，然后将对象传入dispatch触发这种action。然后reducer会根据action的种类马上执行之前写好的对应操作

##### 4-4 redux异步
- `npm install redux-thunk --save` 安装thunk中间件实现异步
- `import thunk from 'redux-thunk';`
- `import {applyMiddleWare} from 'redux` `const store = createStore(reducer, applyMiddleware(thunk));`应用thunk中间件
- 而异步的action creater长这样. 注意异步的creator是指这个creator内部有异步操作。而不是说这个creator在异步回调中被调用

```

export function addAsync() {
    return (dispatch) => {
        setTimeout(() => {
            dispatch({type: ADD});
        }, 2000);
    };
}
```

##### 4-5 配置redux chrome 插件

```
import {createStore, applyMiddleware, compose} from 'redux';

const store = createStore(
    reducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension? window.devToolsExtension(): () => {}
        )
);
```

##### 4-6 使用redux-react
- 安装babel转译decorator `npm i babel-plugin-transform-decorators-legacy --save-dev`
- package.json中配置

```
 "babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      [
        "import",
        {
          "libraryName": "antd-mobile",
          "style": "css"
        }
      ],
      ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
      "transform-decorators-legacy"
    ]
  }
```
- 使用redux-react就不用将各种action creator手动往子组件的props里面传了。直接利用Provider 和connect两个接口即可
- 在index.js中只用向provider中传初始化之后的store即可。

```
import { Provider } from 'react-redux';
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,
    document.getElementById('root')
);
```

- 在app.js中，将creator通过connect装饰器给绑定到props中

```
import { connect } from 'react-redux';
// decorator 写法，将App包装一下再返回一个组件
App = connect(
    (state) => ({num: state}), // 把state什么属性放进props里
    {add, minus, addAsync} // 把action creater 放进属性里
)(App);
```

##### 4-9 react-router
- `<BrowserRouter>`包裹整个应用 `<Route path='/' exact>` 包裹渲染的组件， path表示组件对应路径。 `<Link to='/'>` 等效于`<a>`标签，用于点击跳转

- `<Redirect to='/'></Redirect>` 跳转到主页 `Switch` 包裹`<Route>`这样只会匹配第一个匹配的组件
- `:paramName` – 匹配一段位于 /、? 或 # 之后的 URL。 命中的部分将被作为一个参数

```
<Route path="/hello/:name">         // 匹配 /hello/michael 和 /hello/ryan
<Route path="/hello(/:name)">       // 匹配 /hello, /hello/michael 和 /hello/ryan
<Route path="/files/*.*">           // 匹配 /files/hello.jpg 和 /files/path/to/hello.jpg
```

##### 4-12 react-router 结合 redux
- 使用`<Switch>`包裹`<Route>`这样只会渲染第一个匹配的组件。在其中最后放置一个`<Redirect>`把没有匹配上的全部重定向到其中一个
- state对于整个app始终只有一个。如果两个组件的state并不相同，那么需要用combineReducers来合并两个state的reducer。合并之后的state将会以reducer的名字来命名不同的state。最好创建一个专门的js文件来合成reducers。合成之后在index中createStore时候要用这个新和成的大reducer
- 对于每个组件。如果有自己的redux state都需要用connect装饰器来装饰一下.这样才能通过props来访问state和action creater

```
App = connect(
    (state) => {return {num: state.reducerCounter}}, // 把state什么属性放进props里. 注意这里合并reducer之后state里面以不同reducer的名字来划分不同的state
    {add, minus, addAsync} // 把action creater 放进属性里
)(App);
```
- createStore Provider 和 BrowserRouter都是放在最上层的index.js中来包裹整个app, 包裹顺序是Provider 包住 BrowserRouter

##### 5-1 需求分析
- 页面： 用户中心 登陆注册 信息完善(牛人： 求职信息职位列表。 BOSS：职位管理 查看牛人) 聊天
- src前端源码 server 后端express。 compoennet container reducers 也是有专门文件夹
- 路由：进入应用时候获取用户信息，没有登陆则跳转login页面 login register不需要权限认证
- mongodb数据库 axios异步请求 redux管理所有数据 组件用ant-mobile替代css

##### 5-3 前后端联调
- 因为前端运行在3000端口上, 后端运行在9093端口上。所以需要在package.json中加上`"proxy": "http://localhost:9093"` 来配置。目的是将所有请求转到9093这个端口
- 结合redux使用异步请求更新数据，需要创建一个异步的action creator，在里面发送请求并将请求结果作为action.payload返回。同时还要在reducer中针对这种action来做出处理。也就是将payload中内容更新到state中
- 拦截器。当我们有一些操作需要在每次发送请求的时候执行时。就将它们挂载到拦截器中。拦截器内容写在一个专门文件中。在index.js中执行

##### 6-1 登陆注册内容
- 使用cookie进行身份验证
- express 使用cookie-parser
- 用户加载页面带着cookie向后端获取用户信息，如果未登录 那么返回登陆页面，然后用户登陆，前端储存用户cookie。如果已经登陆，直接调转App内部页面

##### 6-3 判断路由
- 后端对路由的处理需要进行拆分，例如以'/user'开头的请求可以专门写在user.js中

```
const express = require('express');
const Router = express.Router();
Router.get('/info', (req, res) => {
    res.json({code: 1});
});
module.exports = Router;
```
- 然后在server.js中使用:

```
app.use('/user', userRouter);
```

- 前端对路由的判断是在index.js中的BrowserRouter中再加上一个空的组件。这个组件需要使用withRouter装饰器装饰使之拥有普通Route的特性。然后根据this.props.location.path来获取路径。如果路径没问题就向服务端请求然后获得用户信息or跳转到登陆页面

##### 6-4 6-5 6-6 登陆注册
- redux 中返回给组件的就是触发action的方法。 例如user.redux中的register函数，就是在点击注册按钮之后被触发。这个函数中接受的是之前保存在component的state中的用户注册信息。根据用户信息的合法性调用不同的action creator
- 用户信息合法则用axios向后端发送post请求传递数据。请求成功后则dispatch成功的creator
- 后端在存储密码之前需要将密码MD5加密。使用utility这个库来加密
- 在redux中集中存储的user state中加上redirTo这个属性，标明在注册成功后应当跳转到哪一个url
- 在src目录下创建一个utils.js专门存放辅助函数。其中加上redirPath函数来计算跳转的url

##### 6-12 cookie
- 不论我们输入何种url，AuthRouter这个组件都会被重新渲染，因此其中componentDidMount的内容就会被执行
- 在其中用一个Set判断来访目标是不是登陆或者注册页面。是的话就不管
- 如果不是，就向'/user/info'发送get请求。在后端借着这个请求看有没有userInfo这个cookie。如果没有那么返回指令让前端跳转。如果有那么genjucookie(mongoDB自己的ID)来查找对应用户并返回
- 前端获取了这个用户的信息之后向redux中添加用户信息。也就是在get请求成功之后调用redux中的loadData函数更新

##### 7-2 boss信息完善
- 发现login和register两者redux的case是一样的。所以合并成一个case
- 和登陆注册一样。在redux中写一个update的action creator。 接受从BossInfo组件中传来的state内容。向后端发送请求。成功后再更新redux
- 使用PropTypes限定传入内容
- 目前来看redux的使用套路是: 对于某个需要更新数据的情境下，调用一个对应的action creator。在action creator中发送请求和后端数据进行交互，最后返回一个action里面包含更新后的数据。然后在reducer中写一个针对这个情况的case。在case中向旧的state中加入action的payload并且返回
- 牛人信息完善基本只用复制粘贴就可以了。因为redux中的update和后端的update操作都是一样的。仅仅是接受的数据不同

##### 8-1 应用骨架
- 在index中的switch最后加上`<Route component={Dashboard}></Route>`不加path意味着如果前面的路由都没有命中就进入Dashboard这个组件
- Dashboard中加上公共的header和footer。然后在里面的render函数返回值中设置分别导向`/boss` `genius`的路由
- 也就是你只要是登陆了就进了DashBoard。dashBoard再来组织分发到各个后续页面的路由

##### 8-2 牛人列表导航和跳转
- Dashboard中的导航和跳转是依靠点击页面底部的tab-bar来实现。就类似于支付宝app底端的切换栏
- 底端栏是用ant design的TabBar组件实现的
- Dashboard中将导航栏所有可能内容写在数组中。根据当前的redux中的角色来选择性显示内容
- 导航栏中每一项判断是否被选中则是靠判断其对应的路径和当前路径是否一致确定

##### 8-3 牛人列表
- 使用Card组件来渲染牛人的内容。 在componentDidMount中发送请求获取牛人的信息。需要改写后端。使之根据请求参数查询牛人或者BOSS
- 注意。render很有可能在请求完成前就执行了。所以必须在render中先判断请求有没有完成。也就是state中有没有内容
- 建立一个新的reducers chartuser.redux.js来处理用户列表请求的问题。将axios请求部分放进其中的action creator中 updateUserList
- 在reducer.js中合并两个reducers

##### 9-1 boss列表和组件优化
- 由于展示卡片通用于牛人列表和boss列表。所以我们把它抽出来作为单独的组件
- 由于boss列表需要额外展示公司和薪资。所以在render中加两条判断

##### 9-7 高阶组件
- 接受一个函数返回一个新函数。 装饰器模式
- 高阶组件两种模式: 属性代理， 反向继承
- 这里把登陆和注册页面handleChange方法和state放到高阶组件中去, 通过props的方法传入到登陆/注册页面。这样可以减少代码的重复。这种属于属性代理

##### 10-1 socket io
- 实现websocket的一个后端库
- `npm i socket.io --save`
- Chat 组件中获取当前聊天对像是通过路由中在url上传入聊天对象`<Route path="/chat/:user" component={Chat}></Route>`. 同时控制点击用户卡片的时候跳转到被点击用户的聊天页面,同时向url中添加用户名```this.props.history.push(`/chat/${v.user}`);```最后在chat中获取时候`this.props.match.params.user`

##### 10-2 socket.io前后端联通
- 后端接受聊天信息之后直接全局广播

```
io.on('connection', (socket) => {
    console.log('user in');
    socket.on('sendmsg', function (d) { // 传递数据事件的回调
        console.log(d);
        io.emit('receivemsg', d); // 将收到的聊天数据转发全局
    });
});
```

- 前端发送数据并监听从后端来的新信息

```
componentDidMount() {
        socket.on('receivemsg', (d) => { // 收到全局广播的数据后更新state中的msg数组
            this.setState({msg: [...this.state.msg, d.text]});
        });
}
handleSubmit = () => { // 向后端发送一个事件并传递数据
        socket.emit('sendmsg', {text: this.state.text});
        this.setState({text: ''});
}
```

##### 10-4 聊天页面redux
- redux中和聊天相关的action有:

```
const MSG_LIST = 'MSG_LIST'; // 获取聊天列表
const MSG_RECV = 'MSG_RECV'; // 读取信息
const MSG_READ = 'MSG_READ'; // 标识已读
```

- 数据库中聊天相关字段有

```
chat: {
        chatid: { // from和to拼起来作为某一个聊天的唯一标志便于查询
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
            default: ''
        },
        read: {
            type: Boolean,
            default: false
        },
        create_time: {
            type: Number,
            default: (new Date()).getTime()
        }
    }
```
##### 10-8 聊天功能实现
- socket的事件绑定全部都在chat.redux中实现
- 为了展示未读消息的实时数目。需要在NavLink组件中引入chat redux。然后在消息图标的badge属性上面绑定chat.unread数目。
- 未读消息的数目应当只统计别人发给我的消息数目，我发给别人的不应当被统计在其中。因此我们:

```
export function getMsgList() {
    return (dispatch, getState) => {
        axios.get('/user/getmsglist')
            .then(res => {
                if (res.status === 200 && res.data.code === 0) {
                    let d = res.data;
                    let userid = getState().user._id;
                    dispatch({type: MSG_LIST, payload: {users: d.users, data: d.data, id: userid}});
                }
            });
    };
}
```
- 也就是利用传入的第二个参数getState来获取总的redux的state信息

##### 11 消息列表
- 首先需要将redux state中的消息数组按照chatid(聊天对象)进行分组。在Msg组件中遍历redux中的列表。按照chatid将他们分别塞进字典中
- 用Object.values将值都抽出来放进一个大的数组方便遍历。遍历时候取每一项的最后一个显示出来。也就是展示最后一条未读信息
- 统计每一个人的未读消息: `const unreadNum = v.filter(i => !i.read && i.to ===this.props.user._id).length;`
- 实现最近收到消息的对话框排在上面。Object.values之后再排序

```
const chatgroupVals = Object.values(chatgroup).sort((a, b) => {
            return b[b.length - 1].create_time - a[a.length - 1].create_time;
        });
```
- 给每个消息框加上onClick事件。点击之后跳转到对应的chat页面```onClick={() => {this.props.history.push(`/chat/${id}`)}}```


##### 12-2 更新未读消息
- 更新时机是退出一个对话窗口的时候，将该窗口的未读消息全部清零。所以在componentWillUnmount时候触发readMsg这个action creator
- readMsg这个action creator接受一个参数，也就是聊天对象的id。将id发给后端
- 后端收到id之后，根据cookie获取当前用户的id然后用update方法更新Chat集合. `let data = await Chat.update({from: from, to: userId}, {'$set': {read: true}}, {multi: true});`
- 返回的data的格式是`{ n: 5, nModified: 1, ok: 1 }`。 其中nModified代表修改的条数。将它返回前端
- 前端获取回复之后，将redux中的unread直接减去返回的条数。然后遍历chatmsg。将其中from === 当前对话对象的聊天的read属性全部改成true

##### 13 性能优化
- 定制shouldComponentUpdate(nextProps, nextState)来避免无意义的重复渲染。通过比较nextProps中传入的props和当前组件state中对应项有没有区别来决定是否return true
- 更简便方法是用React.PureComponent代替React.Component.这相当于给你写好了shouldComponentUpdate。但是注意这只能用在没有自己state，纯粹依赖外部传入props来渲染的子组件
- 但是这里比较shouldComponentUpdate中nextProps和state时候就涉及比较两个对象了。出于性能的考虑react默认是浅比较。这时候一旦结构复杂了就都会默认是不一样的。所以需要引入immutable.js这个东西
- 用immutable的Map来储存对象。用get set来改变。用is来比较两个Map是不是一样的。减少内存使用， 并发安全，便于比较复杂的数据，定制shouldComponentUpdate方便时间旅行功能方便

##### 14 代码优化
- 定制eslint的代码规范： package.json中eslintConfig.rules里面加上自己的配置就可以。
- 使用ant motion的进出场动画组件QueueAnim来给dashoard和chat两个组件加上动画

##### 14-5 ssr后端渲染  https://juejin.im/entry/5ac197caf265da2377198fb6
- 首先需要让后端支持jsx语法。所以需要安装babel进行后端支持。 `npm i @babel/cli --save` 和 `npm i @babel/node --save`
- 然后在package.json中配置启动server语句。 第一句是我们正在用的。第二句是不配置babel node时候的server启动语句

```
"scripts": {
    "server": "set NODE_ENV=test&&nodemon --exec babel-node -- ./server/server.js",
    "server_bak": "nodemon server/server.js"
  },
```
- 最后用`npm run server`来启动server
- ssr本质是在第一次由浏览器向前端发送html字符串的时候就把内容已经塞进去了。所以需要从前端和后端两方面改造
- 前端上面。需要将index.js中的路由部分(BrowserRouter)以内全部内容提取出来放进一个单独组件App.js中方便后端共用
- 然后使用`npm run build`来打包前端的内容到项目目录下的/build
- 后端需要加上拦截的中间件利用中间件进行请求拦截。如果请求是/user或者/static。那么直接什么都不做用next转发给下一个中间件。否则那就是初次请求，直接返回渲染好的index.html。ssr就在这个中间件中完成
- 后端将静态资源的目录(包括各种图片和js地址)设置成打包好的前端目录build `app.use('/', express.static(path.resolve('build')));`
- npm 安装 css-modules-require-hook 和 asset-require-hook在后端支持处理css和图片
- 然后在后端import App.js.使用react-dom/server中的renderToString来吧App组件中的内容渲染成字符串
- 将index.html内容写死在请求拦截的中间件中。把上面渲染好的字符串插进id="root"的div去
- 我们需要手动把build好的js和css文件引入到index.html中。在build/asset-manifest.json中将所有的css和js路径通过<link>和<script>标签的形式写在index.html中
- 最后res.send(indexHTML)即可

##### 14-11 react 16错误处理
- componentDidCatch(err, info)这个钩子来捕获错误。然后在里面setState。底下render再根据state来render
