import React, { PureComponent } from 'react';
import { Button, Table, Alert, Popconfirm, Divider, Input, message, Select, Badge, Modal, Row, Col, Tooltip } from 'antd';
import { appStart, queryEnvs, batchAddEnvs, editEnvs, resetEnv } from '../../../services/cce';
import { addAppEnvs, deleteAppEnvs } from '../../../services/cce';
import Authorized from '../../../common/Authorized';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { base } from '../../../services/base';
const Option = Select.Option;
const { TextArea } = Input;
const envRegexp = /^[A-Za-z_]([A-Z0-9a-z_])*$/;
const sourceList = ['自定义', '系统注入', '中间件']; //环境变量来源 0:自定义,1:系统注入,2:中间件
const statusList = {
  default: '新建',
  processing: '已修改',
  error: '已删除',
  success: '已生效',
}
const statusMap = {
  add: 'default',
  update: 'processing',
  effect: 'success',
  delete: 'error'
}

/* 部署页面环境变量,props(operationkey,afterenvconf)
 * operationkey str 容器
 * afterenvconf func 保存或删除操作回调
 */
export default class EnvVariables extends PureComponent {
  index = 0;
  cacheOriginData = {};
  state = {
    showWarning: false,
    loading: false,
    appCode: this.props.appCode,
    operationkey: this.props.operationkey,
    data: [],
    visibleModal: false,
    textEnvs: '',
  };

  componentDidMount() {
    const { operationkey, appCode, isAddApp } = this.props;
    if (!isAddApp) {
      this.loadData(appCode, operationkey);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { appCode, operationkey, isAddApp, envData, base } = nextProps;
    if (isAddApp && envData !== this.props.envData) {
      this.setState({ data: envData });
    }
    if (!isAddApp && this.props.base !== base) {
      this.setState({ appCode, operationkey });
      this.loadData(appCode, operationkey);
    }
  }
  //获取所有env
  loadData = (appCode, operationkey) => {
    let showWarning = false;
    this.setState({ loading: true });
    queryEnvs(appCode, operationkey).then(envs => {
      envs.forEach((element) => {
        if (element.operateWay !== 'effect') {
          showWarning = true;
        }
        element.name = element.key;
        element.key = element.id;
      });
      this.setState({ data: envs, showWarning, loading: false });
      //环境变量修改，传递状态给父组件来判断是否部署上面加红点
      this.props.envChange(this.isChange(envs));
    }).catch(() => {
      this.setState({ data: [], loading: false });
    });
  }
  //添加env  
  addData = (target) => {
    const { appCode, operationkey } = this.state;
    let params = {
      key: target.name,
      value: target.value,
      desc: target.desc,
      source: target.source
    };
    this.setState({ loading: true });
    addAppEnvs(appCode, operationkey, params).then(() => {
      //this.setState({showWarning:true});
      this.loadData(appCode, operationkey);
      message.success("环境变量添加成功");
    }).catch((e) => {
      this.loadData(appCode, operationkey);
      base.ampMessage("环境变量添加失败" );
    });
  }
  //批量添加env 
  batchAddData = (envs) => {
    const { appCode, operationkey } = this.state;
    this.setState({ loading: true });
    batchAddEnvs(appCode, operationkey, envs).then(() => {
      this.loadData(appCode, operationkey);
      message.success("环境变量导入成功");
      this.setState({ visibleModal: false });
    }).catch((e) => {
      this.loadData(appCode, operationkey);
      base.ampMessage("环境变量导入失败" );
    });
  }
  //删除env
  deleteData = (key) => {
    const { appCode, operationkey } = this.state;
    this.setState({ loading: true });
    deleteAppEnvs(appCode, operationkey, key).then(() => {
      this.loadData(appCode, operationkey);
      message.success("环境变量删除成功");
    }).catch((e) => {
      this.loadData(appCode, operationkey);
      base.ampMessage("环境变量删除失败" );
    });
  }
  //修改env 
  editData = (target, key) => {
    const { appCode, operationkey } = this.state;
    let params = {
      key: target.name,
      value: target.value,
      desc: target.desc,
      source: target.source
    };
    this.setState({ loading: true });
    editEnvs(appCode, operationkey, params, key).then(() => {
      message.success("环境变量修改成功");
      this.loadData(appCode, operationkey);
    }).catch((e) => {
      this.loadData(appCode, operationkey);
      base.ampMessage("环境变量修改失败" )
    });
  }
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        const tempData = this.state.data.filter(item => item.key !== key);
        let flag = false;
        tempData.forEach(element => {
          if (element.isNew || element.editable) {
            flag = true;
          }
        });
        if (flag) {
          message.error('环境变量表格中存在未保存数据，请先保存再进行编辑操作');
          return;
        }
        if (this.props.afterenvconf) {
          this.props.afterenvconf(null, true);
        }
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  }
  //删除数据或取消保存，temp=true表示取消保存，temp=false表示删除数据
  remove(key, temp) {
    let newData = this.state.data.filter(item => item.key !== key);
    if (this.props.afterenvconf) {
      this.setState({ data: newData });
      newData.forEach(element => {
        element.key = element.name;
      });
      this.props.afterenvconf(newData);
    } else {
      if (!temp) {
        this.deleteData(key);
      } else {
        this.setState({ data: newData });
      }
    }
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    let flag = false;
    newData.forEach(element => {
      if (element.isNew || element.editable) {
        flag = true;
      }
    })
    if (flag) {
      message.error('环境变量表格中存在未保存数据，请先保存后再添加新的数据');
      return;
    }
    newData.push({
      key: Math.random(),
      name: '',
      value: '',
      source: 0,
      desc: '',
      editable: true,
      isNew: true,
      operateWay: 'add',
    });
    this.index += 1;
    this.setState({ data: newData });
    if (this.props.afterenvconf) {
      this.props.afterenvconf(null, true);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key, add) {
    e.persist();
    let flag = 0;
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(key) || {};
    if (!target.source) target.source = 0;
    if (!target.name) {
      message.error('环境变量key未填写，请输入环境变量key值再保存');
      e.target.focus();
      return;
    }
    if (!target.value) {
      message.error('环境变量value未填写，请输入环境变量value再保存');
      e.target.focus();
      return;
    }
    if (!envRegexp.test(target.name)) {
      message.error('环境变量名称只能输入数字、字母、下划线,且必须以字母开头');
      e.target.focus();
      return;
    }
    let newData = this.state.data.slice();
    newData.forEach((element) => {
      if (element.name === target.name) {
        flag++;
      }
    });
    if (flag > 1) {
      message.error(`环境变量名称与已有环境变量重复，请重新填写`);
      return;
    }
    delete target.isNew;
    this.toggleEditable(e, key);
    if (this.props.afterenvconf) {
      newData.forEach(element => {
        element.key = element.name;
        delete element.editable;
      });
      this.props.afterenvconf(newData);
    } else {
      if (!add) {
        this.editData(target, key);
      } else {
        this.addData(target);
      }
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  //撤销操作
  handleRestore = (e, key) => {
    e.preventDefault();
    const { appCode, operationkey } = this.state;
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    const params = {
      name: operationkey
    };
    this.setState({ loading: true });
    resetEnv(appCode, operationkey, target.id, params).then(() => {
      message.success('环境变量撤销修改成功');
      this.loadData(appCode, operationkey);
    }).catch((e) => {
      base.ampMessage('环境变量撤销修改失败' );
      this.loadData(appCode, operationkey);
    });
  }
  onRestartApp = () => {
    const { operationkey, appCode } = this.state;
    appStart(appCode).then(() => {
      this.loadData(appCode, operationkey);
      message.success('应用重启成功！');
    });
  }
  openModal = () => {
    let textEnvs = '';
    this.state.data.forEach(element => {
      let value = element.value;
      if (!value) {
        value = element.oldValue;
      }
      textEnvs += element.name + '=' + value + '\n';
    });
    //console.log('dataenvs', this.state.data, textEnvs);
    this.setState({ visibleModal: true, textEnvs });
  }
  checkEnvs = () => {
    let tempEnvStr = this.state.textEnvs.split('\n');
    let tempEnvs = [];
    let flag = false;
    tempEnvStr.forEach((element, index) => {
      if (element.trim()) {
        if (!flag && element.indexOf('=') > -1) {
          tempEnvs.push({
            key: element.split('=')[0],
            value: element.slice(element.indexOf('=') + 1),
            source: 0,
            desc: '',
            operateWay: 'add'
          })
        } else if (!flag) {
          flag = true;
          message.error(`文本域第${index + 1}行的环境变量有错误，格式为：xxx=yyy，请重新填写`);
        }
        if (!flag && !envRegexp.test(element.split('=')[0])) {
          flag = true;
          message.error('环境变量名称只能输入数字、字母、下划线,且必须以字母开头');
        }
      }
    });
    if (flag) {
      return true;
    }
    tempEnvs = tempEnvs.sort();
    tempEnvs.forEach((element, index, envs) => {
      if (!flag && index < envs.length - 1 && element.key === envs[index + 1].key) {
        flag = true;
        message.error(`文本域存在重复环境变量值${element.key}，请重新填写`);
      }
    });
    if (flag) {
      return true;
    } else {
      return false;
    }
  }
  //导入环境变量，通过\n换行符剪切每一条环境变量，第一个=号截取环境变量key和value
  handleModalOk = () => {
    let newData = this.state.data.slice();
    let flag = false;
    flag = this.checkEnvs();
    if (flag) {
      return;
    }
    let tempEnvStr = this.state.textEnvs.split('\n');
    let tempEnvs = [];
    tempEnvStr.forEach(element => {
      if (element.indexOf('=') > -1) {
        let tempEnv = newData.filter(item => item.name === element.split('=')[0].trim());
        if (tempEnv.length > 0) {
          tempEnv[0].key = element.split('=')[0].trim();
          tempEnv[0].value = element.slice(element.indexOf('=') + 1).trim();
          tempEnvs.push(tempEnv[0]);
        } else {
          tempEnvs.push({
            key: element.split('=')[0].trim(),
            name: element.split('=')[0].trim(),
            value: element.slice(element.indexOf('=') + 1).trim(),
            source: 0,
            desc: '',
            operateWay: 'add'
          })
        }
      }
    });
    if (this.props.afterenvconf) {
      let newData = this.state.data.slice();
      newData.forEach(element => {
        element.key = element.name;
        delete element.editable;
      });
      tempEnvs.forEach(element => {
        newData.forEach((item, index, newData) => {
          if (element.key === item.key) {
            item.value = element.value;
          }
        })
      });
      tempEnvs.forEach(element => {
        if (newData.filter(item => item.key === element.key).length === 0) {
          newData.push(element);
        }
      });
      this.setState({ data: newData });
      this.props.afterenvconf(newData);
      this.setState({ visibleModal: false });
    } else {
      this.batchAddData(tempEnvs);
    }
  }

  //环境变量修改，传递状态给父组件来判断是否部署上面加红点
  isChange = (data) => {
    let b = false;
    if (data.length > 0) {
      data.forEach(e => {
        if (e.operateWay !== 'effect') {
          b = true;
        }
      })
    }
    return b;
  }

  render() {
    const { data, showWarning, loading, visibleModal, textEnvs } = this.state;
    const columns = [{
      title: '键',
      dataIndex: 'name',
      width:280,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              value={text} autoFocus
              onChange={e => this.handleFieldChange(e, 'name', record.key)}
              placeholder="键"
            />
          );
        }
        return <Tooltip title={record.desc}>{text}</Tooltip>;
      },
    }, {
      title: '值',
      dataIndex: 'value',
      render: (text, record) => {
        let value = '';
        if (record.editable) {
          return (
            <Input
              value={record.value} disabled={(!record.isNew && record.source !== '0') ? true : false}
              onChange={e => this.handleFieldChange(e, 'value', record.key)}
              placeholder="值"
            />
          );
        } else if (record.operateWay === 'add' || record.operateWay === 'effect') {
          value = record.value;
        } else if (record.operateWay === 'delete') {
          value = record.oldValue;
        } else if (record.operateWay === 'update') {
          value = record.oldValue + ' ==> ' + record.value;
        } else {
          value = record.value;
        }
        return <Ellipsis tooltip lines={1}>{value}</Ellipsis>
      },
    }, {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Select style={{ width: '100%' }} defaultValue={record.source ? sourceList[record.source] : 0}
              onChange={value => record.source = value}>
              <Option value={0}>{sourceList[0]}</Option>
              <Option value={1}>{sourceList[1]}</Option>
              <Option value={2}>{sourceList[2]}</Option>
            </Select>
          );
        }
        return sourceList[text];
      },
    // }, {
    //   title: '描述',
    //   dataIndex: 'desc',
    //   render: (text, record) => {
    //     if (record.editable) {
    //       return (
    //         <Input
    //           value={text} disabled={(!record.isNew && record.source !== '0') ? true : false}
    //           onChange={e => this.handleFieldChange(e, 'desc', record.key)}
    //           placeholder="描述"
    //         />
    //       );
    //     }
    //     return <Ellipsis tooltip lines={1} length={150}>{text}</Ellipsis>;
    //   },
    }, {
      title: '操作状态',
      dataIndex: 'operateWay',
      width: 100,
      render: (text, record) => {
        return <Badge status={statusMap[record.operateWay]} text={statusList[statusMap[record.operateWay]]} />
        //return statusList[text];
      }
    }, {
      title: '操作',
      dataIndex: 'handle',
      width: 160,
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key, true)}>保存</a>
                <Divider type="vertical" />
                <a onClick={() => this.remove(record.key, true)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        if (statusMap[record.operateWay] === 'default' || statusMap[record.operateWay] === 'success') {
          return (
            <span>
              <Authorized authority={this.props.type==='web'?'app_editdEnvironmentalVariable':'middlewares_editdEnvironmentalVariable'} noMatch={<a disabled="true">编辑</a>}>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              </Authorized>
              
              {(record.source === '0' || !record.source) ?
                <span>
                  <Divider type="vertical" />
                  <Authorized authority={this.props.type==='web'?'app_deleteEnvironmentalVariable':'middlewares_deleteEnvironmentalVariable'} noMatch={<a disabled="true">删除</a>}>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                  </Authorized>
                </span>
                : ''}
            </span>
          );
        } else if (statusMap[record.operateWay] === 'processing') {
          return (
            <span>
              <a onClick={e => this.handleRestore(e, record.key)}>撤销</a>
              <Divider type="vertical" />
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              {(record.source === '0' || !record.source) ?
                <span>
                  <Divider type="vertical" />
                  <Authorized authority={this.props.type==='web'?'app_deleteEnvironmentalVariable':'middlewares_deleteEnvironmentalVariable'} noMatch={<a disabled="true">删除</a>}>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                  </Authorized>
                </span>
                : ''}
            </span>
          );
        } else if (statusMap[record.operateWay] === 'error') {
          return (
            <span>
              <a onClick={e => this.handleRestore(e, record.key)}>撤销</a>
            </span>
          );
        } else {
          return (
            <span>
              {(record.source === '0' || !record.source) ?
              <Authorized authority={this.props.type==='web'?'app_deleteEnvironmentalVariable':'middlewares_deleteEnvironmentalVariable'} noMatch={<a disabled="true">删除</a>}>
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
                </Authorized>
                : ''}
            </span>
          )
        }
      },
    }];
    
    const simpColumns = [{
      title: '键',
      width:280,
      dataIndex: 'name',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              value={text} autoFocus
              onChange={e => this.handleFieldChange(e, 'name', record.key)}
              placeholder="键"
            />
          );
        }
        return <Tooltip title={record.desc}>{text}</Tooltip>;
      },
    }, {
      title: '值',
      dataIndex: 'value',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={record.value}
              onChange={e => this.handleFieldChange(e, 'value', record.key)}
              placeholder="值"
            />
          );
        } else if (record.operateWay === 'add' || record.operateWay === 'effect') {
          return record.value;
        } else if (record.operateWay === 'delete') {
          return record.oldValue;
        } else if (record.operateWay === 'update') {
          return record.oldValue + ' ==> ' + record.value;
        } else {
          return record.value;
        }
      },
    }, {
    //   title: '描述',
    //   dataIndex: 'desc',
    //   render: (text, record) => {
    //     if (record.editable) {
    //       return (
    //         <Input
    //           value={text}
    //           onChange={e => this.handleFieldChange(e, 'desc', record.key)}
    //           placeholder="描述"
    //         />
    //       );
    //     }
    //     return text;
    //   },
    // }, {
      title: '操作',
      dataIndex: 'handle',
      width: 160,
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key, true)}>保存</a>
                <Divider type="vertical" />
                <a onClick={() => this.remove(record.key, true)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        if (statusMap[record.operateWay] === 'default' || statusMap[record.operateWay] === 'success') {
          return (
            <span>
              <Authorized authority={this.props.type==='middleware'?'middlewares_editdEnvironmentalVariable':'app_editdEnvironmentalVariable'} noMatch={<a disabled="true">编辑</a>}>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              </Authorized>
              {(record.source === '0' || !record.source) ?
                <span>
                  <Divider type="vertical" />
                  <Authorized authority={this.props.type==='middleware'?'middlewares_deleteEnvironmentalVariable':'app_deleteEnvironmentalVariable'} noMatch={<a disabled="true">删除</a>}>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                  </Authorized>
                </span>
                : ''}
            </span>
          );
        } else if (statusMap[record.operateWay] === 'processing') {
          return (
            <span>
              <a onClick={e => this.handleRestore(e, record.key)}>撤销</a>
              <Divider type="vertical" />
              <Authorized authority={this.props.type==='middleware'?'middlewares_editdEnvironmentalVariable':'app_editdEnvironmentalVariable'} noMatch={<a disabled="true">编辑</a>}>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              </Authorized>
              {(record.source === '0' || !record.source) ?
                <span>
                  <Divider type="vertical" />
                  <Authorized authority={this.props.type==='middleware'?'middlewares_deleteEnvironmentalVariable':'app_deleteEnvironmentalVariable'} noMatch={<a disabled="true">删除</a>}>
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                  </Authorized>
                </span>
                : ''}
            </span>
          );
        } else if (statusMap[record.operateWay] === 'error') {
          return (
            <span>
              <a onClick={e => this.handleRestore(e, record.key)}>撤销</a>
            </span>
          );
        } else {
          return (
            <span>
              {(record.source === '0' || !record.source) ?
              <Authorized authority={this.props.type==='middleware'?'middlewares_deleteEnvironmentalVariable':'app_deleteEnvironmentalVariable'} noMatch={<a disabled="true">删除</a>}>
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </Authorized>
                : ''}
            </span>
          )
        }
      },
    }];
    return (
      <div>
        <div className="card-title">环境变量</div>
        {
          !this.props.isAddApp && showWarning ?
            <Alert
              message='环境变量改变了,是否重启应用?'
              description={<span><a onClick={this.onRestartApp}>保存并重启应用</a>{/* <Divider type="vertical" /><a>取消修改</a> */}</span>}
              type="warning" style={{ marginBottom: 10 }}
              showIcon
            /> : null
        }
        <Table
          pagination={false}
          loading={loading}
          dataSource={data}
          columns={this.props.isAddApp ? simpColumns : columns}
          rowKey='name'
        />
        <Modal
          title="环境变量导入"
          width={800}
          visible={visibleModal}
          onOk={this.handleModalOk}
          onCancel={() => this.setState({ visibleModal: false })} >
          <Alert
            message="导入提示"
            description={`请将环境变量按格式要求输入下面的文本域中，文本域每一行为一个环境变量，环境变量名不可重复，格式为：
            xxx=yyy（变量名=变量值）`}
            type="info" style={{ marginBottom: 10 }} />
          <TextArea style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
            rows={12} value={textEnvs} onChange={e => this.setState({ textEnvs: e.target.value })} />
        </Modal>
        <Row gutter={16} >
        <Authorized authority={this.props.type==='middleware'?'middlewares_addEnvironmentalVariable':'app_addEnvironmentalVariable'} noMatch={ <Col span={12} >
            <Button disabled="true"
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.newMember}
              icon="plus"
            >
              添加
            </Button>
          </Col>}>
          <Col span={12} >
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.newMember}
              icon="plus"
            >
              添加
            </Button>
          </Col>
        </Authorized>
        
          <Col span={12} >
            <Authorized authority={this.props.type==='middleware'?'middlewares_importEnvironmentalVariable':'app_importEnvironmentalVariable'} noMatch={<Button
                  disabled="true"
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  onClick={this.openModal}
                  icon="download"
                >
                导入
              </Button>}>
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="dashed"
                onClick={this.openModal}
                icon="download"
              >
                导入
              </Button>
            </Authorized>
            
          </Col>
        </Row>
      </div>
    );
  }
}