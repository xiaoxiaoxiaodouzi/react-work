import React, { Fragment,Component } from 'react';
import {Table, Form, Input, Select,  Button, Divider, message ,Modal,Radio,Popconfirm} from 'antd';
import {getEnvs,updateEnvs,addEnvs,deleteEnvs,getKeys} from '../../../services/images'
 

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const TextArea=Input.TextArea;
class ImageTableListForm extends Component{
  state={
    id:'',
    loading:false,
    envs:[],
    visible:false,
    isUpdate:false,
    ckecked:'',
    validateStatus:'',
    help:''
  }
  componentDidMount(){
    let tenant=this.props.tenant;
    let artifact=this.props.artifact;
    if(tenant && artifact){
      getEnvs(tenant,artifact).then(data=>{
        this.setState({
          envs:data.contents
        })
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.tenant !== nextProps.tenant && nextProps.tenant && nextProps.artifact){
      let tenant=nextProps.tenant;
      let artifact=nextProps.artifact;
      if(tenant && artifact){
        getEnvs(tenant,artifact).then(data=>{
          this.setState({
            envs:data.contents
          })
        })
      }
    }
  }
  handleDelete=(record)=>{
    let id=record.id;
    let tenant=this.props.tenant;
    let artifact=this.props.artifact;
    deleteEnvs(tenant,artifact,id).then(data=>{
      this.loadData();
      message.success('删除成功')
    })
  }

  handleUpdate=(record)=>{
    const form =this.props.form
    this.setState({
      visible:true,
      id:record.id,
      isUpdate:true,
    })
    form.setFieldsValue({
      envNecessary:record.envNecessary,
      envKey:record.envKey,
      defaultValue:record.defaultValue,
      valueType:record.valueType,
      envDescribe:record.envDescribe,
    })
  }

  loadData=()=>{
    let tenant=this.props.tenant;
    let artifact=this.props.artifact;
    getEnvs(tenant,artifact).then(data=>{
      this.setState({
        visible:false,
        envs:data.contents,
        id:'',
        isUpdate:false,
        ckecked:'',
      })
    })
  }

  //显示模态框
  showModal=()=>{
    const form=this.props.form;
    form.resetFields();
    form.setFieldsValue({
      envNecessary:0
    })
    this.setState({
      visible:true,
    })
  }

  handleOk=()=>{
    const form=this.props.form;
    let isUpdate=this.state.isUpdate;
    let tenant=this.props.tenant;
    let artifact=this.props.artifact;
    let help=this.state.help;
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      if(help){
        return
      }
      values.image=tenant+'/'+artifact;
      if(values.envKey){
        if(isUpdate){
          values.id=this.state.id;
          updateEnvs(tenant,artifact,values).then(data=>{
            if(data){
              this.loadData();
              message.success('修改环境变量成功')
            }
          })
        }else{
          //
          addEnvs(tenant,artifact,values).then(data=>{
            if(data){
              this.loadData();
              message.success('新增环境变量成功')
            }
          })
        }
      }else{
        message.error('请填写KEY')
      }
      
    })
  }

  //radio单选框
  change=(value)=>{
    this.setState({
      checked:value
    })
  }

  handleCancle=()=>{
    this.setState({
        validateStatus:'',
        help:'',
        visible:false,
        id:'',
        isUpdate:false,
        ckecked:'',
    })
  }
  // KEY输入框焦点失去的时候
  OnBlur=(e)=>{
    let tenant=this.props.tenant;
    let artifact=this.props.artifact;
    if(e.target.value){
      getKeys(tenant,artifact,e.target.value).then(data=>{
        if(data){
          this.setState({
            validateStatus:"error",
            help:"KEY已存在"
          })
        }else{
          this.setState({
            validateStatus:"success",
            help:""
          })
        }
      })
    }else{
      this.setState({
        validateStatus:"error",
        help:"KEY不能为空"
      })
    }
  }
  
  render(){
    const columns = [
      {
        title:"Key",
        dataIndex: 'envKey',
        width: '15%',
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        width: '15%',
      },
      {
        title: '是否必填',
        dataIndex: 'envNecessary',
        width: '15%',
        render:(text,record)=>{
          if(text===0){
            return '否'
          }else if(text===1){
            return '是'
          }
        }
      },
      {
        title: '类型',
        dataIndex: 'valueType',
        width: '15%',
        render:(text,record)=>{
          if(text==='number'){
            return '数字'
          }
          if(text==='string'){
            return '字符串'
          }
          if(text==='pwd'){
            return '密码'
          }
        }
      },
      {
        title: '描述',
        dataIndex: 'envDescribe',
        width: '15%',
      },
      {
        title: '操作',
        width: '15%',
        render: (text,record) => {
          return(
            <Fragment>
                <a onClick={e=>{this.handleUpdate(record)}}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title='确认删除' onConfirm={()=>this.handleDelete(record)}>
                <a>移除</a>
                </Popconfirm>
								
            </Fragment>
          )
        }
      }
    ];
    
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
    return(
        <div>
          <div style={{marginBottom:24}}>
            <Button type='primary' style={{marginRight:8}} onClick={e=>this.showModal()}>新建</Button>
					</div>
          <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={this.state.envs}
          loading={this.state.loading}
          />      
        <Modal
        title={this.state.isUpdate?'修改环境变量':'新增环境变量'}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancle}
        >
        <Form>
          <FormItem {...formItemLayout} label="KEY" 
            validateStatus={this.state.validateStatus}
            help={this.state.help}
            >
                {getFieldDecorator('envKey')(
                    <Input onBlur={this.OnBlur} />
                )}
          </FormItem>
          <FormItem {...formItemLayout} label="默认值" 
            >
                {getFieldDecorator('defaultValue')(
                    <Input   />
                )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否必填" 
          >
              {getFieldDecorator('envNecessary')(
                  <RadioGroup onChange={this.change} >
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </RadioGroup>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="类型" 
            >
                {getFieldDecorator('valueType')(
                    <Select>
                      <Option key='number' value='number'>数字</Option>
                      <Option key='string' value='string'>字符串</Option>
                      <Option key='pwd' value='pwd'>密码</Option>
                    </Select>
                )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述" 
            >
                {getFieldDecorator('envDescribe')(
                    <TextArea   />
                )}
          </FormItem>
        </Form>            
        </Modal>
        </div>
    )
  }
}

const ImageTableList=Form.create()(ImageTableListForm)
export default ImageTableList;