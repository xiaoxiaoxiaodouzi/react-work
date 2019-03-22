import React,{useState,useEffect} from 'react';
import {Table} from 'antd';

export default function RegistryList(props){
    let [data,setData] = useState(null);

    useEffect(()=>{
        if(data===null){
            setData([{ip:'127.0.0.1',port:'8080',url:'http://172.16.25.154:1111/eureka',status:'可用',startDate:'2018-08-01 15:00:35',runTime:'1天20小时30分'}])

        }
    },[props.params])

    const columns =[
        {title:'IP',key:'ip',dataIndex:'ip'},
        {title:'端口',key:'port',dataIndex:'port'},
        {title:'地址',key:'url',dataIndex:'url'},
        {title:'状态',key:'status',dataIndex:'status'},
        {title:'启动时间',key:'startDate',dataIndex:'startDate'},
        {title:'持续运行时间',key:'runTime',dataIndex:'runTime'}
    ]
    return (
        <div>
            <div className="card-title">注册中心副本</div>
            <Table columns={columns} dataSource={data||[]} pagination={false}/>
        </div>
    )
}