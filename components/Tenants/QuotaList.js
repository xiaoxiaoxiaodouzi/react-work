import React, { Component } from "react";
import { Table, Card,message,Divider,InputNumber} from "antd";
import { getTenantQuota,getTenantById,updateQuota,getApplicationRes } from "../../services/tenants";
import constants from '../../services/constants';

export default class QuotaList extends Component {
  state = {
    loading: false,
    data: [],
  };
  tempData = [];
  componentDidMount() {
    if(this.props.code && this.props.tenantId && this.props.tenantCode){
      this.loadData(this.props.code,this.props.tenantId,this.props.tenantCode);
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.code && nextProps.tenantId && nextProps.tenantCode && this.props!==nextProps){
      this.loadData(nextProps.code,nextProps.tenantId,nextProps.tenantCode);
    }
  }
  loadData = (code,tenantId,tenantCode) => {
    let arrayData = [];
    let requests = [];
    requests.push(getTenantQuota(code));
    requests.push(getTenantById(tenantId));
    requests.push(getApplicationRes(tenantCode));
    this.setState({loading:true});
    Promise.all(requests).then(values=>{
      console.log('values',values);
      let cpusUsing = values[2]['cpuUsedTotal'];
      let ramsUsing = values[2]['memoryUsedTotal'];
      values[0].forEach(element => {
        element.key = element.id;
        element.editable = false;
        if(constants.QUOTA_CODE.toString().indexOf(element.code) > -1){
          arrayData.push(element);
        } 
      });
      arrayData.forEach(element=>{
        element.quota = values[1][element.code];
        if(element.code === 'cpus'){
          element.using = cpusUsing;
        }else if(element.code === 'rams'){
          element.using = (parseFloat(ramsUsing)/(1024*1024*1024)).toFixed(1);
        } 
      });
      console.log('arrayData',arrayData);
      this.setState({ 
        data:arrayData,
        loading:false,
      });
      this.tempData = arrayData; 
    }).catch(err=> this.setState({ loading:false }));
  };
  toggleEditable=(e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      this.setState({ data: newData });
    }
  }
  saveRow=(e, key)=>{
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if(parseFloat(target.quota) >parseFloat(target.using)){
      console.log('target',target);
      this.toggleEditable(e,key);
      if(target.code === 'cpus'){
        updateQuota(this.props.tenantId,this.props.code,{cpus:target.quota}).then(data=>{
          this.tempData = newData;
          message.success('修改配额成功');
        }).catch(err=>{
          this.setState({data:this.tempData});
          /* this.loadData(this.props.code,this.props.tenantId,this.props.tenantCode); */
        });
      }else if(target.code === 'rams'){
        updateQuota(this.props.tenantId,this.props.code,{rams:target.quota}).then(data=>{
          this.tempData = newData;
          message.success('修改配额成功');
        }).catch(err=>{
          this.setState({data:this.tempData});
          /* this.loadData(this.props.code,this.props.tenantId,this.props.tenantCode); */
        });
      }
    }else{
      message.error('配额必须大于使用量，请重新输入');
    }
  }
  cancel=(e,key)=>{
    this.toggleEditable(e,key);
    this.setState({data:this.tempData});
  }
  render() {
    const columns = [{
      title: "配额编码",
      dataIndex: "code",
      width: "15%"
    }, {
      title: "名称",
      dataIndex: "name",
      width: "15%"
    }, {
      title: "单位",
      dataIndex: "unit",
      width: "10%"
    }, {
      title: "配额",
      dataIndex: "quota",
      width: "10%",
      render: (text, record) => {
        if (record.editable) {
          return (
            <InputNumber
              value={text} min={1} max={9999} autoFocus style={{width:'100%'}}
              onChange={e => this.handleFieldChange(e, 'quota', record.key)}/>
          );
        }
        return text;
      }, 
    }, {
      title: "使用量",
      dataIndex: "using",
      width: "10%"
    }, {
      title: "配额使用率",
      dataIndex: "usage",
      width: "20%", 
      render: (text, record) => {
        let usage = 0;
        if(record.using && record.quota){
          usage = (parseFloat(record.using)/record.quota*100).toFixed(1) +'%';
        }
        return usage;
      }, 
    }, {
      title: "操作",
      width: "20%",
      render: (text, record) => {
        if(!record.editable){
          return (
            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
          );
        }else{
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
      }
    }];
    return (
      <Card style={{margin:'24px 24px 0 24px'}}>
        <Table
          columns={columns}
          pagination={false}
          dataSource={this.state.data}
          loading={this.state.loading}
        />
      </Card>
    );
  }
}

