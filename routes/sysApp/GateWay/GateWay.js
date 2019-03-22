import React from 'react';
import { Route } from 'react-router-dom';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import GateWaySetting from '../../../components/sysApp/GateWay/GateWaySetting';
import ApiList from '../../Api/List';
import DashBoardApi from '../../../components/sysApp/GateWay/DashBoardApi';
import AppLog from '../../Application/Log';
import AppDeploy from '../../Application/Deploy'


class GateWay extends React.Component {

    constructor(props) {
        super(props);
        this.tabList = [
            { key: 'detail', tab: '概览' },
            { key: 'apis', tab: '服务管理' },
            { key: 'deploy', tab: '部署管理' },
            { key: 'logs', tab: '日志' },
            { key: 'config', tab: '设置' },
        ];
        var tabKey = 'detail';
        this.appid = 'IuGBb7gYRI-eCBO50VxZ5g';
        let path = window.location.href.split('/');
		if (path.length > 10) {
			this.setState({ tabKey: path[path.length - 1] })
		}
        this.state = {
            tabKey: tabKey,
            code: 'apigateway-new',
            deployMode: 'k8s'
        }
    }

    onTabChange = (key) => {
        let { history ,match} = this.props;
        history.push({ pathname: `/setting/systemsetting/env/${match.params.env}/apps/apigateway/${key}` });
        
        this.setState({ tabKey: key });
    }

    render() {
        const breadcrumbList = [
            { title: '平台管理', href: '/' },
            { title: '业务环境', href: '/' },
            { title: '服务网关' }
        ]
        const content = <p>为业务环境提供服务集成与治理能力</p>;

        return (
            <div style={{ margin: '-24px -24px 0' }}>
                <PageHeader title="服务网关" breadcrumbList={breadcrumbList} content={content}
                    tabList={this.tabList} tabActiveKey={this.state.tabKey} onTabChange={this.onTabChange} />
                <Route path="/setting/systemsetting/env/:env/apps/apigateway" component={DashBoardApi} exact />
                <Route path="/setting/systemsetting/env/:env/apps/apigateway/detail" component={DashBoardApi} exact />
                <Route path="/setting/systemsetting/env/:env/apps/apigateway/apis" component={ApiList} exact />
                <Route path="/setting/systemsetting/env/:env/apps/apigateway/deploy" render={() => <AppDeploy appId={this.appid} exact type='chart' env={this.props.match.params.env}/>} />
                <Route path="/setting/systemsetting/env/:env/apps/apigateway/logs" render={() => <AppLog deployMode={this.state.deployMode} {...this.props} match={{ params: { id: this.appid } }} appCode={this.state.code} />} exact />
                <Route path="/setting/systemsetting/env/:env/apps/apigateway/config" component={GateWaySetting} exact />
            </div>
        )
    }
}

export default GateWay;