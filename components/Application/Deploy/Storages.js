import React, { PureComponent } from 'react';
import { queryMountableVolumes, createVolumes } from '../../../services/cce'
import { Button,Table,Input,message,Modal,Divider,Select,Form } from 'antd';
import showConfirmModal from './ShowConfirmModal';
import Authorized from '../../../common/Authorized';
const Option = Select.Option;
const FormItem = Form.Item;
/* 部署页面存储卷,props(volumes,afterstorage)
 * volumes arr 存储卷数据
 * afterstorage func 保存删除操作回调函数
 */
const storageList = [10,20,40,80,100];
class Storages extends PureComponent {
  index = 0;
  state = {
    visibleModal:false,
    data : [],
    mountableVolumes:[],
    name:'',
    storage:'',
    storageValue:'',
    operationkey:this.props.operationkey,
  };
  constructor(props){
    super(props);
    const {volumes} = props;
    if(volumes){
      volumes.forEach((element,index) => {
        element.key = index;
      });
      this.state.data = [...volumes]; 
    }
  }
  componentDidMount(){
    this.getMountableVolumes();
  }
  componentWillReceiveProps (nextProps){
    const {volumes,operationkey} = nextProps;
    if(nextProps.isAddApp && JSON.stringify(volumes) !== JSON.stringify(this.props.volumes)){
      volumes.forEach((element,index) => {
        element.key = index;
      });
      this.setState({ data:volumes });
    }
    if(!nextProps.isAddApp && JSON.stringify(volumes) !== JSON.stringify(this.props.volumes)){
      this.setState({data:volumes,operationkey});
    }
  } 
  getMountableVolumes=()=>{
    queryMountableVolumes().then((data)=>{
      if(data && data.contents){
        this.setState({mountableVolumes:data.contents});
      }
    });
  }
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
  checkAdd = (e,key,temp)=>{
    e.persist();
    let flag = 0;
    const target = this.getRowByKey(key) || {};
    if (!target.name) {
      message.error('存储卷名称未填写，请先填写再保存');
      e.target.focus();
      return;
    }
    if (!target.mountPath) {
      message.error('存储卷路径未填写，请先填写再保存');
      e.target.focus();
      return;
    }
    // eslint-disable-next-line
    let patt = /^\/[0-9a-zA-Z\u4e00-\u9fa5.\/_-]*[0-9a-zA-Z\u4e00-\u9fa5_.\/-]+$/;
    if(!patt.test(target.mountPath)){
      message.error('挂载路径只能输入数字、字母、中文、下划线、横线、点、斜线,以斜线开头,如:/data');
      return;
    }
    this.state.data.forEach((element)=>{
      if(element.mountPath === target.mountPath){
        flag ++;
      }
    });
    if(flag > 1){
      message.error(`存储卷挂载路径与已有存储卷重复，请重新填写`);
      return;
    }
    this.showConfirmAddOrEdit(e,key,temp);
  }
  newRecord = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    let flag = false;
    newData.forEach(element=>{
      if(element.isNew || element.editable){
        flag = true;
      }
    })
    if(flag){
      message.error('存储卷表格中存在未保存数据，请先保存后再添加新的数据');
      return; 
    }
    this.getMountableVolumes();
    newData.push({
      key: this.state.data.length,
      name: '',
      mountPath: '',
      additionalProperties:{storage:''},
      readOnly: null,
      subPath: null,
      editable: true
    });
    this.index += 1;
    this.setState({ data: newData,storageValue:'' });
    if(this.props.afterstorage){
      this.props.afterstorage(null,true);
    }
  }
  remove(key,temp) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    if(this.props.afterstorage){
      this.props.afterstorage(newData);
    }else{
      if(!temp){
        this.props.onEditStorages(newData);
      }
    }
  }
  //保存修改的存储卷信息
  saveRow(e, key) {
    const target = this.getRowByKey(key) || {};
    let flag = 0;
    if (!target.name) {
      message.error('存储卷名称未填写，请先填写再保存');
      e.target.focus();
      return;
    }
    if (!target.mountPath) {
      message.error('存储卷路径未填写，请先填写再保存');
      e.target.focus();
      return;
    }
    // eslint-disable-next-line
    let patt = /^\/[0-9a-zA-Z\u4e00-\u9fa5.\/_-]*[0-9a-zA-Z\u4e00-\u9fa5_.\/-]+$/;
    if(!patt.test(target.mountPath)){
      message.error('挂载路径只能输入数字、字母、中文、下划线、横线、点、斜线,以斜线开头,如:/data');
      return;
    }
    this.state.data.forEach((element)=>{
      if(element.mountPath === target.mountPath){
        flag ++;
      }
    });
    if(flag > 1){
      message.error(`存储卷挂载路径与已有存储卷重复，请重新填写`);
      return;
    }
    delete target.editable;
    if(this.props.afterstorage){
      this.props.afterstorage(this.state.data);
    }else{
      this.props.onEditStorages(this.state.data);
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
//存储卷列表行字段修改
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  //创建存储卷
  handleModalOk = ()=>{
    const { name,storage,data } = this.state;
    let flag = 0;
    data.forEach((element)=>{
      if(element.name === name){
        flag ++;
      }
    });
    if(flag > 0){
      message.error(`存储卷名称与已有存储卷重复，请重新填写`);
      return;
    }
    createVolumes({name:name,storage:storage}).then(()=>{
      this.getMountableVolumes();
      const newData = data.slice();
      newData.forEach((element,index,newData)=>{
        if(index === newData.length-1){
          element.name = name;
          element.additionalProperties.storage = storage+'Gi';
        }
      });
      this.setState({data:newData,visibleModal:false,storageValue:name+'--'+storage+'Gi'});
    });
  }
  render() {
    const { data,mountableVolumes,visibleModal,storage,storageValue } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width:'30%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Select style={{width:'100%'}} value={storageValue} placeholder="名称" onChange={value =>{
                if(value === 'add'){
                  this.setState({visibleModal:true,name:'',storage:''});
                }else{
                  record.name = value.split('--')[0];
                  record.additionalProperties.storage = value.split('--')[1];
                  this.setState({storageValue:value});
                }
              }}>
              <Option value="add">创建存储卷</Option>
              {mountableVolumes.map(element=>{
                return <Option key={element.name} value={`${element.name}--${element.storage}`}>{`${element.name}--${element.storage}`}</Option>
              })}
            </Select>
          );
        }
        return text;
      }
    }, {
      title: '挂载路径',
      dataIndex: 'mountPath',
      key: 'mountPath',
      width:'30%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'mountPath', record.key)}
              placeholder="绝对路径如: /data"
            />
          );
        }
        return text;
      }
    }, {
      title: '最大容量',
      dataIndex: 'storage',
      key: 'storage',
      width:'20%',
      render: (text, record) => {
        return record.additionalProperties.storage;
      }
    }, {
      title: '操作',
      dataIndex: 'handle',
      key:'handle',
      width:'20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <span>
              <a onClick={e =>{this.props.isAddApp?this.saveRow(e, record.key):this.checkAdd(e,record.key,true)}}>保存</a>
              <Divider type="vertical" />
              <a onClick={() => this.remove(record.key,true)}>取消</a>
            </span>
          );
        }
        return (
          <Authorized authority={this.props.type==='middleware'?'middlewares_cancelMount':'app_cancelMount'} noMatch={<a disabled='true' onClick={e =>this.props.isAddApp? this.remove(record.key):this.showConfirmDelete(e,record.key)}>取消挂载</a>}>
            <a onClick={e =>this.props.isAddApp? this.remove(record.key):this.showConfirmDelete(e,record.key)}>取消挂载</a>
          </Authorized>
        );
      },
    }];
    return (
      <div>
        <div className="card-title">存储卷</div>
        <Table
          pagination={false}
          dataSource={data} 
          loading={this.props.storageLoading}
          columns={columns} 
          rowKey="name"
        />
        <Authorized authority={this.props.type==='middleware'?'middlewares_addStorageVolume':'app_addStorageVolume'} noMatch={'' }>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newRecord}
            icon="plus"
          >
            添加
          </Button> 
        </Authorized>
        
        <Modal 
          title="创建存储卷"
          visible={visibleModal}
          onOk={this.handleModalOk} 
          onCancel={()=>{
            this.setState({
              visibleModal:false,
            });
          }}>
          <Form>
            <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator("name",{rules:[
              {
                validator:(rule, value, callback) => {
                  const reg = /^[a-z0-9-]([a-z0-9-]*[a-z0-9-])?$/;
                  if(value !=='' && !reg.test(value)){
                    callback('只接受数字、小写字母和中划线!');
                  }
                  callback();
                }
              }
            ]})(
            <Input onChange={e => this.setState({name:e.target.value})} placeholder="存储卷名称"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="容量">
              <Select value={storage} placeholder="选择容量" onChange={value => this.setState({storage:value})}>
                {
                  storageList.map((element,index)=>{
                    return (
                      <Option key={index} value={element}>{element+'Gi'}</Option>
                    )
                  })
                }
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
const Antdes = Form.create()(Storages);
export default Antdes;