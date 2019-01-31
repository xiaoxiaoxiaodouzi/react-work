import React, { Component } from 'react'
import {Modal,Tabs,Table,message,Button} from 'antd';
import moment from 'moment';
import {resourcesync,previewSync} from '../../../services/aip';
import TreeHelp from '../../../utils/TreeHelp';

const TabPane = Tabs.TabPane;
class EntrancePreview extends Component{

    constructor(props){
        super(props);
        this.state={
            entrypoints:[],
            menus:[],
            loading:true,
            expandedRowKeys:[],
            importLoading:false
        }
    }

    componentDidMount(){
        if(this.props.visible){
            this.loadDatas(this.props.appId);
        }
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.visible){
            this.loadDatas(nextProps.appId);
        }
    }

    loadDatas = (appId) =>{
        previewSync(appId).then(datas=>{
            // datas.menus.push({'appId': "2",
            // 'id': "123",
            // 'name': "用户管理",
            // 'pid': "pL6NaZkWSL2R-iJliSnbcw",
            // 'sn': 2,
            // 'target': "_self",
            // 'url': "/#/users"})
            let treeMenus = TreeHelp.toChildrenStruct(datas.menus);
            this.setState({
                entrypoints:datas.entrypoints,
                menus:treeMenus,
                loading:false,
                expandedRowKeys:datas.menus.filter(d => d.pid === '0'),
            })
        }).catch(err=>{
            this.setState({
                loading:false
            })
        })
    }

    onOk = () =>{
        this.setState({importLoading:true})
        resourcesync(this.props.appId).then(res=>{
            message.success("同步入口数据成功！");
            this.setState({importLoading:false});
            this.props.onCancel();
        }).catch(err =>{
            this.setState({importLoading:false});
        })
    }

    entrypointsView = () =>{
        const columns = [
            {
                title:'名称',
                key:'name',
                dataIndex:'name'
            },
            {
                title:'类型',
                key:'type',
                dataIndex:'type'
            },
            {
                title:'排序号',
                key:'sn',
                dataIndex:'sn'
            },
            {
                title:'URL',
                key:'url',
                dataIndex:'url'
            },
            {
                title:'创建时间',
                key:'createAt',
                dataIndex:'createAt',
                render:(text,record)=>{
                    return moment(text).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        ];

        return <Table rowKey="id"
        dataSource={this.state.entrypoints}
        loading={this.state.loading}
        columns={columns}
        expandedRowKeys={this.state.expandedRowKeys}
        size="small"/>
    }

    menusView = () =>{
        const columns =[ {
            title:'名称',
            key:'name',
            dataIndex:'name'
        },      
        {
            title:'URL',
            key:'url',
            dataIndex:'url'
        }, 
        {
            title:'排序号',
            key:'sn',
            dataIndex:'sn'
        },];
        return <Table rowKey="id"
        dataSource={this.state.menus}
        loading={this.state.loading}
        pagination={{pageSize:8}}
        columns={columns}
        size="small"/>
    }

    render(){
        
        return <Modal
            width={800}
            title='入口数据预览'
            visible={this.props.visible}
            onOk={this.onOk}
            onCancel={this.props.onCancel}
            maskClosable={false}
            destroyOnClose={true}
            footer={[
                        <Button key='cancel' onClick={e=>this.props.onCancel()}>取消</Button>,
                        <Button style={{marginLeft:8}} key='onOk' type='primary' loading={this.state.importLoading} onClick={this.onOk}>确定</Button>
                    ]}
        >
            <Tabs>
                <TabPane tab='入口数据' key='point'>{this.entrypointsView()}</TabPane>
                <TabPane tab='菜单' key='menus'>{this.menusView()}</TabPane>
            </Tabs>
        </Modal>
    }
}

export default EntrancePreview;