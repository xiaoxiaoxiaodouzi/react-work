import React, { Component } from "react";
import { Table, Tooltip } from "antd";
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { getTransactionStack } from '../../../services/dashApi';
import TreeHelp from '../../../utils/TreeHelp'

export default class CallStack extends Component {
  state = {
    loading: false,
    data: [],
  };
  componentDidMount(){
    if(this.props.traceId.length>0){
      this.loadData(this.props.traceId[0]);
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.traceId.length>0 && this.props.traceId !== nextProps.traceId){
      console.log('tarceid111',this.props.traceId);
      this.loadData(nextProps.traceId[0]);
    }
  }
  loadData = (traceId) => {
    this.setState({loading:true});
    getTransactionStack(traceId).then(data => {
      if (data && data.length) {
        data.forEach((item,index,arr) => {
          if(item.execTime <= 0){
            item.count = 0;
          }else{
            item.count = (item.execTime/arr[0].execTime*100).toString().slice(0,4)+'%';
          }
        });
        let array = TreeHelp.toChildrenStruct(data);
        this.setState({
          data: array,
          loading:false
        })
      } else {
        this.setState({
          data: [],
          loading:false
        })
      }
    }).catch(err=> this.setState({loading:false})); 
  }

  render() {
    const columns = [{
      title: '调用栈',
      dataIndex: 'invokeStack',
      width:'40%',
      render: (text, record) => {
        //return <div title={text} style={{width:240,display:'inline-block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',lineHeight: '15px'}}>{text}</div>
        return <Tooltip title={text}><span style={{width:240,display:'inline-block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',lineHeight: '18px'}}>{text}</span> </Tooltip>
        // return <div style={{display:'inline-flex'}}><Ellipsis tooltip lines={1}>{text}</Ellipsis></div>
        // return text;
      }
    }, {
      title: '参数',
      dataIndex: 'args',
      width: '25%',
      render: (text, record) => {
        return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
        // return text;
      }
    }, {
      title: '执行时间（ms）',
      dataIndex: 'execTime',
      width: '15%',
      render:(text,record)=>{
        if(text<0){
          return ''
        }
        return text
      }
    }, {
      title: '占比',
      dataIndex: 'count',
      width: '10%'
    }, {
      title: '偏移（ms）',
      dataIndex: 'pYI',
      width: '10%'
    }];
    return (
      <Table
        columns={columns}
        dataSource={this.state.data}
        pagination={false}
        loading={this.state.loading}
      />
    );
  }
}
