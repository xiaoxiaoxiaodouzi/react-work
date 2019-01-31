import React, { PureComponent } from 'react';
import {Form, Icon, Input, Button} from 'antd';
import loginService from './services/login';
import {base} from './services/base';
import constants from './services/constants'

const FormItem = Form.Item;

class login extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        loginService.safeLogin(values.userName,values.password).then(()=>{
          base.safeMode = true;
          window.localStorage[constants.WINDOW_LOCAL_STORAGE.SAFEMODEL] = true;
          this.props.history.push('/');
        })
      }
    });
  }
  ssoLogin = ()=>{
    base.safeMode = false;
    window.localStorage.removeItem(constants.WINDOW_LOCAL_STORAGE.SAFEMODEL);
    this.props.history.push('/');
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{maxWidth:300,margin:'auto',paddingTop:200,textAlign:'center'}}>
      <h2>应用管理平台（安全模式）</h2>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" style={{width:'100%'}}>
            登 录
          </Button>
          <a onClick={this.ssoLogin}>返回到普通登录模式</a>
        </FormItem>
      </Form>
      </div>
    );
  } 
}

const LoginForm = Form.create()(login);

export default LoginForm;
