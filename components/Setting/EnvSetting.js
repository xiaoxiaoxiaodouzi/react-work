import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Form, Select, Checkbox, Input, message, Popconfirm, InputNumber, Switch, Modal } from 'antd';
import { addEnv, deleteEnv, updateEnv, queryTenantByEnv, updateEnvTenant, queryAllEnvs } from '../../services/setting';
import { getTenant } from "../../services/tenants";
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { base } from '../../services/base';
import RenderAuthorized from 'ant-design-pro/lib/Authorized';
import AddEnvSetting from './AddEnvSetting'

const { Description } = DescriptionList;
const { Option } = Select;

const urlReg = /(http|https):\/\/[\w\-_]+(.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])$/;
const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
//const innerUrlReg=
class EnvSetting extends PureComponent {
  state = {
    data: [],
    submitting: false,
    tenantVisible: false,
    visible: false,
    key: '',       //当前编辑的key
    addVisible: false    // 新增环境模态框visible
  };
  loadData = () => {
    let tenants = [];
    //base.getUserTenants(base.currentUser.id).then(datas => {
    console.log(base.configs)
    if (base.configs.initialize === '1') {
      this.setState({
        tenantVisible: true
      })
      getTenant().then(datas => {
        datas.forEach(t => {
          if (t.tenant_type && t.tenant_type.indexOf('PAAS') !== -1 && t.tenant_code) {
            //tenants.push({ name: t.name, code: t.tenant_code, id: t.id });
            t.label = t.name;
            t.value = t.tenant_code;

            tenants.push(t);
          }

        });
        this.queryAllEnvs(tenants);
        this.setState({ tenants: tenants });
      })
    } else {
      this.queryAllEnvs(tenants);
      this.setState({ tenants: tenants });
    }

  }


  componentDidMount() {
    this.loadData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.path && nextProps.path !== this.props.path) {
      this.loadData();
    }
  }

  queryAllEnvs = (tenants) => {
    queryAllEnvs().then((data) => {
      let queryTenents = [];
      data.forEach(element => {
        element.key = element.id;
        if (base.configs.initialize === '1') {
          queryTenents.push(queryTenantByEnv(element.id));
        }

      });

      if (queryTenents && queryTenents.length > 0) {
        Promise.all(queryTenents).then(responses => {
          responses.forEach((e, i) => {
            //data[i].tenants = e;
            //根据租户code查租户？
            let names = [];
            let choiceValues = [];
            if (tenants && tenants.length > 0) {
              e.forEach(sub => {
                tenants.forEach(tt => {
                  if (sub === tt.tenant_code) {
                    names.push(tt.name);
                    choiceValues.push(sub);
                  }
                })
              });
            }

            data[i].tenants = names;
            data[i].tenant = choiceValues;
          })
          this.setState({ data });
        });
      } else {
        this.setState({ data });
      }

    });
  }


  addEnv = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    this.setState({ visible: true, key: newData.length })
    /* const newData = this.state.data.map(item => ({ ...item }));
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      key: newData.length,
      name: '',
      apiGatewaySchema: 'https',
      apiGatewayHost: '',
      apiGatewayPort: 8080,
      apiGatewayManagePort: 8081,
      authServerAddress: '',
      authServerInnerAddress: '',
      subDomain: '',
    })
    this.setState({ visible: true, key: newData.length }) */
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  onEdit = (key) => {
    const { setFieldsValue } = this.props.form;
    let newData = this.state.data.slice();
    if (newData.filter(item => (item.isEdit || item.isNew) === true).length > 0) {
      message.error('存在未保存环境，请先保存再编辑');
      return;
    }
    newData.forEach((element, index, arr) => {
      if (element.key === key) {
        arr[index].isEdit = true;
        this.setState({ data: arr, visible: true, key }, () => {
          setFieldsValue({
            ...element
          });
        });
      }
    });
    //this.setState({data:newData});
  }
  onDelete = (key) => {
    const newData = this.state.data.filter(item => item.key !== key);
    deleteEnv(key).then(() => {
      message.success('删除指定环境成功');
      this.setState({ data: newData });
      let currentEnviroments = [];
      base.environments.forEach(env => {
        if (env.id !== key) {
          currentEnviroments.push(env);
        }
      });
      base.environments = currentEnviroments;
    })
  }
  //校验数据
  validateParams = (rule, value, callback) => {
    if (rule.field === 'apiGatewayHost' && !ipReg.test(value)) {
      callback('请输入正确的ip地址，格式：xxx.xxx.xxx.xxx');
      return;
    } else if (rule.field === 'authServerAddress' && !urlReg.test(value)) {
      callback('请输入正确的授权服务器地址');
      return;
    } else if (rule.field === 'authServerInnerAddress' && !urlReg.test(value)) {
      callback('请输入正确的授权服务器内网地址');
      return;
    } else if (rule.field === 'serviceMonitorAddress' && !urlReg.test(value)) {
      callback('请输入正确的服务监控地址');
      return;
    }
    callback();
  }

  onSubmit = () => {
    let key = this.state.key
    let newData = this.state.data.slice();
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        if (key === newData.length) {
          addEnv(values).then(newElement => {
            message.success('添加环境成功');
            this.setState({ visible: false, key: '' });
            this.queryAllEnvs();
            //环境下的租户
            if (values.tenant) {
              if (base.configs.initialize === "1") {
                this.updateEnvTenant(newElement, values.tenant, newData);
              }
            }
          })
        } else {
          newData.forEach(element => {
            if (element.key === key) {
              element.isEdit = false;
              Object.assign(element, values);
              updateEnv(key, element).then(() => {
                message.success('修改环境成功');
                this.setState({ data: newData, key: '', visible: false });
                //修改环境下的租户
                if (base.configs.initialize === "1") {
                  this.updateEnvTenant(element, values.tenant, newData);
                }
              });
            }
          });
        }
      }
    });
  }

  updateEnvTenant = (element, newtenants, newData) => {
    let id = element.id;
    updateEnvTenant(id, newtenants).then(data => {
      if (data && data.length>0) {
        let tenantsName = [];
        let choice = [];
        let tenants = [...this.state.tenants];
        let flag = false;
        data.forEach(dt => {
          tenants.forEach(tt => {
            if (dt === tt.tenant_code) {
              tenantsName.push(tt.name);
              choice.push(dt);
            }
          })
          //返回的租户包含了当前租户
          if (dt === base.tenant) {
            flag = true;
          }
        });
        let currentEnviroments = [];
        base.environments.forEach(ce => {
          if (flag) {
            //返回的租户不包含当前租户，当前租户不能使用该环境
            if (id !== ce.id) {
              currentEnviroments.push(ce);
            }
          } 
        });
        // this.props.environmentsChange(currentEnviroments);
        if (flag) {
          currentEnviroments.push(element);
        }
        base.environments = currentEnviroments;
        let enviroments = [];
        newData.forEach(nd => {
          if (nd.id === id) {
            nd.tenants = tenantsName;
            nd.tenant = choice;
          }
          enviroments.push(nd);
        })
        // newData.tenants = tenantsName;
        this.setState({ data: enviroments });
      } else {
        let enviroments = [];
        newData.forEach(nd => {
          if (nd.id === id) {
            nd.tenants = [];
          }
          enviroments.push(nd);
        })
        this.setState({ data: enviroments });
        let currentEnviroments = [];
        base.environments.forEach(ce => {
          if (id !== ce.id) {
            currentEnviroments.push(ce);
          }
        });
        base.environments = currentEnviroments;
      }
    })
  }

  onCancel = () => {
    let key = this.state.key
    let newData = this.state.data.slice();
    newData.forEach((element, index, arr) => {
      if (element.key === key) {
        element.isEdit = false;
        if (element.isNew) {
          arr.splice(index, 1);
        }
      }
    });
    this.setState({ data: newData, key: '', visible: false });
  }

  //添加新环境确认返回参数
  addNewEnv = (values) => {
    this.setState({ addVisible: false })
  }

  //服务监控状态改变事件
  serviceMonitorSwitch = (checked) => {
    let serviceMonitorAddress = this.props.form.getFieldValue('serviceMonitorAddress');
    if (!checked) {//未开启时服务监控地址不需填写
      this.props.form.setFields({
        serviceMonitorAddress: { value: serviceMonitorAddress, errors: null }
      });
    } else {
      if (!urlReg.test(this.props.form.getFieldValue('serviceMonitorAddress'))) {
        this.props.form.setFields({
          'serviceMonitorAddress': { value: serviceMonitorAddress, errors: [new Error('请输入正确的服务监控地址')] }
        });
      } else {
        this.props.form.setFields({
          serviceMonitorAddress: { value: serviceMonitorAddress, errors: null }
        });
      }
    }
  }

  render() {
    const Authorized = RenderAuthorized(base.allpermissions);
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
      <Card
        bordered={false}
        title='环境配置'
        style={{ margin: '24px 0' }}
        bodyStyle={{ padding: 0 }} >
        {
          this.state.data.map((element, index) => {
            return (
              <Card
                key={index}
                type="inner"
                style={{ margin: 16 }}
                title={element.isMain ? element.name + ' (主环境)' : element.name}
                extra={!element.isEdit ?
                  <Fragment>
                    <Authorized authority={'systemset_editEnviromentConfig'} noMatch={<a disabled='true' onClick={() => this.onEdit(element.key)}>编辑    </a>}>
                      <a onClick={() => this.onEdit(element.key)}>编辑</a>&nbsp;&nbsp;
                    </Authorized>
                    {element.isMain ? '' :
                      <Authorized authority={'systemset_deleteEnviromentConfig'} noMatch={<a disabled='true'>删除</a>}>
                        <Popconfirm title="是否要删除此行？" onConfirm={() => this.onDelete(element.key)}>
                          <a>删除</a>
                        </Popconfirm>
                      </Authorized>}
                  </Fragment>
                  : ''} >
                <DescriptionList size="small">
                  <Description term="编码">{element.code}</Description>
                  <Description term="网关协议">{element.apiGatewaySchema}</Description>
                  <Description term="网关地址">{element.apiGatewayHost}</Description>
                  <Description term="网关端口">{element.apiGatewayPort}</Description>
                  <Description term="网关管理端口">{element.apiGatewayManagePort}</Description>
                  <Description term="子域名">{element.subDomain}</Description>
                  <Description term="授权服务器地址">{element.authServerAddress}</Description>
                  <Description term="授权服务器内网地址">{element.authServerInnerAddress}</Description>
                  <Description term="注册中心地址">{element.eurekaServerUrls}</Description>
                  <Description term="服务监控地址">{element.serviceMonitorAddress || '--'}</Description>
                  <Description term="服务监控状态">{element.serviceMonitorSwitch ? '开启' : '关闭'}</Description>
                  {this.state.tenantVisible ?
                    <Description term="租户">{(element.tenants && element.tenants.length > 0) ? element.tenants.toString() : "--"}</Description>
                    : ""
                  }
                </DescriptionList>
              </Card>
            )
          })
        }
        <div style={{ padding: '0 16px 0 16px' }}>
          <Authorized authority={'systemset_addEnviromentConfig'} noMatch={<Button disabled='true' style={{ width: '100%', marginBottom: 24 }} type="dashed" onClick={this.newRecord} icon="plus" >添加环境</Button>}>
            <Button
              style={{ width: '100%', marginBottom: 24 }}
              type="dashed"
              onClick={this.addEnv}
              icon="plus" >
              添加环境
          </Button>
          </Authorized>


          <Modal
            bodyStyle={{ overflow: 'auto', height: '400px' }}
            title={this.state.key ? '修改环境' : '新增环境'}
            visible={this.state.visible}
            onOk={this.onSubmit}
            onCancel={this.onCancel}
            destroyOnClose
          >
            <Form hideRequiredMark>
              <Form.Item {...formItemLayout} label="环境名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入环境名称' }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="编码">
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入编码' }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="网关协议">
                {getFieldDecorator('apiGatewaySchema', {
                  rules: [{ required: true, message: '请选择网关协议' }],
                })(
                  <Select placeholder="请选择">
                    <Option value="http">http</Option>
                    <Option value="https">https</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="网关地址"
              >
                {getFieldDecorator('apiGatewayHost', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ validator: this.validateParams }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="网关端口">
                {getFieldDecorator('apiGatewayPort', {
                  rules: [{ required: true, message: '请输入网关端口' }],
                })(
                  <InputNumber style={{ width: '100%' }} min={1} max={65535} placeholder="请输入网关端口:1~65535之间" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="网关管理端口">
                {getFieldDecorator('apiGatewayManagePort', {
                  rules: [{ required: true, message: '请输入网关管理端口' }],
                })(
                  <InputNumber style={{ width: '100%' }} min={1} max={65535} placeholder="请输入网关端口:1~65535之间" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="授权服务器地址"
              >
                {getFieldDecorator('authServerAddress', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ validator: this.validateParams }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="授权服务器内网地址"
              >
                {getFieldDecorator('authServerInnerAddress', {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ validator: this.validateParams }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="子域名">
                {getFieldDecorator('subDomain')(
                  <Input />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="服务监控状态">
                {getFieldDecorator('serviceMonitorSwitch', { valuePropName: 'checked' })(
                  <Switch onChange={this.serviceMonitorSwitch} />
                )}
              </Form.Item>
              {
                getFieldValue('serviceMonitorSwitch') ? (<Form.Item {...formItemLayout} label="服务监控地址"
                >
                  {getFieldDecorator('serviceMonitorAddress', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ validator: this.validateParams }],
                  })(
                    <Input />
                  )}
                </Form.Item>) : ''
              }
              <Form.Item {...formItemLayout} label="注册中心地址">
                {getFieldDecorator('eurekaServerUrls')(
                  <Input />
                )}
              </Form.Item>
              {this.state.visible && this.state.tenants && this.state.tenants.length ?
                <Form.Item {...formItemLayout} label="租户">
                  {getFieldDecorator('tenant', {
                    rules: [{ required: false, message: '请选择租户' }],
                  })(
                    <Checkbox.Group options={this.state.tenants} />

                  )}
                </Form.Item>
                : ""

              }
            </Form>
          </Modal>
          <AddEnvSetting title='新增环境' visible={this.state.addVisible} onChange={(flag) => { this.setState({ addVisible: flag }) }} addNewEnv={this.addNewEnv} />
        </div>

      </Card >
    );
  }
}
const AntDe = Form.create()(EnvSetting);
export default AntDe;