import React, { Component} from 'react';
import { getTenant, AddTenant, getTenantById, getApplicationRes} from '../../services/tenants'
import { Card, Button, Row, Col, Table, Message, Form, Input} from 'antd';
import constans from '../../services/constants'
import OrgSelectModal from '../../common/OrgSelectModal'
import constants from '../../services/constants';


const FormItem = Form.Item;
class TenantsListForm extends Component{
  constructor(props){
    super(props);
    this.state={
      data:[],
      visible:false,  //选择机构开关
      loading:false,
    }
  }

  componentDidMount(){
    this.loadData(1,10);
  }
  
  loadData = (page,rows,name)=>{
    this.setState({
      loading:true,
    })
    //默认写死租户code
    let queryParams={
      code:constants.TENANT_CODE[0],
      page:page,
      rows: rows,
      name: name
    }
    getTenant(queryParams).then(data=>{
      let ary = [];
      if (data.contents instanceof Array){
        data.contents.forEach(item=>{
          ary.push(getTenantById(item.id))
        })
      }
      let datas = [];
      if(ary.length>0){
        Promise.all(ary).then(response=>{
          if(response.length>0){
            //根据租户的code去查询租户的CPU内存使用量
            response.forEach((item)=>{
              getApplicationRes(item.tenant_code).then(res=>{
                let params={
                  id:item.id,
                  name:item.name,
                  cpus: res.cpuUsedTotal + '/' + item[constants.QUOTA_CODE[0]],
                  rams: parseFloat(res.memoryUsedTotal) / (1024 * 1024 * 1024).toFixed(1) + '/' + item[constants.QUOTA_CODE[1]] ,
                  apps:'0',
                  users:'0'
                }
                datas.push(params)
                //先暂时这样写，异步加载数据很慢的问题 后面想到更好的办法再来解决
                this.setState({
                  data: datas
                })
              })
            })
          }
        })
      }
      this.setState({
        current: data.pageIndex,
        pageSize: data.pageSize,
        total: data.total,
        loading:false
      })
    }).catch(
      err=>{
        Message.error('获取租户列表失败')
        this.setState({
          loading:false
        })
      }
    )
  }

  handleClick = (item)=>{
    const {history}=this.props;
    history.push({ pathname: `tenants/${item.id}`}) 
  }

  showModal=()=>{
    this.setState({
      visible:true
    })
  }

  addTenants=(org)=>{
    this.setState({
      loading:true,
    })
    let bodyParams={
      code:constants.TENANT_CODE[0],
      id:org.id,
      name:org.name,
    }
    AddTenant(bodyParams).then(data=>{
      if(data){
        this.loadData(1,10);
        this.setState({
          visible: false,
          loading:false
        })
      }
    }).catch(err=>{
      Message.error('新增租户出错')
      this.setState({
        loading: false
      })
    })
  }

  handleChange = (current, pageSize)=>{
    this.loadData(current, pageSize);
  }

  //名称搜索框
  _hanldeChange=(value)=>{
    this.setState({
      name:value
    })
    this.loadData(1, 10, value)
  }

  render(){
    const columns=[
      {
        title:'名称',
        dataIndex:'name'
      },
      {
        title:'CPU',
        dataIndex: constans.QUOTA_CODE[0],
      },
      {
        title: '内存',
        dataIndex: 'rams',
      },
      {
        title: '应用数',
        dataIndex: 'apps',
      },
      {
        title: '用户数',
        dataIndex: 'users',
      },
      {
        title:'操作',
        render:(record,text)=>{
          return <a onClick={e=>this.handleClick(record)}>查看</a>
        }
      }
    ]

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 13 },
      },
    };

    const pagination = {
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: this.state.total,
      onChange: (current, pageSize) => {
        this.handleChange(current, pageSize)
      }
    }
    return (
      <Card style={{margin:24}}>
        <div className="tableList">
        <Form>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout} style={{ marginBottom: 12 }} label="名称">
                  <Input value={this.state.name} onChange={e=>this._hanldeChange(e.target.value)}/>
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formItemLayout}>
                  <OrgSelectModal renderButton={() => { return <Button type='primary'>新建</Button> }} onOk={org => this.addTenants(org)}/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey={(record, index) => index}
          columns={columns}
          dataSource={this.state.data}
          pagination={pagination}
          loading={this.state.loading}
        />
      </Card>
    )
  }
}
const TenantsList=Form.create()(TenantsListForm);
export default TenantsList;