import React,{Component} from 'react'
import {Card,Table,Input,Button,Row,Col,Form} from 'antd' 
import {getTaskList} from '../../../services/cce'
import moment from 'moment'
import './ImageTaskList.css'
import LogModal from './LogModal'


const FormItem=Form.Item
class ImageTaskListForm extends Component{
  state={
    list:[],
    current:'',
    pageSize:'',
    total:'',
    imageName:'',
    tenant:'',
  }

  componentDidMount(){
    getTaskList().then(data=>{
      this.setState({
        list:data.contents,
        current:data.pageIndex,
        pageSize:data.pageSize,
        total:data.total
      })
    })
  }

  loadData=(queryParams)=>{
    getTaskList(queryParams).then(data=>{
      this.setState({
        list:data.contents,
        current:data.pageIndex,
        pageSize:data.pageSize,
        total:data.total
      })
    })
  }

  //跳转到指定页面
  handleData=(current,pageSize)=>{
    let queryParams={
      rows:pageSize,
      page:current,
    }
    const {validateFields}=this.props.form;
    validateFields((err,values)=>{
      if(err){
        return 
      }
      if(values.tenant){
        queryParams.tenant=values.tenant;
      }
      if(values.imageName){
        queryParams.imageName=values.imageName;
      }
    })
    this.loadData(queryParams);
  }

  //查询按钮
  handleSearch=()=>{
    const {validateFields}=this.props.form;
    validateFields((err,values)=>{
      if(err){
        return 
      }
      let queryParams={
        imageName:values.imageName,
        tenant:values.tenant
      }
      this.loadData(queryParams);
    })
    
    
  }

  handleReset=()=>{
    const form=this.props.form;
    form.resetFields();
  }
  render(){
    const pagination={
      current:this.state.current,
      pageSize:this.state.pageSize,
      total:this.state.total,
      onChange:(current,pageSize)=>{
        this.handleData(current,pageSize)
      }
    }
    const columns=[
     {
        title:'镜像名称',
        dataIndex:'imageName',
        width:'10%'
      },{
        title:'镜像Tag',
        dataIndex:'imageTag',
        width:'10%'
      },{
        title:'创建人',
        dataIndex:'createUser',
        width:'10%'
      },{
        title:'创建时间',
        dataIndex:'createTime',
        width: '30%', 
        defaultSortOrder:'ascend',
        sorter: (a, b) => b.createTime-a.createTime  ,
        render:(text,record)=>{
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      },{
        title:'状态',
        dataIndex:'status',
        width:'30%',
        render:(text,record)=>{
          if(text===1){
            return <span style={{color:'grey'}}>编译中</span>
          }
          if(text===2){
            return <span style={{color:'green'}}>提交打包任务到k8s成功</span>
          }
          if(text===3){
            return <span style={{color:'red'}}>提交打包任务到k8s失败</span>
          }
          if(text===4){
            return <span style={{color:'green'}}>打包任务执行成功</span>
          }
          if(text===5){
            return <span style={{color:'red'}}>打包任务执行失败</span>
          }
        }
      },
      {
        title:'操作',
        dataIndex:'id',
        width:'10%',
        render:(text,record)=>{
          return <LogModal name={record.imageName} id={record.packid} />
        }
      },
    ]
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title='打包任务列表'>
        <div className="tableList" style={{marginBottom:24}}>
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="镜像名称">
                  {
                    getFieldDecorator('imageName')(<Input placeholder='请输入'/>)
                  }
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="租户">
                  {
                    getFieldDecorator('tenant')(<Input placeholder='请输入'/>)
                  }
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <Button type='primary' onClick={this.handleSearch}>搜索</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          columns={columns}
          dataSource={this.state.list}
          rowKey={record=>record.id}
          pagination={pagination}
          />
      </Card>
        
    )
  }
}
const ImageTaskList=Form.create()(ImageTaskListForm);
export default ImageTaskList;