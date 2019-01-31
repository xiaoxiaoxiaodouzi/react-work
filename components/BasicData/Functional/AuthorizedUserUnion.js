import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button, Table, message } from 'antd';
import moment from 'moment'
import AuthorizeRoleModal from '../../../common/FunctionalSelectModal/AuthorizeRoleModal'
import {deleteRoleManager,getRoleUserCollection,updateUserCollection,deleteUserCollection,roleManagerUsers,getRoleManagerUsers} from '../../../services/aip'
import constants from '../../../services/constants'

const FormItem = Form.Item;

class AuthorizedUserUnion extends Component {
  state = {
    authorizeVisible: false,
    removeVisible: false,
    dataSource: [],
    selectedKeys: [],
    loading: false,
    current:1, 
    total:0, 
    pageSize:10
  }
  static propTypes = {
    prop: PropTypes.object,
    showSearchButon: PropTypes.bool,     //是否显示搜索框
    size: PropTypes.string       //表格大小
  }

  static defaultProp = {
    showSearchButon: false,
    size: 'default'
  }
  componentDidMount() {
    /* getRoleUserCollection(this.props.appId,this.props.roleId,{}).then(data=>{
      this.setState({dataSource:data});
    })  */
    this.loadData(1,10);
  }

  loadData = (current,pageSize,params) => {
    this.setState({ loading: true })
    if (this.props.type === 'manager') {
      getRoleManagerUsers(this.props.appId, this.props.roleId, Object.assign({}, { page: current, rows: pageSize }, params)).then(data => {
        getRoleManagerUsers(this.props.appId, this.props.roleId, params).then(datas => {
          this.setState({
            dataSource: data.contents,
            selectedKeys: datas,
            loading: false,
            current:data.pageIndex,
            total:data.total,
            pageSize:data.pageSize
          })
        })
      }).catch(err => {
        this.setState({ loading: false })
      })
    } else {
      getRoleUserCollection(this.props.appId, this.props.roleId, Object.assign({}, { page: current, rows: pageSize }, params)).then(data => {
        getRoleUserCollection(this.props.appId, this.props.roleId,  params).then(datas=>{
          this.props.userCollections(datas);
          this.setState({
            dataSource: data.contents,
            selectedKeys: datas,
            loading: false,
            current:data.pageIndex,
            total:data.total,
            pageSize:data.pageSize
          });
        })
      }).catch(err => {
        this.setState({ loading: false })
      })
    }
  }

  //处理功能授权modal回调，flag=true为点击确定，返回选择的功能集合数据，flag=false为点击取消，关闭modal
  handleAuthorizeModal = (flag, selectedValues) => {
    if (flag) {
      if (this.props.type === 'manager') {
        //如果是管理员列表
        roleManagerUsers(this.props.appId, this.props.roleId, selectedValues).then(data => {
          message.success('角色授权管理员用户集合成功')
         /*  let  url=`proxy/aip/v1/apps/4/roles/amp_roleManager/usercollections`;

					let bodyParams = selectedValues;
        			fetch(url, {
           				 method: "PUT", credentials: "include",
            			headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'AMP-ENV-ID': '1'},
            			body: JSON.stringify(bodyParams)
        			}).then(response =>{
						if (response.ok) {
							message.success('角色授权管理员用户集合成功')
							this.setState({ dataSource: data, visible: false })
							
						} else {
							message.error('角色授权管理员用户集合失败');
						}
							
					} ).catch(err=>{
						message.error('角色授权管理员用户集合失败');
					});
					message.success('角色授权管理员用户集合成功') */
					this.loadData(1,10);
				})
      } else {
        updateUserCollection(this.props.appId, this.props.roleId, selectedValues).then(data => {
          message.success('修改授权用户集合成功')
          this.loadData(1,10);
        })
      }
    }
    this.setState({ authorizeVisible: false })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.loadData(this.state.current,this.state.pageSize,values)
      };
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  onDeleteUserCollection = (id) => {
    if(this.props.type==='manager'){
      deleteRoleManager(this.props.appId, this.props.roleId, id).then(data => {
				message.success('取消角色授权管理员用户集合成功')
				this.loadData(1,10);
			})
    }else{
      deleteUserCollection(this.props.appId, this.props.roleId, id).then(data => {
        message.success('取消授权用户集合成功');
        this.loadData(1,10);
      })
    }
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
    return (
      <div className="tableList">
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 4, lg: 12, xl: 18}}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={16}>
              <span style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查询
              </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
              </Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
  render() {
    const { current, total, pageSize } = this.state;

    const columns = [{
      title: '名称',
      dataIndex: 'userCollectionName',
    }, {
      title: '类型',
      dataIndex: 'userCollectionType',
      width: '100px',
      render: (value, record) => constants.functionResource.userCollectionType[value]
    }, {
      title: '用户数',
      dataIndex: 'userCount',
      width: '100px',
      align:'right'
    }, {
      title: '授权者',
      dataIndex: 'creator',
    }, {
      title: '授权时间',
      dataIndex: 'createtime',
      width: '180px',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm')
    }, {
      title: '操作',
      width: '120px',
      key: 'action',
      render: (text, record) => <a onClick={() => this.onDeleteUserCollection(record.userCollectionId)} >取消授权</a>
    }];

    const pagination =
      {
        total: total,
        current: current,
        pageSize: pageSize,
        showTotal: total => `共有${total}条数据`,
        onChange: (current, pageSize) => {
          this.loadData(current, pageSize)
        },
        showQuickJumper: true
      }

    return (
      <div >
        {this.props.showSearchButon ? this.renderForm() : ''}
        <Button type='primary' style={{ marginTop: 24 }}
          onClick={() => this.setState({ authorizeVisible: true })} >选择用户集合</Button>
        <Table
          style={{ marginTop: 24 }}
          size={this.props.size || 'default'}
          dataSource={this.state.dataSource}
          columns={columns}
          loading={this.state.loading}
          pagination={pagination}
        />
        <AuthorizeRoleModal
          visible={this.state.authorizeVisible}
          title='功能角色授权' isOffset={true}
          selectedKeys={this.state.selectedKeys}
          handleModal={(flag, data) => this.handleAuthorizeModal(flag, data)} />
      </div>
    )
  }
}
export default Form.create()(AuthorizedUserUnion)