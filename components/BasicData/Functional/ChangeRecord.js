import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row,Col,Card,Form,Input,Select,Button,Table } from 'antd';
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
class ChangeRecord extends Component {
  static propTypes = {
    prop: PropTypes
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="tableList">
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16}}>
          <Col md={8} sm={24}>
            <FormItem label="操作者">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="操作IP">
              {getFieldDecorator('app')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      title: '操作时间',
      dataIndex: 'name',
      width:'20%'
    },{
      title: '操作类型',
      dataIndex: 'app',
      width:'15%'
    },{
      title: '操作对象',
      dataIndex: 'desc',
      width:'20%'
    },{
      title: '操作者',
      dataIndex: 'role',
      width:'15%'
    },{
      title: '操作IP',
      dataIndex: 'role',
      width:'20%'
    },{
      title: '操作',
      width:'10%',
      key: 'action',
      render: (text, record) => <Link to={`functional/12`}>详情</Link>
    }];

    return (
      <Card bordered={false} title='变更记录' style={{margin:'24px 24px 0'}}>
        {this.renderSimpleForm()}
        <Table style={{ marginTop:24 }} 
          dataSource={dataSource} 
          columns={columns} />
      </Card>
    )
  }
}
export default Form.create()(ChangeRecord)