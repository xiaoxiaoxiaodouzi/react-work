import React,{Component} from 'react'
import { Card, Alert, Button, message, Switch,Modal,Input} from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { queryRoutes } from '../../services/deploy'
import { deleteApp, deleteAppDeploy, updateApp,getApp} from '../../services/running';
import { getConfigs} from '../../services/setting'
import constants from '../../services/constants'
import { delServerGroup } from '../../services/api'
import Setting from '../../components/Application/Setting/Setting'
import SettingTable from '../../components/Application/Setting/SettingTable'
import SettingClusterList from '../../components/Application/Setting/SettingClusterList'
import { addEnvs, queryEnvs, queryBaseConfig, deleteEnvs, existEnvs, editEnvs} from '../../services/deploy'
import {base} from '../../services/base'

const { Description } = DescriptionList;
export default class AppSetting extends Component {
  state={
    name:'',      //应用名称
    url1s:'',   //域名绑定
    visible:false,
    host: '',      //内部地址
    url3s:'',       
    code:'',      //应用upstream
    ctx:'',      //上下文
    id:'',
    codes:'',     //应用路由
    checked:'',
    urlchecked:false,    //域名列表的开启关闭状态
    isAPM:true,  //APM地址是否支持开启
    APMChecked: false,            //APM地址是否开启
    APM_URL:''   ,     //APM地址
    config:'' ,       //环境code_应用code
    visibleDel:false,    //删除应用模态框
    isK8s:true,         //应用部署方式是否为K8S
  }

  componentDidMount(){
    let code = this.props.appCode;
    const env = base.currentEnvironment;
    const configs = env.code + '_' + code;
    this.setState({
      config: configs
    })
    let id = this.props.appId || this.state.id;
    //如果有id的话则刷新
    if (id) {
      //需要想办法 让这个方法先执行再执行下面的
      this.loadData(id);
    }
    
  }
  
  /* APMisOpen=()=>{
    
    //获取全局动态路由配置
    getConfigs().then(data1=>{ 
      //将APM_URL地址
      this.setState({
        APM_URL: data1[constants.CONFIG_KEY.APM_URL],
      })
       //获取应用的环境变量来判断是否开启了APM地址配置
      queryBaseConfig(code).then(data => {
        let ary=[];
        if(data){
           data.forEach(item=>{
             ary.push(queryEnvs(code, item.name))
           }) 
        }
        Promise.all(ary).then(datas=>{
          let a = false;
          let b = false;
          datas.forEach(items=>{
            //设置标志位，如果环境变量中只要有一个容器不存在符合条件的key value，则为false
            //遍历数据 ，看是否有满足条件的数据 即（环境CODE-应用CODE）
              items.forEach((item => {
                if (item) {
                  //当满足情况时
                  if (item.key === constants.APMENABLE_KEY[0] && item.value === data1[constants.CONFIG_KEY.APM_URL]) {
                    b=true;
                  }
                }
              }))
              items.forEach((item => {
                if (item) {
                  //当满足情况时
                  if (item.key === 'APPNAME' && item.value === configs) {
                    a=true;
                  }
                }
              }))
          })
          //如果多个容器里面都有对应的值的话，则认为APM是开启的
          if(a && b){
            this.setState({
              APMChecked:true
            })
          }
        })
      })
      if (data1[constants.CONFIG_KEY.GLOBAL_ROUTER_ENABLE] === '1') {
        this.setState({ urlchecked : true })
      }else{
        this.setState({ urlchecked:false})
      }
      //判断是否有APMURL配置，如果配置了则设置APM可点击更改
      if (data1[constants.CONFIG_KEY.APM_URL] && this.state.isK8s){
        this.setState({
          isAPM:false,
        })
      }
    }) 
  } */

  loadData=(id)=>{
    if(!id){
      id=this.state.id
    }
    getApp(id).then(data => {
      getConfigs().then(data1=>{
        //将APM_URL地址
        this.setState({
          APM_URL: data1[constants.CONFIG_KEY.APM_URL],
        })
        //判断是否有APMURL配置，如果配置了则设置APM可点击更改
        if (data1[constants.CONFIG_KEY.APM_URL] && data.deployMode==='k8s'){
          this.setState({
            isAPM:false,
          })
        }
      })
      let code=''
      let upstream = data.upstream?data.upstream.split('//'):'';
      if (upstream.length>1){
        code = upstream[1]
      }else{
        code=upstream[0]
      }
      //如果应用的部署方式是K8S才去调CCE接口
      if(data.deployMode==='k8s'){
        queryRoutes(data.code).then(datas => {
          if (datas) {
            let array = [];
            datas.forEach(item => {
              array.push(item.ip + '(' + item.containerName + ')');
            })
            this.setState({ 
              urls: array.join(','),
           })
          }
        })
      }else{
        this.setState({
          isK8s:false
        })
      }
      this.setState({
        APMChecked:data.apm,
        name:data.name,
        host: data.host,
        ctx: data.ctx,
        id: id,
        code: code,
        codes: data.code,
      })
    })
  }
  

  componentWillReceiveProps(nextProps){
    if (nextProps.appId!==this.state.id ){
      this.setState({ id: nextProps.appId})
      let id = nextProps.appId;
    //如果有id的话则刷新
			if(id){
        getApp(id).then(data => {
          if(data.deployMode!=='k8s'){
            this.setState({
              isK8s:false
            })
          }
          this.setState({
            name:data.name,
            host: data.host,
            ctx: data.ctx,
            codes: data.code,
          })
        })
			}
		}
  }
  //删除应用
  handleDelete=()=>{
    this.setState({deleteLoading:true});
    const appid=this.props.appId;
    const appCode = this.props.appCode;
    if(appCode){
      deleteAppDeploy(appCode).then(data=>{
        this.deleteApp(appid);
      }).catch(error=>{
          message.error("删除应用部署失败");
      });
    }else{
      this.deleteApp(appid);
    }
  }

  showModal=()=>{
    this.setState({
      key:'',
      visibleDel:true
    })
  }

  //删除时输入框的值变化
  confirmInput = (e) => {
    let key = e.target.value;
    this.setState({
      key: key
    })
  }

  handleCancel=()=>{
    this.setState({
      visibleDel:false,
    })
  }

  handleOk=()=>{
    let key=this.state.key;
    let code=this.props.appCode;
    if (key === code){
      this.handleDelete();
    }else{
      message.error('请输入正确的应用CODE')
    }
  }

  deleteApp = (appid)=>{
    deleteApp(appid).then(data=>{
      delServerGroup(appid);
      this.setState({deleteLoading:false});
      message.success('删除应用成功')
      window.location.href='/#/apps';
    }).catch(error=>{
      message.error("删除应用失败");
      this.setState({deleteLoading:false});
    });
  }

  handleHttpChange = (value) => {
    let id=this.state.id;
    let queryParams = {
      type: '2'
    }
    let schema='';
    if(value){
      schema='https'
    }else{
      schema='http'
    }
    
    let bodyParams={
      schema: schema
    }
    updateApp(id,queryParams,bodyParams).then(data=>{
      this.loadData();  
    })
    this.setState({
      checked:value
    })
  }

  handleClickPush=()=>{
    const { history } = this.props
    history.push({pathname: '/setting/syssetting'})
  }

  _handleClick=()=>{
    this.setState({
      visible:true,
    })
  }

  _handleCancle=()=>{
    this.setState({
      visible:false
    })
  }

  _handleOk=()=>{
    let code = this.props.appCode;
    let checked = this.state.APMChecked;
    const configs = this.state.config;
    let APM_URL = this.state.APM_URL;
    let ary = [
      {
        key: 'APPNAME',
        value: configs,
        source:1,
        desc:'开启监控用到的应用名'
      },
      {
        key: constants.APMENABLE_KEY[0],
        value: APM_URL,
        source: 1,
        desc: '性能监控地址',
      },
    ];
    let bodyParams={};
    //如果是的开启状态，则把APM对应的环境变量删除
    queryBaseConfig(code).then(data => {
      let pro = [];
      let pros = [];
      let containers = [];//用于将容器名存储以便后面做新增接口调用
      if (data) {
        data.forEach(item => {
          //先调查询接口，如果数据存在，则调删除接口，否则不处理
          pros.push(existEnvs(code, item.name, 'APPNAME'));
          pros.push(existEnvs(code, item.name, constants.APMENABLE_KEY[0]));
          containers.push(item.name);
        })
        Promise.all(pros).then(response => {
          response.forEach((item,i) => {
            //先判断是否是开启状态，然后调查询接口，如果存在则调删除（修改）接口，否则不处理（新增接口）；
            if (checked) {
              //将应用APM改为false
              bodyParams.APM=false;
              if (item) {
                pro.push(deleteEnvs(code, item.name, item.id))
              }
            } else {
              bodyParams.APM=true;
              if (item) {
                if (item.key === constants.APMENABLE_KEY[0]) {
                  pro.push(editEnvs(code, item.containerName, {
                    key: constants.APMENABLE_KEY[0],
                    value: APM_URL
                  }, item.id));
                }
                if (item.key === 'APPNAME') {
                  pro.push(editEnvs(code, item.containerName, {
                    key: 'APPNAME',
                    value: configs,
                  }, item.id));
                }
              } else {
                //遍历所有的容器名，然后调新增接口
                containers.forEach(items => {
                  pro.push(addEnvs(code, items, ary[i]))
                })
              }
            }
          })
          //当有存在的key才去调接口
          if (pro.length > 0) {
            Promise.all(pro).then(res => {
              this.setState({
                APMChecked: !checked,
              })
              message.success('环境变量更改成功！')
              let queryParams = {
                type: '2'
              }
              updateApp(this.state.id,queryParams,bodyParams).then(data=>{
                message.success('修改应用成功')
              })
              /* appStart(code).then(data=>{
              }) */
            })
          }
          this.setState({
            visible:false
          })
        })
      }
    })
  }
  render(){
    const { host, ctx, code, id, codes, checked,name}=this.state;
    let ip = {
      host: host,
      ctx: ctx,
    }
    // const action = <Setting appCode={codes} appId={id} onOk={()=>this.loadData()} urls={ip}/>
    
    return (
      <div>
        <Card bordered={false} style={{ margin: 24 }} title='应用访问地址设置' extra={<Setting appCode={codes} appId={id} onOk={() => this.loadData()} urls={ip} />}>
          <DescriptionList col={1}>

            <Description term='应用访问地址' style={{ marginBottom: 24 }}>
              {host}
            </Description>
            <Description term='上下文' style={{ marginBottom: 24 }}>
              {ctx}
            </Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} style={{ margin: 24 }} title='域名列表'>
          {this.state.urlchecked ? <SettingTable appCode={code} ctx={ctx} appId={id} checked={checked} />
            : <span>请前往 <a onClick={this.handleClickPush}>系统设置</a>开启全局动态路由配置</span> 
          }
        </Card>


        <Card bordered={false} style={{ margin: 24 }} title='应用集群'>
          <SettingClusterList appUpstream={code} appId={id} appCode={codes} name={name} checked={(e)=>this.handleHttpChange(e)}/>
        </Card>
        <Card bordered={false} style={{ margin: 24 }} title='监控管理'>
          <div style={{ marginBottom: 24 }}>
            <span>是否开启性能监控: </span>  <Switch style={{ marginLeft: 24 }} checked={this.state.APMChecked} onClick={this._handleClick} disabled={this.state.isAPM} />
            <p style={{ marginTop: 24 }}>  如果需要开启性能监控地址的话 请点击 <a onClick={this.handleClickPush}>这里</a>来修改性能监控地址</p>
          </div>
        </Card>  
        <Card bordered={false} style={{margin:24}} title='应用删除'>
          <Alert message="删除应用时，应用相关的所有资源都会被删除，此操作不能够撤销 !" type="error" style={{marginBottom:10}}/>
          <Button loading={this.state.deleteLoading} type='danger' size='large' icon='delete' onClick={this.showModal}>删除</Button>
        </Card>
          <Modal
            title={this.state.APMChecked?'是否关闭性能监控':'是否开启性能监控'}
            onOk={this._handleOk}
            onCancel={this._handleCancle}
            visible={this.state.visible}
          >
            <strong>此操作会修改环境变量，手动重启应用才会生效！</strong><br/>
            <p style={{ marginTop: 24 }}>{constants.APMENABLE_KEY[0]}:{this.state.APM_URL}</p>
            <p> APPNAME:{this.state.config}</p>
          </Modal>

          <Modal
            title='确认删除？'
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            visible={this.state.visibleDel}
          >
          <p>您要删除的应用是：<span style={{color:'red'}}>{this.state.name}</span></p>
          <p>删除应用时，应用相关的所有资源都会被删除，此操作不能够撤销 !</p>
          <p>应用code: <strong>{this.props.appCode}</strong> </p> 
          <Input style={{marginTop:12,width:300}} placeholder='请填写上方的应用CODE' value={this.state.key} onChange={e => this.confirmInput(e)} />
          </Modal>
      </div>
    )
  }
}