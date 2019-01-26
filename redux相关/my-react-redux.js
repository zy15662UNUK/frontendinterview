import React from 'react';
import PropTypes from 'prop-types';

export class Provider extends React.Component{
  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext() {
    return {store: this.store};
  }
  constructor(props) {
    super(props);
    this.store = props.store;
  }
  render() {
    return this.props.children;
  }
}
export function connect(mapStateToProps=state=>state, mapDispatchToProps={}) {
  return function(WrapComponent) {
    return class ConnectComponent extends React.Component {
      static contextTypes = {store: PropTypes.object}
      constructor(props, context) {
        super(props, context);
        this.state = {props: {}}
      }
      componentDidMount() {
        let {store} = this.context;
        store.subscribe(() => this.update());
        this.update();
      }
      update() {
        let {store} = this.context;
        let stateProps = mapStateToProps(store.getState());
        let dispatchProps = bindCreatorsToDispatc(mapDispatchToProps, store.dispatch);
        this.setState({
          props: {
            ...this.state.props,
            ...stateProps,
            ...dispatchProps
          }
        });
      }
      bindCreatorsToDispatc(creators, dispatch) {
        let bound = {};
        for (let k in creators) {
          let creator = creators[k];
          bound[k] = (...args) => dispatch(creator(...args));
        }
        return bound;
      }
      render() {
        return (
          <WrapComponent {...this.state.props} />
        );
      }

    }
  }
}
