import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button, Row, Col,Spin,message } from 'antd';
import AppOverview from './Overview'
import AppDeploy from './Deploy'
import AppRunning from './Running'
import AppApi from './Api'
import AppLog from './Log'
import AppMenus from './Menus'
import AppSetting from './Setting'
import { Route } from 'react-router-dom';
import moment from 'moment';
import { getAppInfo, changeAppProperty, getAppTags, getAppsTags, getAppManager, changeAppManager, getInstanceInfo, createAppTags, addAppTag, removeAppTag, appStateCheck,appStop,appStart } from '../../services/appdetail'
import InputInline from '../../common/Input';
import TagManager from '../../common/TagManager';
import UserSelectModal from '../../common/UserSelectModal';

const { Description } = DescriptionList;

const InstanceStatus = {
  default:'无',
  succeeded: '运行中',
  failed: '失败',
  running: '启动中',
  pending: '等待',
  stop: '停止'
}

const appStateRepeatTime = 5000;

//应用状态监听定时器
let appStateWatching;

class AppDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tabActiveKey: "overview",
      appname: '',
      username: '',
      avatar: "",
      status: 'default',
      replicas: 0,
      creationtime: moment(),
      clusterName: '',
      description: '',
      upstream:'',
      tags: [],
      allTags: [],
      systemManager: [],
      businessManager: [],
      auditManager: [],
      appTypeName:'',
      tabList: [{ key: 'overview', tab: '概览' }]
    }

    this.appid = props.match.params.id;
    this.pathname = props.location.pathname;

    this.onAppNameChangeCommit = this.onAppNameChangeCommit.bind(this);
    this.onAppDescriptionChangeCommit = this.onAppDescriptionChangeCommit.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.onTagsManagerChange = this.onTagsManagerChange.bind(this);
  }

  componentDidMount() {
    Promise.all([getAppInfo(this.appid), getAppTags(this.appid), getAppManager(this.appid, 'SYSTEM_MANAGER'), getAppManager(this.appid, 'BUSINESS_MANAGER'), getAppManager(this.appid, 'AUDIT_MANAGER')])
      .then((response) => {
        var info = {};
        info.appname = response[0].name;
        info.username = response[0].creator;
        info.avatar = response[0].icon;
        info.code = response[0].code;
        info.type = response[0].type;
        info.deployMode = response[0].deployMode;
        info.creationtime = moment(response[0].createtime);
        info.description = response[0].desc;
        info.upstream = response[0].upstream;
        info.tags = response[1];
        var systemManager = [];
        response[2].forEach(element => {
          element.name = element.userName;
          systemManager.push(element)
        });
        var businessManager = [];
        response[3].forEach(element => {
          element.name = element.userName;
          businessManager.push(element)
        });
        var auditManager = [];
        response[4].forEach(element => {
          element.name = element.userName;
          auditManager.push(element)
        });
        info.systemManager = systemManager;
        info.businessManager = businessManager;
        info.auditManager = auditManager;

        info.tabList = this.state.tabList;
        //根据应用是否是k8s部署，查看部署页签
        if(info.deployMode==='k8s'&&info.code){
          info.tabList.push({ key: 'deploy', tab: '部署' });

          getInstanceInfo('develop', info.code).then((response) => {
            if(response === undefined) return ;
            // this.state.tabList.splice(1,0,{ key: 'deploy', tab: '部署' });
            let info2 = {};
            info2.clusterName = response.clusterName;
            info2.replicas = response.replicas;
            info2.status = response.status;
            this.setState(info2);
            //监听应用状态
            console.info("开始监听应用状态...");
            appStateWatching = window.setInterval(()=>{
              appStateCheck(info.code).then(data=>{
                if(data && data.additionalProperties.status !== this.state.status){
                  this.setState({status:data.additionalProperties.status});
                }
              })
            },appStateRepeatTime);
          });
        }
        //中间件类型的应用特殊处理
        if(info.type !== "middleware"){
          info.appTypeName = '应用';
          info.tabList.push(
            { key: 'running', tab: '集成' },
            { key: 'resouce', tab: '资源' },
            { key: 'api', tab: 'API' }
          );
          if(info.deployMode==='k8s'&&info.code)info.tabList.push({ key: 'log', tab: '日志' });
          info.tabList.push({ key: 'setting', tab: '设置' });
        }else info.appTypeName = '中间件';

        info.tabList.forEach(t=>{
          if(this.pathname.indexOf(t.key)>0)info.tabActiveKey = t.key;
        })
        this.setState(info);
      })
      
  }

  componentWillUnmount(){
    //关闭应用状态监听
    if(appStateWatching)window.clearInterval(appStateWatching);
  }

  //*************************************************************************** */
  //**********************************EVENT************************************ */
  //*************************************************************************** */
  onTabChange = (key) => {
    let { history } = this.props;
    let params = this.props.match.params;
    history.push({ pathname: `/apps/${params.id}/${key}` });
    this.setState({ tabActiveKey: key });
  }

  //应用名称修改
  onAppNameChangeCommit(value) {
    var appname = this.state.appname;
    this.setState({
      appname: value
    })
    changeAppProperty(this.appid, { name: value })
      .then((response) => {

      })
      .catch((e) => {
        this.setState({
          appname: appname
        })
      })
  }

  //应用描述修改
  onAppDescriptionChangeCommit(value) {
    var description = this.state.description;
    this.setState({
      description: value
    })
    changeAppProperty(this.appid, { name: this.state.appname, desc: value })
      .then((response) => {

      })
      .catch((e) => {
        this.setState({
          desc: description
        })
      })
  }

  //标签弹窗管理可见回调
  onVisibleChange(visible) {
    if (visible) {
      getAppsTags()
        .then((response) => {
          this.setState({
            allTags: response
          })
        })
    }
  }

  // 标签变化回调  create创建新标签 add绑定已创建标签 remove移除标签{event:'add',value:{id:***,name:*****}}
  onTagsManagerChange(data) {
    var tag = data.value;
    if (data.event === "add") {
      addAppTag(this.appid, tag)
        .then((response) => {
          var tags = this.state.tags.slice(0);
          tags.push(tag);
          this.setState({
            tags: tags
          })
        })
    } else if (data.event === 'create') {
      //创建绑定
      createAppTags(tag.name)
        .then((response) => {
          tag = response[0];
          return addAppTag(this.appid, tag)
        })
        .then((response) => {
          var tags = this.state.tags.slice(0);
          tags.push(tag);
          this.setState({
            tags: tags
          })
        })
    } else if (data.event === 'remove') {
      //移除标签
      removeAppTag(this.appid, tag.id)
        .then((response) => {
          var tags = this.state.tags;
          var tmptags = [];
          tags.forEach((element) => {
            if (element.id !== tag.id) {
              tmptags.push(element)
            }
          })
          this.setState({
            tags: tmptags
          })
        })
    }
  }

  _onManagerChange(type, users) {
    var usersId = [];
    users.forEach((element)=>{
      usersId.push(element.id);
    })
    changeAppManager(this.appid,type,usersId)
    .then((response)=>{
      if(type === "SYSTEM_MANAGER"){
        this.setState({
          systemManager:users
        })
      }else if(type === "BUSINESS_MANAGER"){
        this.setState({
          businessManager:users
        })
      }else if('AUDIT_MANAGER'){
        this.setState({
          auditManager:users
        })
      }
    })
    .catch((e)=>{

    })
  }
  //*************************************************************************** */
  //************************************UI************************************* */
  //*************************************************************************** */
  renderExtra() {
    return (
      <Row>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>实例数</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.replicas}</div>
        </Col>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>状态</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.status==='running'||this.state.status==='pending'?<span><Spin size="small" style={{marginRight:5}}/>{InstanceStatus[this.state.status]}</span>:InstanceStatus[this.state.status]}</div>
        </Col>
      </Row>
    )
  }

  renderconstDescription() {
    return (
      <DescriptionList size="small" col="2">
        <Description term="创建人">{this.state.username}</Description>
        <Description term="创建时间">{this.state.creationtime ? this.state.creationtime.format("YYYY-MM-DD") : null}</Description>
        <Description term="所属环境">{this.state.clusterName}</Description>
        <Description term="系统管理员">
          <UserSelectModal title={'设置管理员'} selectedUsers={this.state.systemManager} dataIndex={{dataIdIndex:'USERID',dataNameIndex:'userName'}} onOk={(users) => { this._onManagerChange('SYSTEM_MANAGER', users) }} />
        </Description>
        <Description term="业务管理员">
          <UserSelectModal selectedUsers={this.state.businessManager} dataIndex={{dataIdIndex:'USERID',dataNameIndex:'userName'}} onOk={(users) => { this._onManagerChange('BUSINESS_MANAGER', users) }} />
        </Description>
        <Description term="审计管理员">
          <UserSelectModal selectedUsers={this.state.auditManager} dataIndex={{dataIdIndex:'USERID',dataNameIndex:'userName'}} onOk={(users) => { this._onManagerChange('AUDIT_MANAGER', users) }}/>
        </Description>
        <Col span={24}><InputInline title={'描述'} value={this.state.description} onChange={this.onAppDescriptionChangeCommit} dataType={'TextArea'} mode={'inline'} defaultNullValue={'空'} /></Col>
      </DescriptionList>
    )
  };

  renderTitle() {
    return (
      <Row type={'flex'}>
        <Row type={'flex'}>{this.state.appTypeName+"名："}<InputInline value={this.state.appname} onChange={this.onAppNameChangeCommit} dataType={'Input'} mode={'inline'} defaultNullValue={'暂无'} rule={{ required: true }} /></Row>
        <TagManager selectedTags={this.state.tags} allTags={this.state.allTags} onVisibleChange={this.onVisibleChange} onChange={this.onTagsManagerChange} />
      </Row>
    )
  }

  appStart = e=>{
    appStart(this.state.code).then(()=>{
      message.info('应用启动中...');
    })
  }

  appStop = e=>{
    appStop(this.state.code).then(()=>{
      message.info('正在停止应用');
    });
  }

  render() {
    const breadcrumbList = [{
      title: this.state.appTypeName+'列表',
      href: this.state.type==='middleware'?'/#/middlewares':'/#/apps'
    },{
      title: this.state.appTypeName+'详情'
    }];
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={this.renderTitle()}
          logo={<img alt="" src={this.state.avatar} />}
          action = {this.state.status==='stop'?<Button icon="caret-right" type="primary" onClick={this.appStart}>启动</Button>:<Button icon="poweroff" onClick={this.appStop} type="primary">停止</Button>}
          content={this.renderconstDescription()}
          extraContent={this.renderExtra()}
          breadcrumbList={breadcrumbList}
          tabList={this.state.tabList}
          tabActiveKey={this.state.tabActiveKey}
          onTabChange={this.onTabChange}
        />
        <Route path="/apps/:id" component={AppOverview} exact />
        <Route path="/apps/:id/overview" component={AppOverview} />
        <Route path="/apps/:id/deploy" component={AppDeploy}/>
        <Route path="/apps/:id/running" component={AppRunning} />
        <Route path="/apps/:id/resouce" component={AppMenus} />
        <Route path="/apps/:id/api" render={props=><AppApi {...props} upstream={this.state.upstream}/>}/>
        <Route path="/apps/:id/log" component={AppLog} />
        <Route path="/apps/:id/setting" render={props=><AppSetting appId={this.appid} appCode={this.state.code}/>}/>
      </div>
    );
  }
}

export default AppDetail;