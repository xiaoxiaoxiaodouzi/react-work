import React,{ Fragment } from 'react';
import { Modal,Table,Badge } from 'antd';
import { queryEnvs } from '../../../services/deploy';
const confirm = Modal.confirm;

const sourceList = ['自定义','系统注入','中间件']; //环境变量来源 0:自定义,1:系统注入,2:中间件
const statusList = {
  default:'新增',
  processing:'修改',
  error:'删除',
}
const statusMap = {
  add:'default',
  update:'processing',
  delete:'error'
}
//弹窗显示环境变量变更信息，确认是否修改其他模块变更并重启应用
export default function showConfirmModal(nextOperation,cancelOperation,args){
  const { appCode,containerName } = args; 
  queryEnvs(appCode,containerName).then((data)=>{
    let newData = [];
    if(data){
      newData = data.filter(element => element.operateWay !=='effect');
    }
    const columns = [{
      title: '环境变量',
      dataIndex: 'key',
      width:'20%',
      render: (value, record) => {
        return record.key;
      }  
    }, {
      title: '变更类型',
      dataIndex: 'operateWay',
      width:'15%',
      render: (value, record) => {
        return <Badge status={statusMap[record.operateWay]} text={statusList[statusMap[record.operateWay]]}/>
      }
    }, {
      title: '来源',
      dataIndex: 'source',
      width:'15%',
      render: (value, record) => {
        return sourceList[record.source];
      }
    },{
      title: '变更内容',
      dataIndex: 'content',
      width:'50%',
      render: (value, record) => {
        if(record.operateWay ==='add'){  //新建
          return '新值：'+record.value;
        }else if(record.operateWay ==='update'){
          return (
            <div>
              <span>旧值：{record.oldValue}</span><br/>
              <span>新值：{record.value}</span>
            </div>
          )
        }else if(record.operateWay ==='delete'){
          return '旧值：'+record.oldValue;
        }
      }
    }];  
    const content = (
      <Fragment>
        <span style={{color:'red'}}>应用环境变量发生变更</span><span>，是否确认并重启应用?</span>
        <Table 
          style={{marginTop:16}}
          dataSource={newData} 
          columns={columns}
          pagination={false}
          scroll={{ y: 360 }}
        />
      </Fragment>
    );
    if(newData.length){
      confirm({
        title: '应用重启确认',
        content: content,
        width:1000,
        onOk() {
          nextOperation();
        },
        onCancel() {
          cancelOperation();
        },
      });
    }else{
      confirm({
        title: '修改该属性会导致应用重启，是否重启应用?',
        onOk() {
          nextOperation();
        },
        onCancel() {
          cancelOperation();
        },
      });
    }
  });
}