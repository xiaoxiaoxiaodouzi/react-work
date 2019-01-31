import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table} from 'antd';
import { getResource } from '../../../services/aip';
import TreeHelp from '../../../utils/TreeHelp'
import constants from '../../../services/constants'
import { ObjectDetailContext } from '../../../context/ObjectDetailContext'
class Resource extends Component {
  static propTypes = {
    prop: PropTypes.object,
    appId: PropTypes.string
  }
  state = {
    dataSource: [],
    current: 1,
    pageSize: 10,
    total: '',
    totalPage: '',
    loading:false,
  }
  componentDidMount() {
    this.loadData(1, 10);
  }
  loadData = (current, pageSize) => {
    let  appId=this.props.appId;
    let queryParams = {
      page: current,
      rows: pageSize,     
      pid: this.props.id,
      cascaded: true,
    }
    this.setState({loading:true})
    getResource(appId,queryParams).then(data => {
      console.log('resource', data);
      let dataSource = [];
      if (data.contents) {
        data.contents.forEach(element => {
          element.pid = element.parentId
        });
        dataSource = TreeHelp.toChildrenStruct(data.contents);
        this.setState({ loading:false,dataSource, current: data.pageIndex, pageSize: data.pageSize, total: data.total, totalPage: data.totalPage });
      }
      this.setState({ dataSource ,loading:false})
    })
  }
  onCheckboxChange = (e) => {
    console.log('object', e.target.checked)
  }

  handleChange = (current, pageSize) => {
    this.loadData(current, pageSize)
  }
  render() {
    const columns = [{
      title: '资源名称',
      dataIndex: 'name',
      width: '40%',
      render: (text, record) => {
        return text
      }
    }, {
      title: '资源类型',
      dataIndex: 'type',
      width: '20%',
      render: (value, record) => constants.functionResource.type[value]
    }, {
      title: '资源URL',
      dataIndex: 'uri',
      width: '30%',
    }];

    // const pagination = {
    //   current: this.state.current,
    //   pageSize: this.state.pageSize,
    //   onChange: (current, pageSize) => {
    //     this.handleChange(current, pageSize);
    //   },
    //   showTotal: (total => { return `共有${total}条数据` })
    // }
    return (
      <Table columns={columns} dataSource={this.state.dataSource} loading={this.state.loading} rowKey='id'/>
    )
  }
}

export default props => (
  <ObjectDetailContext.Consumer>
    {context => <Resource {...props} appId={context.appId} id={context.id} />}
  </ObjectDetailContext.Consumer>
);

