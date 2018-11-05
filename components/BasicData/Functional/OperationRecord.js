import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button, Table } from 'antd';
import Link from 'react-router-dom/Link';
import moment from 'moment';

const FormItem = Form.Item;
const dataSource = [{
  time:moment().format('YYYY-MM-DD HH:mm:ss'),
  type: '关联功能',
  object: '字典管理',
  user: '何思芬',
  ip: '172.16.25.123'
}, {
  time:moment().format('YYYY-MM-DD HH:mm:ss'),
  type: '授权角色',
  object: '字典列表',
  user: '何思芬',
  ip: '172.16.25.122'
}];
class OperationRecord extends Component {
  static propTypes = {
    prop: PropTypes.object
  }
  state = {
    roles: [],
    users: [],
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      };
    });
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="tableList">
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row style={{ marginBottom: 12 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="操作类型">
                {getFieldDecorator('type')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="操作IP">
                {getFieldDecorator('ip')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
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
      dataIndex: 'time',
      width: '20%',
      render:(text,record)=>{
        return text
        /* if(text){
          return moment(text).format('lll')
        } */
      }
    }, {
      title: '操作类型',
      dataIndex: 'type',
      width: '15%'
    }, {
      title: '操作对象',
      dataIndex: 'object',
      width: '15%'
    }, {
      title: '操作者',
      dataIndex: 'user',
      width: '15%'
    }, {
      title: '操作IP',
      dataIndex: 'ip',
      width: '20%'
    }, {
      title: '操作',
      width: '15%',
      key: 'action',
      render: (text, record) => <Link to={`functional/12`}>详情</Link>
    }];

    return (
      <div >
        {this.renderSimpleForm()}
        <Table style={{ marginTop: 24 }}
          dataSource={dataSource}
          columns={columns} />
      </div>
    )
  }
}
export default Form.create()(OperationRecord)