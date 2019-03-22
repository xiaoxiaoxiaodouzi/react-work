import React,{PureComponent} from 'react';
import  { Button,Table,Popconfirm ,message} from 'antd';
import {getBlacks,putBlacks,deleteBlacks} from '../../../services/aip'
import {getPagination} from "../../../utils/utils"
import UserSelectModal from "../../../common/UserSelectModal"

class Blacks extends PureComponent{
    
    state ={
        blackResult:{},
        blackSelects:[],
        page:1,
        rows:10
    } 
    appId = '';
    componentDidMount(){
        if(this.props.appId){
            this.appId = this.props.appId;
            this.getBlackDatas(this.props.appId,1,10);
        }
    }
    componentDidUpdate(nextProps,nextState){
        if(nextProps.appId && nextProps.appId !== this.appId){
            this.getBlackDatas(nextProps.appId,nextState.page,nextState.rows);
        }
        return true;
    }
    getBlackDatas = (appId,page,rows) =>{
        getBlacks(appId,page,rows).then(data =>{
            if(data){
                this.setState({
                    blackResult:data,
                    page:data.pageIndex,
                    rows:data.pageSize
                })

                if(data.total > 10){
                    getBlacks(appId).then(responses =>{
                        if(responses){
                            this.setState({
                                blackSelects:responses
                            })
                        }
                    })
                }else{
                    this.setState({
                        blackSelects:data.contents
                    })
                }
            }
        })
    }

    putBlackUsers = (users) => {
        let userIds = [];
        users.forEach(element => {
            userIds.push(element.id);
        });
        putBlacks(this.props.appId,userIds).then(data => {
            this.getBlackDatas(this.props.appId,1,10);
        })
    }

    onChange=(page,rows)=>{
        this.setState({
            page:page,
            rows:rows
        })
        this.getBlackDatas(this.props.appId,page,rows);
    }

    delete = (record) =>{
        deleteBlacks(this.appId,[record.id]).then(data=>{
            message.success("将用户从黑名单中移除成功");
            this.getBlackDatas(this.props.appId,this.state.page,this.state.rows)
        })
    }

    render(){
        const columns = [
            { title: "姓名", dataIndex: "name", key: "name" },
            { title: "证件号", dataIndex: "certificateNum", key: "certificateNum" },
            // { title: "工号", key: "workno", dataIndex: "workno" },
            {title:"操作",key:"opt",render:(text,record )=>{
                return <Popconfirm title={"确认将用户【"+record.name+"】从黑名单中移除?"} onConfirm={()=>{this.delete(record)}}><a>移除</a></Popconfirm>
            }}
        ]
        return (
            <div style={{border:0}}>
                <UserSelectModal 
                    renderButton={() => { return <Button style={{marginLeft:8}}>导入</Button>}}
                    title={'选择用户'}
                    mark='黑名单'
                    description=''
                    selectedUsers={this.state.blackSelects}
                    //disabledUsers={this.state.systemManager}
                    dataIndex={{ dataIdIndex: 'id', dataNameIndex: 'name' }}
                    onOk={this.putBlackUsers} 
                />
                <Table style={{marginTop:8}} columns={columns} dataSource={this.state.blackResult?this.state.blackResult.contents:[]} 
                pagination={getPagination(this.state.blackResult,this.onChange)}
                />
                
            </div>)
              
    }
}
export default Blacks;