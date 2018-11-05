import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import OperationRecord from './OperationRecord'
import VisitRecord from './VisitRecord'
import { Card } from 'antd';
export default class Log extends Component {
  static propTypes = {
    prop: PropTypes
  }

  render() {
    return (
      <Fragment>
        <VisitRecord />
        <Card bordered={false} title='操作记录' style={{ margin: '24px 24px 0' }}>
          <OperationRecord />
        </Card>
      </Fragment>
    )
  }
}
