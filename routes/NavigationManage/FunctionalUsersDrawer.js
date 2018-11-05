import React, { Fragment } from 'react';
import { Drawer, Input, Table } from 'antd';
import { getResourceUser } from '../../services/functional'
import constants from '../../services/constants';
const Search = Input.Search;

export default class FunctionalUsersDrawer extends React.PureComponent {
  state = {
    datas: [],
    loading:false
  }
  search = (value) => {
    let search;
    if (value) search = { name: value };
    this.loadData(this.props.appId, this.props.functionId, search);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible && nextProps.appId && nextProps.functionId) {
      this.loadData(nextProps.appId, nextProps.functionId);
    }
  }
  loadData = (appId, functionId, params) => {
    this.setState({loading:true})
    getResourceUser(appId, functionId, params).then(data => {
      this.setState({ datas: data ,loading:false});
    }).catch(err=>{
      this.setState({loading:false});
    })
  }
  render() {
    const columns = [{
      title: '用户名',
      dataIndex: 'userName'
    }, {
      title: '权限来源',
      dataIndex: 'userCollections',
      render: (text, record) => {
        return record.userCollections.map(r => {
          return <Fragment><span style={{ marginRight: 5, whiteSpace: 'nowrap' }}>[{constants.functionResource.userCollectionType[r.userCollectionType]}]{r.userCollectionName}</span> </Fragment>;
        })
      }
    }];
    return (
      <Drawer title={this.props.title}
        width={480}
        placement="right"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        mask={true}>
        <Search placeholder="输入需要查询的用户名" style={{ marginBottom: 10 }}
          onSearch={this.search}
        />
        <Table columns={columns} dataSource={this.state.datas} pagination={false} l  loading={this.state.loading}/>
      </Drawer>
    );
  }

}