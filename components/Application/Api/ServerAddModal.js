import React, { PureComponent } from 'react';
import { Modal, Form, Input, Alert, Radio, message, Select } from 'antd';
import QueryParamsTable from './QueryParamsTable';
import TagManager from '../../../common/TagManager';

import { queryTags, createTags, addService, addTag, queryAllServices } from '../../../services/api';
import { getAppInfo } from '../../../services/appdetail'

import { getApp } from '../../../services/running';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const methodList = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH', 'OPTIONS', 'TRACE'];
const isOpenList = [{
  key: '0', name: '私有服务'
}, {
  key: '1', name: '普通服务'
}, {
  key: '2', name: '公开服务'
}];
// this.props.editable    true 时this.props.appId,表示应用内的服务  false groupId表示服务列表
class ServerAddModal extends PureComponent {
  state = {
    allTags: [],
    tags: [],
    appName: '',
    groupId: '',
  };
  upstream = '';
  tableData = [];
  tableDataFlag = 0;
  componentDidMount() {
    if (this.props.editable) {
      getApp(this.props.appId).then((appInfo) => {
        this.upstream = appInfo.upstream;
        this.setState({
          appName: appInfo.name,
        });
      });

      this.setState({ groupId: this.props.appId });
    } else if (this.props.groups && this.props.groups.length > 0) {
      this.setState({ groupId: this.props.groups[0].id });
    }
    this.props.form.setFieldsValue({
      method: 'GET',
      isOpen: '0',
      name: '',
      path: '',
      desc: '',
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.editable && nextProps.isServerAddModalShow && nextProps.isServerAddModalShow !== this.props.isServerAddModalShow && nextProps.groups && nextProps.groups !== this.props.groups && nextProps.groups.length > 0) {
      this.setState({ groupId: nextProps.groups[0].id });
      getAppInfo(nextProps.groups[0].id)
        .then((response) => {
          this.upstream = response.upstream;
        })
    }
    if (this.props.isServerAddModalShow !== nextProps.isServerAddModalShow) {
      //this.setState({data:[]});
      this.props.form.setFieldsValue({
        method: 'GET',
        isOpen: '0',
        name: '',
        path: '',
        desc: '',
      });
      this.setState({ tags: [], helpPath: '', validatePath: '' });
    }
  }
  //点击确定添加服务，验证完成请求添加服务接口
  handleOk = (e) => {
    e.preventDefault();
    let params = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line
        //let patt = /^\/[0-9a-zA-Z\u4e00-\u9fa5.\/_-]*[0-9a-zA-Z\u4e00-\u9fa5_.\/-]+$/;
        let patt = /^\/[0-9a-zA-Z./_-]*([0-9a-zA-Z_./-]*|\{[0-9a-zA-Z._-]*\})+$/;
        if (!patt.test(values.path)) {
          this.setState({
            validatePath: 'error',
            helpPath: '请输入正确的服务路径(以/开头,只能包含"/","_",".","-","{}",数字，字母)'
          })
          return false;
        }
        if (!this.props.editable && !this.state.groupId) {
          message.error('请先选择应用');
          return;
        }
        if (this.tableDataFlag > 0) {
          message.error('请先保存服务参数列表数据再添加服务');
          return;
        }
        let tagNames = [], name = '';
        this.state.tags.forEach(element => {
          tagNames.push(element.name);
        });
        name = tagNames.join(',');
        params = {
          isRequestBodyModel: true,
          reqs: this.tableData,
          requestBodyModeName: '',
          service: {
            desc: values.desc,
            methods: values.method,
            name: values.name,
            uri: values.path,
            upstream: this.upstream,
            visibility: values.isOpen
          },
          tags: name,
        }
        if (this.props.editable) {
          addService(this.props.appId, params).then(() => {
            message.success('添加服务成功');
            this.props.onCloseModal(true);
          });
        } else {
          addService(this.state.groupId, params).then(() => {
            message.success('添加服务成功');
            this.props.onCloseModal(true);
          });
        }
      }
    });
    //this.props.onCloseModal();
  }
  handleCancel = (e) => {
    this.props.onCloseModal();
  }
  getAllTags = () => {
    if (this.state.groupId) {
      queryTags(this.state.groupId)
        .then((response) => {
          this.setState({
            allTags: response
          })
        })
    }
  }
  //标签弹窗管理可见回调
  onVisibleChange = (visible) => {
    if (visible) {
      if (this.state.groupId) {
        this.getAllTags();
      } else {
        message.error('添加服务标签前请先选择应用');
      }
    }
  }
  // 标签变化回调  create创建新标签 add绑定已创建标签 remove移除标签{event:'add',value:{id:***,name:*****}}
  onTagsManagerChange = (data) => {
    let tag = data.value;
    if (data.event === "add") {
      let tags = this.state.tags.slice();
      tags.push(tag);
      this.setState({ tags });
    } else if (data.event === 'create') {
      let tags = this.state.tags.slice();
      tags.push(tag);
      if (this.props.editable) {
        createTags(this.props.appId, tag.name).then((data) => {
          addTag(this.props.appId, tag).then(() => {
            message.success('创建标签成功');
            this.getAllTags();
            this.setState({ tags });
          })
        });
      } else {
        if (!this.state.groupId) {
          message.error('请先选择应用在创建标签');
          return;
        }
        createTags(this.state.groupId, tag.name).then((data) => {
          addTag(this.state.groupId, tag).then(() => {
            message.success('创建标签成功');
            this.getAllTags();
            this.setState({ tags });
          })
        });
      }
    } else if (data.event === 'remove') {
      const tags = this.state.tags.filter(ele => tag.id !== ele.id);
      this.setState({ tags });
    }
  }
  onTableDataChange = (data) => {
    this.tableData = data.slice();
  }
  onTableDataFlagChange = (flag) => {
    this.tableDataFlag += flag;
  }
  onCheckService = () => {
    let name = this.props.form.getFieldValue('name');
    let path = this.props.form.getFieldValue('path');
    queryAllServices('', '', '', '', '', name, path,this.props.tenant).then(data => {
      if (data.contents && data.contents.length > 0) {
        this.setState({
          validatePath: 'error',
          helpPath: name + '服务已存在,服务路径和服务方法不能完全一致'
        })
      } else {
        this.setState({
          validatePath: '',
          helpPath: ''
        })
      }
    });
  }
  render() {
    const { allTags, tags, appName } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 21 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        width={1000}
        style={{ top: 20 }}
        title="添加服务"
        visible={this.props.isServerAddModalShow}
        onOk={this.handleOk}
        onCancel={this.handleCancel} >
        <Form>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label={this.props.editable?'应用':'应用'}>
            {!this.props.editable ?
              <Select 
                showSearch
                value={this.state.groupId}
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                onChange={value => {
                  this.setState({ groupId: value, tags: [] }, () => this.getAllTags());
                  getAppInfo(value)
                    .then((response) => {
                      this.upstream = response.upstream;
                    })
                }} >
                {this.props.groups.map((ele, index) => <Option key={index} value={ele.id}>{ele.name}</Option>)}
              </Select>
              : <Input value={appName} disabled />}
          </FormItem>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="服务名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入服务名称' },{max:54,message:'服务名称过长'}],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="服务路径"
            validateStatus={this.state.validatePath}
            help={this.state.helpPath}>
            {getFieldDecorator('path', {
              rules: [{ required: true, message: '请输入服务路径' }],
            })(
              <Input placeholder="请输入" onBlur={this.onCheckService} />
            )}
          </FormItem>
          <FormItem className='tags' {...formItemLayout} style={{ marginBottom: 0 }} label="服务标签">
            {getFieldDecorator('tag', {
              rules: [{ required: true, message: '请选择服务标签' }],
            })(
              <TagManager
                selectedTags={tags}
                allTags={allTags}
                onVisibleChange={this.onVisibleChange}
                onChange={this.onTagsManagerChange} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="服务方法">
            {getFieldDecorator('method', {
              rules: [{ required: true, message: '请选择服务方法' }],
            })(
              <RadioGroup>
                {methodList.map((element, index) => {
                  return <Radio key={index} value={element}>{element}</Radio>
                })}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="服务类型">
            {getFieldDecorator('isOpen', {
              rules: [{ required: true, message: '请选择服务类型' }],
            })(
              <RadioGroup>
                {isOpenList.map((element, index) => {
                  return <Radio key={index} value={element.key}>{element.name}</Radio>
                })}
              </RadioGroup>
            )}
          </FormItem>
          <Alert style={{ marginLeft: 36, marginBottom: 8 }} message="服务描述支持Markdown语法，但请不要在描述中添加标题(#)，会影响离线文档的格式" type="info" />
          <FormItem {...formItemLayout} style={{ marginBottom: 0 }} label="服务描述">
            {getFieldDecorator('desc')(
              <Input.TextArea rows={2} placeholder="请输入" />
            )}
          </FormItem>
        </Form>
        <QueryParamsTable
          isServerAddModalShow={this.props.isServerAddModalShow}
          onChange={this.onTableDataChange}
          onTableDataFlagChange={this.onTableDataFlagChange} />
      </Modal>
    );
  }
}

const Antdes = Form.create()(ServerAddModal);
export default Antdes;