import React, { Component, Fragment } from 'react';
import { Form, Table, Select, Divider, Popconfirm, Button, Switch, message, InputNumber, Row, Col, Input, Icon } from 'antd'
import {getupstream,doUpstream} from '../../../services/amp'
import constants from '../../../services/constants'
import Authorized from '../../../common/Authorized';
import { queryRoutes } from '../../../services/cce';
import { updateApp } from '../../../services/aip'
import { base } from '../../../services/base';

const Option = Select.Option
class SettingClusterList extends Component {
  state = {
    data: [],
    port: '',
    ip: '',
    weight: '',
    isEditing: false,
    HttpCheckedValue: false,
    upstream: '',     //应用的upstream
    code: '',   //应用的code
    id: '',    //应用ID
    ips: [],       //集群ip数组
    name: '',    //
    record: {},      //当前行数据
    loading: false,
    edit:false
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.upstream !== nextProps.appUpstream ) {
      let upstream = nextProps.appUpstream;
      if (upstream) {
        this.setState({ upstream: upstream, loading: true });
        getupstream(upstream).then(data => {
          if (data) {
            this.setState({ data: data.targets });
          }
          this.setState({
            loading: false
          })
        }).catch(err=>{
          this.setState({
            loading: false
          })
        })
      }
    }
    if (nextProps.appDatas !== this.props.appDatas) {
      //非k8s部署的应用不需要查询集群配置
      if (nextProps.appDatas.deployMode === 'k8s' && base.configs.passEnabled) {
        queryRoutes(nextProps.appDatas.code).then(datas => {
          if (datas.lenth > 0) {
            let array = [];
            datas.forEach(item => {
              let ips = {
                ip: item.ip,
                port: item.port
              };
              array.push(ips);
            })
            this.setState({
              ips: array
            })
          }
        })
      }
      this.setState({
        HttpCheckedValue: nextProps.appDatas.schema === 'http' ? false : true,
        ctx: nextProps.appDatas.ctx,
        name: nextProps.appDatas.name,
      })
    }
  }

  loadDatas = () => {
    let upstream = this.state.upstream;
    if (upstream) {
      this.setState({ loading: true });
      getupstream(upstream).then(data => {
        if (data) {
          this.setState({
            data: data.targets
          })
        } else {
          this.setState({
            data: []
          })
        }
        this.setState({
          ip: '',
          port: '',
          weight: '',
          record: {},
          isEditing: false,
          loading: false
        })
      })
    }
  }

  newMember = () => {
    if (!this.state.isEditing) {
      const newData = this.state.data.map(item => ({ ...item }));
      newData.push({
        ip: '',
        port: '',
        weight: '10',
        editable: true,
        isNew: true,
      })
      this.setState({ data: newData, isEditing: true })
    } else {
      message.error('有数据未保存，请先保存数据再进行添加')
    }

  }

  handleIpChange = (e, record) => {
    let ips = this.state.ips;
    if (ips.length > 0) {
      ips.forEach(item => {
        if (item.ip === e) {
          record.port = parseInt(item.ip.split(':')[1], 10);
        }
      })
    }
    record.ip = e.split(':').length > 0 ? e.split(':')[0] : e;
    // this.setState({
    //   ip: e.split(':').length>0?e.split(':')[0]:e,
    // })
  }

  handleChecked = (checked) => {
    this.props.checked(checked);
    this.setState({
      HttpCheckedValue: checked
    })
  }


  //保存
  handleSave = (record) => {
    if (!record.ip) {
      message.error('集群IP不能为空')
      return;
    }
    if (!record.port) {
      message.error('集群port不能为空')
      return;
    }

    let reg = constants.reg.ip;
    if (!reg.test(record.ip)) {
      message.error('集群IP格式错误,请参考xxxx.x.x.x')
      return;
    }
    let name = this.state.name;
    let upstream = this.state.upstream;
    //获取集群所有的target,如果当前行有数据，则是证明编辑状态

    let targets = [];
    if (this.state.record) {
      this.state.data.forEach(item => {
        if ((item.id === record.id)) {
          item.ip = record.ip;
          item.port = record.port;
          item.weight = record.weight;
        }
        targets.push(item);
      });
    }

    let bodyParams = {
      code: upstream,
      name: name,
      targets: targets,
    }
    let queryParams = { appId: this.props.appDatas.appId }
    let a = this.state.data.filter(item => item.ip === record.ip && item.port === record.port);
    if (a.length > 1) {
      message.error('存在重复ip端口，请重新填写');
      return;
    }
    doUpstream(upstream, bodyParams, queryParams).then(data => {
      if (data) {
        message.success('操作成功')
        this.loadDatas();
      }
    })
  }

  //编辑
  handleEdit = (record) => {
    if (!this.state.isEditing) {
      this.setState({
        isEditing: true,
        ip: record.ip,
        port: record.port,
        weight: record.weight,
        record: record,
      })
      record.editable = true;
    } else {
      message.error('有数据未保存，请先保存数据再进行修改')
    }
  }

  handleDelete = (record) => {
    // eslint-disable-next-line
    let targets = this.state.data.filter(item => {
      if (!(item.ip === record.ip && item.port === record.port)) {
        return item;
      }
    })
    let name = this.state.name;
    let upstream = this.state.upstream;
    let queryParams = {
      code: upstream,
      name: name,
      targets: targets,
    }
    doUpstream(upstream, queryParams).then(data => {
      if (data) {
        message.success('操作成功')
        this.loadDatas();
      }
    })
  }

  handlePortChange = (value, record) => {
    record.port = value
    // this.setState({
    //   port: value,
    // })
  }
  handleWeightChange = (value, record) => {
    record.weight = value
    // this.setState({
    //   weight: value,
    // })
  }

  //应用上下文更改
  handleChange = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        updateApp(this.props.appDatas.id, { type: 2 }, { ctx: values.ctx }).then(data => {
          this.setState({ ctx: data.ctx,edit:false })
          message.success('修改应用上下文成功');
        })
      }else{
        return ;
      }
    });
    
  }
  render() {
    const { ips } = this.state;
    const Options = ips.map(item => {
      return <Option key={item.ip} value={item.ip}>{item.ip}</Option>
    });
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'IP',
        dataIndex: 'ip',
        width: '30%',
        render: (text, record) => {
          if (record.editable) {
            return <Select
              defaultValue={text}
              onChange={e => this.handleIpChange(e, record)}
              style={{ width: '60%', marginRight: 8 }}
              mode='combobox'
              filterOption={e => { return true }}
            >
              {Options}
            </Select>
          } else {
            return text;
          }
        }
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return <InputNumber defaultValue={text} onChange={e => this.handlePortChange(e, record)} />
          } else {
            return text;
          }
        }
      },
      {
        title: '权重',
        dataIndex: 'weight',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return <InputNumber defaultValue={text} onChange={e => this.handleWeightChange(e, record)} />
          } else {
            return text;
          }
        }
      },
      {
        title: '健康状态',
        dataIndex: 'stuts',
        width: '20%',
      },
      {
        title: '操作',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Fragment>
                <a onClick={e => this.handleSave(record)}>保存</a>
                <Divider type='vertical' />
                <a onClick={this.loadDatas}>取消</a>
              </Fragment>
            )
          } else {
            return (
              <Fragment>
                <Authorized authority={this.props.appDatas.appType === "middleware" ? 'middleware_editCluster' : 'app_editCluster'} noMatch={<a disabled="true" onClick={e => this.handleEdit(record)}>编辑</a>}>
                  <a onClick={e => this.handleEdit(record)}>编辑</a>
                </Authorized>
                <Divider type='vertical' />
                <Authorized authority={this.props.appDatas.appType === "middleware" ? 'middleware_deleteCluster' : 'app_deleteCluster'} noMatch={<a disabled="true">删除</a>}>
                  <Popconfirm title='确认删除?' onConfirm={e => this.handleDelete(record)}>
                    <a>删除</a>
                  </Popconfirm>
                </Authorized>
              </Fragment>
            )
          }
        }
      },
    ]

    const simpleColumns = [
      {
        title: 'IP',
        dataIndex: 'ip',
        width: '30%',
        render: (text, record) => {
          if (record.editable) {
            return <Select
              value={this.state.ip}
              onChange={e => this.handleIpChange(e, record)}
              style={{ width: '60%', marginRight: 8 }}
              mode='combobox'
              filterOption={e => { return true }}
            >
              {Options}
            </Select>
          } else {
            return text;
          }
        }
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return <InputNumber value={text} onChange={e => this.handlePortChange(e, record)} />
          } else {
            return text;
          }
        }
      },
      {
        title: '权重',
        dataIndex: 'weight',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return <InputNumber value={text} onChange={e => this.handleWeightChange(e, record)} />
          } else {
            return text;
          }
        }
      },
      {
        title: '健康状态',
        dataIndex: 'stuts',
        width: '30%',
      }]
    return (
      <div>
        <div style={{ marginBottom: 12 ,height:50}}>
          <Row>
            <Col span={4}>
              <span>支持https</span>
              <Authorized authority={this.props.appDatas.appType === "middleware" ? 'middleware_https' : 'app_supportHttps'} noMatch={<Switch disabled='true' style={{ marginLeft: 24 }} checked={this.state.HttpCheckedValue} onChange={this.handleChecked} />}>
                <Switch style={{ marginLeft: 24 }} checkedChildren="开" unCheckedChildren="关" checked={this.state.HttpCheckedValue} onChange={this.handleChecked} />
              </Authorized>
            </Col>
            {/* <Col span={12}>
            
                {this.state.edit?
                <span><Form layout="inline">
                  <Form.Item label="应用上下文">
                    {getFieldDecorator('ctx', 
                    {
                      initialValue:this.state.ctx,
                        rules: [{
                          validator: (rule, value, callback)=>{
                            if(value){
                              if("/" !== value.substring(0,1)){
                                callback('格式错误，可以为空或者以‘/’开头');
                              }else{
                                callback()
                              }
                              
                              return;
                            }else{
                              callback()
                            }
                           }
                        }],
                      })(
                      <Input style={{width:200}} value={this.state.ctx ? this.state.ctx : '/'} /> 
                    )}
                  </Form.Item>
                    <Button style={{marginLeft:3}} type='primary' onClick={this.handleChange}>确定</Button>
                    <Button style={{marginLeft:3}} onClick={()=>{this.setState({edit:false})}} >取消</Button>
                </Form>
                </span>:
               <span className='hover-editor'>应用上下文:<span style={{marginLeft:5}}>{this.state.ctx ? this.state.ctx : '/'}</span><Icon style={{marginLeft:10}} type='edit' onClick={()=>{this.setState({edit:true})}}/></span>
              }
            </Col> */}
          </Row>
        </div>
        <Table
          dataSource={this.state.data}
          columns={this.props.springCloud ? simpleColumns : columns}
          rowKey={record => record.id}
          pagination={false}
          loading={this.state.loading}
        />
        {this.props.springCloud ? '' :
          <Authorized authority={this.props.appType === "middleware" ? 'middleware_addCluster' : 'app_addCluster'} noMatch={<Button disabled="true" style={{ width: '100%', marginTop: 16, marginBottom: 8 }} type="dashed" onClick={this.newMember} icon="plus">新增</Button>}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.newMember}
              icon="plus"
            >
              新增
            </Button>
          </Authorized>
        }
      </div>
    )
  }
}

export default Form.create()(SettingClusterList);