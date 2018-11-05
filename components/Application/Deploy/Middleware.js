import React, { PureComponent } from 'react';
import { queryAppAIP,queryAppCCE } from '../../../services/apps';
import DataFormate from '../../../utils/DataFormate';
import { getMiddleware,addMiddleware,deleteMiddleware } from '../../../services/deploy';
import { Button,Table,Modal,Badge,message,Popconfirm,Icon } from 'antd';
import Link from 'react-router-dom/Link';
import {base} from '../../../services/base'
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';
//status={statusMap[text]} text={status[text]} 

const statusMap = { 'succeeded': 'success', 'running': 'processing', 'stop': 'default', 'pending': 'processing', 'exception':'warning','failed':'error' };
const status = { 'succeeded': '运行中', 'running': '启动中', 'stop': '停止', 'pending': '等待', 'exception':'异常','failed':'失败' };
/* 部署页面中间件,props(operationkey,appId)
 * operationkey str 容器名称
 * appId str 应用Id
 */
export default class Middleware extends PureComponent {
  index = 0;
  state = {
    loading:false,
    visibleModal:false,
    appId:this.props.appId,
    modalData:[],
    modalRow:10,
    modalPage:1,
    modalTotal:0,
    selectedRowKeys: [],
    addRowKeys:[],
    loadingModalData:true,
    data : [],
  };
  componentDidMount(){
    //this.getAllMiddleware(1,10);
    this.getMiddlewareByAppId(this.props.appId);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.appId !==this.state.appId){
      this.getMiddlewareByAppId(this.props.appId);
    }
  }
  addMiddlewareWithApp = (appId,middlewareId) =>{
    let params = {
      appId:appId,
      middlewareId:middlewareId,
    }
    addMiddleware(appId,params).then(()=>{
      //设置添加state
      message.success('中间件关联成功');
      this.getMiddlewareByAppId(appId);
    });
  }
  getMiddlewareByAppId = (appId) =>{
    getMiddleware(appId).then(middleware=>{
      let middlewares = [];
      let appIds = [];
      middleware.forEach(element => {
        if (element.code) {
          appIds = [element.code, ...appIds];
        }
        middlewares.push({
          key:element.id,
          name:element.name,
          code:element.code,
          clusterName:element.clusterName,
          createtime:element.createtime,
          status:element.status,
        });
      });
      queryAppCCE({ appIds }).then(app => {
        middlewares.forEach(element=>{
          if(app[element.code]){
            element.imageList = app[element.code].imageList;
            element.reply = app[element.code].replicas+'/'+app[element.code].totalReplicas;
          }
        });
        this.setState({data:middlewares});
      });
    });
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  getAllMiddleware = (page,row)=>{
    let params = {
      page:page,
      rows:row,
      type:'middleware',
      tenant:base.tenant
    }
    queryAppAIP(params).then((data)=>{
      let modalData = [];
      data.contents.forEach(element => {
        modalData.push({
          key:element.id,
          name:element.name,
          cluster:element.clusterName,
          createtime:element.createtime
        });
      });
      this.setState({
        modalData,
        loadingModalData:false,
        modalPage:data.pageIndex,
        modalRow:data.pageSize,
        modalTotal:data.total,
      });
    });
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    const selectedRowKeys = this.state.selectedRowKeys.filter(item => item !==key);
    deleteMiddleware(this.state.appId,key).then(()=>{
      this.setState({ data: newData,selectedRowKeys });
      message.success('中间件取消关联成功');
    });
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  handleModalOk = ()=>{
    const { selectedRowKeys,appId,addRowKeys } = this.state;
    let keys = selectedRowKeys.filter((item)=>{
      let flag = true;
      addRowKeys.forEach(element=>{
        if(element === item){
          flag = false;
        }
      });
      return flag;
    })
    keys.forEach(element=>{
      this.addMiddlewareWithApp(appId,element);
    });
    this.setState({visibleModal:false});
  }
  onOpenModal = ()=>{
    let selectedRowKeys = [];
    this.state.data.forEach(element=>{
      selectedRowKeys.push(element.key);
    });
    this.setState({visibleModal:true,selectedRowKeys,addRowKeys:selectedRowKeys});
    this.getAllMiddleware(1,10);
  }
  render() {
    const Authorized = RenderAuthorized(base.allpermissions);
    const { data,loading,visibleModal,modalData,loadingModalData,modalPage,modalRow,modalTotal,selectedRowKeys } = this.state;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      width:'15%',
    }, {
      title: '集群',
      dataIndex: 'clusterName',
      width:'10%',
    }, {
      title: '所属镜像',
      dataIndex: 'imageList',
      width:'30%',
      render: (value, record) => 
        <span>
          {value ?
            value.map((item, index) => {
              const image = item.split('/');
              const imageInfo = image[2].split(":");
              return <div key={index}><Link to={'/setting/images/'+imageInfo[0]+'?'+image[1]}>{imageInfo[0]}</Link><Icon type="tag-o" style={{fontSize:12}}/>{imageInfo[1]}</div>
            }) : ""
          }
        </span>
    }, {
      title: '副本',
      dataIndex: 'reply',
      width:'10%',
    }, {
      title: '运行时间',
      dataIndex: 'createtime',
      width:'10%',
      render: (value, record) => {
        return DataFormate.periodFormate(value);
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      width:'10%',
       render: (text, record) => {
        return <Badge status={statusMap[text]} text={status[text]} />
      } 
    }, {
      title: '操作',
      dataIndex: 'handle',
      width:'15%',
      render: (text, record) => {
        return (
          <span> 
            <Authorized authority='app_cancelReleationMiddleware' noMatch={<Popconfirm title="是否要将此中间件取消关联？" onConfirm={() => this.remove(record.key)}><a disabled="true">取消关联</a></Popconfirm>}>
            <Popconfirm title="是否要将此中间件取消关联？" onConfirm={() => this.remove(record.key)}>
              <a>取消关联</a>
            </Popconfirm>
            </Authorized>
          </span>
        );
      },
    }];
    const columnsModal = [{
      title: '名称',
      dataIndex: 'name'  
    }, {
      title: '集群',
      dataIndex: 'cluster',
    }, {
      title: '运行时间',
      dataIndex: 'createtime',
      render: (value, record) => {
        return DataFormate.periodFormate(value);
      }
    }];  
    const paginationModal = {
      total: modalTotal,
      current:modalPage,
      pageSize: modalRow,
      onChange:(current, pageSize) => {
          this.getAllMiddleware(current, pageSize)
      },
    };   
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: this.state.addRowKeys.filter(item => item === record.key).length > 0, // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div>
        <div className="card-title">关联中间件</div>
        <Authorized authority='app_releationMiddleware' noMatch={null}>
            <Button style={{marginBottom: 16}} type="primary" 
              onClick={this.onOpenModal}>新增</Button>
        </Authorized>
        <Table
          loading={loading}
          pagination={false}
          dataSource={data} 
          columns={columns} 
          rowKey="id"
        />
        <Modal 
          title="新增中间件"
          visible={visibleModal}
          onOk={this.handleModalOk} 
          onCancel={()=>{this.setState({  visibleModal:false,});}}>
          <Table 
            dataSource={modalData} 
            columns={columnsModal} 
            size='small'
            pagination={paginationModal} 
            rowSelection={rowSelection}
            loading={loadingModalData} />
        </Modal>
      </div>
    );
  }
}