import React from 'react';
import { Button } from 'antd';
import Result from 'ant-design-pro/lib/Result';
import Link from 'react-router-dom/Link';
import { queryAppInfo } from '../../../services/cce';
import { base } from '../../../services/base';

/* function ExtraText(props) {
    return (
        <div style={{ marginBottom: 20 }}>
            <span style={{
                fontSize: 14, color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: '500'
            }}>
                {props.lable}：
            </span>
            <span>{props.text}</span>
        </div>
    )
} */

class Step3 extends React.Component {
    state = {
        appInfo: null
    }
    componentDidMount(){
        this.setState({ appInfo:this.props.appinfo });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.status === 1 && this.state.appInfo!==nextProps.appinfo) {
            if(base.configs.passEnabled){
                queryAppInfo(nextProps.appinfo.code).then(data => {
                    this.setState({
                        cceInfo: data,
                        appInfo:nextProps.appinfo
                    })
                })
            }else{
                this.setState({
                    appInfo:nextProps.appinfo
                })
            }            
        }else{
            this.setState({ appInfo:nextProps.appinfo });
        }
    }
   
    render() {
        const labelName = this.props.type==='app'?'应用':'中间件';
        const appid = this.state.appInfo?this.state.appInfo.id:'';
        /* const extra = (
            <div style={{ margin: '10px 0 0 160px' }}>
                {
                    this.state.cceInfo ?
                        <span>
                            <ExtraText lable={labelName+'名称'} text={this.state.cceInfo.name} />
                            <ExtraText lable="所属集群" text={this.state.cceInfo.clusterName} />
                            <ExtraText lable="副本数量" text={this.state.cceInfo.replicas} />
                        </span> : ""
                }
            </div>
        ); */
        const actions = (
            <div>
                <Button type="primary">
                    <Link to={this.props.type==='app'?'/apps/'+appid:'/middlewares/'+appid}>查看{labelName}详情</Link>
                </Button>
                <Button>
                    <Link to={this.props.type==='app'?'/apps':'/middlewares'}>返回{labelName}列表</Link>
                </Button>
            </div>
        );
        const description = this.props.type==='app'?'应用部署完成，应用门户、统一认证等相关配置请到应用详情页面配置':'中间件部署完成，需要修改相关配置请到中间件详情页面进行配置';
        return (
            <span style={{ display: this.props.display ? 'block' : 'none' }}>
                <Result
                    type="success"
                    title={labelName+'创建成功'}
                    description={description}
                    /* extra={extra} */
                    actions={actions}
                    style={{ marginTop: 48, marginBottom: 16 }}
                />
            </span>
        )
    }
}

export default Step3;