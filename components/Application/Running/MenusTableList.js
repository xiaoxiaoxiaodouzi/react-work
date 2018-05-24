import React,{Fragment,Component} from 'react'
import TreeHelp from './../../../utils/TreeHelp'
import { Table, Divider, Select, Input, message, Modal, Form, Button, Icon} from 'antd'
import {getMenuTrees,updateMenus,deleteMenuById,addMenus} from '../../../services/menus'
import IconSelectModal from '../../../common/IconSelectModal'

const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem=Form.Item;
class MenusTableListForm extends Component{
  state={
    treeData:[],
    options:[],
    visible:false,
    id:'',
    name:'',        //当前编辑的菜单名称
    target:'',      //当前编辑的菜单打开方式
    url:'',          //当前编辑的路径
    pid:'',
    icon:'',
    tempName:'',
    tempTarget:'',
    tempUrl:'',
  }

  //初始化状态
  initState=()=>{
    this.setState({
      id:'',
      url:'',
      name:'',
      target:'',
      pid:''  ,
      icon:''  
    })
  }
  componentDidMount(){
    const appid=this.props.appid;
    getMenuTrees(appid).then(data=>{
      let childArray=TreeHelp.toChildrenStruct(data);
      console.log("childArray",childArray)
      this.setState({
        treeData:childArray,
        options:data,
      })
    })
  }


  //菜单删除
  handleDelete=(record)=>{
    console.log("record",record)
    const appid=this.props.appid
    let id='';
    if(record){
      id=record.id
    }else{
      id=this.state.id
    }
    deleteMenuById(appid,id).then(data=>{
      message.success('删除成功')
      getMenuTrees(appid).then(datas=>{
        let childArray=TreeHelp.toChildrenStruct(datas);
        this.setState({
          treeData:childArray,
          options:datas,
        })
      })
    })
  }

  //菜单编辑
  handleUpdate=(e,record)=>{
    const form=this.props.form;
    form.setFieldsValue({
      name:record.name,
      target:record.target,
      url:record.url,
      pid:record.pid,
      icon:record.icon
    })
    //保留原有的数据
    this.setState({
      visible:true,
      id:record.id,
      icon:record.icon,
    })
  }
  showDeleteConfirm=(e,record)=> {
    this.setState({
      id:record.id
    })
    var th =this
    confirm({
      title: '是否删除',
      content: '确定删除该菜单?',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk:()=> {
        this.handleDelete();
      },
      onCancel() {
        th.initState();
      },
    });
  }

  //新增按钮,
  handleAdd=()=>{ 
    const form=this.props.form;
    form.setFieldsValue({
			name:'',
			url:'',
			icon:'',
      pid:'0',
      target:'_self'
    })
    this.setState({visible:true}) 
  }
  //Modal 取消
  handleCancel=()=>{
    this.setState({
      visible:false,
    })
    this.initState();
  }
  //Modal 确认
  handleOk=()=>{
    const appId=this.props.appid;
    const form=this.props.form;
    let id=this.state.id;
    form.validateFields((err,values) =>{
      values.appId=appId;
      if(!id){
        addMenus(appId,values).then(data=>{
          message.success('新增应用菜单成功')
          getMenuTrees(appId).then(datas=>{
            let childArray=TreeHelp.toChildrenStruct(datas);
            this.setState({
              treeData:childArray,
              visible:false,
              options:datas,
            })
            this.initState();
          })
        })
      }else{
        values.id=id;
        updateMenus(appId,id,values).then(data=>{
          message.success('修改菜单成功')
          getMenuTrees(appId).then(datas=>{
            let childArray=TreeHelp.toChildrenStruct(datas);
            this.setState({
              treeData:childArray,
              visible:false,
              options:datas,
            })
            this.initState();
          })
        })
      }
      
    })
  }

  selectIcon=(icon)=>{
    const form = this.props.form;
    form.setFieldsValue({
      icon:icon
    })
    this.setState({
      icon:icon,
    })
  }

  render(){
    const columns=[
      {
        title:'菜单名称',
        dataIndex:'name',
        key:'name',
        width:'55%'
      },
      {
        title:'访问路径',
        dataIndex:'url',
        key:'url',
        width:'20%'
      },
      {
        title:'打开方式',
        dataIndex:'target',
        key:'target',
        width:'10%',
        render:(text,record)=>{
          if(record.target==='_self'){
            return '本窗口'
          }
          if(record.target==='_blank'){
            return '新窗口'
          }
          if(record.target==='iframe'){
            return 'iframe嵌入'
          }
      } 
      },
      {
        title:'操作',
        width:'15%',
        render:(text,record)=>{
          return (
            <Fragment>
            <a onClick={e=>this.handleUpdate(e,record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={e=>this.showDeleteConfirm(e,record)}>删除</a>
            </Fragment>
          )
        }
      }
    ]
    const { getFieldDecorator} = this.props.form;
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
    return(
      <div>
        <Button type="primary" style={{marginBottom:16}} onClick={this.handleAdd}>新增</Button>
        <Table
          dataSource={this.state.treeData}
          columns={columns}
        >
        </Table>
        <Modal
          title='新增应用菜单'
          onCancel={this.handleCancel}
          cancelText='取消'
          okText='保存'
          onOk={this.handleOk}
          visible={this.state.visible}
          >
            <Form >
              <FormItem {...formItemLayout} label="父级菜单">
                  {getFieldDecorator('pid')(
                      <Select>
                      {this.state.options.map(item=>
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )}
                      <Option key='0' value='0'>应用菜单</Option>
                      </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="菜单名称"
              >
                  {getFieldDecorator('name')(
                      <Input  />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="访问路径"
              >
                  {getFieldDecorator('url')(
                      <Input  />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="打开方式"
              >
                  {getFieldDecorator('target')(
                      <Select>
                          <Option value="_self">本窗口</Option>
                          <Option value="_blank">新窗口</Option>
                          <Option value="iframe">iframe嵌入</Option>
                      </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="图标"
              >
                  {getFieldDecorator('icon')(
                <Input addonAfter={<IconSelectModal renderButton={<Icon type={this.state.icon ? this.state.icon:'setting'}/>} selectIcon={(icon) => this.selectIcon(icon)}/>} />  
                  )}
              </FormItem>
            </Form>
          </Modal>
      </div>
    )
  }
}
const MenusTableList=Form.create()(MenusTableListForm);
export default  MenusTableList;