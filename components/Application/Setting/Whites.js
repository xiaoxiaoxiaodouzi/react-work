import React,{PureComponent} from 'react';
import  { Table,Popconfirm ,message,Button} from 'antd';
import {getWhiteUsers,deleteWhiteUsers,putWhiteUsers} from '../../../services/aip'
import {getPagination} from "../../../utils/utils"
import UserSelectModal from "../../../common/UserSelectModal"
class Whites extends PureComponent{
    
    state ={
        whiteResult:{},
        whiteSelects:[],
        page:1,
        rows:10
    } 
    appId = '';
    componentDidMount(){
        if(this.props.appId){
            this.appId = this.props.appId;
            this.getWhiteDatas(this.props.appId,1,10);
        }
    }
    componentDidUpdate(nextProps,nextState){
        if(nextProps.appId && nextProps.appId !== this.appId){
            this.getWhiteDatas(nextProps.appId,1,10);
        }
        return true;
    }
    getWhiteDatas = (appId,page,rows) =>{
        getWhiteUsers(appId,{page:page,rows:rows}).then(data =>{
            if(data){
                this.setState({
                    whiteResult:data,
                    page:data.pageIndex,
                    rows:data.pageSize
                })
                if(data.total > 10){
                    getWhiteUsers(appId).then(responses =>{
                        if(responses){
                            this.setState({
                                whiteSelects:responses
                            })
                        }
                    })
                }else{
                    this.setState({
                        whiteSelects:data.contents
                    })
                }
            }
        })
    }

    putWhiteUsers = (users) =>{
        let userIds = [];
        users.forEach(element => {
            userIds.push(element.id);
        });
        putWhiteUsers(this.props.appId,userIds).then(data=>{
            message.success("设置白名单成功")
            this.getWhiteDatas(this.props.appId,this.state.page,this.state.rows);
        })
    }

    onChange=(page,rows)=>{
        this.setState({
            page:page,
            rows:rows
        })
        this.getWhiteDatas(this.props.appId,page,rows);
    }

    delete = (record) =>{
        deleteWhiteUsers(this.appId,[record.userId]).then(data=>{
            message.success("将用户从白名单中移除成功");
            this.getWhiteDatas(this.props.appId,this.state.page,this.state.rows)
        })
    }

    render(){
        const columns = [
            { title: "姓名", dataIndex: "userName", key: "userName" },
            { title: "角色", dataIndex: "role", key: "role" },
            { title:'状态',dataIndex:"status",key:"status"},
            {title:"操作",key:"opt",render:(text,record )=>{
                return <Popconfirm title={"确认将用户【"+record.userName+"】从白名单中移除?"} onConfirm={()=>{this.delete(record)}}><a>移除</a></Popconfirm>
            }}
        ]
        return (
            <div>
                <UserSelectModal 
                    renderButton={() => { return <Button style={{marginLeft:8}}>导入</Button>}}
                    title={'选择用户'}
                    mark='白名单'
                    description=''
                    selectedUsers={this.state.whiteSelects}
                    //disabledUsers={this.state.systemManager}
                    dataIndex={{ dataIdIndex: 'userId', dataNameIndex: 'userName' }}
                    onOk={this.putWhiteUsers} 
                />
                <Table style={{marginTop:8}} columns={columns} dataSource={this.state.whiteResult?this.state.whiteResult.contents:[]} 
                pagination={getPagination(this.state.whiteResult,this.onChange)}
                />

            </div>
        )
    }
}
export default Whites;