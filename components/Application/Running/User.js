import React, { Component } from 'react';
import { Table, Row, Col, Form, Input, Select, Button} from 'antd';
import './User.css'
import { getUsers } from '../../../services/aip'
import Link from 'react-router-dom/Link';
import PropTypes from 'prop-types'


const FormItem = Form.Item;
const { Option } = Select;

class UserForm extends Component {
  static propTypes = {
    prop: PropTypes.object,
  }

  state = {
    expandForm: false,
    data: [],
    current: 1,
    total: 1,
    pageSize: 10,
    roles: [],      //用户角色集合
    users: [],      //用户集合
    data1: [],       //功能集合
    userCollectionId: [],
  }
  componentDidMount() {
    this.loadDatas({page:1,rows:10});
  }
  componentWillReceiveProps(nextProps) {

    /* if (nextProps.userCollectionId !== this.props.userCollectionId) {
      this.setState({userCollectionId:nextProps.userCollectionId})
      this.loadDatas({userCollectionId:nextProps.userCollectionId});
    } */
  }

  loadDatas = (queryParam) => {
    getUsers(this.props.appId, queryParam).then(data => {
      this.setState({ total: data.total, data: data.contents ,current:data.pageIndex,pageSize:data.pageSize})
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.loadDatas(values)
      };
    });
  }


  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.loadDatas();
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }


  renderSimple = () => {
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
      <div className='tableList'>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <span style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a> */}
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  renderAdvancedForm() {
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
      <div className='tableList'>

        <Form onSubmit={this.handleSearch} layout="inline">
          <Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
           {/*  <Col md={8} sm={24}>
              <FormItem label="用户集合">
                {getFieldDecorator('userCollectionId', { initialValue: this.props.selectedTag })(
                  <Select placeholder="请选择"
                  >
                    {
                      this.state.userCollectionId.length > 0 ?
                        this.state.userCollectionId.map((value, index) => {
                          return (
                            <Option key={index} value={value.collectionId}>{value.collectionName}</Option>
                          )
                        }) : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col> */}
            <Col span={8}>
              <FormItem {...formItemLayout} label="功能角色">
                {getFieldDecorator('roles')(
                  <Select placeholder="请选择"
                  >
                    {
                      this.state.roles.length > 0 ?
                        this.state.roles.map((value, index) => {
                          return (
                            <Option key={index} value={value.id}>{value.name}</Option>
                          )
                        }) : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
           {/*  <Col md={8} sm={24}>
              <FormItem label="功能">
                {getFieldDecorator('data1')(
                  <Select placeholder="请选择"
                  >
                    {
                      this.state.data1.length > 0 ?
                        this.state.data1.map((value, index) => {
                          return (
                            <Option key={index} value={value.id}>{value.name}</Option>
                          )
                        }) : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col> }
          </Row> */}
          <div style={{ overflow: 'hidden' }}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a> */}
            </span>
          </div>
        </Form>
      </div>
    );
  }

  render() {

    const { current, total, pageSize } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
       // width: '10%',
      },
      {
        title: '关联功能角色',
        dataIndex: 'roleList',
       // width: '20%',
        render: (text, record) => {
          if (record.roleList) {
            /*return <Tooltip placement="topLeft" title={record.roleList.map(element => {
              return <Link style={{ color: 'yellow', marginLeft: 6 }} to={`/applications/${element.appId}/functionalroles/${element.id}`}>{element.name}</Link>
            })}>
              <div>
                <Ellipsis lines={1} length='20' tooltip>{record.roleList.map(element => {
                  return <Link style={{ marginLeft: 6 }} to={`/applications/${element.appId}/functionalroles/${element.id}`}>{element.name}</Link>
                })}</Ellipsis>
              </div>
            </Tooltip>*/
            return record.roleList.map(element => {
              return <Link style={{ marginLeft: 6 }} to={`/applications/${element.appId}/functionalroles/${element.id}`}>{element.name}</Link>
            })
          } else {
            return '无'
          }
        }
      },
      /* {
        title: '操作',
        width: '20%',
        render: (record, text) => {
          /*  return (
             <Fragment>
               <a >授权</a>
               <Divider type='vertical' />
               <a>详情</a>
             </Fragment>
           )
        }
      }, */
    ]

    const pagination =
      {
        total: total,
        current: current,
        pageSize: pageSize,
        showTotal: total => `共有${total}条数据`,
        onChange: (current, pageSize) => {
          this.loadDatas({page:current,rows:pageSize})
        },
        showQuickJumper: true
      }
    return (
      <div>
        {this.state.expandForm ? this.renderAdvancedForm() : this.renderSimple()}
        <Table
          dataSource={this.state.data}
          columns={columns}
          rowKey={record => record.code}
          pagination={pagination}
        />
      </div>
    )
  }
}

const User = Form.create()(UserForm)
export default User;