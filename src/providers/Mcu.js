import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import mcuStore from '../stores/mcuStore'

export default class Mcu extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { reducers, middlewares } = this.props
    return (
      <Provider store={mcuStore(reducers, middlewares)}>
        {this.props.children}
      </Provider>
    )
  }
}

Mcu.propTypes = {
  reducers: PropTypes.array,
  middlewares: PropTypes.array
}
