export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(redux);
  }
  let currentState;
  let currentListener = [];
  function getState() {
    return currentState;
  }
  function subscribe(fn) {
    currentListener.push(fn);
  }
  function dispatch(action) {
    reducer(currentState, action);
    currentListener.forEach(v => v());
    return action;
  }

  dispatch({type: 'ssssswxec3rvc@3'});
  return {dispatch, subscribe, getState};
}

export function compose(...functions) {
  if (functions.length === 0) {
    return args => args;
  }
  if (functions.length === 1) {
    return functions[0];
  }
  return functions.reduce((prev, cur) => (...args) => prev(cur(...args)));
}

export function applyMiddlewares(...middlewares) {
  return function (createStore) {
    return function (...args) {
      let store = createStore(...args);
      let dispatch = store.dispatch;
      let midApi = {getState: store.getState, dispatch};
      let middlewareChain = middlewares.map(v => v(midApi));
      dispatch = compose(...middlewareChain)(store.dispatch);
      return {...store, dispatch};
    }
  }
}
