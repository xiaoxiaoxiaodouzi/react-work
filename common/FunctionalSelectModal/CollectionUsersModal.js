import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Drawer, Input } from "antd";
import { getCollectionUsers } from '../../services/uop'
import constants from '../../services/constants'
import { getPagination } from '../../utils/utils';

//集合用户详情授权modal组件，接受selectedKeys对象数组
class CollectionUsersModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,  //modal是否可见
    title: PropTypes.string,  //modal标题
    collections: PropTypes.array   //默认选中的值,是一个用户集合对象列表，对象包含name、id、type属性
  }

  state = {
    dataSource: [],
    loading: false,
  }

  defaultUserCollection = [];
  componentDidUpdate(prevProps, prevState) {
    if (this.props.visible && prevProps.visible !== this.props.visible) {
      this.loadData();
    }
  }

  loadData = (params, page = 1, rows = 10) => {
    const cids = this.props.collections.map(c => c.userCollectionId);
    if (cids.length > 0) {
      this.setState({ loading: true });
      getCollectionUsers({ ...params, page, rows, userCollectionIds: cids }).then(data => {
        const pagenation = getPagination(data, (current, pageSize) => {
          this.loadData(params, current, pageSize);
        })
        this.setState({ loading: false, dataSource: data.contents, pagenation });
      })
    }
  }
  render() {

    const columns = [{
      title: '用户',
      dataIndex: 'userName',
    }, {
      title: '权限来源',
      dataIndex: 'userCollections',
      render: (value, record) => {
        return value.length > 0 ? value.map(u => {
          return <Fragment key={u.userCollectionId}><span style={{ marginRight: 5, whiteSpace: 'nowrap' }}>[{constants.functionResource.userCollectionType[u.userCollectionType]}]{u.userCollectionName}</span> </Fragment>;
        }) : '--';
      }
    }];

    return (
      <Drawer
        title={'【' + this.props.title + '】已授权的用户列表'}
        // style={modalStyle}
        visible={this.props.visible}
        mask={true}
        width='580px'
        maskStyle={{ opacity: '-0.7' }}
        onClose={() => this.props.handleModal()}>
        {/* <SearchForm items={searchItems} onSearch={(e,values)=>this.loadData({name:values.name,userCollectionIds:[values.userCollectionId]})} colNum={2}/> */}
        <Input.Search placeholder='输入用户名进行搜索' onSearch={value => this.loadData({ name: value })} />
        <Table
          style={{ marginTop: 12 }}
          rowKey='id'
          size='small'
          dataSource={this.state.dataSource}
          pagination={this.state.pagenation}
          columns={columns}
          loading={this.state.loading}
        />
      </Drawer>
    )
  }
}

export default Form.create()(CollectionUsersModal);
