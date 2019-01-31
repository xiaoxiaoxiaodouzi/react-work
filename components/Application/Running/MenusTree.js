import React from 'react'
import {Row, Col,Divider,Button,Tree,Form,Input,Select,message,Modal} from 'antd'
import TreeHelp from './../../../utils/TreeHelp'
import {getMenus,addMenus,getMenuById,deleteMenuById,updateMenus} from '../../../services/aip'

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
class AppMenusForm extends React.PureComponent {
  state={
    visible:false,
    visibleConfirm:false, //删除菜单弹出框
    treeData:[],      //树 数据
    id:'',       //菜单节点ID
    pid:'',
    options:[]  ,     //父级菜单下拉框数据
    initOptions:[],     //页面加载的下拉框数据，用于应用新增时候使用
    url:'',         //访问路径
    name:'',        //菜单名称
    target:'',      //打开方式
  }
  componentDidMount(){
    const appid=this.props.appid;
    getMenus(appid).then(data=>{
      let childArray=TreeHelp.toChildrenStruct(data);
      this.setState({
        treeData:childArray,
        options:data,
        initOptions:data
      })
    })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.key} dataRef={item} />;
    });
  }
  //树形菜单选择
  onSelect= (id) => {
    const appid=this.props.appid;
    if(id[0]!=='0' && id[0]!=='sourceTree'){
      getMenuById(appid,id[0]).then(data=>{
        if(data){
          this.props.form.setFieldsValue({
              url:data.menu.url,
              name:data.menu.name,
              target:data.menu.target
          })
          this.setState({
            pid:data.menu.pid,
            options:data.options,
            id:id[0],
            url:data.menu.url,
            name:data.menu.name,
            target:data.menu.target
          })
        }  
      })
    }else{
      this.setState({
        options:[] ,
        url:'',
        name:'',
        target:'',
        id:''
      })
    }
  }

  renderForm=()=>{
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
      },
   };
    return (
      <div>
          <div style={{height:32}}>
            <h2>菜单详情</h2>
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <div>
            <Form >
              <FormItem {...formItemLayout} label="父级菜单">
                  {getFieldDecorator('pid',{initialValue:this.state.pid})(
                      <Select>
                      {this.state.options.map(item=>
                        <Option value={item.id}>{item.name}</Option>
                      )}
                      </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="菜单名称"
              >
                  {getFieldDecorator('name',{initialValue:this.state.name})(
                      <Input  />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="访问路径"
              >
                  {getFieldDecorator('url',{initialValue:this.state.url})(
                      <Input  />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="打开方式"
              >
                  {getFieldDecorator('target',{initialValue:this.state.target})(
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
                      <Input></Input>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} style={{marginLeft:200}}>
                  <Button type='primary' onClick={this.handleUpdate}>修改</Button>
               </FormItem>
            </Form>
          </div>
      </div>
    )
  }
  //删除确认框
  handleConfirm=()=>{
    let id=this.state.id
    if(id){
      if(id!=='0' || id!=='sourceTree'){
        this.setState({
          visibleConfirm:true
        })
      }
    }else{
      message.error('请重新选择需要删除的菜单')
    }
  }

  handleOk=()=>{
    this.handleDelete()
  }
  handleCancel=()=>{
    this.setState({
      id:'',
      visibleConfirm:false
    })
  }
  handleDelete= ()=> {
    const appid=this.props.appid
    let id=this.state.id
    deleteMenuById(appid,id).then(data=>{
      message.success('删除成功')
      getMenus(appid).then(data=>{
        let childArray=TreeHelp.toChildrenStruct(data);
        this.setState({
          visibleConfirm:false,
          id:'',
          treeData:childArray,
          options:[],     
          url:'',         
          name:'',        
          target:''
        })
      })
    })
  }

  handleUpdate= ()=> {
    const appId=this.props.appid;
    //获取当前菜单id
    let id=this.state.id;
    this.props.form.validateFields((err, values) =>{
      values.appId=appId;
      values.id=id;
      updateMenus(appId,id,values).then(data=>{
        message.success('修改菜单成功')
        getMenus(appId).then(datas=>{
          let childArray=TreeHelp.toChildrenStruct(datas);
          this.setState({
            treeData:childArray,
            options:datas.options,
            id:datas.id,
            url:datas.menu.url,
            name:datas.menu.name,
            target:datas.menu.target
          })
        })
      })
    })
  }
  handleAdd= ()=> {
    this.setState({
      visible:true
    })
  }

  onOk= ()=> {
    const appId=this.props.appid;
    const form=this.props.form
    form.validateFields((err,values) =>{
      if(values.name1){
        //重新拼装成接口需要的bodyParams
        let bodyParams={
          appId:appId,
          pid:values.pid1,
          url:values.url1,
          name:values.name1,
          icon:values.icon1,
          target:values.target1
        }
        addMenus(appId,bodyParams).then(data=>{
          message.success('新增应用菜单成功')
          getMenus(appId).then(datas=>{
            let childArray=TreeHelp.toChildrenStruct(datas);
            this.setState({
              id:'',
              treeData:childArray,
              visible:false,
              options:datas,
              initOptions:datas
            })
          })
        })
      }
    })
  }
  onCancel=()=>{
    this.setState({
      visible:false
    })
  }
  render(){
    const { getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
      },
   };
    return (
      <div>
            <Row>
              <Col span={10}>
                <div>
                    <div style={{textAlign:'center'}}>
                        <Button type="primary" onClick={this.handleAdd}>新增</Button>
                        <Button type="danger" style={{marginLeft:20}} onClick={this.handleConfirm}>删除</Button>
                    </div>
                    <Divider style={{ marginBottom: 32 }} />
                    <div style={{marginLeft:160}}>
                      <Tree
                        showLine
                        onSelect={this.onSelect}
                        defaultExpandedKeys={['0']}
                      >
                        <TreeNode title='资源树' key='sourceTree'>
                          <TreeNode title='菜单' key='0'>
                            {this.renderTreeNodes(this.state.treeData)}
                          </TreeNode>
                        </TreeNode>
                      </Tree>
                    </div>
                </div>
              </Col>
              <Col span={10} offset={2}>
                {this.state.id?this.renderForm()
                  :
                  <div style={{paddingTop:68,textAlign:'center'}}>
                      <h2 >未选中内容</h2>
                      <p>请在左侧选择要查看的菜单、表单、表单元素或者其它分类的具体资源。</p>
                  </div>
                }
              </Col>
            </Row>
          <Modal
          title='新增应用菜单'
          onCancel={this.onCancel}
          cancelText='取消'
          okText='保存'
          onOk={this.onOk}
          visible={this.state.visible}
          >
            <Form >
              <FormItem {...formItemLayout} label="父级菜单">
                  {getFieldDecorator('pid1',{initialValue:'0'})(
                      <Select>
                      {this.state.initOptions.map(item=>
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )}
                      <Option key='0' value='0'>应用菜单</Option>
                      </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="菜单名称"
              >
                  {getFieldDecorator('name1')(
                      <Input  />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="访问路径"
              >
                  {getFieldDecorator('url1')(
                      <Input  />
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="打开方式"
              >
                  {getFieldDecorator('target1',{initialValue:'_self'})(
                      <Select>
                          <Option value="_self">本窗口</Option>
                          <Option value="_blank">新窗口</Option>
                          <Option value="iframe">iframe嵌入</Option>
                      </Select>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="图标"
              >
                  {getFieldDecorator('icon1')(
                      <Input></Input>
                  )}
              </FormItem>
            </Form>
          </Modal>
          <Modal
          title='是否删除菜单'
          visible={this.state.visibleConfirm}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          >
          <p>确定删除 {this.state.name}菜单吗？</p>
          </Modal>
      </div>
    )
  }
}
const MenusTree=Form.create()(AppMenusForm)
export default MenusTree;