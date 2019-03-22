import React,{useState,useEffect} from 'react';
import {Spin,Card,Divider} from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import moment from 'moment';
import RegistryList from './RegistryList';
import AppInstance from './AppInstance'

const { Description } = DescriptionList;

export default function SpringCloudCard(props){

    let [loading,setLoading] = useState(false);
    let [data,setData] = useState(null);

    useEffect(()=>{
        if(data === null){
            setLoading(true);
            setData({type:'Netflix Eureka',env:'test',datacenter:'default',sysdate:moment().format(),
        startDate:moment().format(),runTime:'2小时40分',totalMemory:'438MB',memory:'154MB(35%)'});
            setLoading(false);
        }
    },[props.params]);

    return (
        <Spin spinning={loading}>
            <Card border={false} style={{margin:24}}>
                <DescriptionList size="large" title="系统信息">
                    <Description term="类型">
                        {data===null?'':data.type}
                    </Description>
                    <Description term="环境">
                        {data===null?'':data.env}
                    </Description>
                    <Description term="数据中心">
                        {data===null?'':data.datacenter}
                    </Description>
                    <Description term="系统时间">
                        {data===null?'':data.sysdate}
                    </Description>
                    <Description term="启动时间">
                        {data===null?'':data.startDate}
                    </Description>
                    <Description term="运行时间">
                        {data===null?'':data.runTime}
                    </Description>
                    <Description term="总内存(最新)">
                        {data===null?'':data.totalMemory}
                    </Description>
                    <Description term="已用内存(最新)">
                        {data===null?'':data.memory}
                    </Description>
                </DescriptionList>
                <Divider style={{ marginBottom: 32, marginTop: 32 }} />
                <RegistryList params={props.params}/>
                <Divider style={{ marginBottom: 32, marginTop: 32 }} />
                <AppInstance params={props.params}/>
            </Card>

        </Spin>
    )
}