import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import Exception from 'ant-design-pro/lib/Exception';

import './vis.min.css';

import { getApplicationTopo,getTransactionLink } from '../../../services/dashApi';

export default class ApplicationTopo extends PureComponent {
    constructor(props) {
        super(props);
        if (props.height) {
            props.options.height = props.height;
        }
        if (props.sortMethod) {
            props.options.layout.hierarchical.sortMethod = props.sortMethod;
        }

        props.events.showPopup = this.showPopup;
        props.events.hidePopup = this.hidePopup;
        this.state = { loading: true };
    }

    componentDidMount() {
        if (this.props.appCode || this.props.traceId) {
            this.loadData(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.appCode !== nextProps.appCode
            || this.props.traceId !== nextProps.traceId
            || this.props.from !== nextProps.from
            || this.props.to !== nextProps.to) {
            this.loadData(nextProps);
        }

    }

    render() {
        if (this.state.loading) {
            const height = this.props.options.height;
            return <div style={{ textAlign: "center", height: height, lineHeight: height }}><Spin /><span>  链路拓扑数据加载中...</span></div>;
        } if (this.state.error) {
            console.error("获取性能监控数据时发生了错误" + this.state.error.message, this.state.error);
            return <Exception title="错误" desc="获取性能监控数据时发生了错误，请联系系统管理员处理" img="images/exception/500.svg" actions={<div />} />
        } else if (this.state.data && this.state.data.nodes.length > 0) {
            return <Graph graph={this.state.data} options={this.props.options} events={this.props.events} getNetwork={network => this.setState({ network })} />;
        } else {
            return <Exception title="无数据" desc="没有获取到性能监控数据" img="images/exception/404.svg" actions={<div />} />
        }
    }

    loadData = (params) => {
        if (!this.state.loading) {
            this.setState({ loading: true });
        }
        if(params.appCode){
            this.getAppTopo(params);
        }else if(params.traceId){
            this.getTraceTopo(params.traceId);
        }
        
    }
    //根据应用Code查询topo数据
    getAppTopo = (params)=>{
        getApplicationTopo(params).then(res => {
            if (res.exception) {
                throw new Error(res.exception.message);
            } else {
                const data = this.getTopoData(res.nodeDataArray,res.linkDataArray);
                this.setState({ loading: false, error: null, data: data });
            }
        }).catch(error => {
            this.setState({ loading: false, error: error });
        });
    }
    //根据事务ID查询topo
    getTraceTopo = (traceId)=>{
        getTransactionLink(traceId).then(res => {
            if (res.exception) {
                throw new Error(res.exception.message);
            } else {
                const data = this.getTopoData(res.nodeDataArray,res.linkDataArray);
                this.setState({ loading: false, error: null, data: data });
            }
        }).catch(error => {
            this.setState({ loading: false, error: error });
        });
    }

    getTopoData = (nodeData=[],linkData=[])=>{
        let newData = { nodes: [], edges: [] }
        nodeData.forEach(node => {
            node.id = node.key;
            node.label = node.applicationName;
            node.title = `<span>主机类型：${node.category}</span>`;
            newData.nodes.push(this.props.nodeFormatter(node, this.props.appCode));
        });
        linkData.forEach(link => {
            link.source = link.from;
            link.target = link.to;
            link.id = link.key;
            let title = '';
            for(let v in link.histogram){
                title+=`<p>${v}:${link.histogram[v]}</p>`;
            }
            link.title = title;
            newData.edges.push(this.props.edgeFormatter(link));
        });
        return newData;
    }
}

ApplicationTopo.propTypes = {
    appCode: PropTypes.string,//目标应用的code
    traceId: PropTypes.string,
    from: PropTypes.string,//开始日期
    to: PropTypes.string,//结束日期
    height: PropTypes.string,//拓扑图高度
    sortMethod: PropTypes.string,//布局排序方式，可选项"hubsize":智能(默认值)，"directed":定向
    options: PropTypes.object,//拓扑图基础配置，配置：http://visjs.org/docs/network/#options
    callerRange: PropTypes.number,//调用者层级，默认1级
    calleeRange: PropTypes.number,//被调用者层级，默认5级
    nodeFormatter: PropTypes.func,//节点格式化回调，配置：http://visjs.org/docs/network/nodes.html
    edgeFormatter: PropTypes.func,//连线格式化回调，配置：http://visjs.org/docs/network/edges.html
    events: PropTypes.object//事件回调，可用事件：http://visjs.org/docs/network/#Events
}

const colors = {
    nodeBorader: "#d5def4",
    nodeBorderCurrent: "#722ed1",
    nodeBackground: "#fff",
    nodeBackgroundCurrent: "#fff",
    nodeWarn: "#fa8c16",
    nodeError: "#ffa940",
    edgeOk: "#666",
    edgeWarn: "#fa8c16",
    edgeError: "#ffa940"
}

ApplicationTopo.defaultProps = {
    callerRange: 5,
    calleeRange: 1,
    options: {
        height: "300px",
        layout: {
            improvedLayout: true,
            hierarchical: {
                enabled: true,
                direction: "LR",
                levelSeparation: 160,
                nodeSpacing: 100,
                treeSpacing: 100
            },
        },
        interaction: {
            zoomView: false,
            hover: true
        },
        edges: {
            smooth: true
        },
        nodes: {
            color: {
                border: colors.nodeBorader,
                background: colors.nodeBackground,
                highlight: {
                    border: colors.nodeBorader,
                    background: colors.nodeBackground,
                }
            },
            borderWidth: 2,
            shape: "circularImage",
            size: 24,
            shapeProperties: {
                interpolation: false,
            }
        },
        physics: {
            enabled: false
        }
    },
    nodeFormatter: function (node, current) {
        node.image = "images/topo/" + node.category + ".png";

        if (node.category === "USER") {
            node.label = undefined;
        }
        if (node.applicationName === current) {
            node.color = {
                border: colors.nodeBorderCurrent,
                background: colors.nodeBackgroundCurrent,
                highlight: {
                    border: colors.nodeBorderCurrent,
                    background: colors.nodeBackgroundCurrent,
                }
            }
        }
        return node;
    },
    edgeFormatter: function (edge) {
        if (edge.histogram) {
            let count = 0;
            for (let key in edge.histogram) {
                count += edge.histogram[key];
            }
            edge.label = "" + count;
            let color = colors.edgeOk;
            if (edge.histogram.Error > 0) {
                color = colors.edgeError;
                edge.width = 2;
            } else if (edge.histogram.Slow > 0) {
                color = colors.edgeWarn;
                edge.width = 2;
            }
            edge.color = {
                color: color,
                highlight: color
            }
        }
        return edge;
    },
    events: {
        
    }
}