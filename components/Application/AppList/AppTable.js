import React from 'react'
import { Badge, Button, Tag, Icon, Card, Table } from 'antd';
import { queryAppAIP, queryAppCCE } from '../../../services/apps';
import Link from 'react-router-dom/Link';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import SearchInput from './SearchInput';
import DataFormate from '../../../utils/DataFormate'
import {base} from '../../../services/base'

//等待(pending),运行中(succeeded),停止(stop),失败(failed),启动中(running),异常(exception)")
/* const statusMap = [
    { key:'pending',status:'processing',text:'等待' },
    { key:'succeeded',status:'success',text:'运行中' },
    { key:'stop',status:'default',text:'停止' },
    { key:'failed',status:'error',text:'失败' },
    { key:'running',status:'processing',text:'启动中' },
    { key:'exception',status:'warning',text:'异常' },
] */

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
            tagId: "",
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
        tenant:base.tenant,
        environment:base.environment
    }

    componentWillReceiveProps(nextProps){
        if((nextProps.tenant && nextProps.tenant !== this.state.tenant)||(nextProps.environment && nextProps.environment !== this.state.environment)){
            this.setState({tenant:base.tenant,environment:base.environment});
            //this.getApps();
            if(nextProps.status && nextProps.status !== this.props.status){
                this.setState({searchParam:{status:nextProps.status}},()=>{
                    this.getApps();
                })
            }else{
                this.getApps(); 
            }
        }
    }

    componentDidMount() {
        this.getApps();
    }

    getApps = (page = 1, rows = 10, params = this.state.searchParam) => {
        //如果类型参数，则获取中间件列表
        if (this.props.type) {
            params.type = this.props.type;
        }

        params.page = page;
        params.rows = rows;
        params.tenant = base.tenant;
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
            queryAppCCE({ appIds }).then(data => {
                aipData.forEach((item, index) => {
                    if (data[item.code]) {
                        const cceItem = data[item.code];
                        delete cceItem.id;
                        delete cceItem.creator;
                        delete cceItem.status;
                        Object.assign(item, cceItem);
                    }
                })
                this.setState({
                    datas: aipData
                })
            })
        })
    }
    onTableChange = (pagination, filters, sorter) => {
        const newPagination = { ...this.state.pagination };
        newPagination.current = pagination.current;
        newPagination.pageSize = pagination.pageSize;
        this.setState({
            pagination: newPagination
        });
        this.getApps(pagination.current, pagination.pageSize, this.state.searchParam);
    }
    handleSearch = () => {
        this.getApps(1, 10, this.state.searchParam);
    }
    tagClick = (id) => {
        const newSearchParam={...this.state.searchParam};
        newSearchParam.tagId=id;
        this.setState({
            searchParam:newSearchParam
        })
        this.getApps(1, 10, newSearchParam);
    }
    restFields = () => {
        const searchParam={
            name: "",
            tagId: "",
            status:'',
        };
        this.setState({
            searchParam
        })
        this.getApps(1, 10, searchParam);
    }
    searchChange = (value) => {
        const newSearchParam={...this.state.searchParam};
        if(value.name){
            newSearchParam.name=value.name;
        }
        if(value.tagId){
            newSearchParam.tagId=value.tagId;
        }
        if(value.status){
            newSearchParam.status=value.status;
        }
        this.setState({
            searchParam:newSearchParam
        })
    }
    render() {
        const statusMap = { 'succeeded': 'success', 'running': 'processing', 'stop': 'default', 'pending': 'processing', 'exception':'warning','failed':'error' };
        const status = { 'succeeded': '运行中', 'running': '启动中', 'stop': '停止', 'pending': '等待', 'exception':'异常','failed':'失败' };
         
        //表格列
        const columns = [{
            title: '应用名',
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => {
                let tags = [];
                if (record.tags && record.tags.length > 0) {
                    tags = record.tags.map((item, index) => {
                        if (index === 0) {
                            return <span key={item.id}>
                                {value}&nbsp;&nbsp;<Tag key={item.id}
                                    style={{ marginTop: '5px' }}
                                    onClick={()=>this.tagClick(item.id)}>
                                    {item.name}</Tag>
                            </span>
                        }
                        return <Tag key={item.id}
                            style={{ marginTop: '5px' }}
                            onClick={()=>this.tagClick(item.id)}>{item.name}</Tag>
                    })
                    return tags;
                }
                return value
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
                            return <Ellipsis tooltip lines={1}><Link to={'setting/images/'+imageInfo[0]+'?'+item.split('/')[1]}>{imageInfo[0]}</Link> <Icon type="tag-o" style={{fontSize:12}}/>{imageInfo[1]}</Ellipsis>
                        }) : ""
                }
                </span>
            )
        }, {
            title: '实例个数',
            dataIndex: 'replicas',
            key: 'replicas',
            width: '90px',
            render: (value, record) => value !== undefined ? record.replicas + "/" + record.totalReplicas:'未知'
        }, {
            title: '应用状态',
            dataIndex: 'status',
            key: 'status',
            width: '90px',
            render: (value, record) =><Badge status={statusMap[value]} text={status[value]} />
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
                    <span>
                        <Link to={`/${basePath}/${record.id}`}>管理</Link>
                    </span>
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

