import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Switch ,Card,Button} from 'antd'
import UserSelectModal from '../../common/UserSelectModal/index'
import constants from '../../services/constants'
import { base } from '../../services/base';
class SystemBasic extends Component {
  static propTypes = {
    prop: PropTypes.object
  }
  state = {
    disabled: !base.configs.passEnabled,
    apmDisabled: !base.configs.APMEnabled,
    monitDisabled: !base.configs.monitEnabled,
  }
  //表单数据校验
  validateParams = (rule, value, callback) => {
    let regport = constants.reg.port;
    let reghost = constants.reg.host
    if (rule.field === 'paasManageUrl') {
      if (value) {
        if (!reghost.test(value)) {
          callback('请输入正确格式类似于 http://xxx.xx.xx.xx')
          return;
        }
      } else {
        callback('请输入部署 地址')
        return;
      }
    }
    if (rule.field === 'APMServerUrl') {
      if (value) {
        if (!regport.test(value)) {
          callback('请输入正确格式类似于 xxx.xx.xx.xx:xxxx')
          return;
        }
      }
    }
    callback()
  }

  _handleOk = (e) => {
    e.preventDefault();
    let form = this.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      if (values) {
        this.props._handleOk(values);
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 36 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 13 },
      },
    };
    return (
      <Card  style={{ margin: '24px 0' }}>
        <Form>
          <Form.Item {...formItemLayout} label="管理租户CODE">
            {getFieldDecorator('manageTenantCode', {
              initialValue: this.props.manageTenantCode
            })(<Input />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="是否启用性能监控">
            {getFieldDecorator('APMEnabled', {
              initialValue: this.props.APMEnabled
            })(<Switch defaultChecked={this.props.APMEnabled} onChange={(e) => { this.setState({ apmDisabled: !e }) }} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="性能监控地址">
            {getFieldDecorator('APMServerUrl', {
              initialValue: this.props.APMServerUrl,
              rules: [{
                validator: this.validateParams
              }],

            })(
              <Input disabled={this.state.apmDisabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="是否启用全局资源监控">
            {getFieldDecorator('monitEnabled', {
              initialValue: this.props.monitEnabled
            })(<Switch defaultChecked={this.props.monitEnabled} onChange={(e) => { this.setState({ monitDisabled: !e }) }} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="全局资源监控地址">
            {getFieldDecorator('globalResourceMonitUrl', {
              initialValue: this.props.globalResourceMonitUrl
            })(<Input disabled={this.state.monitDisabled} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="是否启用pass">
            {getFieldDecorator('passEnabled', {
              initialValue: this.props.passEnabled
            })(<Switch defaultChecked={this.props.passEnabled} onChange={(e) => { this.setState({ disabled: !e }) }} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="部署内网地址">
            {getFieldDecorator('paasManageUrl', {
              initialValue: this.props.paasManageUrl,
              rules: [{
                required: !this.state.disabled,
                validator: this.validateParams
              }],
            })(
              <Input disabled={this.state.disabled} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="错误消息提示框">
            {getFieldDecorator('errorMessage', {
              initialValue: this.props.errorMessage
            })(<Switch defaultChecked={this.props.errorMessage} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="消息铃铛">
            {getFieldDecorator('messageBell', {
              initialValue: this.props.messageBell
            })(<Switch defaultChecked={this.props.messageBell} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="系统管理员">
            <div>
              <UserSelectModal
                title={'设置管理员'}
                mark='系统管理员'
                description=''
                selectedUsers={this.props.managers}
                // disabledUsers={this.state.managers}
                dataIndex={{ dataIdIndex: 'id', dataNameIndex: 'name' }}
                onOk={(users) => { this.props._putUsersByGroup(users) }} />
            </div>
          </Form.Item>
          <Button type='primary' style={{float: 'right'}} disabled={this.props.Updatedisabled} onClick={this._handleOk}>确定</Button>
        </Form>
      </Card>
    )
  }
}
const SystemBasicForm = Form.create({
  onValuesChange:(props, changedValues, allValues)=>{
    if(changedValues){
      props.onValuesChange();
    }
  }
})(SystemBasic);
export default SystemBasicForm;
