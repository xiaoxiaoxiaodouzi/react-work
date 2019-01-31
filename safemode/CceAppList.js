import React from 'react'
import { Breadcrumb, Divider, Table, Col, Form, Row, Select, Input, Button, Card,Badge,Icon,Tooltip } from 'antd';
import { GlobalHeaderContext } from '../context/GlobalHeaderContext'
import { base } from '../services/base';
import PageHeaderLayout from "../routes/setting/layouts/PageHeaderLayout"
import DataFormate from '../utils/DataFormate';
import constants from '../services/constants';
import Link from 'react-router-dom/Link';
import {getClusters, getStatus,getApplications} from '../services/cce';
const FormItem = Form.Item;
const { Option } = Select;
class CceAppList extends React.Component {
  state = {
    applicationData: [],
    total: 0,
    page: 1,
    row: 10,
    cond: '',
    cluster: '',
    appState: {},
    clusters:[]
  }

  componentDidMount() {
    this.loadData(this.state.page, this.state.row, '', '');
    this.setState({tenant:base.tenant});
  }

  componentWillReceiveProps(nextProps) {
    if (base.tenant && base.tenant !== this.state.tenant) {

        this.setState({ tenant: base.tenant});
        this.loadData(this.state.page, this.state.row, '', '');
    }
    
}
  loadData = (page, row, cond, cluster) => {
    // eslint-disable-next-line
    getApplications(base.tenant, { page: page, rows: row, cond: cond ? encodeURI(encodeURI("\{\"keyword\":\"" + cond + "\"\}")) : '', cluster: cluster }).then(data => {
      if (data) {
        this.setState({
          applicationData: data.contents,
          page: data.pageIndex,
          row: data.pageSize,
          total: data.total
        });

        let appState = {};
        let promiseArray = [];
        data.contents.forEach((en, i) => {
          promiseArray.push(getStatus(base.tenant, en.id));
        })
        Promise.all(promiseArray).then(response => {
          response.forEach(statusData => {
            appState[statusData.additionalProperties.appid] = statusData.additionalProperties.status;
          })
          this.setState({ appState });
        })
      }
    });

    //获取集群
    getClusters().then(data =>{
      if(data && data.length > 0){
        this.setState({clusters:data});
      }
    })
  }

  showTotal = (total, range) => {
    return `${range[0]} - ${range[1]}   共 ${total} 条`;
  }
  handleInput = (e) => {
    e.preventDefault();
    this.props.form.validateFields((ell, values) => {
      this.setState({ cond: values.cond, cluster: values.cluster });
      this.loadData(1, this.state.row, values.cond, values.cluster);
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ page: 1, row: 10, code: '', cluster: '' })
    this.loadData(1, 10, '', '')
  }
  render() {
    let breadcrumTitle = <Breadcrumb style={{ marginTop: 6 }}>
      <Breadcrumb.Item><Divider type="vertical" style={{ width: "2px", height: "15px", backgroundColor: "#15469a", "verticalAlign": "text-bottom" }} /> 应用管理</Breadcrumb.Item>
    </Breadcrumb>;
    const applicationColums = [{
      title: "名称",
      dataIndex: "name",
      key: "name"
    }, {
      title: "实例个数",
      key: "totalReplicas",
      width:'100px',
      render: (text,record) => {
        return <span>{record.replicas}/{record.totalReplicas}</span>
      }
    }, {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: '100px',
      render: (value, record) => {
        const state = this.state.appState[record.id];
        return <Badge status={constants.APP_STATE_EN[state]} text={constants.APP_STATE_CN[state]} />;
      }
    }, {
      title: "所属集群",
      dataIndex: "clusterName",
      key: "clusterName",
      width: '120px',
    }, {
      title: "所属镜像",
      key: "imageList",
      render: (record) => {
        let viewTxt = record.imageList ? record.imageList.map((item, index) => {
          const image = item.substring(item.lastIndexOf('/') + 1);
          const imageInfo = image.split(":");
          return <p key={index} style={{width: 200, 'word-break':'keep-all',overflow: 'hidden',whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',marginBottom:2,textIndent:'1em'}}> <Link to={'setting/images/' + imageInfo[0] + '?' + item.split('/')[1]}>{imageInfo[0]}</Link><Icon type="tag-o" style={{ fontSize: 12 }} />{imageInfo[1]}</p>
        }) : '--'
        let overTxt = record.imageList ? record.imageList.map((item, index) => {
          const image = item.substring(item.lastIndexOf('/') + 1);
          const imageInfo = image.split(":");
          return <p key={index} >{imageInfo[0]}<Icon type="tag-o" />{imageInfo[1]}</p>
        }) : '--'
        return (
          <Tooltip title={overTxt}>{ viewTxt}</Tooltip>
      )
    }}, {
      title: "运行时间",
      dataIndex: "creationTimestamp",
      key: "creationTimestamp",
      width: '100px',
      render: (Text) => {
        return DataFormate.periodFormate(Text);
      }
    },
    {
      title:'操作',
      dataIndex: "opt",
      key: "opt",
      width: 100,
      render:(text,record)=>{
        const basePath = 'safeapps';
                return (
                    <Link to={`/${basePath}/${record.id}`}>管理</Link>
                )
      }
    }]
    const pagination = {
      total: this.state.total,
      current: this.state.page,
      pageSize: this.state.row,
      showTotal: this.showTotal,
      onChange: (current, pageSize) => {
        this.loadData(current, pageSize, this.state.cond, this.state.cluster)
      },
    }
    const {
      form: { getFieldDecorator },
    } = this.props;
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
      <div style={{ margin: '-24px -24px 0' }}>
         <PageHeaderLayout title={breadcrumTitle}/>
         <Card bordered={false} style={{ margin: 24 }}>
            <Form onSubmit={this.handleInput}>
              <Row gutter={{ md: 4, lg: 12, xl: 18 }} style={{marginLeft:-78}}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="名称">
                    {getFieldDecorator('cond')(<Input placeholder="请输入" style={{ width: "100%" }} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="所属集群">
                    {getFieldDecorator("cluster")(<Select placeholder="请选择" style={{ width: '100%' }}>
                      {this.state.clusters.map(cls =>{
                        return <Option value = {cls.id}>{cls.name}</Option>
                      })}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
            </Button>
                </Col>
              </Row>
            </Form>
            <Table
              pagination={pagination}
              dataSource={this.state.applicationData}
              columns={applicationColums}
            />
          </Card>
      </div>
    );
  }
}


const WrappedAdvancedSearchForm = Form.create()(CceAppList);
export default props => (

  <GlobalHeaderContext.Consumer>
    {context => <WrappedAdvancedSearchForm {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);