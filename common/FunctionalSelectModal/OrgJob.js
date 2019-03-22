import React, { PureComponent } from 'react';
import { Input, Form, Table, Button, Row, Col } from "antd";
import { getJobs } from '../../services/uop';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import OrgTree from './OrgTree';
class OrgJob extends PureComponent {

  state = {
    checkedOrgKeys: {
      checked: []
    },                   //选中的机构id数组
    treeDataOrg: [],           //机构树数据源
    categories: [],                   //下拉选择分类机构数据源
    categoryId: '',           //选择框的分类机构id  
    selectedKeys: this.props.selectedKeys || [],
    orgs: [],
    total: '',
    current: '',
    pageSize: '',
    orgId: '',
    disabledJobs: []
  }
  componentDidMount() {
    if (this.props.disabledJobs) {

      this.setState({ disabledJobs: this.props.disabledJobs });
    }

  }

  //机构树选择事件
  treeOnSelect = (orgId, categoryId) => {
    this.setState({ orgId: orgId, categoryId: categoryId });
    this.loadtreeDataJob({ page: 1, rows: 10, orgIds: [orgId], categoryId: categoryId });
  }

  //重置
  resetForm = (type) => {
    this.setState({ searchJobValue: '' })
    this.loadtreeDataJob({ page: 1, rows: 10, orgIds: this.state.orgId, categoryId: this.state.categoryId });
  }

  //查詢
  onSubmit = (type, e) => {
    e.preventDefault();
    this.loadtreeDataJob({ name: this.state.searchJobValue || '', page: 1, rows: 10, orgIds: this.state.orgId, categoryId: this.state.categoryId })
  }

  //加载岗位数据
  loadtreeDataJob = (params) => {
    this.setState({ jobLoading: true })
    getJobs(params).then(data => {

      data.contents.forEach(element => {
        element.key = element.id
      })
      this.setState({ treeDataJob: data.contents, total: data.total, pageSize: data.pageSize, current: data.pageIndex, jobLoading: false }, () => this.props.loadCheckedValues())
    }).catch(err => {
      this.setState({ jobLoading: false })
    })
  }

  render() {
    const jobPagination = {
      total: this.state.total,
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: (current, pageSize) => {
        this.loadtreeDataJob({ name: this.state.searchJobValue || '', page: current, rows: pageSize, orgIds: this.state.orgId, categoryId: this.state.categoryId })
      },
    }
    const columnJob = [{
      title: '岗位名称',
      dataIndex: 'name',
      width: '20%'
    },
    {
      title: '所属机构',
      width: 150,
      render: (text, record) => {
        return <Ellipsis tooltip lines={1}>{record.orgName + '-' + record.categoryOrgName}</Ellipsis>
      }
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: 150,
      render: (text) => {
        return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
      }
    }, {
      title: '用户数',
      dataIndex: 'userCount',
      align: 'center',
      width: 120
    }];
    let rowSelectionJob = {
      selectedRowKeys: this.props.checkedJobKeys,
      // onChange: (selectedRowKeys) => this.setState({ checkedJobKeys: selectedRowKeys }), 
      onSelect: (record, selected) => {

        this.props.onJobCheck(record, selected);
      },
      getCheckboxProps: record => ({
        disabled: this.state.disabledJobs.indexOf(record.id) !== -1, // Column configuration not to be checked
        name: record.name,
      }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.props.onAllCheck(selectedRows, changeRows, selected, 'job');
      }
    };
    console.log(this.props.checkedJobKeys);
    return (
      <div>
        <Row>
          <Col span={8} style={{ borderRight: "1px dashed #dddddd" }}>
            <OrgTree onSelect={this.treeOnSelect} simple={true} />
          </Col>
          <Col offset={1} span={15} style={{ paddingLeft: 16 }}>
            <Form layout="inline" style={{ marginBottom: 16 }} onSubmit={(e) => this.onSubmit('job', e)}>

              <Form.Item label="岗位名称">
                <Input style={{ width: 200 }}
                  value={this.state.searchJobValue}
                  onChange={e => this.setState({ searchJobValue: e.target.value })} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" style={{ marginRight: 8 }} htmlType="submit">查询</Button>
                <Button onClick={() => { this.resetForm('job') }}>重置</Button>
              </Form.Item>
            </Form>
            <Table
              rowkey='id'
              size='small'
              rowSelection={rowSelectionJob}
              dataSource={this.state.treeDataJob}
              columns={columnJob}
              loading={this.state.jobLoading}
              pagination={jobPagination}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
export default OrgJob;