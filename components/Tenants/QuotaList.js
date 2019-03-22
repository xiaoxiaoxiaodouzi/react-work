import React, { Component } from "react";
import { Table, Card,message,Divider,InputNumber} from "antd";
import { getTenantById, getTenantQuota, updateTenant } from '../../services/tp';
import constants from "../../services/constants";

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
    requests.push(getTenantQuota('PAAS'));
    requests.push(getTenantById(tenantId));
   // requests.push(getApplicationRes(tenantCode));
    this.setState({loading:true});
    Promise.all(requests).then(values=>{
     // let cpusUsing = values[2]['cpuUsedTotal'];
     // let ramsUsing = values[2]['memoryUsedTotal'];
      values[0].forEach(element => {
        element.key = element.id;
        element.editable = false;
         //if(constants.QUOTA_CODE.toString().indexOf(element.code) > -1){
          arrayData.push(element);
        // } 
      });
      arrayData.forEach(element=>{
        element.quota = values[1][element.code];
        // if(element.code === 'cpus'){
        //   element.using = cpusUsing;
        // }else if(element.code === 'rams'){
        //   element.using = (parseFloat(ramsUsing)/(1024*1024*1024)).toFixed(1);
        // } 
      });
      console.log(arrayData);
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
  saveRow=(e, key,paramKey)=>{
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if(parseFloat(target.total) >= parseFloat(target.quota)){
      this.toggleEditable(e,key);
      //if(target.code === 'cpus'){
        let tenant = this.props.tenant;
        tenant[paramKey] = target.quota;
        updateTenant(this.props.tenantId,constants.TENANT_CODE[0],tenant).then(data=>{
          this.tempData = newData;
          message.success('修改配额成功');
        }).catch(err=>{
          this.setState({data:this.tempData});
        });
      //}
    }else{
      message.error('使用量必须小于或等于配额总量，请重新输入');
    }
  }
  cancel=(e,key)=>{
    this.toggleEditable(e,key);
    this.setState({data:this.tempData});
  }
  render() {
    const columns = [{
      title: "名称",
      dataIndex: "name",
    }, {
      title: "配额编码",
      dataIndex: "code",
    },{
      title: "单位",
      dataIndex: "unit",
      width: 100
    }, {
      title: "配额总量",
      dataIndex: "total",
      width: 100,
      
    }, {
      title: "分配量",
      dataIndex: "quota",
      width:150,
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
    },{
      title: "操作",
      width: 150,
      render: (text, record) => {
        if(!record.editable){
          return (
            <a disabled={record.dataType === 'Text'?true:false} onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
          );
        }else{
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key,record['code'])}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
      }
    }];
    return (
      <Card  title={this.props.title?this.props.title:''}>
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

