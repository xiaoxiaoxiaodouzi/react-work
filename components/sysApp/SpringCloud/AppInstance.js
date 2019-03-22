import React,{useState,useEffect} from 'react';
import {Table,Badge,Tooltip } from 'antd';
import {getPagination} from '../../../utils/utils'

export default function AppInstance(props){
    let [data,setData] = useState(null);

    useEffect(()=>{
        if(data===null){
            setData([{name:'应用1',instance:'实例1',ip:'127.0.0.1',port:'8000',status:'运行中',safeport:'1125',registeDate:'2018-08-01 18:50:42',refreshTime:'2018-08-01 19:26:41'}])
        }
    },[props.params])

    const columns =[
        {title:'应用名',key:'name',dataIndex:'name'},
        {title:'实例',key:'instance',dataIndex:'instance'},
        {title:'IP',key:'ip',dataIndex:'ip'},
        {title:'状态',key:'status',dataIndex:'status',render:(text,record,index)=>{
            return <Badge status="success" text={record.status}></Badge>
        }},
        {title:'端口',key:'port',dataIndex:'port',render:(text,record,index)=>{
            return <Tooltip title="启用"><Badge status="success" text={record.port}></Badge></Tooltip>
        }},
        {title:'安全端口',key:'safeport',dataIndex:'safeport',render:(text,record,index)=>{
            return <Tooltip title="未启用"><Badge status="error" text={record.port}></Badge></Tooltip>
        }},
        {title:'注册时间',key:'registeDate',dataIndex:'registeDate'},
        {title:'最近刷新时间',key:'refreshTime',dataIndex:'refreshTime'}
    ]

    const pagination = getPagination({},(current,pageSize)=>{
        this.loadData(undefined,current,pageSize);
      })
    return (
        <div>
            <div className="card-title">应用实例</div>
            <Table columns={columns} dataSource={data||[]} pagination={pagination}/>
        </div>
    )
}