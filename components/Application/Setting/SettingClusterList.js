import React,{Component,Fragment} from 'react';
import { Table, Select, Divider, Popconfirm, Button, Switch, message,InputNumber} from 'antd'
import { doUpstream, getupstream} from '../../../services/domainList'
import { queryRoutes } from '../../../services/deploy'
import { getApp} from '../../../services/running'
import constants from '../../../services/constants'


const Option = Select.Option
export default class SettingClusterList extends Component{
  state={
    data:[],
    port:'',
    ip:'',
    weight:'',
    isEditing:false,
    HttpCheckedValue:false,      
    upstream:'',     //应用的upstream
    code:'',   //应用的code
    id:'',    //应用ID
    ips:[],       //集群ip数组
    name:'' ,    //
    record:{},      //当前行数据
    }

  componentWillReceiveProps(nextProps){
    if(this.state.upstream!==nextProps.appUpstream){
      let upstream = nextProps.appUpstream;
      if (upstream){
        this.setState({ upstream: upstream});
        getupstream(upstream).then(data=>{
          if(data){
            this.setState({data:data.targets})
          }
        })
      }
    }
    if(this.state.code !== nextProps.appCode){
      this.setState({id:nextProps.appId,name:nextProps.name})
      let id=nextProps.appId;
      getApp(id).then(data=>{
        if (data.schema === 'http') {
          this.setState({ HttpCheckedValue: false })
        }
        if (data.schema === 'https') {
          this.setState({ HttpCheckedValue: true })
        }
        let code=nextProps.appCode;
        if(code){
          this.setState({code:code})
          if(data.deployMode==='k8s'){
            queryRoutes(code).then(datas=>{
              if(datas){
                let array=[];
                datas.forEach(item=>{
                  let ips={
                    ip:item.ip,
                    port:item.port
                  };
                  array.push(ips);
                })
                this.setState({
                  ips:array
                })
              }
            })
          }
        }
      })
    }
    
  }


  loadDatas=()=>{
    let upstream = this.state.upstream;
    if (upstream) {
      getupstream(upstream).then(data => {
        if (data) {
          this.setState({ 
            data: data.targets
           })
        }else{
          this.setState({
            data:[]
          })
        }
        this.setState({
          ip:'',
          port:'',
          weight:'',
          record:{},
          isEditing:false,
        })
      })
    }
  }
  
  newMember=()=>{
    if(!this.state.isEditing){
      const newData = this.state.data.map(item => ({ ...item }));
      newData.push({
        ip:'',
        port:'',
        weight:'',
        editable:true,
        isNew:true,
      })
      this.setState({ data: newData, isEditing:true})
    }else{
      message.error('有数据未保存，请先保存数据再进行添加')
    }

  }

  handleIpChange=(e,record)=>{
    let ips=this.state.ips;
    if(ips.length>0){
      ips.forEach(item=>{
        if(item.ip===e){
          record.port=item.port;
        }
      })
    }
    record.ip=e;
    this.setState({
      ip:e,
    })
  }

  handleChecked = (checked) => {
    this.props.checked(checked);
    this.setState({
      HttpCheckedValue: checked
    })
  }

  
  //保存
  handleSave=(record)=>{
    if(!record.ip){
      message.error('集群IP不能为空')
      return ;
    }
    if(!record.port){
      message.error('集群port不能为空')
      return ;
    }

    let reg=constants.reg.ip;
    if(!reg.test(record.ip)){
      message.error('集群IP格式错误,请参考xxxx.x.x.x')
      return;
    }
    /* if(!record.weight){
      message.error('集群weight不能为空')
      return ;
    } */
    // let code=this.state.code;
    let name=this.state.name;
    let upstream = this.state.upstream;
    let targets = this.state.data;
    //获取集群所有的target,如果当前行有数据，则是证明编辑状态，先进行过滤数据
    if(this.state.record){
      targets=this.state.data.filter(item=>item.ip!==record.ip)
    }
    let target={
      ip: record.ip,
      port: record.port,
      weight: record.weight,
    }
    targets.push(target);
    let queryParams={
      code: upstream,
      name:name,
      targets: targets,
    }
    let a=this.state.data.filter(item=>item.ip===record.ip);
    if(a.length>1){
      message.error('存在重复ip，请重新填写');
      return;
    }
    doUpstream(upstream,queryParams).then(data=>{
      if(data){
        message.success('操作成功')
        this.loadDatas();
      }
    })
  }

  //编辑
  handleEdit=(record)=>{
    if(!this.state.isEditing){
      this.setState({
        isEditing:true,
        ip:record.ip,
        port:record.port,
        weight:record.weight,
        record:record,
      })
      record.editable=true;
    }else{
      message.error('有数据未保存，请先保存数据再进行修改')
    }
  }

  handleDelete=(record)=>{
    let targets=this.state.data.filter(item=>item.ip!==record.ip)
    let name = this.state.name;
    let upstream = this.state.upstream;
    let queryParams = {
      code: upstream,
      name: name,
      targets: targets,
    }
    doUpstream(upstream, queryParams).then(data => {
      if (data) {
        message.success('操作成功')
        this.loadDatas();
      }
    })
  }
    
  handlePortChange = (value,record)=>{
    record.port = value
    this.setState({
      port:value,
    })
  }
  handleWeightChange = (value,record) => {
    record.weight = value
    this.setState({
      weight: value,
    })
  }
  render(){
    const {ips}=this.state;
    const Options=ips.map(item=>{
      return <Option key={item.ip} value={item.ip}>{item.ip}</Option>
    });
    const columns=[
      {
        title:'IP',
        dataIndex:'ip',
        width:'30%',
        render:(text,record)=>{
          if(record.editable){
            return <Select
              value={this.state.ip}
              onChange={e=>this.handleIpChange(e,record)}
              style={{ width: '60%', marginRight: 8 }}
              mode='combobox'
              filterOption={e => { return true }}
            >
              {Options}
            </Select>
          }else{
            return text;
          }
        }
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '20%',
        render:(text,record)=>{
          if(record.editable){
            return <InputNumber value={text} onChange={e=>this.handlePortChange(e,record)} />
          }else{
            return text;
          }
        }
      },
      {
        title: '权重',
        dataIndex: 'weight',
        width: '10%',
        render:(text,record)=>{
          if(record.editable){
            return <InputNumber  value={text} onChange={e=>this.handleWeightChange(e,record)}/>
          }else{
            return text;
          }
        }
      },
      {
        title: '健康状态',
        dataIndex: 'stuts',
        width: '20%',
      },
      {
        title: '操作',
        width: '20%',
        render:(text,record)=>{
          if(record.editable){
            return (
              <Fragment>
                <a onClick={e=>this.handleSave(record)}>保存</a>
                <Divider type='vertical'/>
                <a onClick={this.loadDatas}>取消</a>
              </Fragment>
            )
          }else{
            return(
              <Fragment>
                <a onClick={e=>this.handleEdit(record)}>编辑</a>
                <Divider type='vertical' />
                <Popconfirm title='确认删除?' onConfirm={e=>this.handleDelete(record)}>
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
            )
          }
        }
      },
    ]
    return(
      <div>
        <div style={{ marginBottom: 24 }}>
          <span>是否支持https: </span>  <Switch style={{ marginLeft: 24 }} checked={this.state.HttpCheckedValue} onChange={this.handleChecked} />
        </div>
      <Table
        dataSource={this.state.data}
        columns={columns}
        rowKey={record=>record.code}
        pagination={false}
      />
      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="dashed"
        onClick={this.newMember}
        icon="plus"
      >
        新增
      </Button>
      </div>
    )
  }
}