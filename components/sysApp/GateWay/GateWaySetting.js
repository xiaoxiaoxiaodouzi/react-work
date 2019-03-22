import React,{PureComponent} from 'react';
import { EditorDynamicForm } from 'c2-antd-plus';
import {Card} from 'antd';
import constants from '../../../services/constants';
import '../sysApp.less'

class GateWaySetting extends PureComponent{

    state={
        gatewayInfo:{a:'http://127.0.0.1:8080',b:'http://127.0.0.1:8080',c:'http://127.0.0.1:8080',d:'http://127.0.0.1:8080',doc:'http://127.0.0.1:8080'},
    }

    //修改网关基本信息
    onSubmit = (value) =>{
        let data = Object.assign(JSON.parse(JSON.stringify(this.state.gatewayInfo)),value);
        this.setState({gatewayInfo:data});
    }

    //修改网关文档地址
    onDocSubmit = (value)=>{
        let doc = Object.assign(JSON.parse(JSON.stringify(this.state.gatewayInfo)),value);
        this.setState({gatewayInfo:doc});
    }

    render(){
        const items=[
            {label:'服务网关管理地址',name:'a',editable:true,mode:'read',regExp:constants.reg.host,regExpMessage:'请输入正确格式类似于 http://xxx.xx.xx.xx'},
            {label:'管理凭证',name:'b',editable:true,mode:'read',regExp:constants.reg.host,regExpMessage:'请输入正确格式类似于 http://xxx.xx.xx.xx'},
            {label:'服务网关访问地址(外部)',name:'c',editable:true,mode:'read',regExp:constants.reg.host,regExpMessage:'请输入正确格式类似于 http://xxx.xx.xx.xx'},
            {label:'服务网关访问地址(内部)',name:'d',editable:true,mode:'read',regExp:constants.reg.host,regExpMessage:'请输入正确格式类似于 http://xxx.xx.xx.xx'}
        ];

        const docItems=[
            {label:'服务文档地址',name:'doc',editable:true,mode:'read',regExp:constants.reg.host,regExpMessage:'请输入正确格式类似于 http://xxx.xx.xx.xx'}
        ];

        return (
            <div style={{margin:24}}>
                <Card title="基础信息" style={{marginBottom:24,border:0}}>
                    <EditorDynamicForm items={items} data={this.state.gatewayInfo} colNum={2} className="editForm" onSubmit={this.onSubmit}/>
                </Card>
                <Card title="服务文档设置" style={{border:0}}>
                    <EditorDynamicForm className="editForm" items={docItems} data={this.state.gatewayInfo} colNum={1} onSubmit={this.onDocSubmit}/>
                </Card>
            </div>
        )
    }
}

export default GateWaySetting;