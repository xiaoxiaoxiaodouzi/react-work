import React, { PureComponent } from 'react';
import showConfirmModal from './ShowConfirmModal';
import { Button,Table,Modal,Form,Input,message,Divider } from 'antd';
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
      //console.log('cccc',cmd,args,cmd[0]+' '+args.join(' '));
      this.state.startCmd = cmd[0]+' '+args.join(' ');
      this.state.tempCmd = cmd[0]+' '+args.join(' ');
    }
    this.state.data = [...configs];
    this.state.configContent = Object.assign({},configContent);
    this.state.operationkey = operationkey;
    //console.log("confsoperationkey",configContent,configs,operationkey);
  }
  componentWillReceiveProps (nextProps){
    const {configs,cmd,args,operationkey} = nextProps;
    // if( operationkey !== this.state.operationkey){
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
        //console.log('cccc',cmd,args,cmd[0]+' '+args.join(' '));
        startCmd = cmd[0]+' '+args.join(' ');
      }
      this.setState({data:configs,startCmd,configContent,operationkey,tempCmd:startCmd});
    // }
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
    //console.log(startCmd);
    if(!!startCmd && (startCmd.indexOf(' ')<1 || startCmd.indexOf(' ')===startCmd.length-1)){
      message.error("启动命令格式有误，请重新输入");
    }else{
      this.setState({loadSave:false,tempCmd:startCmd});
      this.showConfirmStartCMD();
      //this.props.onSaveStartCMD(startCmd); 
    }
  }
  handleModalOk = ()=>{
    const { path,content,editKey,data,configContent,operationkey } = this.state;
    //console.log("handlemodal122211 ok",path,content,operationkey);
    if(editKey){//编辑
      //console.log("bianji",configContent);
      data.forEach((element)=>{
        if(element.key === editKey){
          //console.log("element.key === editKey");
          element.name = editKey;
          element.mountPath = path;
          //element.additionalProperties.path = name;
          element.additionalProperties.config = content;
        }
      });
      for(let key in configContent.data){
        //console.log("key",key,editKey);
        if(key === editKey){
          //console.log("editkey",key);
          configContent.data[key] = content;
        }
      }
    }else{ //新增
      let keyName ='config-'+operationkey+'-'+Math.random().toString().slice(2,10);
      //console.log("xinzeng111",keyName);
      data.push({
        key:keyName,
        name:keyName,
        mountPath:path,
        additionalProperties:{
          //path:name,
          config:content
        }
      });
      configContent.data[keyName] = content;
    }
    if(this.props.aftersetting){
      console.log("aftersetting",data);
      this.props.aftersetting(data);
      this.setState({visibleModal:false});
    }else{
      this.props.onEditSettingfiles(data,configContent);
      this.setState({visibleModal:false});
    }
  }
  editSettingfile = (e,key)=>{
    const { data } = this.state;
    //console.log("edit",key);
    data.forEach((element)=>{
      if(element.key === key){
        this.setState({
          //name:element.additionalProperties.path,
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
    //console.log("checkAdd ok",path,content,titleModal,data,editKey);
    let patt = /^\/[0-9a-zA-Z\u4e00-\u9fa5.\/_-]*[0-9a-zA-Z\u4e00-\u9fa5_.\/-]+$/;
    let pathFlag = 0;
    if(!path){
      this.setState({validatePath:'error',helpPath:'挂载路径不能为空'})
      //message.error('请完整填写文件名称、挂载路径和文件内容');
      return;
    }
    if(!patt.test(path)){
      this.setState({
        validatePath:'error',
        helpPath:'挂载路径只能输入数字、字母、中文、下划线、横线、点、斜线,以斜线开头,如:/data'
      });
      //message.error('挂载路径只能输入数字、字母、中文、下划线、横线、点、斜线,以斜线开头,如:/data');
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
      //message.error('配置文件挂载路径与已有配置文件重复，请重新填写');
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
        <div className="title111">配置文件</div>
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
              <Input onChange={e => this.setState({path:e.target.value})} value={path} placeholder="挂载路径"/>
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
          dataSource={data} 
          columns={columns} 
          rowKey="id"
        />
        {
          this.props.hidecmd?"":
            <div style={{ marginTop: 24 }}>
              <span>启动命令:</span>
              <Input style={{ marginLeft:8,width:400 }} value={startCmd} onChange={this.onCMDChange} placeholder="容器启动命令"/>              
              {loadSave?<Button type='primary' onClick={this.saveCMD} style={{ marginLeft: 16 }}>保存</Button>:''}
            </div>
        }
      </div>
    );
  }
}
const Antdes = Form.create()(Settingfiles);
export default Antdes;