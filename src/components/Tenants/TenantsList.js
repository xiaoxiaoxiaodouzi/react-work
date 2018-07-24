import React, { Component} from 'react';
import { getTenant, AddTenant, getTenantById, getApplicationRes,getTenantApps,getTenentUsercount} from '../../services/tenants'
import { Card, Button, Row, Col, Table, Form, Input} from 'antd';
// import OrgSelectModal from '../../common/OrgSelectModal'
import constants from '../../services/constants';
import AddTenantModal from './AddTenantModal';

const FormItem = Form.Item;
class TenantsListForm extends Component{
  constructor(props){
    super(props);
    this.state={
      // data:[],
      visible:false,  //选择机构开关
      loading:true,
      addVisible:false,
      tenantCodes : []
    }
  }
  
  componentDidMount(){
    this.loadData(1,1000);
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
      let tenants=[];
      if (data.contents instanceof Array){
        data.contents.forEach(item=>{
          //过滤掉没有tenent_type的数据
          if(item.tenant_type && item.tenant_code){
            tenants.push(item)
            ary.push(getTenantById(item.id));
            this.state.tenantCodes.push(item.tenant_code);
          }
        })
        this.setState({tenantCodes:this.state.tenantCodes});
      }
      if(ary.length>0){
        Promise.all(ary).then(response=>{
        if(response.length>0){
            //根据租户的code去查询租户的CPU内存使用量
            response.forEach((item)=>{
              let datas = [];
              getApplicationRes(item.tenant_code).then(res=>{
                getTenantApps({tenant:item.tenant_code}).then(apps=>{
                  getTenentUsercount(item.id).then(users=>{
                    let params={
                      id:item.id,
                      name:item.name,
                      cpus: res.cpuUsedTotal + '/' + item[constants.QUOTA_CODE[0]]?item[constants.QUOTA_CODE[0]]:item[constants.QUOTA_CODE[0]]===0?0:'--',
                      rams: parseFloat(res.memoryUsedTotal) / (1024 * 1024 * 1024).toFixed(1) + '/' + item[constants.QUOTA_CODE[1]]?item[constants.QUOTA_CODE[1]]:item[constants.QUOTA_CODE[1]]===0?0:'--' ,
                      apps:apps,
                      users:users
                    }
                    this.state.data.forEach(d=>{
                      if(d.id===params.id)datas.push(params);
                      else datas.push(d);
                    });
                    this.setState({
                      data: datas
                    })
                  })
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
        data: tenants,
        loading:false
      })
    })
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
        this.loadData(1,1000);
        this.setState({
          visible: false,
          loading:false
        })
    }).catch(err=>{ 
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
    this.loadData(1, 1000, value)
  }

    //弹出新建租户弹窗
    _buttonOnclick=()=>{
      this.setState({
        addVisible:true
      });
    }
  //新建租户弹窗回调函数
  transferAddVisible=(visible,data,flag)=>{
    this.loadData(1,1000);
    this.setState({
      addVisible:visible
    });
  }

  render(){
    const columns=[
      {
        title:'名称',
        dataIndex:'name'
      },
      {
        title:'CPU(核)',
        dataIndex: constants.QUOTA_CODE[0],
      },
      {
        title: '内存(GB)',
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

    // const pagination = {
    //   current: this.state.current,
    //   pageSize: this.state.pageSize,
    //   total: this.state.total,
    //   onChange: (current, pageSize) => {
    //     this.handleChange(current, pageSize)
    //   }
    // }
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
                {/* <FormItem {...formItemLayout}>
                  <OrgSelectModal renderButton={() => { return <Button type='primary'>新建</Button> }} onOk={org => this.addTenants(org)} checkableTopOrg={false} checkableCategoryOrg={false}/>
                </FormItem> */}
                 <Button type='primary' onClick={this._buttonOnclick}>新建</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey={(record, index) => index}
          columns={columns}
          dataSource={this.state.data}
          loading={this.state.loading}
        />
         <AddTenantModal visible = {this.state.addVisible} 
      tenantCodes = {this.state.tenantCodes} 
      onCancle={e=>{this.setState({addVisible:false})}}
      transferVisible={(visible,data,flag) => this.transferAddVisible(visible,data,flag)}/>
      </Card>
      
    )
  }
}
const TenantsList=Form.create()(TenantsListForm);
export default TenantsList;