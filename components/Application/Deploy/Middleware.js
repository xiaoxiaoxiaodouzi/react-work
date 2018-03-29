import React, { PureComponent } from 'react';
import { queryAppAIP,queryAppCCE } from '../../../services/apps';
import DataFormate from '../../../utils/DataFormate';
import { getMiddleware,addMiddleware,deleteMiddleware } from '../../../services/deploy';
import { Button,Table,Modal,Badge,message,Popconfirm,Icon } from 'antd';
import Link from 'react-router-dom/Link';
import {base} from '../../../services/base'
const confirm = Modal.confirm;
//status={statusMap[text]} text={status[text]} 

const statusMap = [ 'success', 'processing',  'error', 'default' ];
const status = [ '运行中', '启动中', '停止', '等待'];
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
  /* {
  "id": "string",
  "appId": "string",
  "middlewareId": "string"
  } */
  addMiddlewareWithApp = (appId,middlewareId) =>{
    let params = {
      appId:appId,
      middlewareId:middlewareId,
    }
    //console.log("addd",appId,middlewareId);
    addMiddleware(appId,params).then(()=>{
      //设置添加state
      this.getMiddlewareByAppId(appId);
    });
  }
  getMiddlewareByAppId = (appId) =>{
    getMiddleware(appId).then(middleware=>{
      //console.log("middleware app",middleware);
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
        //console.log("middlewares",app);
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
    //console.log('selectedRowKeys',selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  getAllMiddleware = (page,row)=>{
    let params = {
      page:page,
      rows:row,
      type:'middleware'
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
      //console.log("data",data);
      this.setState({
        modalData,
        loadingModalData:false,
        modalPage:data.pageIndex,
        modalRow:data.pageSize,
        modalTotal:data.total,
      });
    });
  }
  showConfirm = (e)=>{
    let index = e.target.getAttribute('data-index');
    confirm({
      title: '是否删除此条记录?',
      onOk: () => {
        //console.log("delete",index);
      },
    });
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    const selectedRowKeys = this.state.selectedRowKeys.filter(item => item !==key);
    //console.log("aaaa",this.state.appId,key);
    deleteMiddleware(this.state.appId,key).then(()=>{
      this.setState({ data: newData,selectedRowKeys });
      message.success('中间件取消关联成功');
    });
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  handleModalOk = ()=>{
    //console.log("handlemodal ok111",this.state.selectedRowKeys);
    const { selectedRowKeys,appId } = this.state;
    selectedRowKeys.forEach(element=>{
      this.addMiddlewareWithApp(appId,element);
    });
    this.setState({visibleModal:false});
  }
  onOpenModal = ()=>{
    //console.log("open",this.state.selectedRowKeys.join(",").indexOf("sJWibHYiaISLC0vRO8yEoOcg")>-1);
    let selectedRowKeys = [];
    this.state.data.forEach(element=>{
      selectedRowKeys.push(element.key);
    });
    this.setState({visibleModal:true,selectedRowKeys,addRowKeys:selectedRowKeys});
    this.getAllMiddleware(1,10);
  }
  render() {
    const { data,loading,visibleModal,modalData,loadingModalData,modalPage,modalRow,modalTotal,selectedRowKeys } = this.state;
    const columns = [{
      title: '中间件名称',
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
              const image = item.substring(item.lastIndexOf('/')+1);
              const imageInfo = image.split(":");
              return <div key={index}><Link to={'/setting/images/'+imageInfo[0]+'&tenant='+base.tenant}>{imageInfo[0]}</Link><Icon type="tag-o" style={{fontSize:12}}/>{imageInfo[1]}</div>
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
        return <Badge status={statusMap[text]} text={status[text]} />;
      } 
    }, {
      title: '操作',
      dataIndex: 'handle',
      width:'15%',
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="是否要将此中间件取消关联？" onConfirm={() => this.remove(record.key)}>
              <a>取消关联</a>
            </Popconfirm>
          </span>
        );
      },
    }];
    const columnsModal = [{
      title: '中间件名称',
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
        disabled: this.state.addRowKeys.join(",").indexOf(record.key)>-1, // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div>
        <div className="title111">关联中间件</div>
        <Button style={{marginBottom: 16}} type="primary" 
          onClick={this.onOpenModal}>新增</Button>
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
            pagination={paginationModal} 
            rowSelection={rowSelection}
            loading={loadingModalData} />
        </Modal>
        {/* <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newRecord}
          icon="plus"
        >
          添加关联中间件
        </Button> */}
      </div>
    );
  }
}