import React, { PureComponent,Fragment } from 'react';
import { Button,Table,Select,message,Divider,InputNumber,Tooltip,Icon,Alert } from 'antd';
import showConfirmModal from './ShowConfirmModal';
import Authorized from '../../../common/Authorized';
const Option = Select.Option;
/* 部署页面网络配置,props(networkConfigs,node)
 * networkConfigs arr 集群数据
 * afternetconf func 保存删除操作回调函数
 * node string 节点地址
 */
export default class NetworkConfig extends PureComponent {
  state = {
    data:[],
    flag:'111',
    //node:this.props.node,
    innerSelect:'close',
    outerSelect:'close',
    showWarning:false
  };
  constructor(props){
    super(props);
    this.state.data = this.props.networkConfigs.slice();
  }
  outerStatus = '';
  componentWillReceiveProps (nextProps){
    if(JSON.stringify(nextProps.networkConfigs) !== JSON.stringify(this.props.networkConfigs)){
      this.setState({
        data:[...nextProps.networkConfigs]
      });
    }
  }
  /** 显示是否重启应用modal
     * @param function 确认操作，调用父组件的修改方法
     * @param function 取消操作，关闭modal
     * @param object   传入应用code和容器名称参数
     */
  showConfirmAddOrEdit = (e,key,temp)=>{
    const { appCode,operationkey } = this.props;
    showConfirmModal(()=>{
      this.saveRow(e,key);
    },()=>{
      this.remove(key,temp);
    },{
      appCode:appCode,
      containerName:operationkey,
    }); 
  } 
  showConfirmDelete = (e,key,temp)=>{
    const { appCode,operationkey } = this.props;
    showConfirmModal(()=>{
      this.remove(key,temp);
    },()=>{
    },{
      appCode:appCode,
      containerName:operationkey,
    }); 
  }
  //新增网络配置数据
  newRecord = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    let flag = false;
    newData.forEach(element=>{
      if(element.isNew || element.editable || element.isChange){
        flag = true;
      }
    })
    if(flag){
      message.error('网络配置表格中存在未保存数据，请先保存后再添加新的数据');
      return; 
    }
    newData.push({
      key: Math.random(),
      port: null,
      protocol: 'TCP',
      inneraddress: '',
      outaddress:'',
      editable: true,
    });
    this.index += 1;
    this.setState({ data: newData,outerSelect:'close',innerSelect:'close' });
    if(this.props.afternetconf){
      this.props.afternetconf(null,true);
    }
  }
  //编辑网络配置数据
  onEdit = (key)=>{
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if(!target.editable) {
        const tempData = this.state.data.filter(item => item.key !== key);
        let flag = false;
        tempData.forEach(element =>{
          if(element.isNew || element.editable || element.isChange){
            flag = true;
          }
        });
        if(flag){
          message.error('网络配置表格中存在未保存数据，请先保存再进行编辑操作');
          return;
        }
      }
      target.isChange = true;
      this.setState({ data: newData,outerSelect:!!target.outaddress?'open':'close' });
      this.outerStatus = !!target.outaddress?'open':'close';
    }
  }
  cancelChange = (key)=>{
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      delete target.isChange;
      this.setState({ data: newData,outerSelect:'close' });
    }
  }
  //删除网络配置数据
  remove(key,temp) {
    const newData = this.state.data.filter(item => item.key !== key);
    if(this.props.afternetconf){
      this.props.afternetconf(newData);
    }else{
      if(!temp){
        this.props.onDeleteNetWorkConfig(key);
      }else{
        this.setState({data:newData});
      }
    }
  }
  //点击保存时添加网络配置数据
  saveRow(e, key) {
    const { data,innerSelect,outerSelect } = this.state;
    let flag=false;
    const target = this.getRowByKey(key) || {};
    if (!target.port){
      message.error('网络配置端口号未填写，请输入网络端口号再保存');
      return;
    }
    if(!target.protocol){
      message.error('网络配置协议未填写，请输入网络协议再保存');
      return;
    }
    if(innerSelect==='open' && !target.inneraddress.split(':')[1]){
      message.error('网络配置集群内端口号未填写，请填写集群内端口号再保存');
      return;
    }
    data.forEach((element)=>{
      if(element.port === target.port  && element.protocol === target.protocol ){
        flag ++;
      }
      if(element.inneraddress){
        element.innerPort = parseInt(element.inneraddress.split(':')[1],10);
      }
      if(element.outaddress){
        element.outerPort = parseInt(element.outaddress.split(':')[1],10);
      }
    });
    if(flag > 1){
      message.error(`网络配置端口与已有端口重复，请重新填写`);
      return;
    }
    delete target.editable;
    if(this.props.afternetconf){
      this.props.afternetconf(data);
    }else{
      this.props.onAddNetworkConfig(target,innerSelect,outerSelect);
    }
  }
  //修改集群外地址配置
  changeNetwork(key) {
    const target = this.getRowByKey(key) || {};
    if(target.outaddress && (parseInt(target.outaddress.split(':')[1],10)<30000 || parseInt(target.outaddress.split(':')[1],10)>32676)){
      message.error('集群外端口必须在30000-32767之间,请重新填写');
      return;
    }
    if(this.outerStatus !== this.state.outerSelect){
      delete target.isChange;
      if(this.state.outerSelect === 'open'){
        this.props.onChangeNetworkConfig(target,this.state.outerSelect);
      }else{
        this.props.onChangeNetworkConfig(target,this.state.outerSelect);
      }
    }else{
      this.cancelChange(key);
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  //表格行数据修改
  handleFieldChange(e, fieldName, key) {
    //const { node } = this.state;
    if(fieldName === 'port'){
      const newData = this.state.data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] = e;
        this.setState({ data: newData });
      }
    }else{
      const newData = this.state.data.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
        target[fieldName] =this.props.node +':'+ e;
        this.setState({ data: newData });
      }
    }
  }
  checkAdd = (e,key,temp)=>{
    e.persist();
    let portFlag = 0;
    let innerPortFlag = 0;
    let outerPortFlag = 0;
    const target = this.getRowByKey(key) || {};
    if(target.outaddress && (parseInt(target.outaddress.split(':')[1],10)<30000 || parseInt(target.outaddress.split(':')[1],10)>32676)){
      message.error('集群外端口必须在30000-32767之间,请重新填写');
      return;
    }
    if (!target.port){
      message.error('网络配置端口号未填写，请输入网络端口号再保存');
      return;
    }
    if(!target.protocol){
      message.error('网络配置协议未填写，请输入网络协议再保存');
      return;
    }
    if(this.state.innerSelect==='open' && !target.inneraddress.split(':')[1]){
      message.error('网络配置集群内端口号未填写，请填写集群内端口号再保存');
      return;
    }
    this.state.data.forEach((element)=>{
      if(element.port === target.port && element.protocol === target.protocol){
        portFlag ++;      
      }
      if(element.inneraddress && element.inneraddress.split(':')[1] === target.inneraddress.split(':')[1]){
        innerPortFlag ++;
      }
      if(element.outaddress && element.outaddress.split(':')[1] === target.outaddress.split(':')[1]){
        outerPortFlag ++;
      }
    });
    if(portFlag > 1){
      message.error(`网络配置端口与已有端口重复，请重新填写`);
      return;
    }
    if(innerPortFlag > 1){
      message.error(`网络配置集群内端口与已有端口重复，请重新填写`);
      return;
    }
    if(outerPortFlag > 1){
      message.error(`网络配置集群外端口与已有端口重复，请重新填写`);
      return;
    }
    this.showConfirmAddOrEdit(e,key,temp);
  }
  render() {
    const titleTip = (
      <Tooltip title="端口必须在30000-32767之间,为空时平台自动分配">
          <Icon type="info-circle-o" />
      </Tooltip>
    )
    const { data,innerSelect,outerSelect,showWarning } = this.state;
    const columns = [{
      title: '容器端口',
      dataIndex: 'port',
      key: 'port',
      width:'15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <InputNumber
              value={text} min={1} max={65535} autoFocus style={{width:'100%'}}
              onChange={e => this.handleFieldChange(e, 'port', record.key)}/>
            );
          }
          return text;
        }
      }, {
        title: '协议',
        dataIndex: 'protocol',
        key: 'protocol',
        width:'15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style={{width:'100%'}} defaultValue='TCP' onChange={value => record.protocol = value}>
                <Option value="TCP">TCP</Option>
                <Option value="UDP">UDP</Option>
              </Select>
            );
          }
          return text;
        },
    }, {
      title: '集群内地址',
      dataIndex: 'inneraddress',
      key: 'inneraddress',
      width:'25%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Fragment>
              <Select style={{width:'40%'}} value={innerSelect}
                onChange={value => this.setState({innerSelect:value})}>
                <Option value="open">开放</Option>
                <Option value="close">关闭</Option>
              </Select>
              {
                innerSelect === 'open'?
                <InputNumber
                  min={1} max={65535} style={{width:'50%',marginLeft:8}} placeholder="自定义端口"
                  onChange={e => this.handleFieldChange(e, 'inneraddress', record.key)}/>
                :''
              }
            </Fragment>
          );
        }
        return text;
      },
    }, {
      title: '集群外地址',
      dataIndex: 'outaddress',
      key: 'outaddress',
      width:'25%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Fragment>
              <Select style={{width:'40%'}} value={outerSelect} 
                onChange={value => this.setState({outerSelect:value})}>
                <Option value="open">开放</Option>
                <Option value="close">关闭</Option>
              </Select>
              {outerSelect === 'open'?
              <Fragment><InputNumber 
                style={{width:'40%',marginLeft:8,marginRight:8}} placeholder="自动分配"
                onChange={e => this.handleFieldChange(e, 'outaddress', record.key)}/>{titleTip}</Fragment>:''}
            </Fragment>
          );
        }else if(record.isChange){
          return (
            <Fragment>
              <Select style={{width:'40%'}} value={outerSelect} 
                onChange={value => this.setState({outerSelect:value})}>
                <Option value="open">开放</Option>
                <Option value="close">关闭</Option>
              </Select>
              {outerSelect === 'open'?
              <Fragment><InputNumber disabled={this.outerStatus==='open'?true:false}
                style={{width:'40%',marginLeft:8,marginRight:8}} 
                placeholder={!!record.outaddress?record.outaddress.split(':')[1]:'自动分配'}
                onChange={e => this.handleFieldChange(e, 'outaddress', record.key)}/>{titleTip}</Fragment>:''}
            </Fragment>
          );
        }
        return text;
      },
    }, {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      width:'15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <span>
              <a onClick={e => this.props.isAddApp?this.saveRow(e, record.key):this.checkAdd(e,record.key,true)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e =>this.remove(record.key,true)}>取消</a>
            </span>
          );
        }else if(record.isChange){
          return (
            <span>
              <a onClick={e => this.changeNetwork(record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e =>this.cancelChange(record.key)}>取消</a>
            </span>
          );
        }else{
          return (
            <span>
              { !this.props.isAddApp?
              <Authorized authority={this.props.type==='middleware'?'middlewares_editNet':'app_editNet'} noMatch={<a disabled="true" onClick={e =>this.onEdit(record.key)}>编辑</a>}>
                <a onClick={e =>this.onEdit(record.key)}>编辑</a>
              </Authorized>
              : '' }
              <Divider type="vertical" />
              <Authorized authority={this.props.type==='middleware'?'middlewares_deleteNet':'app_deleteNet'} noMatch={<a disabled="true" onClick={e =>this.props.isAddApp? this.remove(record.key) :this.showConfirmDelete(e,record.key)}>删除</a>}>
                <a onClick={e =>this.props.isAddApp? this.remove(record.key) :this.showConfirmDelete(e,record.key)}>删除</a>
              </Authorized>
            </span>
          );
        }
      },
    }];
    return (
      <div>
        <div className="card-title">网络配置</div>
        { showWarning?
          <Alert
            message='网络配置修改内容未保存生效,是否保存并重启应用?'
            description={<span><a onClick={this.onRestartApp}>保存并重启应用</a>{/* <Divider type="vertical" /><a>取消修改</a> */}</span>}
            type="warning" style={{marginBottom:10}}
            showIcon
          />:null
        }
        <Table
          loading={this.props.networkLoading}
          pagination={false}
          dataSource={data} 
          columns={columns} 
          rowKey="containerName"
        /> 
        <Authorized authority={this.props.type==='middleware'?'middlewares_addNet':'app_addNet'} noMatch={<Button disabled="true" style={{ width: '100%', marginTop: 16, marginBottom: 8 }}type="dashed"onClick={this.newRecord}icon="plus">添加网络配置</Button>}>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newRecord}
            icon="plus"
          >
            添加网络配置
          </Button>
        </Authorized>
      </div>
    );
  }
}