import React, { Component } from "react";
import { Table, Card, Popconfirm,message,Divider,Breadcrumb} from "antd";
import PageHeaderLayout from "./layouts/PageHeaderLayout";
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'
import { base } from '../../services/base';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';

import { 
  queryAllVolumes,
  deleteVolumes,
  recoverVolumes,
  deleteVolumesImmediately,
  queryAppAIP 
} from "../../services/deploy";
import moment from "moment";

let title = <Breadcrumb style={{marginTop:6}}>
<Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 高级设置</Breadcrumb.Item>
<Breadcrumb.Item>存储卷管理</Breadcrumb.Item>
</Breadcrumb>;
class Storage extends Component {
  state = {
    loading: false,
    data: [],
    page:1,
    row:10,
    total:0,
  };
  showTotal =() => `共 ${this.state.total} 条记录  第 ${this.state.page}/${Math.ceil(this.state.total/this.state.row)} 页 `;

  componentDidMount() {
    this.loadData(1,10);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.tenant!==nextProps.tenant){
      this.loadData(1,10);
    }
  }
  loadData = (page,row) => {
    let params = {
      page:page,
      rows:row,
      mountable:false
    }
    this.setState({loading:true});
    queryAllVolumes(params).then(data => {
      let volumeData = data.contents;
      let appIds = [];
      let requests = [];
      volumeData.forEach((item, index) => {
        if(item.boundApp && item.boundApp.appName){
          if(appIds.filter(element=> element === item.boundApp.appName).length === 0){
            appIds.push(item.boundApp.appName);
          }
        }
      });

      appIds.forEach(element=>{
        requests.push(queryAppAIP(element))
      });
      Promise.all(requests).then(values=>{
        let apps = [];
        values.forEach(value=>{
          apps = [...apps,...value];
        })
        volumeData.forEach((item, index) => {
          apps.forEach(app=>{
            if(item.boundApp && item.boundApp.appName === app.code){
              item.appName = app.name;
              item.appId = app.id;
            }
          })
        });
        this.setState({
          data: volumeData,
          page:data.pageIndex,
          row:data.pageSize,
          total:data.total,
          loading: false,
        });
      });
    }).catch(err=>{
      this.setState({loading:false});
    })
  };

  //删除存储卷
  handleDelete=(name)=>{
    deleteVolumes(name).then(data=>{
      message.success('删除存储卷成功')
      this.loadData(1,10);
    });
  }
  recoverVolume = (name)=>{
    recoverVolumes(name).then(data=>{
      message.success('恢复存储卷成功')
      this.loadData(1,10);
    });
  }
  deleteImmediately = (name)=>{
    deleteVolumesImmediately(name).then(data=>{
      message.success('彻底删除存储卷成功')
      this.loadData(1,10);
    });
  }
  renderOpen = () => {
    const Authorized = RenderAuthorized(base.allpermissions);
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        width: "10%"
      },
      {
        title: "路径",
        dataIndex: "path",
        width: "20%"
      },
      {
        title: "挂载应用名称",
        dataIndex: "appName",
        width: "20%"
      },
      {
        title: "状态",
        dataIndex: "status",
        width: "10%",
        render: (text, record) => {
          if(text ==='删除中'){
            const current=new Date().getTime();
            const days = parseInt(record.delTime / 1000 / 3600 / 24 ,10)-parseInt(current / 1000 / 3600 / 24,10) + 7;
            return <span>{text}，<span style={{color:'red'}}>{days+1}</span>天后彻底删除</span>;
          }else{
            return text;
          }
        }
      },
      {
        title: "容量",
        dataIndex: "storage",
        width: "10%"
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        width: "15%",
        render: (text, record) => {
          return moment(text).format("YYYY-MM-DD HH:mm");
        }
      },
      {
        title: "操作",
        width: "15%",
        render: (text, record) => {
          if(record.status === '未挂载'){
            return (
              <Authorized authority={'storage_delete'} noMatch={<Popconfirm title='确认删除' onConfirm={e => {this.handleDelete(record.name)}}><a disabled='true'>删除</a></Popconfirm> }>
                <Popconfirm title='确认删除' onConfirm={e => {this.handleDelete(record.name)}}>
                  <a>删除</a>
                </Popconfirm> 
              </Authorized>
            );
          }else if(record.status === '已挂载' && record.appId){
            return (
              <a onClick={()=> window.location.href = `/#/apps/${record.appId}`}>查看{/* <Link to={`apps/${record.appId}/deploy`}>查看</Link> */}</a>
            );
          }else if(record.status === '删除中'){
            return (
              <span>
                <a onClick={()=> this.recoverVolume(record.name)}>恢复</a>
                <Divider type="vertical" />
                <Popconfirm 
                  title={<div><span>彻底删除将删除该存储卷所有的数据，</span><br/><span>且操作不可恢复，确认删除？</span></div>} 
                  onConfirm={()=> this.deleteImmediately(record.name)} >
                  <a>彻底删除</a>
                </Popconfirm> 
              </span>
            );
          }
        }
      }
    ];
    
    const pagination = {
      total: this.state.total,
      current: this.state.page,
      pageSize: this.state.row,
      showTotal: this.showTotal,
      onChange:(current, pageSize) => {
        this.loadData(current,pageSize)
      },
    }; 
    return (
      <Card>
          <Table
            columns={columns}
            pagination={pagination}
            dataSource={this.state.data}
            loading={this.state.loading}
          />
      </Card>
    );
  };

  render() {
    return (
      <PageHeaderLayout
      title={title}
        content="所有容器挂载的存储卷管理"
      >
        {this.renderOpen()}
      </PageHeaderLayout>
    );
  }
}

export default props=>(
  <GlobalHeaderContext.Consumer>
    {context=><Storage {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);