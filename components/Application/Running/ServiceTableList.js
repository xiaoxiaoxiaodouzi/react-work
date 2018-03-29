import React,{Component,Fragment} from 'react';
import {Table,Input,Divider,Modal,Popconfirm,Button,Form} from 'antd'

const FormItem=Form.Item
class ServiceTable extends Component{
  state={
    formData:[],
    name:'',
    visible:false,
    id:'',
    isUpdate:false
  }

  componentDidMount(){

  }

  initState=()=>{
    this.setState({
      name:'',
      id:'',
      icon:'',
      isupdate:false
    })  
  }
  //点击编辑触发事件
  handleEdit=(e,record)=>{
    this.setState({
      visible:true,
      name:record.name,
      icon:record.icon,
      id:record.id
    })
    const form=this.props.form;
    form.setFieldsValue({
      name:record.name,
      icon:record.icon,
      id:record.id
    })
  }

  //点击删除触发事件
  handleDelete=(id)=>{

  }

  //模态框取消
  onCancel=()=>{
    this.setState({
      visible:false
    })
    this.initState();
  }

  onOk=()=>{
    this.props.form.validateFields((err, values) => {
      if(err){
        return;
      }
      //获取表单数据并且进行操作
      this.setState({
        visible:false
      })
    })

  }

  handleAdd=()=>{
    this.setState({
      visible:true,
    })
    const form =this.props.form;
    form.setFieldsValue({
      name:'',
      icon:'',
      url:''
    })
  }
  render(){
    const columns=[
      {
        dataIndex:'name',
        title:'页面名称',
        width:'50%',
       },
       {
         dataIndex:'id',
         title:'编码',
         width:'20%'
       },
       {
         dataIndex:'icon',
         title:'图标',
         width:'10%'
       },
       {
         title:'操作',
         width:'20',
         render:(text,record)=>{
          <Fragment>
              <a onClick={e=>this.handleEdit(e,record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除??" onConfirm={() => this.handleDelete(record.id)}>
                  <a>删除</a>
              </Popconfirm>
          </Fragment>
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
    return (
      <div>
        <Button type='primary' style={{marginBottom:24}} onClick={this.handleAdd}>新增</Button>
        <Table
          dataSource={this.state.formData}
          columns={columns}
        >
        </Table>
        <Modal
          title={this.state.isUpdate?'修改页面':'新增页面'}
          onCancel={this.onCancel}
          onOk={this.onOk}
          visible={this.state.visible}
        >
          <Form>
              <FormItem {...formItemLayout} label="页面名称" 
              >
                  {getFieldDecorator('name')(
                      <Input />
                  )}
              </FormItem>

              <FormItem {...formItemLayout} label="地址" 
              >
                  {getFieldDecorator('url')(
                      <Input />
                  )}
              </FormItem>

              <FormItem {...formItemLayout} label="图标" 
              >
                  {getFieldDecorator('icon')(
                      <Input />
                  )}
              </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const ServiceTableList =Form.create()(ServiceTable);
export default ServiceTableList;