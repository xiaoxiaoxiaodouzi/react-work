import React from 'react'
import { Badge, Button, Tag, Icon, Card, Table, Tooltip } from 'antd';
import { queryAppAIP, queryAppCCE } from '../../../services/apps';
import Link from 'react-router-dom/Link';
import SearchInput from './SearchInput';
import DataFormate from '../../../utils/DataFormate'
//import {base} from '../../../services/base'
import constants from '../../../services/constants';
import { base } from '../../../services/base';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';

export default class AppTable extends React.Component {
    showTotal = () => {
        const { total, current, totalPage } = this.state.pagination;
        return `共 ${total} 条记录  第 ${current}/${totalPage} 页 `;
    }
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
            totalPage: null
        },
        tenant: '',
        environment: '',
    }
    // componentDidMount() {
        //     this.setState({ tenant: this.props.tenant, environment: this.props.environment }, () => {
            //         this.getApps();
            //     });
            // }
            componentWillReceiveProps(nextProps) {
                if ((nextProps.tenant && nextProps.tenant !== this.state.tenant) || (nextProps.environment && nextProps.environment !== this.state.environment) || (nextProps.status && nextProps.status !== this.props.status)) {
                    let searchParam = {};
                    if(nextProps.status)searchParam.status = nextProps.status;
                    this.setState({ tenant: nextProps.tenant, environment: nextProps.environment, searchParam: searchParam }, () => {
                        this.getApps();
                    });
                }
                
            }
            
            getApps = (page = 1, rows = 10) => {
                let params = {
                    name: this.state.searchParam.name?this.state.searchParam.name.trim():'',
                    tagId: this.state.searchParam.tagId ? this.state.searchParam.tagId.toString() : '',
                    status: this.state.searchParam.status,
                };
                
                //如果类型参数，则获取中间件列表
                if (this.props.type) {
                    params.type = this.props.type;
                }
                params.page = page;
                params.rows = rows;
                params.tenant = this.state.tenant;
                this.setState({
                    loading: true
                })
                if(base.isAdmin)params.withOutAuthorize = true;
                queryAppAIP(params).then(data => {
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
        this.getApps(pagination.current, pagination.pageSize);
    }
    handleSearch = () => {
        this.getApps(1, 10);
    }
    tagClick = (id) => {
        const newSearchParam = { ...this.state.searchParam };
        newSearchParam.tagId = id;
        this.setState({
            searchParam: newSearchParam
        }, () => {
            this.getApps(1, 10);
        })
    }
    restFields = () => {
        const searchParam = {
            name: "",
            tagId: [],
            status: '',
        };
        this.setState({
            searchParam
        }, () => {
            this.getApps(1, 10);
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
            newSearchParam.status = value.status;
            this.props.onStatusChange(value.status);
        }
        this.setState({
            searchParam: newSearchParam
        })
    }
    
    
    render() {
        const Authorized = RenderAuthorized(base.allpermissions);

        const appTypeRender = (record)=>{
            if(record.type === 'web')return <Tooltip title='Web应用'><Icon type="desktop" style={{paddingRight:'5px'}}/></Tooltip>
            if(record.type === 'app')return <Tooltip title='APP'><Icon type="mobile" style={{paddingRight:'5px'}} /></Tooltip>
            // if(record.type === 'middleware')return <Tooltip title='中间件'><Icon type="setting" /></Tooltip>
        }
        
        //表格列
        const columns = [{
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
                    <Tooltip title={
                        <div>
                            <p style={{marginBottom: 0}}>集群：{!record.clusterName && '--'}</p>{!record.clusterName?'':<p style={{marginBottom:2,textIndent:'1em'}}>{record.clusterName }</p>}
                            <p> 镜像：{record.imageList ? record.imageList.map((item, index) => {
                                const image = item.substring(item.lastIndexOf('/') + 1);
                                const imageInfo = image.split(":");
                                return <p key={index} style={{marginBottom:2,textIndent:'1em'}}> <Link style={{color:'yellow'}} to={'setting/images/' + imageInfo[0] + '?' + item.split('/')[1]}>{imageInfo[0]}</Link><Icon type="tag-o" style={{ fontSize: 12 }} />{imageInfo[1]}</p>
                            }) : '--'}</p>
                        </div>} overlayClassName="maxWithNone" overlayStyle={{maxWidth:'none'}}>
                        <span>{record.deployMode === 'k8s' ? '云部署' : '外置部署'}</span>
                    </Tooltip>)
            }
        }, {
            title: '实例个数',
            dataIndex: 'replicas',
            key: 'replicas',
            width: '100px',
            render: (value, record) => (record.replicas === undefined || record.totalReplicas === undefined) ? '--' : record.replicas + "/" + record.totalReplicas
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: '100px',
            render: (value, record) => <Badge status={constants.APP_STATE_EN[value]} text={constants.APP_STATE_CN[value]} />
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
       // console.log(base.allpermissions)
        return (
            <Card bordered={false} style={{ margin: 24 }}
            >
                {/* <Row style={{
                    fontSize: '16px', fontWeight: 500,
                    marginBottom: '24px', color: 'rgba(0, 0, 0, 0.85)'
                }}>
                    <Col span={6}>应用列表</Col>
                    <Col span={6} offset={12}>
                        <Search placeholder="请输入" onBlur={e => this.onSearchName(e.target.value)} onSearch={value => this.onSearchName(value)} />
                    </Col>
                </Row> */}
                <SearchInput
                    tenant={this.props.tenant}
                    environment={this.props.environment}
                    handlesearch={this.handleSearch}
                    searchparam={this.state.searchParam}
                    restfields={this.restFields}
                    searchchange={this.searchChange} />
                <Link to={{ pathname: '/addapp', search: this.props.type }}>

                <Authorized authority={this.props.type?'middleware_add':'app_add'} noMatch={null}>
                    <Button type="primary" style={{ marginBottom: 16, marginTop: 24 }} icon="plus">新建</Button>
                </Authorized>

                </Link>
                <Table columns={columns} dataSource={this.state.datas}
                    rowKey={record => record.id} loading={this.state.loading}
                    pagination={this.state.pagination} onChange={this.onTableChange} />
            </Card>
        )
    }
}

