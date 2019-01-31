import React,{Component} from 'react';
import {Table} from 'antd';
import { getEvents} from '../../../services/cce';

class EventsTable extends Component{
    constructor(props){
        super(props);
        this.state={
            datas:[],
            loading:true
        }
    }

    componentDidMount(){
        this.getData(this.props.appCode);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.appCode !== this.props.appCode){
            this.getData(nextProps.appCode);
        }
    }

    getData = (appCode) =>{
        if(appCode && appCode !== ''){
            getEvents(appCode).then(events => {
                this.setState({datas:events,loading:false});
            }).catch(err => {
                this.setState({loading:false});
            })
        }
    }

    render(){
        let columns = [
            {title:'原因',
            dataIndex:'reason',
            key:'reason',
            width:140,
            render:(text)=>{
                    if(text==="Scheduled"){
                       return "资源分配成功";
                    }else if(text==="Pulling"){
                        return "镜像拉取中";
                    }else if(text==="Pulled"){
                        return "镜像拉取成功";
                    }else if(text==="Created"){
                        return "容器创建成功";
                    }else if(text ==="Started"){
                        return "应用启动成功";
                    }else if(text ==="SuccessfulMountVolume"){
                        return "挂载卷成功";
                    }else if(text ==="Killing"){
                        return "正在进行清除操作";
                    }else if(text ==="FailedCreatePodSandBox"){
                        return "创建pod失败";
                    }else {
                        return text;
                    }

                }
            },           
            {title:'消息',
            dataIndex:'message',
            key:'message'
            },
            {title:'类型',
            dataIndex:'type',
            key:'type',
            width:60,
            },
            {title:'次数',
            dataIndex:'count',
            key:'count',
            width:60,
            },
            {title:'运行时间',
            dataIndex:'lastTime',
            key:'lastTime',
            width:150,
            render:(text,record)=>{
                var datetime = new Date();
                var t=datetime-text;
                var h=0;
                var m=0;
                if(t>=0){
                    h=Math.floor(t/1000/60/60%24);
                    m=Math.floor(t/1000/60%60);
                }
                if(h>0){
                    if(m<2){
                        m=m+1;
                    }
                    return h+"小时"+m+"分钟前";
                }else{
                    if(m<20){
                        m=m+1;
                    }
                    return m+"分钟前";
                }
            }
            }

        ];
        
        return <Table 
                    dataSource={this.state.datas}
                    loading={this.state.loading}
                    columns={columns}
                    pagination={{pageSize:10}}
                />
    }

}

export default EventsTable;