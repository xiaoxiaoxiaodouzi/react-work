import React, { Component } from 'react';
import { Table, Checkbox, Input, Button, Row, Col, message, Form } from 'antd'
import { getManagertables, orgPermissions, deleteOrgPermissions } from '../../../services/running'


class OrgModalForm extends Component {
  state = {
    current: '1',
    pageSize: '10',
    total: '',
    orgs: [],
    name: ''     //查询时候的数据
  }

  componentDidMount() {
    const appid = this.props.appid;
    getManagertables(appid).then(data => {
      this.setState({
        orgs: data.contents,
        total: data.total,
        current: data.pageIndex,
        pageSize: data.pageSize
      })
    })
  }

  loadData = (current, pageSize, name) => {
    const appid = this.props.appid;
    let queryParams = {
      page: current,
      rows: pageSize,
      name: name
    }
    getManagertables(appid, queryParams).then(data => {
      this.setState({
        orgs: data.contents,
        total: data.total,
        current: data.pageIndex,
        pageSize: data.pageSize
      })
    })
  }
  handleData = (current, pageSize) => {
    let name = this.state.name
    this.loadData(current, pageSize, name);
  }

  handleChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  CheckChange = (id, data) => {
    const appid = this.props.appid;
    let bodyParams = []
    let params = {
      appid: appid,
      categoryOrgId: id,
      scope: data
    }
    bodyParams.push(params);

    if (data) {
      orgPermissions(bodyParams).then(data => {
        message.success('授权成功')
        this.loadData(this.state.current, this.state.pageSize, this.state.name)
      })
    } else {
      deleteOrgPermissions(appid, id).then(data => {
        message.success('取消授权成功')
        this.loadData(this.state.current, this.state.pageSize, this.state.name)
      })
    }
  }
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '55%',
      },
      {
        title: '拒绝',
        width: '15%',
        render: (text, record) => {
          return <Checkbox checked={record.data === '' ? true : false} onClick={e => { this.CheckChange(record.id, '') }} />
        }
      },
      {
        title: '只读',
        width: '15%',
        render: (text, record) => {
          return <Checkbox checked={record.data === 'r' ? true : false} onClick={e => { this.CheckChange(record.id, 'r') }} />
        }
      },
      {
        title: '读写',
        width: '15%',
        render: (text, record) => {
          return <Checkbox checked={record.data === 'rw' ? true : false} onClick={e => { this.CheckChange(record.id, 'rw') }} />
        }
      },
    ]
    const paginationProps = {
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: this.state.total,
      onChange: (current, pageSize) => {
        this.handleData(current, pageSize)
      }
    }

    return (
      <div>
        <Form>
          <Row style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Input placeholder='名称' onChange={e => this.handleChange(e)} value={this.state.name} />
            </Col>
            <Col span={12}>
              <Button icon="search" type="primary" htmlType="submit" onClick={() => this.loadData(1, 10, this.state.name)} style={{ marginLeft: 16 }}>
                查询
            </Button>
            </Col>
          </Row>
        </Form>

        <Table
          dataSource={this.state.orgs}
          rowKey={record => record.id}
          columns={columns}
          pagination={paginationProps}
        >

        </Table>
      </div>
    )
  }
}

const OrgModal = Form.create()(OrgModalForm);
export default OrgModal;