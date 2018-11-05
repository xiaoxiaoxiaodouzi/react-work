import React, { Component } from 'react'
// import {Button} from 'antd';
class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props;
    return (
      <div>
        <span>{value}</span>
        <button type="primary" onClick={onIncreaseClick}>Increase</button>
      </div>
    )
  }
}

export default Counter;