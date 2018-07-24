import React,{Component,Fragment} from 'react';
import {Table,Input,Divider,Modal,Popconfirm,Button,Form,message} from 'antd'
import {getResources,addResources,updateResources,deleteResources} from '../../../services/running'


const FormItem=Form.Item
class FormTable extends Component{
  state={
    formData:[],
    name:'',
    visible:false,
    id:'',
    isUpdate:false
  }

  componentDidMount(){
    this.loadData();
  }

  loadData=()=>{
    const appid=this.props.appid
    let queryParams={
      type:''
    }
    //查询表单数据 默认type=2
    queryParams.type='2';
    getResources(appid,queryParams).then(data=>{
      this.setState({
        formData:data
      })
    })
  }

  initState=()=>{
    this.setState({
      name:'',
      id:'',
      url:'',
      parentId:'',
      isUpdate:false
    })  
  }
  //点击编辑触发事件
  handleEdit=(e,record)=>{
    this.setState({
      visible:true,
      name:record.name,
      id:record.id,
      url:record.url,
      isUpdate:true
    })
    const form=this.props.form;
    form.setFieldsValue({
      name:record.name,
      id:record.id,
      url:record.url,
      code:record.code,
    })
  }

  //点击删除触发事件
  handleDelete=(id)=>{
    const appid=this.props.appid;
    deleteResources(appid,id).then(data=>{
      this.loadData();
      this.initState();
      message.success('删除成功')
    })
  }

  //模态框取消
  onCancel=()=>{
    this.setState({
      visible:false
    })
    const form = this.props.form;
    form.setFieldsValue({
      name:'',
      parentId: '',
      code: '',
    })
    this.initState();
  }

  onOk=()=>{
    const appid=this.props.appid;
    this.props.form.validateFields((err, values) => {
      if(err){
        return;
      }
      //获取表单数据并且进行操作
      //默认写父资源为form
      values.parentId='form'
      values.appId=appid;
      values.type='2'
      let isUpdate=this.state.isUpdate;
      let id=this.state.id;
      if(isUpdate){
        let queryParams={
          name:values.name
        }
        updateResources(appid,id,queryParams).then(data=>{
          if(data){
            this.loadData();
            this.initState();
            message.success('修改成功')
          }
        })
      }else{
        addResources(appid,values).then(data=>{
          if(data){
            this.loadData();
            this.initState();
            message.success('新增成功')
          }
        })
      }
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
      url:'',
      code:''
    })
  }
  render(){
    const columns=[
      {
        dataIndex:'name',
        title:'页面名称',
        width:'40%',
       },
       {
         dataIndex:'code',
         title:'编码',
         width:'20%'
       },
       {
         dataIndex:'url',
         title:'地址',
         width:'20%'
       },
       {
         title:'操作',
         width:'20',
         render:(text,record)=>{
           return (
            <Fragment>
              <a onClick={e=>this.handleEdit(e,record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除??" onConfirm={() => this.handleDelete(record.id)}>
                  <a>删除</a>
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
        sm: { span: 16 },
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
          title={this.state.isUpdate?'修改页面资源':'新增页面资源'}
          onCancel={this.onCancel}
          onOk={this.onOk}
          visible={this.state.visible}
        >
          <Form>
              <FormItem {...formItemLayout} label="资源名称" 
              >
                  {getFieldDecorator('name',
                  {rules:[{
                    required: true, message: '请输入资源名称',
                  }]
                })(
                      <Input />
                  )}
              </FormItem>

              {/* <FormItem {...formItemLayout} label="地址" 
              >
                  {getFieldDecorator('url')(
                      <Input />
                  )}
              </FormItem> */}

              <FormItem {...formItemLayout} label="资源编码" 
              >
                  {getFieldDecorator('code')(
                      <Input  placeholder='选填，为空则由平台自动生成'/>
                  )}
              </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const FormTableList =Form.create()(FormTable);
export default FormTableList;