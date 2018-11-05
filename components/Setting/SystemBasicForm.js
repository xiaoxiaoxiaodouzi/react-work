import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Modal } from 'antd'
import UserSelectModal from '../../common/UserSelectModal/index'
import constants from '../../services/constants'
class SystemBasic extends Component {
  static propTypes = {
    prop: PropTypes.object
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
        callback('请输入部署地址')
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

  CheckBoxChange = (e) => {
    this.props.CheckBoxChange(e.target.checked ? 1 : 0)
  }

  _handleOk = (e) => {
    e.preventDefault();
    let form = this.props.form;
    let initialize = this.props.initialize
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      if (values) {
        values.initialize = initialize;
        this.props._handleOk(values);
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
    return (
      <div>
        <Modal
          title='修改平台设置'
          visible={this.props.visibleSet}
          onOk={this._handleOk}
          onCancel={this.props._handleCancle}
          destroyOnClose
        >
          <Form>
            <Form.Item {...formItemLayout} label="部署内网地址">
              {getFieldDecorator('paasManageUrl', {
                initialValue: this.props.paasManageUrl,
                rules: [{
                  required: true,
                  validator: this.validateParams
                }],
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="性能监控地址">
              {getFieldDecorator('APMServerUrl', {
                initialValue: this.props.APMServerUrl,
                rules: [{
                  validator: this.validateParams
                }],

              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="管理租户CODE">
              {getFieldDecorator('manageTenantCode', {
                initialValue: this.props.manageTenantCode
              })(<Input />)}
            </Form.Item>
            {this.props.isDone ? '' :
              <Form.Item {...formItemLayout} label="是否初始化完成">
                {getFieldDecorator('initialize')(<Checkbox checked={this.props.initialize === '1' ? true : false} onChange={this.CheckBoxChange} />)}
              </Form.Item>}
          </Form>
          <Form.Item {...formItemLayout} label="全局资源监控地址">
            {getFieldDecorator('globalResourceMonitUrl', {
              initialValue: this.props.globalResourceMonitUrl
            })(<Input />)}
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
        </Modal>
      </div>
    )
  }
}
const SystemBasicForm = Form.create()(SystemBasic);
export default SystemBasicForm;
