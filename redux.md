##### 回忆一下redux和react-redux的使用

```
const store = createStore(
  reducerCounter,
  applyMiddlewares(arrthunk, thunk )
);
console.log('store', store.getState())
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```
##### 简易版的redux
- 迷你版。仅实现三个基本的API: getState, dispatch, subscribe
- 简单的发布订阅模式
- https://stackblitz.com/edit/react-ryqzlm    my-redux.js
##### context的概念: 在子孙组件中也能调用祖先组件的state
- 祖先组件中必须定义`getChildContext`方法。在其中返回`this.state`
- 必须在最外层和使用的地方定义prop-types
- 使用时: `this.context.user`
- https://stackblitz.com/edit/react-p6xcav   context.js

##### 迷你react-redux
- https://stackblitz.com/edit/react-p6xcav   my-react-redux.js

##### 实现applyMiddleWare并和createStore  my-redux.js

##### 实现自己的thunk中间件 my-redux-thunk.js

##### 实现接受多个中间件的applyMiddleWares和compose  my-redux
