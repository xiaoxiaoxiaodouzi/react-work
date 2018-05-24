import React, { Component } from "react";
import { Table,Badge} from "antd";
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import moment from "moment";

const statusMap = [ 'success', 'error'];
const status = [ '正常', '异常'];

export default class TransactionTableSimple extends Component {
  state = {
    data: [],
    page:1,
    row:5,
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
  onSelectChange = (selectedRowKeys) => {
    this.props.onSelectRows(selectedRowKeys);
  }
  onRow= (record) => {
    return {
      onClick: () => {
        this.props.onSelectRows([record.key]);
      },       // 点击行
    };
  }
  render() {
    const columns = [{
        title: "路径",
        dataIndex: "application",
        width: "25%",
        render: (text, record) => {
          return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
        }
      },{
        title: "开始时间",
        dataIndex: "startTime",
        width: "15%",
        render: (text, record) => {
          return moment(text).format("YYYY-MM-DD HH:mm");
        }
      },{
        title: "耗时(ms)",
        dataIndex: "elapsed",
        width: "10%",
      },{
        title: "异常",
        dataIndex: "exception",
        width: "10%",
        render:(text)=> <Badge status={statusMap[text]} text={status[text]} />
      },{
        title: "实例",
        dataIndex: "agentId",
        width: "20%",
        render: (text, record) => {
          return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
        }
      },{
        title: "客户端IP",
        dataIndex: "endpoint",
        width: "20%",
        render: (text, record) => {
          return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
        }
      }];
    const pagination = {
      total: this.state.total,
      current: this.state.page,
      pageSize: this.state.row,
      showSizeChanger: true, 
      pageSizeOptions:['5','10','20'],
      onShowSizeChange:(current, pageSize) =>{
        this.setState({page:current,row:pageSize});
      },
      onChange:(current, pageSize) => {
        this.setState({page:current,row:pageSize})
      },
    }; 
    const rowSelection = {
      selectedRowKeys:this.props.selectedRows,
      onChange: this.onSelectChange,
      type:'radio'
    };
    return (
      <Table
        size='middle'
        loading={this.props.loading}
        columns={columns}
        pagination={pagination}
        rowSelection={rowSelection}
        dataSource={this.state.data}
        onRow={this.onRow}
      />
    );
  }
}
