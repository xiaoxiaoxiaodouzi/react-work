import React,{Component} from 'react';
import  { Modal,Table, Tabs,message,Button } from "antd";
import constants from '../../../services/constants';
import { importRoles } from '../../../services/aip';
import {downloadTxt} from '../../../utils/utils';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
class ResourcePreviewModal extends Component{

    constructor(props){
        super(props)
        this.state={
            loading:true,
            roles:[],
            recouces:[],
            permissions:[],
            errors:[],
            importLoading:false
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.visible && nextProps.previewData && nextProps.previewData !== this.props.previewData){
            this.filterDatas(nextProps.previewData);
        }
    }

    filterDatas=(previewData)=>{
        let appResPris = previewData.appResPris;//資源
        let rolesData = previewData.roles;//角色
        let roleResPris = previewData.roleResPris;//资源角色权限

        let resources =  appResPris?appResPris.filter(d => d.checkState === 'success'):[];
        let roles = rolesData?rolesData.filter(d => d.checkState === 'success'):[];
        let permissions = [];
        let errors = [];//存放错误数据
        appResPris.forEach(item =>{
            if(item.checkState !== 'success'){
                item.errorType="资源";
                errors.push(item);
            }
        })
       // errors = errors.concat(appResPris?appResPris.filter(d => d.checkState !== 'success'):[]);
        //errors = errors.concat(rolesData?rolesData.filter(d => d.checkState !== 'success'):[]);
        rolesData.forEach(item =>{
            if(item.checkState !== 'success'){
                item.errorType="角色";
                errors.push(item);
            }
        })
        roleResPris.forEach(element => {
            let res = appResPris.filter(d => d.id === element.resourceId);
            let role = rolesData.filter(d => d.id === element.roleId);
            if(element.checkState === 'success'){
                //将资源和角色的id转换为名称
                
                element.resourceName = res[0].name;
                element.roleName = role[0].name;
                element.errorType = '资源权限';
                permissions.push(element);
            }else{
                element.errorType = '资源权限';
                element.name = res[0].name + "-" + role[0].name;
                errors.push(element);
            }
        });

        errors.forEach(element => {//错误数据类型解析
            if(element.checkState === 'error'){
                element.errorDesc = '错误数据';
            }else if(element.checkState === 'exist'){
                element.errorDesc = '数据已存在';
            }

            // if(element.uri){
            //     element.errorType = '资源'
            // }else if(element.resourceId){
            //     element.errorType = '资源权限';
            // }else{
            //     element.errorType = '角色';
            // }
        })

        this.setState({resources,roles,permissions,errors,loading:false});
    }

    importConfirm = () => {
        if(this.state.resources.length > 0 || this.state.roles.length > 0 || this.state.permissions.length > 0){
            confirm({
                title: '确认是否导入?',
                content: '存在' + this.state.errors.length + '条错误数据，请确认是否导入(错误数据将不被导入)！',
                onOk: () => {
                    this.setState({importLoading:true})
                    this.saveData();               
                },
                onCancel: () => {
                    console.log('Cancel');
                },
            });
        }else{
            message.warn('没有可导入的正确数据！');
        }
        
    }

    //导入数据
    saveData = () => {
        importRoles(this.props.appId,{appResPris:this.state.resources,roles:this.state.roles,roleResPris:this.state.permissions}).then(datas => {

            if(datas.importState && datas.importState === 'error'){
                this.filterDatas(datas);
            }else{
                message.success('数据导入成功!');
                this.props.importOk(true);
            }
            this.setState({importLoading:false})
        }).catch(err=>{
            this.setState({importLoading:false})
        })
  
    }

    //将错误数据生成txt文件
    download = () => {
        if(this.state.errors.length >0){
            let errors = JSON.stringify(this.state.errors);
            downloadTxt(errors,'角色资源错误数据');
           
        }else{
            message.warn('没有可下载的错误数据！');
        }
        

    }

    //角色
    rolesView = () =>{
        const columns = [
            {
                title:'名称',
                key:'name',
                dataIndex:'name'
            },
            {
                title:'编码',
                key:'code',
                dataIndex:'code'
            },
            {
                title:'描述',
                key:'desc',
                dataIndex:'desc'
            }
        ];

        return <Table rowKey="id"
        dataSource={this.state.roles}
        loading={this.state.loading}
        pagination={{pageSize:8}}
        columns={columns}
        size="small"/>
    }

    //资源
    resourceView = () =>{
        const columns = [
            {
                title:'名称',
                key:'name',
                dataIndex:'name'
            },
            {
                title:'URL',
                key:'uri',
                dataIndex:'uri'
            },
            {
                title:'编码',
                key:'code',
                dataIndex:'code'
            },
            {
                title:'资源类型',
                key:'type',
                dataIndex:'type',
                render: (value, record) => {
					return constants.functionResource.type[value];
				}
            }
        ];

        return <Table rowKey="id"
        dataSource={this.state.resources}
        loading={this.state.loading}
        pagination={{pageSize:8}}
        columns={columns}
        size="small"/>
    }

    //资源角色权限
    permissionsView = () => {
        const columns = [
            {
                title:'角色名称',
                key:'roleName',
                dataIndex:'roleName'
            },
            {
                title:'资源名称',
                key:'resourceName',
                dataIndex:'resourceName'
            },
            // {
            //     title:'描述',
            //     key:'desc',
            //     dataIndex:'desc'
            // }
        ];

        return <Table rowKey="id"
        dataSource={this.state.permissions}
        loading={this.state.loading}
        pagination={{pageSize:8}}
        columns={columns}
        size="small"/>
    }

    //错误数据
    errorsView = () => {
        const columns = [
            {
                title:'名称',
                key:'name',
                dataIndex:'name'
            },
            {
                title:'类型',
                key:'errorType',
                dataIndex:'errorType'
            },
            {
                title:'描述',
                key:'errorDesc',
                dataIndex:'errorDesc'
            }
        ];

        return <Table rowKey="id"
        dataSource={this.state.errors}
        loading={this.state.loading}
        pagination={{pageSize:8}}
        columns={columns}
        size="small"/>
    }
    /*
     footer={[<Button key='cancel' onClick={e=>this.props.onCancel()}>取消</Button>,
               	            <Button style={{marginLeft:8}} key='onOk' type='primary' onClick={this.importConfirm}>确定</Button>
               	    ]}
    */

    render(){
        return (
            <Modal title="导入资源预览"
                    width={800}
                    visible={this.props.visible}
                    maskClosable={false}
                    destroyOnClose={true}
                    onOk={this.importConfirm}
                    onCancel={this.props.onCancel}
                    footer={[<Button key='downlod' type='primary' onClick={this.download}>下载错误数据</Button>,
                            <Button style={{marginLeft:8}}  key='cancel' onClick={e=>this.props.onCancel()}>取消</Button>,
                            <Button style={{marginLeft:8}} key='onOk' type='primary' loading={this.state.importLoading} onClick={this.importConfirm}>确定</Button>
                    ]}
            >
                <Tabs>
                    <TabPane tab="角色" key="roles">{this.rolesView()}</TabPane>
                    <TabPane tab="资源" key="resources">{this.resourceView()}</TabPane>
                    <TabPane tab="角色资源权限" key="permissions">{this.permissionsView()}</TabPane>
                    <TabPane tab="错误数据" key="errors">{this.errorsView()}</TabPane>
                </Tabs>
            </Modal>
        )
    }
}

export default ResourcePreviewModal;