import React from 'react'
import { Row, Col, Button, Popconfirm,message } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Route } from 'react-router-dom';
import InputInline from '../../common/Input';
import TagManager from '../../common/TagManager';
import PermissionCard from '../../components/Application/ApiDetail/PermissionCard';
import ParamsCard from '../../components/Application/ApiDetail/ParamsCard';
import { getServicesApi, queryAppTags, changeApiProperty, createTag, removeServiceApi, getAppInfo } from '../../services/aip'
import constants from '../../services/constants'
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import { getupstream } from '../../services/amp';

import { base } from '../../services/base';
import ApiMonitor from '../../components/Application/ApiDetail/ApiMonitor';

const { Description } = DescriptionList;

// const grade = {
//   0: '私有',
//   1: '普通',
//   2: '公开'
// }

class ApiDetail extends React.Component {

  constructor(props) {
    super(props)
    this.tabList = [{ key: 'params', tab: '参数' }, { key: 'permission', tab: '权限' }];

    if(base.configs.monitEnabled){
      this.tabList.push( { key: 'monitor', tab: '监控' });
    }
    var tabActiveKey = 'params';
    this.tabList.forEach(t => {
      if (props.location.pathname.indexOf(t.key) > 0) tabActiveKey = t.key;
    })
    this.upstream = '';
    this.state = {
      appName: '',
      apiName: '',
      ctx: '',
      httpMethod: 'GET',
      uri: "",
      visibility: 0,
      upstreamConnectTimeout: 10,
      upstreamSendTimeout: 10,
      upstreamReadTimeout: 10,
      desc: '',
      tags: [],
      allTags: [],
      tabActiveKey: tabActiveKey,
      obj: {},
      clustersName: ''
    }

    this.appId = '0';
    this.apiId = props.match.params.apiId;

    this._onTabChange = this._onTabChange.bind(this);
    this._onTagsManagerChange = this._onTagsManagerChange.bind(this);
    this._onApiDescriptionChangeCommit = this._onApiDescriptionChangeCommit.bind(this);
  }


  componentDidMount() {

    //查询服务详情可以不用传应用ID，所以想暂时先写是一个0
    getServicesApi('0', this.apiId).then(res => {
      var obj = {};
      obj.code = res.code;
      obj.apiName = res.name;
      obj.httpMethod = res.methods;
      obj.uri = res.uri;
      // obj.ctx = res.ctx;
      obj.visibility = res.visibility;
      obj.desc = res.desc;
      obj.upstreamConnectTimeout = res.upstreamConnectTimeout;
      obj.upstreamSendTimeout = res.upstreamSendTimeout;
      obj.upstreamReadTimeout = res.upstreamReadTimeout;
      obj.owned = res.owned;
      this.appId = res.groupId;
      getAppInfo(this.appId).then(data => {
        this.upstream = data.upstream
        obj.upstream = data.upstream
        obj.appName = data.name;
        obj.avatar = data.icon;
        obj.ctx = data.ctx;
        queryAppTags(this.appId).then(datas => {
          obj.allTags = datas || [];
          if (res.tagName) {
            var tagArr = res.tagName.split(',');
            var tags = [];
            tagArr.forEach((element) => {
              for (var n = 0; n < obj.allTags.length; n++) {
                if (element === obj.allTags[n].name) {
                  tags.push(obj.allTags[n]);
                }
              }
            });
            obj.tags = tags;
          }
          this.setState(obj);
          this.setState({ obj: obj })
        }).catch(err => {
          this.setState(obj)
        })

        //获取服务所属集群
        let index = this.upstream.indexOf("//");
        let upstream = '';
        if(index !== -1){
          upstream = this.upstream.substr(index + 2);
        }else{
          upstream = this.upstream;
        }
        
        getupstream(upstream).then(data => {
          if (data) {
            let targets = data.targets;
            let clusters = [];
            targets.forEach(tar => {
              if (tar.weight > 0) {
                let cluster = tar.ip + ":" + tar.port;
                clusters.push(cluster);
              }

            });

            this.setState({
              clustersName: clusters.toString()
            })
          }
        });
      }).catch(err => {
        this.setState(obj)
      })
    })


  }


  //*************************************************************************** */
  //**********************************EVENT************************************ */
  //*************************************************************************** */
  _onTabChange(key) {
    let { history } = this.props;
    history.push({ pathname: `/apis/${this.apiId}/${key}` });
    this.setState({ tabActiveKey: key });
  }

  // 标签变化回调  create创建新标签 add绑定已创建标签 remove移除标签{event:'add',value:{id:***,name:*****}}
  _onTagsManagerChange(data) {
    var tag = data.value;
    if (data.event === "add") {
      var tags = [tag];
      var tagStr = tag.name + ',';

      this.state.tags.forEach((element, index, array) => {
        tagStr += element.name;
        if (index < array.length - 1) {
          tagStr += ','
        }
      })
      tags = tags.concat(this.state.tags);
      this.setState({
        tags: tags
      })
      this._onApiDescriptionChangeCommit({ tagName: tagStr })
    } else if (data.event === 'create') {
      //创建绑定
      createTag(this.appId, tag.name)
        .then((response) => {
          tag = response;
          var tags = [tag];
          var tagStr = tag.name + ',';

          this.state.tags.forEach((element, index, array) => {
            tagStr += element.name;
            if (index < array.length - 1) {
              tagStr += ','
            }
          })
          tags = tags.concat(this.state.tags);
          var allTags = this.state.allTags.slice();
          allTags.push(tag);
          this.setState({
            tags: tags,
            allTags: allTags
          })
          this._onApiDescriptionChangeCommit({ tagName: tagStr })
        })
    } else if (data.event === 'remove') {
      //移除标签
      // eslint-disable-next-line
      var tags = [];
      // eslint-disable-next-line
      var tagStr = '';

      this.state.tags.forEach((element, index, array) => {
        if (tag.id !== element.id) {
          tags.push(element);
          tagStr += element.name;
          if (index < array.length - 1) {
            tagStr += ','
          }
        }
      })
      this.setState({
        tags: tags
      })
      this._onApiDescriptionChangeCommit({ tagName: tagStr })
    }
  }

  _onApiDescriptionChangeCommit(property) {
    var params = Object.assign({ upstreamConnectTimeout: this.state.upstreamConnectTimeout, upstreamSendTimeout: this.state.upstreamSendTimeout, upstreamReadTimeout: this.state.upstreamReadTimeout }, property)

    changeApiProperty(this.appId, this.apiId, params)
      .then((response) => {
        if (property.tags != null) {
          return
        }
        this.setState(property)
      })
  }
  // onContextChange = (value) => {
  //   let params = {
  //     ctx: value
  //   }
  //   changeApiProperty(this.appId, this.apiId, params)
  //     .then((response) => {
  //       this.setState({ ctx: value })
  //       message.success('修改上下文信息成功')
  //     })
  // }

  _delete() {
    removeServiceApi(this.appId, this.apiId)
      .then(() => {
        //window.history.back();
        message.success('删除服务【'+this.state.apiName+'】成功!');
        window.location.href = '/#/apis'
      })
  }

  //应用名称修改
  onAppNameChangeCommit = (value) => {
    var apiName = this.state.apiName;
    this.setState({
      apiName: value
    })
    changeApiProperty(this.appId, this.apiId, { name: value })
      .then((response) => {

      })
      .catch((e) => {
        this.setState({
          apiName: apiName
        })
      })
  }
  //*************************************************************************** */
  //************************************UI************************************* */
  //*************************************************************************** */
  renderExtra() {
    return (
      <Row type={'flex'} justify="end">
        <Col>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>状态</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>未知</div>
        </Col>
      </Row>
    )
  }

  renderconstDescription() {
    return (
      <DescriptionList size="small" col="2">
        <Description term="所属应用">{this.state.appName}</Description>
        <Description term="上下文">{this.state.ctx?this.state.ctx:'/'}</Description>
        <Description term="HTTP Method">{this.state.httpMethod}</Description>
        <Description term="所属集群">{this.state.clustersName || '--'}</Description>
        <Description term="请求路径"><Ellipsis lines={1} tooltip>{this.state.uri}</Ellipsis></Description>
      </DescriptionList>
    )
  }

  renderTitle() {
    return (
   
        <InputInline
          title={'服务名称'}
          onChange={this.onAppNameChangeCommit}
          editing={this.state.editing}
          value={this.state.apiName}
          dataType={'Input'}
          mode={ base.allpermissions.includes('service_edit') ?'inline':'common'}
          defaultNullValue={'暂无'}
          rule={{ required: true }}
          renderExtraContent={() => {
            return (<TagManager style={{ marginLeft: 10 }} selectedTags={this.state.tags} allTags={this.state.allTags} onVisibleChange={() => null} onChange={this._onTagsManagerChange} />)
          }}
        /> 
    )
    // return (
    //   <div style={{ display: 'flex', height: 'auto' }}>
    //     <InputTag title={'服务名称'} value={this.state.apiName} onChange={this.onAppNameChangeCommit} dataType={'Input'} mode={'inline'} defaultNullValue={'暂无'} rule={{ required: true }} selectedTags={this.state.tags} allTags={this.state.allTags} onVisibleChange={() => null} onTagChange={this._onTagsManagerChange} />
    //   </div>
    // )
  }

  render() {
    const action = <div>
      <Popconfirm title="确认删除?" onConfirm={() => this._delete()}><Button type="danger">删除</Button></Popconfirm>
    </div>
    const breadcrumbList = [{title:'服务列表',href:'#/apis'},{title:'服务详情'}];
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={this.renderTitle()}
          logo={<img alt="" src={constants.PIC.service} />}
          action={base.allpermissions.includes('service_delete') && this.state.owned ? action : ''}
          content={this.renderconstDescription()}
          extraContent={this.renderExtra()}
          tabList={this.tabList}
          breadcrumbList={breadcrumbList}
          tabActiveKey={this.state.tabActiveKey}
          onTabChange={this._onTabChange}
        />

        <Route path="/apis/:apiId" render={() => <ParamsCard obj={this.state.obj} appId={this.appId} apiId={this.apiId} />} exact />
        <Route path="/apis/:apiId/params" render={() => <ParamsCard obj={this.state.obj} appId={this.appId} apiId={this.apiId} />} />
        <Route path="/apis/:apiId/permission" render={() => <PermissionCard appId={this.appId} apiId={this.apiId} />} />
        <Route path="/apis/:apiId/monitor" render={() => <ApiMonitor apiMethod={this.state.obj.httpMethod} apiPath={this.state.obj.uri} code={this.state.obj.code} />} />
      </div>
    )
  }
}

export default ApiDetail;