import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { getRoles,updateRole } from '../../../services/running'
import { getAppInfo } from '../../../services/appdetail'
import { Form,Input,Modal,message } from 'antd'
const { Description } = DescriptionList;

class RoleDetailBasic extends Component {
  static propTypes = {
    prop: PropTypes
  }
  state={
    code:'',
    name:'',
    appName:'',
    desc:'',
    visibleModal:false
  }
  componentDidMount(){
    this.loadRoles();
    getAppInfo(this.props.appId).then(data=>{
      this.setState({appName:data.name})
    })
  }
  loadRoles = ()=>{
    getRoles(this.props.appId,{roleId:this.props.id}).then(data=>{
      if(data && data.length){
        this.setState({
          code:data[0].code,
          name:data[0].name,
          desc:data[0].desc,
          visibleModal:false
        })
      }
    });
  }
  handleModalOk = ()=>{
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        updateRole(this.props.appId,this.props.id,values).then(data=>{
          message.success('修改角色信息成功');
          this.loadRoles();
        })
      }
    })
  }
  onClickEdit = ()=>{
    const { setFieldsValue }=this.props.form;
    setFieldsValue({
      name:this.state.name,
      desc:this.state.desc
    });
    this.setState({visibleModal:true});
  }

  render() {
    const { name,code,desc,appName,visibleModal } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout1 = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    const title=<span>基本信息<a style={{float:"right",fontSize:14}} onClick={this.onClickEdit}>编辑</a></span>
    return (
      <div>
        <DescriptionList size="large" title={title}>
          <Description term="编码">
            {code}
              </Description>
          <Description term="名称">
            {name}
              </Description>
          <Description term="所属应用">
            {appName}
              </Description>
          <Description term="描述">
            {desc}
          </Description>
        </DescriptionList>
        <Modal 
            title="修改角色信息"
            visible={visibleModal}
            onOk={this.handleModalOk} 
            onCancel={()=>this.setState({visibleModal:false})}>
          <Form>
            <Form.Item {...formItemLayout1} label="名称">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入名称!' },
              ],
            })(
              <Input/>
            )}
            </Form.Item>
            <Form.Item {...formItemLayout1} label="描述">
            {getFieldDecorator('desc')(
              <Input.TextArea rows={4}/>
            )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(RoleDetailBasic);