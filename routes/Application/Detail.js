import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import  {Button, Row, Col, Spin, message, Card, Badge, Tag} from 'antd';
import AppOverview from './Overview'
import AppDeploy from './Deploy'
import AppRunning from './Running'
import AppApi from './Api'
import AppLog from './Log'
import AppMenus from './Menus'
import AppSetting from './Setting'
import { Route } from 'react-router-dom';
import moment from 'moment';
import { getInstanceInfo, appStop, appStart, isEnvChanged, appStateCheck } from '../../services/cce'
import InputInline from '../../common/Input';
import TagManager from '../../common/TagManager';
import { getUserInfos } from '../../services/uop';
import Transaction from '../../components/Application/Overview/Transaction';
import constants from '../../services/constants'
import { base } from '../../services/base'
import { checkIdName, getAppInfo, changeAppProperty, getAppsTags, createAppTags, getAppTags, addAppTag, removeAppTag } from '../../services/aip'
import '../../assets/fonts/iconfont.css';
import Authorized from '../../common/Authorized';
import { breadcrumbDataGenerate } from '../../common/SimpleComponents';

const { Description } = DescriptionList;
const InstanceStatus = constants.APP_STATE_CN;
const appStateRepeatTime = 5000;

//应用状态监听定时器
let appStateWatching;
class AppDetail extends React.Component {

  constructor(props) {
    super(props)

    this.appid = props.match.params.id;
    this.pathname = props.location.pathname;
    this.basePath = this.props.match.path;
    this.code = '';
    this.inputRelicas = '';
    let tabs = this.pathname.split(`${this.appid}/`);
    const tabActiveKey = tabs.length>1?tabs[1]:'overview';

    this.state = {
      appData:{},
      deployInfo:{},
      tabActiveKey,
      appname: '',
      username: '',
      status: 'unknown',
      code: '',
      tags: [],
      allTags: [],
      appTypeName: '',
      statusLoading: false,
      tabList: [],
      visible: false,
      appId: this.props.match.params.id,
      isSysApp:this.props.match.params.id==='0',
      edit:false,
      //检查是否有未生效环境变量
      envChange: (isChanged) => {
        this.state.tabList.forEach(tab => {
          if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
        })
        this.setState({ tabList: this.state.tabList });
      }
    }

    

    this.onAppNameChangeCommit = this.onAppNameChangeCommit.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.onTagsManagerChange = this.onTagsManagerChange.bind(this);
  }

  componentDidMount() {
    const appId = this.props.match.params.id;
    getAppInfo(appId).then(data=>{
      this.code = data.code;
      let appData = data;
      //高可用
      appData.ha = data.healthCheck && data.replicas && data.replicas > 1;

      //访问地址和上下文
      if(data.ctx ){
        if( data.ctx.substring(0, 1) === "/"){
          appData.ctx = data.ctx;
        }else{
          appData.ctx = "/" + data.ctx;
        } 
      }else{
        appData.ctx = "/";
      }
      if(data.host){
        appData.visit = data.host + appData.ctx;
      }

      //创建人
      if (data.creator !== 'admin') {
        getUserInfos(data.creator).then(user => {
          this.setState({username:user.name});
        })
      } else {
        this.setState({username:'admin'});
      }

      this.setState({appData,appTypeName:data.type !== "middleware"?'应用':'中间件'});

      //初始化Tab数据
      this.initTabList(data);

      if (data.deployMode === 'k8s' && data.code && base.configs.passEnabled) {
        this.getCceInfo(data.code);
      }
      getAppTags(this.appid).then(tags=>{
        this.setState({tags});
      })
    })
  }

  componentWillUnmount() {
    //关闭应用状态监听
    if (appStateWatching) window.clearInterval(appStateWatching);
  }

  initTabList = (data)=>{
    let tabList = this.state.tabList;
    const appType = data.type !== 'middleware'?'apps':'middleware';
    tabList.push({ key: 'overview', tab: '概览', path: `${this.basePath}/overview`, resourceId: `${appType}_overview`, 
      render: (props)=><AppOverview appData={this.state.appData} {...props}/>
    });

    if (data.deployMode === 'k8s' && data.code && base.configs.passEnabled) {
      tabList.push({ key: 'deploy', tab: '部署', resourceId: `${appType}_deploy`, path: `${this.basePath}/deploy`, 
        render: (props)=><AppDeploy appData={this.state.appData} envChange={this.envChange} {...props}/> 
      });
      //检查是否有未生效环境变量
      isEnvChanged(data.code).then(data => {
        if (data) {
          this.state.tabList.forEach(tab => {
            if (tab.key === 'deploy') tab.tab = <Badge dot>部署</Badge>;
          })
          this.setState({ tabList: this.state.tabList });
        }
      });
    }

    if (data.type !== "middleware") {
      tabList.push(
        { key: 'running', tab: '访问&认证', resourceId: 'apps_running', path: `${this.basePath}/running`, render: (props)=><AppRunning appData={this.state.appData} {...props}/> },
        { key: 'resource', tab: '角色&功能', resourceId: 'apps_resource', path: `${this.basePath}/resource`, render: (props)=><AppMenus upstream={data.upstream} {...props} appname={data.name} />},
        { key: 'api', tab: '服务', resourceId: 'apps_api', path: `${this.basePath}/api`, render: (props)=><AppApi  {...props} appData={this.state.appData} /> }
      );
    }

    tabList.push({ key: 'log', tab: '日志', resourceId: `${appType}_log`, path: `${this.basePath}/log`, render:(props)=><AppLog  {...props} appData={this.state.appData}/> });
    if (data.apm) tabList.push({ key: 'transaction', tab: '性能监控', path: `${this.basePath}/transaction`, render: (props)=><Card style={{ margin: 24 }} bodyStyle={{ padding: '24px 8px 0px 8px' }} ><Transaction appCode={data.code} {...props}/></Card> });
    tabList.push({ key: 'setting', tab: '设置', resourceId: `${appType}_setting`, path: `${this.basePath}/setting`, render: (props)=><AppSetting appId={data.id} appCode={data.code} appData={this.state.appData} deployInfo={this.state.deployInfo} {...props} /> });
  }

  //获取部署信息
  getCceInfo = (code)=>{
    getInstanceInfo(code).then((deployInfo) => {
      if (deployInfo === undefined) return;

      this.setState({deployInfo});
      //监听应用状态
      appStateWatching = window.setInterval(() => {
        appStateCheck(code).then(data => {
          if (data && data.additionalProperties.status !== this.state.status) {
            this.setState({ status: data.additionalProperties.status, statusLoading: false });
          }
        })
      }, appStateRepeatTime);
    });
  }

  //*************************************************************************** */
  //**********************************EVENT************************************ */
  //*************************************************************************** */
  onTabChange = (key) => {
    let { history } = this.props;
    history.push({ pathname: `${this.props.match.url}/${key}` });
    this.setState({ tabActiveKey: key });
  }

  envChange = (isChanged) => {
    this.state.tabList.forEach(tab => {
      if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
    })
    this.setState({ tabList: this.state.tabList });
  }

  //应用名称修改
  onAppNameChangeCommit(value) {
    return new Promise((resolve, reject) => {
      if (value && value !== this.state.appname) {
        var appname = this.state.appname;
        checkIdName({attr:value}, { attr: "name", tenant: base.tenant }).then(data => {
          if (data) {
            message.error('应用名称已存在，请重新修改')
            reject();
          } else {
            changeAppProperty(this.appid, { name: value }).then(data => {
              message.success('应用名称修改成功')
              this.setState({
                appname: value
              })
              resolve();
            }).catch((e) => {
              resolve();
              this.setState({
                appname: appname
              })
            })
          }
        }).catch(err => {
          resolve();
        })
      } else {
        resolve();
      }
    })
  }
  //标签弹窗管理可见回调
  onVisibleChange(visible) {
    if (visible) {
      getAppsTags()
        .then((response) => {
          this.setState({
            allTags: response,
            visible: true
          })
        })
    } else {
      this.setState({ visible: false })
    }
  }

  // 标签变化回调  create创建新标签 add绑定已创建标签 remove移除标签{event:'add',value:{id:***,name:*****}}
  onTagsManagerChange(data) {
    var tag = data.value;
    tag.tenant = base.tenant;
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
      createAppTags(tag)
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

  //*************************************************************************** */
  //************************************UI************************************* */
  //*************************************************************************** */
  renderExtra() {
    return (
      <Row>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>实例数</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.appData.replicas || '--'}</div>
        </Col>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>状态</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.status === 'running' || this.state.status === 'pending' ? <span><Spin size="small" style={{ marginRight: 5 }} />{InstanceStatus[this.state.status]}</span> : InstanceStatus[this.state.status]}</div>
        </Col>
      </Row>
    )
  }

  renderconstDescription() {
    let appFeature = [{ name: this.state.appData.type, enable: this.state.appData.type, icon: 'icon-' + this.state.appData.type }, { name: "系统应用", enable: this.state.isSysApp }, { name: "统一认证", enable: this.state.appData.acl, icon: 'icon-auth' }, { name: "SpringCloud", enable: this.state.appData.springcloud, icon: 'icon-framework' }, { name: "性能监控", enable: this.state.appData.apm, icon: 'icon-apm' }, { name: "高可用", enable: this.state.appData.ha, icon: 'icon-ha' }];
    return (
      <div>
        <DescriptionList size="small" col="3">
          <Description term="应用编码">{this.state.appData.code}</Description>
          <Description term="创建人">{this.state.username}</Description>
          <Description term="创建时间">{this.state.appData.createtime ? moment(this.state.appData.createtime).format('YYYY-MM-DD HH:mm') : '--'}</Description>
        </DescriptionList>
        <DescriptionList size="small" col="1" style={{ marginTop:10}}>
          <Description term="访问地址">{this.state.appData.visit?<a href={this.state.appData.visit} target='_blank' rel="noopener noreferrer">{this.state.appData.visit}</a>:'--'}</Description>
          <div className="ant-col-xs-24 ant-col-sm-24" style={{ paddingLeft: 16, paddingRight: 16}}><div className="antd-pro-description-list-term">特性</div>
            <div className="antd-pro-description-list-detail">
              {appFeature.map((f, index) => <Tag key={index} color={f.enable ? "geekblue" : ""}><i className={'icon ampicon ' + f.icon}></i><span style={{ paddingLeft: 5 }}>{f.name}</span></Tag>)}
            </div>
          </div>
        </DescriptionList>
      </div>
    )
  }

  renderTitle() {
    return (
      <Authorized authority={this.state.appData.type === "middleware"?"middlewares_edit":"app_edit"} noMatch={ 
      <InputInline
        title={this.state.appTypeName}
        onCommit={this.onAppNameChangeCommit}
        value={this.state.appData.name}
        dataType={'Input'}
        mode={'inline'}
        editing={false}
        defaultNullValue={'暂无'}
        rule={{ required: true }}
        renderExtraContent={() => {
          return (<TagManager style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.tags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange} />)
        }}
      />}>
          <InputInline
          title={this.state.appTypeName}
          onCommit={this.onAppNameChangeCommit}
          value={this.state.appData.name}
          dataType={'Input'}
          mode={'inline'}
          defaultNullValue={'暂无'}
          rule={{ required: true }}
          renderExtraContent={() => {
            return (<TagManager key={"testkeytetewt"} style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.tags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange} />)
          }}
        />
      </Authorized>
    )
  }

  appStart = e => {
    this.setState({ statusLoading: true });
    appStart(this.state.appData.code).then(() => {
      message.info('应用启动中...');
    })
  }

  appStop = e => {
    this.setState({ statusLoading: true });
    appStop(this.state.appData.code).then(() => {
      message.info('正在停止应用');
    });
  }

  render() {
    let basePath = this.props.match.url;
    const breadcrumbList = breadcrumbDataGenerate(this.props.match,this.pathname.indexOf('middlewares')!==-1?'middleware':'app');
    
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={this.renderTitle()}
          logo={<img alt='' src={this.state.appData.type === "middleware" ? constants.PIC.middleware : constants.PIC.app} />}
          action={this.state.appData.deployMode === 'k8s' && base.configs.passEnabled?
            (this.state.status === 'stop' ?
              <Button icon="caret-right" disabled={!base.checkPermission(this.state.type === "middleware" ? 'middleware_start' : 'app_start')} type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button>:
              <Button icon="poweroff" disabled={!base.checkPermission(this.state.type === "middleware" ? 'middleware_stop' : 'app_stop')} loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button>
            ):''}
          content={this.renderconstDescription()}
          extraContent={this.renderExtra()}
          breadcrumbList={breadcrumbList}
          tabList={this.state.tabList}
          tabActiveKey={this.state.tabActiveKey}
          onTabChange={this.onTabChange}
        />
        
        {this.state.tabList.length > 0 ?
          <div>
            {this.state.tabList.map((i,index) => <Route key={index} path={i.path} render={i.render} exact/>)}
            {/* 默认选中第一个tap页 */}
            <Route path={basePath} render={this.state.tabList[0].render} exact />
          </div> : ''
        }
      </div>
    );
  }
}

export default AppDetail;