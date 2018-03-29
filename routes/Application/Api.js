import React from 'react'
import { Card, Row, Col, Tooltip } from 'antd';
import Clipboard from 'copy-to-clipboard';
import { getApiGatewayInfo, getApiGatewayUrl, resetApiKey } from '../../services/api'
import ProvidedServices from '../../components/Application/Api/ProvidedServices';
import AccessibilityServer from '../../components/Application/Api/AccessibilityServer';

export default class AppApi extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      inApiGateway: '',
      outApiGateway: '',
      internetApiGateway: '',
      apiKey: '',
      securityKey: ''
    }

    this.appid = props.match.params.id;
    this.apiKey = '';
    this.securityKey = '';
    this._resetApiKey = this._resetApiKey.bind(this);
    this._setClipboard = this._setClipboard.bind(this);
  }

  componentDidMount() {
    this._pullData();
  }
  //********************************************************************* */
  //********************************EVENT******************************** */
  //********************************************************************* */
  _pullData() {
    Promise.all([getApiGatewayInfo(this.appid), getApiGatewayUrl()])
      .then((response) => {
        var slen = response[0].key.length > 8 ? 4 : Math.floor(response[0].key.length / 2);
        var clen = response[0].key.length > 8 ? response[0].key.length - 8 : Math.floor(response[0].key.length / 2);
        var apikeyhide = this._hideStr(response[0].key, slen, clen, '*')
        slen = response[0].secret.length > 8 ? 4 : Math.floor(response[0].secret.length / 2);
        clen = response[0].secret.length > 8 ? response[0].secret.length - 8 : Math.floor(response[0].secret.length / 2);
        var securityKeyhide = this._hideStr(response[0].secret, slen, clen, '*')

        this.apiKey = response[0].key || '';;
        this.securityKey = response[0].secret || '';
        this.setState({
          apiKey: apikeyhide,
          securityKey: securityKeyhide,
          inApiGateway: response[1].localUrl || '',
          outApiGateway: response[1].publicUrl || '',
          internetApiGateway: response[1].internetUrl || ''
        })
      })
  }

  _resetApiKey() {
    resetApiKey(this.appid)
      .then((response) => {
        var slen = response.key.length > 8 ? 4 : Math.floor(response.key.length / 2);
        var clen = response.key.length > 8 ? response.key.length - 8 : Math.floor(response.key.length / 2);
        var apikeyhide = this._hideStr(response.key, slen, clen, '*')
        slen = response.secret.length > 8 ? 4 : Math.floor(response.secret.length / 2);
        clen = response.secret.length > 8 ? response.secret.length - 8 : Math.floor(response.secret.length / 2);
        var securityKeyhide = this._hideStr(response.secret, slen, clen, '*')

        this.apiKey = response.key || '';;
        this.securityKey = response.secret || '';

        this.setState({
          apiKey: apikeyhide,
          securityKey: securityKeyhide
        })
      })
  }

  _hideStr(str, pos, length, newChar) {
    pos = pos || 0;
    length = length || 0;
    newChar = newChar || '*';
    if (pos < 0 || length <= 0 || pos + length > str.length) {
      return str;
    }
    var repStr = "";
    for (var i = 0; i < length; i++) {
      repStr += newChar;
    }
    return str.slice(0, pos) + repStr + str.slice(pos + length, str.length);
  }

  _setClipboard(content) {
    Clipboard(content);
  }
  //********************************************************************* */
  //**********************************UI********************************* */
  //********************************************************************* */
  render() {
    return (
      <div>
        <Card title={'网关信息'} bordered={false} style={{ margin: 24 }}>
          <Row>
            <Col span={22}>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>{'网关集群内地址:' + this.state.inApiGateway}</Col>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>{'网关集群外地址:' + this.state.outApiGateway}</Col>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>{'网关互联网地址:' + this.state.internetApiGateway}</Col>

              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>API-KEY:<Tooltip title={'点击复制'}><a onClick={() => { this._setClipboard(this.apiKey) }}>{this.state.apiKey}</a></Tooltip></Col>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>SECURITY:<Tooltip title={'点击复制'}><a onClick={() => { this._setClipboard(this.securityKey) }}>{this.state.securityKey}</a></Tooltip></Col>
            </Col>
            <Col span={2}>
              <Col style={{ paddingTop: 10, paddingBottom: 10 }}><a onClick={() => { this._resetApiKey() }}>重置凭证</a></Col>
            </Col>
          </Row>

        </Card>
        <Card title={'对外提供的服务'} bordered={false} style={{ margin: 24 }}>
          <ProvidedServices appId={this.appid} apiKey={this.apiKey} upstream={this.props.upstream} />
        </Card>
        <Card title={'可调用的外部服务'} bordered={false} style={{ margin: 24 }}>
          <AccessibilityServer appId={this.appid} apiKey={this.apiKey} />
        </Card>
      </div>
    )
  }
}