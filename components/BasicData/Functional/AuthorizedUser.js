import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row,Col,Form,Input,Select,Button,Table } from 'antd';
import Link from 'react-router-dom/Link';

const FormItem = Form.Item;
const { Option } = Select;
const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];
class AuthorizedUser extends Component {
  static propTypes = {
    prop: PropTypes
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="tableList">
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16}}>
          <Col md={6} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户集合">
              {getFieldDecorator('app')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="功能角色 ">
              {getFieldDecorator('status')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{float:'right'}}>
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
    const columns = [{
      title: '用户名',
      dataIndex: 'name',
      width:'15%'
    },{
      title: '主机构',
      dataIndex: 'app',
      width:'15%'
    },{
      title: '所属用户集合',
      dataIndex: 'desc',
      width:'30%'
    },{
      title: '关联功能角色',
      dataIndex: 'role',
      width:'30%'
    },{
      title: '操作',
      width:'10%',
      key: 'action',
      render: (text, record) => <Link to={`functional/12`}>管理</Link>
    }];

    return (
      <div >
        <div className="card-title">授权用户</div>
        {this.renderSimpleForm()}
        <Table style={{ marginTop:24 }} 
          dataSource={dataSource} 
          columns={columns} />
      </div>
    )
  }
}
export default Form.create()(AuthorizedUser)