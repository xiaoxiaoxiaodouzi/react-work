import React, { Component } from "react";
import {  Modal,Button, Icon, Upload,Table,Tabs,message} from "antd";
// import PreviewData from "./PreviewData";
import {previewNavigations,importNavigations} from '../../services/aip';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const TabPane = Tabs.TabPane;
export default class UploadData extends Component{
    constructor(props){
        super(props);
        this.state={
            name:"导入",
            isBtn:true,
            previewVisible:false, 
            dataLoading:true,
            uploading:false,
            fileList:[],
            functions:[],
            catalogs:[]
        }

        this.previewData={};     

    }

    filterData = (data) =>{

        let navigationCataLogFunctions = data.navigationCataLogFunctions;
        let navigationCataLogs = data.navigationCataLogs;
        this.setState({
            functions:navigationCataLogFunctions,
            catalogs:navigationCataLogs,
        })
        this.previewData = data;
    }

    importData=()=>{
        this.setState({uploading:true})
        importNavigations(this.previewData).then(response => {
            message.success('全局导航数据导入成功！');
            this.setState({uploading:false,previewVisible:false})
            this.props.loadData();
        }).catch(err =>{
            this.setState({uploading:false})
        })
    }
  
    //选择文件
    choiceFile = () => {

        const props = {
            onRemove: (file) => {
                this.setState({ fileList: [] })
            },
            beforeUpload: (file) => {
                this.setState({ fileList: [file] })
                return false;
            },
            onChange:(info) =>{
                if(info.fileList && info.fileList.length > 0){
                    let filedata = new FormData();
                    filedata.append('file', info.fileList[0].originFileObj);
                   
                    this.setState({
                        previewVisible:true,
                         fileList:[]
                    });
                    //预览
                    previewNavigations(filedata).then(data=>{
                        this.filterData(data);
                    })
                }
              
            },
            fileList: this.state.fileList,
            className: 'upload-list-inline',
            showUploadList:false
        }
        return (
            this.state.isBtn ?
            <Upload {...props}>
                    <Button>
                        <Icon type="folder-open" />{this.state.name}
                    </Button>
                 </Upload>         
            :
             this.props.disabled?<Upload {...props}> <div style={{width:95,height:20,margin:0}}>导入</div></Upload>  :"导入"                                         
        );
    }

    transferVisible = (visible,data,flag) => {
        this.setState({previewVisible:visible});
        this.props.transferVisible(visible,data,flag);
        this.setState({ fileList: [] });
    }
    render(){
        const pagination={           
            pageSize: 8,           
        }

        const columnsFun = [
            {
              title: '菜单名称',
              dataIndex: 'name',
              width:100,
            }, {
              title: '图标',
              dataIndex: 'fontIcon',
              width:'60px',
              align:'center',
              render: (text, record) => <Icon type={text} />
            }, {
                title: '所属应用',
                dataIndex: 'app',
                width:'60px',
                align:'center',
                render: (text, record) => {
                    return record.app && record.app.name?record.app.name:'--';
                }
              }, {
              title: '路径',
              dataIndex: 'uri',
              width:150,
              render: (text, record) => {
                return  <Ellipsis tooltip lines={1}>{text}</Ellipsis>
              }
            }
          ];
          const columnsCate = [
            {
              title: '菜单名称',
              dataIndex: 'name',
              width:180,
            }, {
              title: '图标',
              dataIndex: 'fontIcon',
              width:'60px',
              align:'center',
              render: (text, record) => <Icon type={text} />
            }, {
              title: '路径',
              dataIndex: 'url',
              width:150,
              render: (text, record) => {
                return  <Ellipsis tooltip lines={1}>{text}</Ellipsis>
              }
            }
          ];
        return (<span style={this.props.style}>
            {this.choiceFile()}
            <Modal visible={this.state.previewVisible}
            onCancel={()=>{this.setState({previewVisible:false})}}
            onOk={this.importData}
            title='全局导航预览'
            width={800}
            footer={[
                <Button key='cancel' type='cancel' onClick={this.props.onCancel}>取消</Button>,
                <Button  type="primary" onClick={this.importData} loading={this.state.uploading}>导入</Button>
    ]}
            >
                 <Tabs>
                 <TabPane tab="目录" key="job">
                        <Table columns={columnsCate} dataSource={this.state.catalogs} pagination={pagination} size="small"/>
                    </TabPane>
                    <TabPane tab="功能" key="user">
                        <Table columns={columnsFun} dataSource={this.state.functions} pagination={pagination} size="small"/>
                    </TabPane>
                </Tabs>
               
            </Modal>
        </span>)
    }
}
