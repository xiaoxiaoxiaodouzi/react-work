import React from 'react'
import { Row, Col,Card,Modal,Form ,Input,Button,Icon,Upload,message,Select} from 'antd';
import {getList,getDockerfileByArtifact,getDockerfileByType,pack,getLogs,getCurrentUser} from '../../services/images'
import {base} from '../../services/base'


const TextArea=Input.TextArea;
const FormItem=Form.Item;
const Option=Select.Option;

class ImagesUploadForm extends React.Component {
  state={
    artifact:'',          //镜像名称  
    tenant:'',            //租户信息
    visible:false,
    latest:'',        //最新版本号
    dockerfile:'',        //dockerfile
    fileList:[],        //文件列表
    uploading:false,
  }
 

  componentWillReceiveProps(nextProps){
    if(nextProps.tenant!==this.state.tenant || nextProps.artifact!==this.state.artifact){
      this.setState({
        tenant:nextProps.tenant,
        artifact:nextProps.artifact,
      })
    }
  }

  loadData=()=>{
    let tenant=this.props.tenant;
    let artifact=this.props.artifact;
    const {setFieldsValue} =this.props.form;
    if(artifact){
      setFieldsValue({
        imageName:artifact
      })
      getList(tenant,artifact).then(data=>{
        this.setState({
          latest:data.contents[0].tag
        })
      })
      //获取dockerfile
      getDockerfileByArtifact(artifact).then(data=>{
        if(!data){
          setFieldsValue({
            dockerfile:data.dockerfile
          })
        }else{
          //先默认写死war，目前只支持这个类型的程序包
          getDockerfileByType('java-web').then(datas=>{
            setFieldsValue({
              dockerfile:datas.dockerfile
            })
          })
        }
      })
    }else{
      getDockerfileByType('java-web').then(datas=>{
        setFieldsValue({
          dockerfile:datas.dockerfile
        })
        this.setState({
          latest:''
        })
      })
    }
  }

  showModal=(e)=>{
    this.setState({
      visible:true
    })
    //当模态框打开的时候才去调用接口
    this.loadData();
  }
  onCancel=()=>{
    const {resetFields}=this.props.form;
    this.setState({
      visible:false
    })
  }

  handleChange=(icon)=>{
    this.props.selectIcon(icon)
    this.setState({
      visible:false
    })
  }

  handleSubmit=()=>{
    this.setState({
      uploading: true,
    });
    getCurrentUser().then(user=>{
      const {validateFields} =this.props.form;
      validateFields((err,values)=>{
        if(err){
          return
        }
        let fileList=this.state.fileList
        let tenant=this.state.tenant
        if(fileList.length>0){
          let filedata=new FormData();
          filedata.append('files',fileList[0])
          filedata.append('tenant',tenant)
          filedata.append('packMethod',0)
          filedata.append('fileInfo',fileList[0].name)
          filedata.append('imageName',values.imageName)
          filedata.append('imageTag',values.imageTag)
          filedata.append('dockerfile',values.dockerfile)
          filedata.append('createUser',user.name)
          const getAmpEnvId = () => {
            let evnId = base.currentEnvironment ? base.currentEnvironment.id : '1';
            return evnId;
          }
          fetch('proxy/cce/v1/buildimages',{
            method:'POST',
            credentials: "include",
            headers:{
              'X-Requested-With': 'XMLHttpRequest', 
              'AMP-ENV-ID': getAmpEnvId() 
           },
           body:filedata,
          }).then((response) => 
            response.json() // << This is the problem
          ).then(data=>{
            if(data){
              let queryParams={
                lines:100
              }
              getLogs(data.taskid,queryParams).then(datas=>{
                
              })
              this.setState({
                fileList:[],
                uploading:false,
                visible:false,
              })
              this.props.onOk();
              message.success('编译镜像成功')
            }else{
              message.error('编译失败，请联系管理员')
              this.setState({
                uploading:false
              })
            }
          })
        }else{
          message.error('请先上传文件在进行编译')
          this.setState({
            uploading:false
          })
        }
      })
    })
  }
  render() {
    var dom = null;
    if (this.props.renderButton) {
        dom = 
        (<a onClick={this.showModal}>
            {this.props.renderButton}
        </a>)
    }
    const formItemLayout = {
      labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 13 },
      },
     };
     const { getFieldDecorator } = this.props.form;
     const props = {
      name: 'file',
      action: '',
      headers: {
      authorization: 'authorization-text',
      },
      onRemove:(file)=>{
        this.setState({
          fileList:[]
        })
      },
    
      beforeUpload:(file)=>{
        let query=[];
        query.push(file);
        this.setState({
          fileList:query
        })
        return false;
      },
      fileList:this.state.fileList,
    }
    return (
      <div>
        {dom}
        <p>{this.state.icon}</p>
        <Modal
          width='700px'
          bodyStyle={{height:500,overflow:'auto'}}
          title='上传程序包&编译镜像'
          footer={null}
          visible={this.state.visible}
          onCancel={this.onCancel}
          maskClosable={false}
        >
        <Form>
          <FormItem {...formItemLayout} label="程序包类型" 
          validateStatus={this.state.validateStatus}
          help={this.state.help}
          >
              {getFieldDecorator('fileInfo',{initialValue:'war'})(
                  <Select>
                    <Option value='war' key='war'>war</Option>
                  </Select>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="镜像名称" 
          validateStatus={this.state.validateStatus}
          help={this.state.help}
          >
              {getFieldDecorator('imageName')(
                  <Input onBlur={this.OnBlur} />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="镜像版本" 
          validateStatus=''
          help={'最新版本:'+this.state.latest}
          >
              {getFieldDecorator('imageTag')(
                  <Input onBlur={this.OnBlur} />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="上传程序包" 
          validateStatus=''
          help='只支持war包'
          >
              {getFieldDecorator('files')(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> 上传文件
                  </Button>
                </Upload>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="Dockerfile" 
          validateStatus={this.state.validateStatus}
          help={this.state.help}

          >
              {getFieldDecorator('dockerfile')(
                  <TextArea style={{height:300}} onBlur={this.OnBlur} />
              )}
          </FormItem>
          <FormItem {...formItemLayout}  
          style={{paddingLeft:260}}
          >
              <Button type='primary' loading={this.state.uploading} onClick={this.handleSubmit}>{this.state.uploading?'正在编译中...':'提交编译'}</Button>
          </FormItem>
        </Form>
        
        </Modal>
      </div>
    );
  }
}
const ImagesUpload =Form.create()(ImagesUploadForm)
export default ImagesUpload;