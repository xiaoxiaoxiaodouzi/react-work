import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import PropTypes from 'prop-types';

export default class CallTree extends Component {
    render() {
        const columns = [{
            title: '方法',
            dataIndex: 'method',
            key: 'method'
        }, {
            title: '参数',
            dataIndex: 'args',
            key: 'args'
        }, {
            title: '执行时间',
            dataIndex: 'exec',
            key: 'exec'
        },
        {
            title: '耗时占比',
            dataIndex: 'pre',
            key: 'pre'
        },
        {
            title: '偏移',
            dataIndex: 'delay',
            key: 'delay'
        },
        {
            title: '类',
            dataIndex: 'class',
            key: 'class'
        },
        {
            title: '调用类型',
            dataIndex: 'API',
            key: 'API'
        },
        {
            title: '应用',
            dataIndex: 'client',
            key: 'client'
        }];
        if (this.state.data) {
            return (<Table columns={columns} dataSource={this.state.data} />)
        } else {
            return <div style={{ textAlign: "center" }}><Spin /><span>  链路拓扑数据加载中...</span></div>;
        }

    }
}

CallTree.propTypes = {
    transactionId: PropTypes.string.isRequired
}

CallTree.defaultProps = {
}