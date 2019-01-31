import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Form, Modal, message, Button, Card } from 'antd'
import RoleUser from '../../../components/BasicData/Functional/RoleUser'
import AuthorizedUserUnion from '../../../components/BasicData/Functional/AuthorizedUserUnion'
//import OperationRecord from '../../../components/BasicData/Functional/OperationRecord'
import Functions from '../../../components/BasicData/Functional/Functions'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import {getRoles, updateRole,deleteRole, getAppInfo } from '../../../services/aip'
import constants from '../../../services/constants'
import InputInline from '../../../common/Input'
import { base } from '../../../services/base';
import Authorized from '../../../common/Authorized';

const { Description } = DescriptionList;
const confirm = Modal.confirm;
class FunctionalDetail extends React.Component {
  state = {
    data: {},
    appName: '',
    code: '',
    desc: '',
    name: '',
    visibleModal: false,
    userCollections: [],
  }

  componentDidMount() {
    if(this.props.permissions)base.allpermissions = this.props.permissions;
    this.loadRoles();
    getAppInfo(this.props.match.params.appid).then(data => {
      this.setState({ appName: data.name })
    })
  }

  loadRoles = () => {
    getRoles(this.props.match.params.appid, { roleId: this.props.match.params.id }).then(data => {
      if (data && data.length) {
        this.setState({
          code: data[0].code,
          name: data[0].name,
          desc: data[0].desc,
          visibleModal: false
        })
      }
    });
  }
  onClickEdit = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      name: this.state.name,
      desc: this.state.desc
    });
    this.setState({ visibleModal: true });
  }

  handleDescChange = (value, type) => {
    let params = {};
    params[type] = value;
    if (type === 'name' && this.state.name !== value) {
      return new Promise((resolve, reject) => {
        getRoles(this.props.match.params.appid, params).then(data => {
          if (data.length > 0) {
            message.error('角色名称已存在');
          } else {
            updateRole(this.props.match.params.appid, this.props.match.params.id, params).then(data => {
              message.success('修改角色信息成功');
              this.loadRoles();
              resolve();
            })
          }
        })

      })
    } else {
      updateRole(this.props.match.params.appid, this.props.match.params.id, params).then(data => {
        message.success('修改角色信息成功');
        this.loadRoles();
      })
    }
  }

  showDeleteConfirm = () => {
    if(this.state.code==='admin' || this.state.code==='roleManager' || this.state.code==='manager' || this.state.code === 'amp_admin' || this.state.code === 'amp_roleManager'){
      message.warn('管理员角色不能删除')
    }else{
      let that = this;
      confirm({
        title: '删除角色?',
        content: '删除角色会将角色关联的所有资源删除',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteRole(that.props.match.params.appid, that.props.match.params.id).then(data => {
            message.success('删除角色成功！');
            window.history.back()
          })
          
        },
        onCancel() {
  
        },
      });
    }
  }
  render() {

    const { name, code, desc, appName } = this.state;
    // const { getFieldDecorator } = this.props.form;
    // const formItemLayout1 = {
    //   labelCol: {
    //     sm: { span: 5 },
    //   },
    //   wrapperCol: {
    //     sm: { span: 18 },
      // },
    // };

    const description = (
      <div>
        <DescriptionList size="small" col="2">
          <Description term="所属应用">
            {appName}
          </Description>
          <Description term="编码">
            {code}
          </Description>
          <Authorized noMatch={<Description><InputInline title='描述' value={desc || '/'} editing={false} dataType={'TextArea'} mode={'inline'} /></Description>}>
            <Description>
              <InputInline title='描述' value={desc || '/'} onChange={(value) => this.handleDescChange(value, 'desc')} dataType={'TextArea'} mode={'inline'} width={600} />
            </Description>
          </Authorized>
        </DescriptionList>
        
      </div>
    )

    const action = (
      <div>
        <Authorized authority="app_deleteRole" noMatch={null}> 
          <Button onClick={this.showDeleteConfirm} type='danger'>删除</Button>
        </Authorized>
        
      </div>
    );

    const title = this.state.name==='平台管理员' || this.state.name==='功能管理员' || this.state.name==='角色管理员'?this.state.name:<InputInline title={'角色名称 '} value={name} onCommit={(value) => this.handleDescChange(value, 'name')} dataType={'Input'} mode={'inline'} />

    // const breadcrumbList = [{title:'应用列表',href:'#/applications'},{title:appName},{title:'角色详情'}];
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={title}
          logo={<img alt="" src={constants.PIC.service} />}
          content={description}
          action={action}
        />

        <Card bordered={false} style={{ margin: '24px 24px 0' }} title='授权功能'>
          <Functions showUnionButton={true}
            appId={this.props.match.params.appid}
            roleId={this.props.match.params.id}
            history={this.props.history} />
        </Card>

        <Card bordered={false} style={{ margin: '24px 24px 0' }} title='授权的管理员  '>
          <AuthorizedUserUnion appId={this.props.match.params.appid} roleId={this.props.match.params.id} type='manager' showSearchButon={true} />
        </Card>

        <Card bordered={false} style={{ margin: '24px 24px 0' }} title='授权的用户集合'>
          <AuthorizedUserUnion userCollections={(selectedKeys) => { this.setState({ userCollections: selectedKeys }) }} showSearchButon={true} appId={this.props.match.params.appid} roleId={this.props.match.params.id} />
        </Card>

        <Card bordered={false} style={{ margin: '24px 24px 0' }} title='授权的用户  '>
          <RoleUser userCollections={this.state.userCollections} appId={this.props.match.params.appid} id={this.props.match.params.id} />
        </Card>

        {/* <Card bordered={false} style={{ margin: '24px 24px 0' }} title='操作记录  '>
          <OperationRecord />
        </Card> */}
        
      </div>
    )
  }
}

export default Form.create()(FunctionalDetail);