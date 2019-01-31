import React, { Component } from "react";
import { Table, Card, Popconfirm, message, Divider,Tooltip } from "antd";
import PageHeaderLayout from "./layouts/PageHeaderLayout";
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'
import moment from "moment";
import Authorized from "../../common/Authorized";
import {BreadcrumbTitle} from '../../common/SimpleComponents'
import { queryAppCCE, deleteVolumes, queryAllVolumes, recoverVolumes, deleteVolumesImmediately } from "../../services/cce";

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
        requests.push(queryAppCCE({appIds:element}))
      });
      Promise.all(requests).then(values=>{

        volumeData.forEach((item, index) => {
          if(item.boundApp ){
            values.forEach((key)=>{
              let value = key[item.boundApp.appName];
              if(value){
                item.appName = value.name;
                item.appId = value.id;
              }
              
            })
                        
          }
          
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
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        render:(text)=>{
          return <Tooltip title={text}><div style={{width: 150, 'word-break':'keep-all',overflow: 'hidden',whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'}}>{text}</div></Tooltip>
        }
      },
      {
        title: "路径",
        dataIndex: "path",
        render:(text)=>{
          return <Tooltip title={text}><div style={{width: 150, 'word-break':'keep-all',overflow: 'hidden',whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'}}>{text}</div></Tooltip>
        }
      },
      {
        title: "挂载应用名称",
        dataIndex: "appName",
        render:(text)=>{
          return <Tooltip title={text}><div style={{width: 150, 'word-break':'keep-all',overflow: 'hidden',whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'}}>{text}</div></Tooltip>
        }
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 75,
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
        width: 75
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        width: 120,
        render: (text, record) => {
          return moment(text).format("YYYY-MM-DD");
        }
      },
      {
        title: "操作",
        width: 60,
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
            return <Popconfirm title='确认删除' onConfirm={e => {this.handleDelete(record.name)}}><a disabled='true'>删除</a></Popconfirm>
              // <a onClick={()=> window.location.href = `/#/apps/${record.appId}`}>查看</a>
              
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
    const title = BreadcrumbTitle([{name:'高级设置'},{name:'存储卷管理'}]);
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