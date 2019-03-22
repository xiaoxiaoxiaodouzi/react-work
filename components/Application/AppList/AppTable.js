import React from 'react'
import { Badge, Button, Tag, Icon, Card, Table, Tooltip } from 'antd';
import { queryAppAIP } from '../../../services/aip';
import { queryAppCCE } from '../../../services/cce'
import Link from 'react-router-dom/Link';
import SearchInput from './SearchInput';
import DataFormate from '../../../utils/DataFormate'
//import {base} from '../../../services/base'
import constants from '../../../services/constants';
import { base } from '../../../services/base';
import Authorized from '../../../common/Authorized';

export default class AppTable extends React.Component {
    showTotal = () => {
        const { total, current, totalPage } = this.state.pagination;
        return `共 ${total} 条记录  第 ${current}/${totalPage} 页 `;
    }
    appCodes = null;
    state = {
        loading: false,
        datas: [],
        searchParam: {
            name: "",
            tagId: [],
            status: '',
        },
        // searchText: "",//标签搜索字段
        // searchName: "",//应用名搜索字段
        filterDropdownVisible: false,
        filtered: "",
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: this.showTotal,
            total: null,
            pageSize: null,
            current: null,
            totalPage: null,
            allStatus:this.props.allStatus,
        },
        environment: '',
        type:this.props.type,
        
    }

    appStateMap={};

    componentWillReceiveProps(nextProps) {
        if(nextProps.allStatus ){
           this.appStateMap = nextProps.appStateMap;
           this.setState({
            allStatus : nextProps.allStatus
           })
        }

        if ((nextProps.tenant && nextProps.tenant !== this.props.tenant) || (nextProps.environment && nextProps.environment !== this.state.environment) || (nextProps.status && nextProps.status !== this.props.status)) {
            let searchParam = {};
            
            if(nextProps.status){
                searchParam.status = nextProps.allStatus && nextProps.allStatus[ nextProps.status] ?nextProps.status:'';
                //**********根据状态获取code */
                //getAppCodeByStatus(upFirstWord(nextProps.status)).then(response => {
                    let appCodes = nextProps.allStatus && nextProps.allStatus[ nextProps.status]?nextProps.allStatus[ nextProps.status].code:[];
                    this.appCodes = appCodes;
                    this.getApps(nextProps.tenant,1,10,appCodes);            
                //})    
            }else{
                this.getApps(nextProps.tenant);
            }
            this.setState({ environment: nextProps.environment, searchParam: searchParam ,type:nextProps.type});
        }
        
    }
    
    getApps = (tenant,page = 1, rows = 10,codeArr) => {
        let params = {
            name: this.state.searchParam.name?this.state.searchParam.name.trim():'',
            tagId: this.state.searchParam.tagId ? this.state.searchParam.tagId.toString() : '',
        };
        
        //如果类型参数，则获取中间件列表
        if (this.props.type === 'middleware') {
            params.type = this.props.type;
        }
        params.page = page;
        params.rows = rows;
        params.tenant = tenant;
        
        if(codeArr){
            params.code = codeArr;
            if(codeArr.length===0){
                this.setState({
                    datas: [],
                    pagination: {
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: this.showTotal,
                        total: 0,
                        pageSize: 10,
                        current: 1,
                        totalPage: 1
                    },
                })

                return;
            }
        }
        if(base.isAmpAdmin)params.withOutAuthorize = true;
        this.setState({
            loading: true
        })
        queryAppAIP(params,{'AMP-ENV-ID':base.environment}).then(data => {
            const aipData = data.contents;
            const newPagination = { ...this.state.pagination };
            newPagination.total = data.total;
            newPagination.current = data.pageIndex;
            newPagination.pageSize = data.pageSize;
            newPagination.totalPage = data.totalPage;
            
            let appIds = []
            aipData.forEach((item, index) => {
                if (item.code) {
                    appIds = [item.code, ...appIds];
                }
            });
            this.setState({
                datas: aipData,
                loading: false,
                pagination: newPagination
            })
            if(appIds.length>0){
                if(base.configs.passEnabled){
                    queryAppCCE({ appIds }).then(data1 => {
                        aipData.forEach((item, index) => {
                            if (data1[item.code]) {
                                let cceItem = data1[item.code];
                                delete cceItem.id;
                                delete cceItem.creator;
                                delete cceItem.status;
                                delete cceItem.name;
                                Object.assign(item, cceItem);
                            }
                        })
                        this.setState({
                            datas: aipData
                        })
                    })
                }
                
            }
        }).catch(err => {
            this.setState({ loading: false, datas: [] })
        })
    }
    onTableChange = (pagination) => {
        const newPagination = { ...this.state.pagination };
        newPagination.current = pagination.current;
        newPagination.pageSize = pagination.pageSize;
        this.setState({
            pagination: newPagination
        });
        this.getApps(this.props.tenant,pagination.current, pagination.pageSize,this.appCodes);
    }
    handleSearch = () => {
        this.getApps(this.props.tenant,1, 10,this.appCodes);
    }
    tagClick = (id) => {
        const newSearchParam = { ...this.state.searchParam };
        newSearchParam.tagId = id;
        this.setState({
            searchParam: newSearchParam
        }, () => {
            this.getApps(this.props.tenant,1, 10);
        })
    }
    restFields = () => {
        const searchParam = {
            name: "",
            tagId: [],
            status: ''
        };
        this.setState({
            searchParam,
            codes:null
        }, () => {
            this.appCodes = null;
            this.getApps(this.props.tenant,1, 10);
        })
        this.props.onStatusChange();
    }
    searchChange = (value) => {
        const newSearchParam = { ...this.state.searchParam };
        if (value.name || value.name === '') {
            newSearchParam.name = value.name;
        }
        if (value.tagId) {
            newSearchParam.tagId = value.tagId;
        }
        if (value.status) {
            //**********根据状态获取code */
            newSearchParam.status = value.status;
            this.appCodes = this.state.allStatus[value.status].code; 
        }
        this.setState({
            searchParam: newSearchParam
        })
    }
    render() {
        const appTypeRender = (record)=>{
            if(record.type === 'web')return <Tooltip title='Web应用'><Icon type="desktop" style={{paddingRight:'5px'}}/></Tooltip>
            if(record.type === 'app')return <Tooltip title='APP'><Icon type="mobile" style={{paddingRight:'5px'}} /></Tooltip>
            // if(record.type === 'middleware')return <Tooltip title='中间件'><Icon type="setting" /></Tooltip>
        }
        
        //表格列
        let columns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => {
                let tags = [];
                const basePath = this.props.type === 'middleware' ? 'middlewares' : 'apps';
                if (record.tags && record.tags.length > 0) {
                    tags = record.tags.map((item, index) => {
                        if (index === 0) {
                            return (
                                <span key={item.id}>
                                    {appTypeRender(record)}
                                    <Link style={{ marginRight: 8 }} to={`/${basePath}/${record.id}`}>{value}</Link>
                                    <Tag key={item.id}
                                        style={{ marginTop: '5px' }}
                                        onClick={() => this.tagClick(item.id)}>
                                        {item.name}
                                    </Tag>
                                </span>
                            )
                        }
                        return <Tag key={item.id}
                            style={{ marginTop: '5px' }}
                            onClick={() => this.tagClick(item.id)}>{item.name}</Tag>
                    })
                    return tags;
                }
                return (
                    <span>
                    {appTypeRender(record)}
                    <Link style={{ marginRight: 8 }} to={`/${basePath}/${record.id}`}>{value}</Link>
                    </span>
                )
            },
        }, {
            title: '统一认证',
            dataIndex: 'acl',
            key: 'acl',
            width: '100px',
            align:"center",
            render: (value, record) => {
                return record.acl ? <span style={{color:'#1384ec'}}>已启用</span>:<span style={{color:'#b4b4b4'}}>未启用</span>
            }
        }, {
            title: '性能监控',
            dataIndex: 'apm',
            key: 'apm',
            width: '100px',
            align:"center",
            render: (value, record) => {
                return record.apm ? <span style={{color:'#1384ec'}}>已启用</span>:<span style={{color:'#b4b4b4'}}>未启用</span>
            }
        }, {
            title: '部署方式',
            dataIndex: 'deployMode',
            key: 'deployMode',
            width: '100px',
            render: (value, record) => {
                return (
                    record.deployMode === 'k8s' ? 
                    <Tooltip title={
                        <div>
                            <p style={{marginBottom: 0}}>集群：{!record.clusterName && '--'}</p>{!record.clusterName?'':<p style={{marginBottom:2,textIndent:'1em'}}>{record.clusterName }</p>}
                            <p> 镜像：{record.imageList ? record.imageList.map((item, index) => {
                                const image = item.substring(item.lastIndexOf('/') + 1);
                                const imageInfo = image.split(":");
                                return <p key={index} style={{marginBottom:2,textIndent:'1em'}}> <Link style={{color:'yellow'}} to={'setting/images/' + imageInfo[0] + '?' + item.split('/')[1]}>{imageInfo[0]}</Link><Icon type="tag-o" style={{ fontSize: 12 }} />{imageInfo[1]}</p>
                            }) : '--'}</p>
                        </div>} overlayClassName="maxWithNone" overlayStyle={{maxWidth:'none'}}>
                        <span>云部署</span>
                    </Tooltip> : 
                    '外置部署'
                )
            }
        }, {
            title: '实例个数',
            dataIndex: 'replicas',
            key: 'replicas',
            width: '100px',
            render: (value, record) => (record.replicas === undefined || record.totalReplicas === undefined) ? '--' : record.replicas + "/" + record.totalReplicas
        }, {
            title: '状态',
            // dataIndex: 'status',
            // key: 'status',
            width: '100px',
            render: (value, record) => {
                let codeValue = this.appStateMap[record.code];
                let appStatus = codeValue?codeValue.toLowerCase():'unknown';
                let en = constants.APP_STATE_EN[appStatus];  
                
                if(codeValue){
                    let cn = codeValue?this.state.allStatus[codeValue].statusName:'';
                    return <Badge status={en} text={cn} /> 
                }else{
                    return "--"
                }                
            }
        }, {
            title: '运行时间',
            dataIndex: 'createtime',
            key: 'createtime',
            width: '100px',
            render: (value, record) => {
                return DataFormate.periodFormate(value);
            }
        }, {
            title: '操作',
            key: 'action',
            width: '100px',
            render: (text, record) => {
                const basePath = this.props.type === 'middleware' ? 'middlewares' : 'apps';
                return (
                    <Link to={`/${basePath}/${record.id}`}>管理</Link>
                )
            }

        }];

        if(!base.configs.APMEnabled){
            columns.splice(2,1);
        }
        return (
            <Card bordered={false} style={{ margin: 24 }}>
                <SearchInput
                    tenant={this.props.tenant}
                    environment={this.props.environment}
                    handlesearch={this.handleSearch}
                    searchparam={this.state.searchParam}
                    restfields={this.restFields}
                    allStatus={this.state.allStatus}
                    searchchange={this.searchChange} />
                <Authorized authority={this.state.type === "middleware" ?'middleware_add':'app_add'} noMatch={null}>
                    <Link to={{ pathname: '/addapp', search: this.state.type }}>
                        <Button type="primary" style={{ marginBottom: 16}} icon="plus">新建</Button>
                    </Link>
                </Authorized>
                <Table columns={columns} dataSource={this.state.datas}
                    rowKey={record => record.id} loading={this.state.loading}
                    pagination={this.state.pagination} onChange={this.onTableChange} />
            </Card>
        )
    }
}

