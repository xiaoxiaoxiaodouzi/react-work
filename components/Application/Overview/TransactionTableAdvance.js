import React, { Component } from "react";
import { Badge,Table } from "antd";
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const statusMap = [ 'success', 'error'];
const status = [ '正常', '异常'];

export default class TransactionTableAdvance extends Component {
  state = {
    data: [],
    page:1,
    row:10,
    total:0,
  };
  componentDidMount(){
    const { data } = this.props;
    if(data){
      this.setState({
        data,
        total:data.length,
      })
    }
  }
  componentWillReceiveProps(nextProps){
    const { data } = nextProps;
      this.setState({
        data,
        total:data.length,
      })
  } 
  render() {
    const columns = [{
      title: "路径",
      dataIndex: "application",
      width: "10%",
      render: (text, record) => {
        return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
      }
    },{
      title: "次数",
      dataIndex: "times",
      width: "10%"
    },{
      title: "平均耗时（ms）",
        dataIndex: "avgTimes",
      width: "10%"
    },{
      title: "最大耗时（ms）",
        dataIndex: "maxTimes",
      width: "10%",
    },{
      title: "最小耗时（ms）",
        dataIndex: "minTimes",
      width: "10%"
    },{
      title: "1s",
      dataIndex: "1s",
      width: "10%",
    },{
      title: "3s",
      dataIndex: "3s",
      width: "10%",
    },{
      title: "5s",
      dataIndex: "5s",
      width: "10%",
    },{
      title: ">5s",
      dataIndex: ">5s",
      width: "10%",
    },{
      title: "状态",
      dataIndex: "exception",
      width: "10%",
      render:(text)=> <Badge status={statusMap[text]} text={status[text]} />
    }];
    const pagination = {
      total: this.state.total,
      current: this.state.page,
      pageSize: this.state.row,
      onChange:(current, pageSize) => {
        this.loadData(current,pageSize)
      },
    }; 
    return (
      <Table
        size='middle'
        loading={this.props.loading}
        columns={columns}
        pagination={pagination}
        dataSource={this.state.data}
      />
    );
  }
}
