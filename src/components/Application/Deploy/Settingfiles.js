import React, { PureComponent } from 'react';
import showConfirmModal from './ShowConfirmModal';
import { Button,Table,Modal,Form,Input,Divider } from 'antd';
const FormItem = Form.Item;
/* 部署页面配置文件,props(configs,aftersetting)
 * configs arr 配置文件数据
 * aftersetting func 保存删除操作回调函数
 */
const configContentInit = {
  data:{},
  metadata:{
    annotations:{
      data:{}
    }
  },
}
class Settingfiles extends PureComponent {
  index = 0;
  cacheOriginData = {};
  state = {
    loadSave:false,
    visibleModal:false,
    editKey:'',
    operationkey:'',
    startCmd:'',
    data: [],
    configContent:{
      data:{},
      metadata:{
        annotations:{
          data:{}
        }
      }
    },
    path:'',
    content:'',
    tempCmd:'',
    titleModal:'add',
  };
  constructor(props){
    super(props);
    const {configs,cmd,args,operationkey} = props;
    let configContent = Object.assign({},configContentInit);
    if(configs){
      configs.forEach((element,index) => {
        let keyName = element.name;
        element.key = keyName;
        if(element&&element.additionalProperties&& element.additionalProperties.config){
          configContent.data[element.name] = element.additionalProperties.config;
        }
      });
    }
    if( Array.isArray(cmd) && Array.isArray(args) && cmd.length && args.length){
      this.state.startCmd = cmd[0]+' '+args.join(' ');
      this.state.tempCmd = cmd[0]+' '+args.join(' ');
    }
    this.state.data = configs.filter(element => element.name !=='config-license');
    this.state.configContent = Object.assign({},configContent);
    this.state.operationkey = operationkey;
  }
  componentWillReceiveProps (nextProps){
    const {configs,cmd,args,operationkey,isAddApp} = nextProps;
    if(isAddApp){
      this.setState({data:configs});
    }
    if(!isAddApp && operationkey !== this.state.operationkey){
      let configContent = Object.assign({},configContentInit);
      let startCmd='';
      if(configs){
        configs.forEach((element,index) => {
          let keyName = element.name;
          element.key = keyName;
          configContent.data[element.name] = element.additionalProperties.config;
        });
      }
      if(Array.isArray(cmd) && Array.isArray(args) &&cmd.length && args.length){
        startCmd = cmd[0]+' '+args.join(' ');
      }
      this.setState({
        data:configs.filter(element => element.name !=='config-license'),
        startCmd,
        configContent,
        operationkey,
        tempCmd:startCmd
      });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    let {configContent}=this.state;
    delete configContent.data[key];
    this.setState({ data: newData,configContent });
    if(this.props.aftersetting){
      this.props.aftersetting(newData);
    }else{
      this.props.onEditSettingfiles(newData,configContent);
    }
  }
  onCMDChange = (e)=>{
    this.setState({
      startCmd:e.target.value,
      loadSave:true
    });
  }
  saveCMD = ()=>{
    const { startCmd } = this.state;
    if(startCmd){
      this.setState({loadSave:false,tempCmd:startCmd});
      this.showConfirmStartCMD();
    }
  }
  handleModalOk = ()=>{
    const { path,content,editKey,data,configContent,operationkey } = this.state;
    if(editKey){//编辑
      data.forEach((element)=>{
        if(element.key === editKey){
          element.name = editKey;
          element.mountPath = path;
          element.additionalProperties.config = content;
        }
      });
      for(let key in configContent.data){
        if(key === editKey){
          configContent.data[key] = content;
        }
      }
    }else{ //新增
      let keyName ='config-'+operationkey+'-'+Math.random().toString().slice(2,10);
      data.push({
        key:keyName,
        name:keyName,
        mountPath:path,
        additionalProperties:{
          config:content
        }
      });
      configContent.data[keyName] = content;
    }
    if(this.props.aftersetting){
      this.props.aftersetting(data);
      this.setState({visibleModal:false});
    }else{
      this.props.onEditSettingfiles(data,configContent);
      this.setState({visibleModal:false});
    }
  }
  editSettingfile = (e,key)=>{
    const { data } = this.state;
    data.forEach((element)=>{
      if(element.key === key){
        this.setState({
          editKey:key,
          path:element.mountPath,
          content:element.additionalProperties.config,
          visibleModal:true,
          titleModal:'edit',
          validatePath:null,
          validateContent:null,
          helpPath:null,
          helpContent:null
        });
      }
    });
  }
  showConfirmAddOrEdit = ()=>{
    const { appCode,operationkey } = this.props;
    showConfirmModal(()=>{
      this.handleModalOk();
    },()=>{
      this.setState({visibleModal:false});
    },{
      appCode:appCode,
      containerName:operationkey,
    });
  } 
  showConfirmStartCMD = ()=>{
    const { appCode,operationkey } = this.props;
    const { startCmd,tempCmd } = this.state;
    showConfirmModal(()=>{
      this.props.onSaveStartCMD(startCmd);
    },()=>{
      this.setState({loadSave:false,startCmd:tempCmd});
    },{
      appCode:appCode,
      containerName:operationkey,
    }); 
  }
  showConfirmDelete = (key)=>{
    const { appCode,operationkey } = this.props;
    showConfirmModal(()=>{
      this.remove(key);
    },()=>{
    },{
      appCode:appCode,
      containerName:operationkey,
    }); 
  }
  checkAdd = ()=>{
    const { path,editKey,data } = this.state;
    // eslint-disable-next-line
    let patt = /^\/[0-9a-zA-Z\u4e00-\u9fa5.\/_-]*[0-9a-zA-Z\u4e00-\u9fa5_.\/-]+$/;
    let pathFlag = 0;
    if(!path){
      this.setState({validatePath:'error',helpPath:'挂载路径不能为空'})
      return;
    }
    if(path ==='/data/license'){
      this.setState({validatePath:'error',helpPath:'挂载路径不能为 /data/license,请重新填写'})
      return;
    }
    if(!patt.test(path)){
      this.setState({
        validatePath:'error',
        helpPath:'挂载路径只能输入数字、字母、中文、下划线、横线、点、斜线,以斜线开头,如:/data'
      });
      return;
    }
    const newData = data.filter(item => item.key !== editKey);
    newData.forEach((element)=>{
      if(element.mountPath === path){
        pathFlag ++;
      }
    });
    if(pathFlag >0){
      this.setState({
        validatePath:'error',
        helpPath:'配置文件挂载路径与已有配置文件重复，请重新填写'
      });
      return;
    }
    this.props.isAddApp?this.handleModalOk():this.showConfirmAddOrEdit();
  }
  render() {
    const { data,loadSave,startCmd,visibleModal,content,path,titleModal } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    const columns = [{
      title: '配置文件挂载路径',
      dataIndex: 'mountPath',
      width:'70%',
      render: (text, record) => {
        return `${record.mountPath}`;
        //return text;
      }
    }, {
      title: '操作',
      dataIndex: 'handle',
      width:'30%',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => this.editSettingfile(e,record.key)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={e =>this.props.isAddApp?this.remove(record.key):this.showConfirmDelete(record.key)}>删除</a>
          </span>
        );
      },
    }];
    return (
      <div>
        <div className="card-title">配置文件</div>
        <Button style={{marginBottom: 16}} type="primary" 
          onClick={() => 
            this.setState({
              titleModal:'add',
              visibleModal:true,
              editKey:null,
              path:'',
              content:'',
              validatePath:null,
              validateContent:null,
              helpPath:null,
              helpContent:null
            })}>新增</Button>
        <Modal 
          title={titleModal ==='add'?"新增配置文件":"编辑配置文件"}
          visible={visibleModal}
          onOk={this.checkAdd} 
          onCancel={()=>{
            this.setState({
              visibleModal:false,
            });
          }}>
          <Form>
            <FormItem {...formItemLayout} 
              validateStatus={this.state.validatePath}
              help={this.state.helpPath}
              label="挂载路径">
              <Input onChange={e => this.setState({path:e.target.value})} value={path} placeholder="文件的绝对路径，如：/usr/local/web.xml"/>
            </FormItem>
            <FormItem {...formItemLayout} 
              validateStatus={this.state.validateContent}
              help={this.state.helpContent}
              label="文件内容">
              <Input.TextArea value={content} rows={10} onChange={e => this.setState({content:e.target.value})} />
            </FormItem>
          </Form>
        </Modal>
        <Table
          pagination={false}
          loading={this.props.settingFileLoading}
          dataSource={data} 
          columns={columns} 
          rowKey="id"
        />
        {
          this.props.hidecmd?"":
            <div style={{ marginTop: 24 }}>
              <span>启动命令:</span>
              <Input style={{ marginLeft:8,width:400 }} value={startCmd} onChange={this.onCMDChange} placeholder="示例：systemctl restart docker"/>              
              {loadSave?<Button type='primary' onClick={this.saveCMD} style={{ marginLeft: 16 }}>保存</Button>:''}
            </div>
        }
      </div>
    );
  }
}
const Antdes = Form.create()(Settingfiles);
export default Antdes;