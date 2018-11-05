import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Resource from './Resource';
import Role from './Role';
import ResourceUser from '../../../components/BasicData/Functional/ResourceUser';
import { Card } from 'antd'

export default class Permission extends Component {
  static propTypes = {
    prop: PropTypes.object,
    value: PropTypes.object
  }

  render() {
    return (
      <div>
        <Card  bordered={false} title='下级资源' style={{ margin: '24px 24px 0' }}>
          <Resource />
        </Card>
        <Card  bordered={false} title='已关联的角色' style={{ margin: '24px 24px 0' }}>
          <Role />
        </Card>
        <Card  bordered={false} title='已授权的该功能的用户列表' style={{ margin: '24px 24px 0' }}>
          <ResourceUser />
        </Card>
      </div>  
    )
  }
}
