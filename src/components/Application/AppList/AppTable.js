import React from 'react'
import { Badge, Button, Tag, Icon, Card, Table } from 'antd';
import { queryAppAIP, queryAppCCE } from '../../../services/apps';
import Link from 'react-router-dom/Link';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import SearchInput from './SearchInput';
import DataFormate from '../../../utils/DataFormate'
//import {base} from '../../../services/base'
import constants from '../../../services/constants';

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
        tenant:'',
        environment:'',
    }

    componentWillReceiveProps(nextProps){
        if((nextProps.tenant && nextProps.tenant !== this.state.tenant)||(nextProps.environment && nextProps.environment !== this.state.environment)){
            this.setState({tenant:nextProps.tenant,environment:nextProps.environment},()=>{
                this.getApps(); 
            });
        }
        if(nextProps.status && nextProps.status !== this.props.status){
            this.setState({searchParam:{status:nextProps.status}},()=>{
                this.getApps();
            })
        }
    }

    getApps = (page = 1, rows = 10 ) => {
        console.log('getapps');
        let params = {
            name: this.state.searchParam.name,
            tagId: this.state.searchParam.tagId?this.state.searchParam.tagId.toString():'',
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
        queryAppAIP(params).then(data => {
            const aipData = data.contents;
            const newPagination = { ...this.state.pagination };
            newPagination.total = data.total;
            newPagination.current = data.pageIndex;
            newPagination.pageSize = data.pageSize;
            newPagination.totalPage = data.totalPage;
            this.setState({
                pagination: newPagination
            });
            let appIds = []
            aipData.forEach((item, index) => {
                if (item.code) {
                    appIds = [item.code, ...appIds];
                }
            });
            this.setState({
                datas: aipData,
                loading: false
            })
            queryAppCCE({ appIds }).then(data1 => {
                aipData.forEach((item, index) => {
                    if (data1[item.code]) {
                        const cceItem = data1[item.code];
                        delete cceItem.id;
                        delete cceItem.creator;
                        delete cceItem.status;
                        delete cceItem.name;
                        Object.assign(item,cceItem);
                    }
                })
                this.setState({
                    datas: aipData
                })
            })
        }).catch(err=>{
            this.setState({ loading:false,datas:[] })
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
        const newSearchParam={...this.state.searchParam};
        newSearchParam.tagId=id;
        this.setState({
            searchParam:newSearchParam
        },()=>{
            this.getApps(1, 10);
        })
    }
    restFields = () => {
        const searchParam={
            name: "",
            tagId: [],
            status:'',
        };
        this.setState({
            searchParam
        },()=>{
            this.getApps(1, 10);
        })
        this.props.onStatusChange();
    }
    searchChange = (value) => {
        const newSearchParam={...this.state.searchParam};
        
        if(value.name || value.name===''){
            newSearchParam.name=value.name;
        }
        if(value.tagId){
            newSearchParam.tagId=value.tagId;
        }
        if(value.status){
            newSearchParam.status=value.status;
            this.props.onStatusChange(value.status);
        }
        this.setState({
            searchParam:newSearchParam
        })
    }
    render() {
        //表格列
        const columns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => {
                let tags = [];
                const basePath = this.props.type==='middleware'?'middlewares':'apps';
                if (record.tags && record.tags.length > 0) {
                    tags = record.tags.map((item, index) => {
                        if (index === 0) {
                            return (
                                <span key={item.id}>
                                    <Link style={{marginRight:8}} to={`/${basePath}/${record.id}`}>{value}</Link>
                                    <Tag key={item.id}
                                        style={{ marginTop: '5px' }}
                                        onClick={()=>this.tagClick(item.id)}>
                                        {item.name}
                                    </Tag>
                                </span>
                            )
                        }
                        return <Tag key={item.id}
                            style={{ marginTop: '5px' }}
                            onClick={()=>this.tagClick(item.id)}>{item.name}</Tag>
                    })
                    return tags;
                }
                return <Link style={{marginRight:8}} to={`/${basePath}/${record.id}`}>{value}</Link>
            },
        }, {
            title: '集群',
            dataIndex: 'clusterName',
            key: 'clusterName',
            width: '90px',
            align:'center',
            render:(value,record) => value?value:'--'
        }, {
            title: '镜像',
            dataIndex: 'imageList',
            key: 'imageList',
            width: '35%',
            render: (value, record) => (
                <span>{
                    value ?
                        value.map((item, index) => {
                            const image = item.substring(item.lastIndexOf('/')+1);
                            const imageInfo = image.split(":");
                            return <Ellipsis key={index} tooltip lines={1}><Link to={'setting/images/'+imageInfo[0]+'?'+item.split('/')[1]}>{imageInfo[0]}</Link> <Icon type="tag-o" style={{fontSize:12}}/>{imageInfo[1]}</Ellipsis>
                        }) : ""
                }
                </span>
            )
        }, {
            title: '实例个数',
            dataIndex: 'replicas',
            key: 'replicas',
            width: '90px',
            render: (value, record) => (record.replicas===undefined || record.totalReplicas===undefined) ? '--': record.replicas + "/" + record.totalReplicas
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: '90px',
            render: (value, record) =><Badge status={constants.APP_STATE_EN[value]} text={constants.APP_STATE_CN[value]} />
        }, {
            title: '运行时间',
            dataIndex: 'createtime',
            key: 'createtime',
            width: '90px',
            render: (value, record) => {
                return DataFormate.periodFormate(value);
            }
        }, {
            title: '操作',
            key: 'action',
            width: '70px',
            render: (text, record) => {
                const basePath = this.props.type==='middleware'?'middlewares':'apps';
                return (
                    <Link to={`/${basePath}/${record.id}`}>管理</Link>
                )
            }
            
        }];
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
                    <Button type="primary" style={{ marginBottom: 16, marginTop: 24 }} icon="plus">新建</Button>
                </Link>
                <Table columns={columns} dataSource={this.state.datas}
                    rowKey={record => record.id} loading={this.state.loading}
                    pagination={this.state.pagination} onChange={this.onTableChange} />
            </Card>
        )
    }
}

