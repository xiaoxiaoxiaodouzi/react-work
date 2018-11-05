import React, { PureComponent } from 'react';
import { Button,Table,Divider,Popconfirm,Input,message,Checkbox,Select } from 'antd';

const Option = Select.Option;

const sourceList = ['query','path','header','body','form'];
const typeList = ['字符串','数组','对象']

export default class QueryParamsTable extends PureComponent {
  state = {
    data : [],
  };
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.props.onChange(newData);
    this.setState({ data: newData});
  }
  componentWillReceiveProps (nextProps){
    if(this.props.isServerAddModalShow !== nextProps.isServerAddModalShow){
      this.setState({data:[]});
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: Math.random(),
      name: '',
      in:'query',
      type:'字符串',
      required:false,
      desc:'',
      editable: true,
    });
    this.setState({ data: newData });
    this.props.onTableDataFlagChange(1);
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    let flag = 0;
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    newData.forEach(element=>{
      if(target.name === element.name){
        flag ++;
      }
    });
    if(flag > 1){
      message.error('服务参数名称不能重复，请重新填写');
      return;
    }
    if (!target.name) {
      message.error('请填写服务参数名称');
      return;
    }
    if (!target.in) {
      message.error('请填写服务参数来源');
      return;
    }
    if (!target.type) {
      message.error('请填写服务参数类型');
      return;
    }
    if (target) {
      target.editable = false;
      this.setState({ data: newData },()=>{
        this.props.onTableDataFlagChange(-1);
        this.props.onChange(this.state.data);
      })
    }
  }
  render() {
    const { data } = this.state;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'name', record.key)}
              placeholder="参数名称"
            />
          );
        }
        return text;
      },
    },{
      title: '来源',
      dataIndex: 'in',
      key: 'in',
      width:'15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Select style={{width:'100%'}} defaultValue='query' onChange={value => record.in = value}>
              { sourceList.map((ele,i)=><Option key={i} value={ele}>{ele}</Option>)}
            </Select>
          );
        }
        return text;
      },
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width:'15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Select style={{width:'100%'}} defaultValue='字符串' onChange={value => record.type = value}>
              { typeList.map((ele,i)=><Option key={i} value={ele}>{ele}</Option>) }
            </Select>
          );
        }
        return text;
      },
    }, {
      title: '说明',
      dataIndex: 'desc',
      key: 'desc',
      width: '30%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'desc', record.key)}
              placeholder="说明"
            />
          );
        }
        return text;
      },
    }, {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width:'10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Checkbox style={{marginLeft:8}} value={text} onChange={e=> record.required = e.target.value?'true':'false'}/>
          );
        }
        return <Checkbox value={text} disabled/>
      },
    }, {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
                <a onClick={() => {
                  this.remove(record.key);
                  this.props.onTableDataFlagChange(-1);
                }}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];
    return (
      <div style={{marginTop:16,marginLeft:36}}>
        <div className='card-title'>请求参数</div>
        <Table rowKey='id' columns={columns} dataSource={data} pagination={false} size="middle"/>
        <Button
          style={{ width: '100%', marginTop: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus" >添加参数</Button>
      </div>
    );
  }
}
