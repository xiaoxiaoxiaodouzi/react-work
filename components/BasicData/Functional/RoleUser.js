import React, { Component, Fragment } from 'react';
import { Table, Row, Col, Form, Input, Button } from 'antd';
import { getUsersByRoleId } from '../../../services/aip'
import PropTypes from 'prop-types'
import constants from '../../../services/constants'
const FormItem = Form.Item;

class UserForm extends Component {
  static propTypes = {
    prop: PropTypes.object,
    appId: PropTypes.string,     //应用ID
    id: PropTypes.string,      //角色ID
  }

  state = {
    expandForm: false,
    data: [],
    current: 1,
    total: 1,
    pageSize: 10,
    loading:false,
  }

  componentDidMount() {
    this.loadDatas();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userCollections !== this.props.userCollections) {
      this.loadDatas();
    }
  }

  loadDatas = (params) => {
    this.setState({loading:true})
    params=Object.assign({},params,{page:this.state.current,rows:this.state.pageSize})
    getUsersByRoleId(this.props.appId, this.props.id, params).then(datas => {
      this.setState({ data: datas.contents, total: datas.total ,current:datas.pageIndex,pageSize:datas.pageSize,loading:false})
    }).catch(err=>{
      this.setState({loading:false})
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
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  render() {

    const { current, total, pageSize, data } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
      },
      {
        title: '所属用户集合',
        dataIndex: 'userCollections',
        render: (value, record) => {
          return value && value.length > 0 ? value.map(u => {
            return <Fragment key={u.userCollectionId}><span style={{ marginRight: 5, whiteSpace: 'nowrap' }}>[{constants.functionResource.userCollectionType[u.userCollectionType]}]{u.userCollectionName}</span> </Fragment>;
          }) : '--';
        }
      }
    ]

    const pagination =
      {
        total: total,
        current: current,
        pageSize: pageSize,
        showTotal: total => `共有${total}条数据`,
        onChange: (current, pageSize) => {
          this.setState({ current, pageSize }, () => {
            this.props.form.validateFields((err, values) => {
              if (!err) {
                this.loadDatas(values)
              };
            });
          })
        },
        showQuickJumper: true
      }
    return (
      <div>
        {this.renderSimple()}
        <Table
          dataSource={data}
          columns={columns}
          rowKey={record => record.code}
          pagination={pagination}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

const RoleUser = Form.create()(UserForm)
export default RoleUser;