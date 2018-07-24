import React from 'react'

import { Row, Col, Button, Popconfirm,message } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Route } from 'react-router-dom';

import InputInline from '../../common/Input';
import TagManager from '../../common/TagManager';
import PermissionCard from '../../components/Application/ApiDetail/PermissionCard';
import ParamsCard from '../../components/Application/ApiDetail/ParamsCard';
import { getServicesApi, queryTags, changeApiProperty, createTag, removeServiceApi } from '../../services/api'
import { getAppInfo } from '../../services/appdetail'
import constants from '../../services/constants'

const { Description } = DescriptionList;

const tabList = [{ key: 'params', tab: '参数' }, { key: 'permission', tab: '权限' }, { key: 'monitor', tab: '监控' }];
// const grade = {
//   0: '私有',
//   1: '普通',
//   2: '公开'
// }

class ApiDetail extends React.Component {

  constructor(props) {
    super(props)

    var tabActiveKey = 'params';
    tabList.forEach(t => {
      if (props.location.pathname.indexOf(t.key) > 0) tabActiveKey = t.key;
    })
    this.upstream='';
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
    }

    this.appId = props.match.params.appId;
    this.apiId = props.match.params.apiId;

    this._onTabChange = this._onTabChange.bind(this);
    this._onTagsManagerChange = this._onTagsManagerChange.bind(this);
    this._onApiDescriptionChangeCommit = this._onApiDescriptionChangeCommit.bind(this);
  }


  componentDidMount() {
    Promise.all([getAppInfo(this.appId), getServicesApi(this.appId, this.apiId), queryTags(this.appId)])
      .then((response) => {
        var obj = {};
        this.upstream=response[0].upstream;
        obj.appName = response[0].name;
        obj.avatar = response[0].icon;
        obj.apiName = response[1].name;
        obj.httpMethod = response[1].methods;
        obj.uri = response[1].uri;
        obj.ctx = response[1].ctx;
        obj.visibility = response[1].visibility;
        obj.desc = response[1].desc;
        obj.upstreamConnectTimeout = response[1].upstreamConnectTimeout;
        obj.upstreamSendTimeout = response[1].upstreamSendTimeout;
        obj.upstreamReadTimeout = response[1].upstreamReadTimeout;
        obj.allTags = response[2] || [];
        if (response[1].tagName) {
          var tagArr = response[1].tagName.split(',');
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
      })

  }


  //*************************************************************************** */
  //**********************************EVENT************************************ */
  //*************************************************************************** */
  _onTabChange(key) {
    let { history } = this.props;
    history.push({ pathname: `/apps/${this.appId}/apis/${this.apiId}/${key}` });
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
  onContextChange=(value)=>{
    let params = {
      ctx:value
    }
    changeApiProperty(this.appId, this.apiId, params)
      .then((response) => {
        this.setState({ ctx:value })
        message.success('修改上下文信息成功')
      })
  }

  _delete() {
    removeServiceApi(this.appId, this.apiId)
      .then(() => {
        window.history.back();
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
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>NULL</div>
        </Col>
      </Row>
    )
  }

  renderconstDescription() {
    return (
      <DescriptionList size="small" col="2">
        <Description term="所属应用">{this.state.appName}</Description>
        {/* <Description term="上下文">{this.state.ctx?this.state.ctx:'/'}</Description> */}
        <Description term="上下文">
        <InputInline inputWidth={120}
          value={ this.state.ctx } 
          onChange={this.onContextChange} 
          dataType={'Input'} mode={'inline'} 
          defaultNullValue={'/'} />
        </Description>
        <Description term="HTTP Method">{this.state.httpMethod}</Description>
				<Description term="请求路径">{this.state.uri}</Description>
      </DescriptionList>
    )
  }

  renderTitle() {
    return (
      <Row type={'flex'}>
        <Row type={'flex'}>{"服务名称："}<InputInline value={this.state.apiName} onChange={this.onAppNameChangeCommit} dataType={'Input'} mode={'inline'} defaultNullValue={'暂无'} rule={{ required: true }} /></Row>
        <TagManager selectedTags={this.state.tags} allTags={this.state.allTags} onVisibleChange={() => null} onChange={this._onTagsManagerChange} />
      </Row>
    )
  }

  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={this.renderTitle()}
          logo={<img alt="" src={constants.PIC.service} />}
          action={<Popconfirm title="确认删除?" onConfirm={() => this._delete()}><Button type="danger">删除</Button></Popconfirm>}
          content={this.renderconstDescription()}
          extraContent={this.renderExtra()}
          tabList={tabList}
          tabActiveKey={this.state.tabActiveKey}
          onTabChange={this._onTabChange}
        />

        <Route path="/apps/:appId/apis/:apiId" render={() => <ParamsCard appId={this.appId} apiId={this.apiId} />} exact />
        <Route path="/apps/:appId/apis/:apiId/params" render={() => <ParamsCard appId={this.appId} apiId={this.apiId} />} />
        <Route path="/apps/:appId/apis/:apiId/permission" render={() => <PermissionCard appId={this.appId} apiId={this.apiId} />} />
      </div>
    )
  }
}

export default ApiDetail;