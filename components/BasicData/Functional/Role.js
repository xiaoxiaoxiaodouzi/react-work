import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, message, Popconfirm } from 'antd';
import {getResourceRole,deleteResourceRole} from '../../../services/aip'
import { ObjectDetailContext } from '../../../context/ObjectDetailContext'
import Link from 'react-router-dom/Link';
class Role extends Component {
  static propTypes = {
    prop: PropTypes.object
  }
  state = {
    dataSource: [],
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true })
    getResourceRole(this.props.appId, this.props.id, ).then(data => {
      this.setState({ loading: false, dataSource: data })
      this.props.roleListChange(data);
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  removeRole = (roleId) => {
    this.setState({ loading: true })
    deleteResourceRole(this.props.appId, this.props.id, roleId).then(data => {
      getResourceRole(this.props.appId, this.props.id, ).then(datas => {
        message.success('移除角色成功！');
        this.setState({ dataSource: datas, loading: false });
        this.props.roleListChange(datas);
      }).catch(err => {
        this.setState({ loading: false })
      })
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      width: '15%',
      render: (text, record) => {
        return (
          <Link to={`/applications/${record.appId}/functionalroles/${record.id}`}>{text}</Link>
        )
      }
    }, {
      title: '管理员',
      dataIndex: 'roleDesc',
      width: '25%'
    },{
      title: '描述',
      dataIndex: 'desc',
      width: '25%'
    },{
      title: '操作',
      width: '10%',
      key: 'action',
      render: (text, record) => <Popconfirm onConfirm={() => this.removeRole(record.id)} okText='删除' title='是否删除'><a>移除</a></Popconfirm>
    }];
    return (
      <Table
        dataSource={this.state.dataSource}
        columns={columns}
        pagination={false}
        loading={this.state.loading}
        rowKey='id'
      />
    )
  }
}
export default props => (
  <ObjectDetailContext.Consumer>
    {context => <Role {...props} appId={context.appId} id={context.id} roleListChange={context.roleListChange} />}
  </ObjectDetailContext.Consumer>
);
