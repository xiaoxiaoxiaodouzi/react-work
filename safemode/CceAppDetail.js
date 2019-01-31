import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button, Row, Col, Spin, message, Badge,  Divider, Tooltip, InputNumber } from 'antd';
import AppOverview from './OverView'
import AppDeploy from '../routes/Application/Deploy'
import AppLog from '../routes/Application/Log'
import AppSetting from '../routes/Application/Setting'
import { Route } from 'react-router-dom';
import moment from 'moment';
import constants from '../services/constants'
import Authorized from '../common/Authorized';
import InputInline from '../common/Input';

import { getInstanceInfo, changeAppCluster, changeAppExtention, appStop, appStart, appStateCheck } from '../services/cce'
import ClusterSelectModal from '../common/ClusterSelectModal';

const { Description } = DescriptionList;
const InstanceStatus = constants.APP_STATE_CN;
const appStateRepeatTime = 5000;
//应用状态监听定时器
let appStateWatching;

class appDetail extends React.Component{

    constructor(props) {
        super(props)
    
        this.state = {
          tabActiveKey: "overview",
          appname: '',
          username: '',
          avatar: "",
          status: 'unknown',
          replicas: 0,
          creationtime: moment(),
          clusterName: '--',
          description: '',
          code: this.props.match.params.id,
          tags: [],
          allTags: [],
          systemManager: [],
          businessManager: [],
          auditManager: [],
          statusLoading: false,
          deployMode: '',
          tabList: [],
          clusterVisible: false,
          clusterId: '',
          isEditNumber: false,
          replicasLoading: false,
          visible: false,
          history: this.props.history,
          appId: this.props.match.params.id,
          //检查是否有未生效环境变量
          envChange: (isChanged) => {
            this.state.tabList.forEach(tab => {
              if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
            })
            this.setState({ tabList: this.state.tabList });
          }
        }
    
        this.appid = props.match.params.id;
        this.pathname = props.location.pathname;
        this.code = props.match.params.id;
        this.inputRelicas = '';
    }

    componentDidMount(){
        
          this.getLoadData(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.appid) {
          this.code = nextProps.match.params.id;
          this.loadData(nextProps.match.params.id);
        }
        if (nextProps.location.pathname !== this.props.location.pathname) {
          let tabs = nextProps.location.pathname.split(`${this.code}/`);
          this.setState({ tabActiveKey: tabs[1] });
        }
      }

    componentWillUnmount() {
        //关闭应用状态监听
        if (appStateWatching) window.clearInterval(appStateWatching);
    }

    getLoadData = (code) => {
        let tabList = [];
        tabList.push(
            { key: 'overview', tab: '资源监控', path: `/safeapps/:id/overview`, resourceId: `apps_overview`, render: <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} /> },
            { key: 'deploy', tab: '部署', resourceId: `apps_deploy`, path: `/safeapps/:id/deploy`, render: <AppDeploy appId={this.appid} envChange={this.envChange} /> },
            { key: 'log', tab: '日志', resourceId: `apps_log`, path: `/safeapps/:id/log`, component: AppLog },
            { key: 'setting', tab: '设置', resourceId: `apps_setting`, path: `/safeapps/:id/setting`, render: <AppSetting appId={this.appid} appCode={this.state.code} history={this.props.history} /> }
          );

        let newAry = [];
        let  tabActiveKey='';
        tabList.forEach((t, i) => {
          //权限控制
          //if (base.allpermissions.includes(t.resourceId)) {
            newAry.push(t)
          //}
          if (this.pathname.indexOf(t.key) > 0) tabActiveKey = t.key;
        })
        if(tabActiveKey && tabActiveKey !== ''){
          this.setState({
            tabActiveKey:tabActiveKey
          })
        }
        this.setState({
            tabList:newAry,
        })
        
        //获取部署信息
        getInstanceInfo(code).then((response) => {
            if (response === undefined) return;
            // this.state.tabList.splice(1,0,{ key: 'deploy', tab: '部署' });
            
            let info2 = {};
            info2.appname = response.name;
            info2.clusterName = response.clusterName;
            info2.replicas = response.replicas ? response.replicas : 0;
            this.inputRelicas = info2.replicas;
            info2.status = response.status;
            info2.clusterId = response.clusterId;
            this.setState(info2);
            //监听应用状态
            console.info("开始监听应用状态...");
            appStateWatching = window.setInterval(() => {
              appStateCheck(code).then(data => {
                if (data && data.additionalProperties.status !== this.state.status) {
                  this.setState({ status: data.additionalProperties.status, statusLoading: false });
                }
              })
            }, appStateRepeatTime);
          });  
    }

    _setInputReplicas = (value) => {
        this.inputRelicas = value;
    }

    //应用迁移弹窗
    _clusterVisible = () => {
      this.setState({
        clusterVisible: true
      });
    }

    //应用迁移确定操作
    clusterOnOk = (cluster, clusterName, th) => {

      if (cluster) {
        changeAppCluster(this.code, cluster).then(data => {
          if (data) {
            message.success("应用迁移成功！");
            this.setState({
              clusterVisible: false,
              clusterName: clusterName,
              clusterId: cluster
            });
  
            th.setState({
              loading: false
            });
          }
        }).catch(err => {
          th.setState({
            loading: false
          });
        });
      } else {
        message.error("请选择集群！");
      }
  
    }
  
    //应用迁移取消操作
    clusterOnCancel = () => {
      this.setState({
        clusterVisible: false
      })
    }

    //修改应用副本
    _setReplicas = () => {
        
        this.setState({
          replicasLoading: true
        })

        changeAppExtention(this.code, this.inputRelicas).then(data => {
          if (data) {
            this.setState({
              isEditNumber: false,
              replicas: this.inputRelicas
            })
          }
          this.setState({
            replicasLoading: false
          })
        }).catch(err => {
          this.setState({
            replicasLoading: false
          })
        })
    
     }

     //修改环境变量事件
    envChange = (isChanged) => {
      this.state.tabList.forEach(tab => {
        if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
      })
      this.setState({ tabList: this.state.tabList });
    }

    appStart = e => {
        this.setState({ statusLoading: true });
        appStart(this.state.code).then(() => {
          message.info('应用启动中...');
        })
    }
    
    appStop = e => {
        this.setState({ statusLoading: true });
        appStop(this.state.code).then(() => {
          message.info('正在停止应用');
        });
    }

    renderconstDescription() {
        return (
          <div>
    
            <DescriptionList size="small" col="2">
              <Description term="创建时间">{this.state.creationtime ? this.state.creationtime.format("YYYY-MM-DD HH:mm:ss") : null}</Description>
              <Description term="CODE">{this.state.code}</Description>
              <Description term="所属集群"> <Authorized authority={'app_migrate'} noMatch={this.state.clusterName}><Tooltip title="点击迁移应用" onClick={this._clusterVisible}>{this.state.clusterName}</Tooltip></Authorized></Description>
                <Description term="应用副本">
                  {
                    this.state.isEditNumber ?
                      <div><InputNumber min={1} max={5} defaultValue={this.state.replicas} onChange={this._setInputReplicas} />
                        <Button style={{ marginLeft: 8 }} type="primary" onClick={this._setReplicas} loading={this.state.replicasLoading}>确定</Button><Button style={{ marginLeft: 8 }} onClick={() => { this.setState({ isEditNumber: false }) }}>取消</Button></div>
                      :
                      <Tooltip title="点击修改副本数" onClick={() => { if (!this.state.isEditNumber) { this.setState({ isEditNumber: true }) } }}>
                        {this.state.replicas}
                      </Tooltip>
    
                  }
    
                </Description>
            </DescriptionList>
          </div>
        )
      };

    onTabChange = (key) => {
        let { history } = this.props;
        let params = this.props.match.params;
        history.push({ pathname: `/safeapps/${params.id}/${key}` });
        this.setState({ tabActiveKey: key });
    }

    renderTitle() {
        return (
          <InputInline
            title={'应用'}
            value={this.state.appname}
            dataType={'Input'}
            mode={'common'}
            editing={false}
            defaultNullValue={'暂无'}
            rule={{ required: true }}
          />
        )
    }

    renderExtra() {
        return (
          <Row>
            <Col sm={24} md={12}>
              <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>实例数</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.replicas}</div>
            </Col>
            <Col sm={24} md={12}>
              <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>状态</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.status === 'running' || this.state.status === 'pending' ? <span><Spin size="small" style={{ marginRight: 5 }} />{InstanceStatus[this.state.status]}</span> : InstanceStatus[this.state.status]}</div>
            </Col>
          </Row>
        )
      }

    render() {
        const basePath = "safeapps";
        let breadcrumbList;
        if (basePath) {
        breadcrumbList = [{
            title: <span><Divider type="vertical" style={{ width: "2px", height: "15px", backgroundColor: "#15469a", "verticalAlign": "text-bottom" }} /> {'应用列表'}</span>,
            href: '/#/' + basePath
        }, {
            title: '应用详情'
        }];
        }
        return (
        <div style={{ margin: '-24px -24px 0' }}>
        
        <PageHeader
            title={this.renderTitle()}
            logo={<img alt='' src={constants.PIC.app} />}
            action={this.state.status === 'stop' ?
                <Authorized authority={'app_start'} noMatch={<Button disabled="true" icon="caret-right" type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button>}>
                    <Button icon="caret-right" type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button>
                </Authorized> :
                <Authorized authority={ 'app_stop'} noMatch={<Button disabled="true" icon="poweroff" loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button>}>
                    <Button icon="poweroff" loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button>
                </Authorized>}
             content={this.renderconstDescription()}
             extraContent={this.renderExtra()}
            breadcrumbList={breadcrumbList}
            tabList={this.state.tabList}
            tabActiveKey={this.state.tabActiveKey}
            onTabChange={this.onTabChange}
            />

            <ClusterSelectModal
              visible={this.state.clusterVisible}
              clusterName={this.state.clusterName}
              clusterId={this.state.clusterId}
              onOk={this.clusterOnOk}
              onCancel={this.clusterOnCancel}
            />

            <Route path={`/${basePath}/:id`} render={props => <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} />} exact />
            <Route path={`/${basePath}/:id/overview`} render={props => <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} />} />
            <Route path={`/${basePath}/:id/deploy`} render={props => <AppDeploy appCode={this.state.code} appId={this.appid} envChange={this.envChange} />} />
            <Route path={`/${basePath}/:id/log`} component={AppLog} />
            {/* <Route path={`/${basePath}/:id/transaction`} render={props => <Card style={{ margin: 24 }} bodyStyle={{ padding: '24px 8px 0px 8px' }} ><Transaction appCode={this.state.code} /></Card>} /> */}
            <Route path={`/${basePath}/:id/setting`} render={props => <AppSetting appId={this.appid} appCode={this.state.code} history={this.props.history} />} />
        </div>
        );
    }
}
export default appDetail;

