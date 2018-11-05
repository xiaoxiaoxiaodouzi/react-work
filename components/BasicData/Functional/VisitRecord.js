import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row,Col,Card,Form,Input,Select,Button,Table } from 'antd';

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
class VisitRecord extends Component {
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
      title: '访问时间',
      dataIndex: 'visittime',
      width:'20%'
    },{
      title: '来源IP',
      dataIndex: 'sourceip',
      width:'15%'
    },{
      title: '访问用户',
      dataIndex: 'user',
      width:'15%'
    },{
      title: '终端类型',
      dataIndex: 'type',
      width:'15%'
    },{
      title: 'URL',
      dataIndex: 'url',
      width:'15%'
    },{
      title: '状态码',
      dataIndex: 'code',
      width:'10%'
    },{
      title: '耗时(ms)',
      dataIndex: 'time',
      width:'10%',
    }];

    return (
      <Card bordered={false} title='访问记录' style={{margin:'24px 24px 0'}}>
        {this.renderSimpleForm()}
        <Table style={{ marginTop:24 }} 
          dataSource={dataSource} 
          columns={columns} />
      </Card>
    )
  }
}
export default Form.create()(VisitRecord)