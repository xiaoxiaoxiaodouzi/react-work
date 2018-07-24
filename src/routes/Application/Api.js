import React from 'react'
import { Card, Row, Col, Tooltip,message,Icon,Form,Modal,Input } from 'antd';
import Clipboard from 'copy-to-clipboard';
import { getApiGatewayInfo, getApiGatewayUrl, resetApiKey } from '../../services/api'
import ProvidedServices from '../../components/Application/Api/ProvidedServices';
import AccessibilityServer from '../../components/Application/Api/AccessibilityServer';

class AppApi extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      inApiGateway: '',
      outApiGateway: '',
      internetApiGateway: '',
      apiKey: '******',
      securityKey: '******',
      visibleModal:false,
    }

    this.appid = props.match.params.id;
    this.apiKey = '';
    this.apikeyHide = '******';
    this.securityKey = '';
    this.securityKeyHide = '******';
    this._resetApiKey = this._resetApiKey.bind(this);
    this._setClipboard = this._setClipboard.bind(this);
  }

  componentDidMount() {
    this._pullData();
  }
  _pullData() {
    Promise.all([getApiGatewayInfo(this.appid), getApiGatewayUrl()])
      .then((response) => {
        this.apiKey = response[0].key || '';
        this.apikeyHide = '******';
        this.securityKey = response[0].secret || '';
        this.securityKeyHide = '******';
        this.setState({
          apiKey: '******',
          securityKey: '******',
          inApiGateway: response[1].localUrl || '',
          outApiGateway: response[1].publicUrl || '',
          internetApiGateway: response[1].internetUrl || ''
        })
      })
  }

  _resetApiKey() {
    resetApiKey(this.appid)
      .then((response) => {

        this.apiKey = response.key || '';
        this.apikeyHide = '******';
        this.securityKey = response.secret || '';
        this.securityKeyHide = '******';
        message.success('重置凭证成功');
        this.setState({
          apiKey: '******',
          securityKey: '******',
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
  handleModalOk = ()=>{
    const { getFieldsValue } = this.props.form;
    console.log('values',getFieldsValue());
  }
  onEdit = ()=>{
    const { setFieldsValue } = this.props.form;
    this.setState({visibleModal:true});
    setFieldsValue({
      inApiGateway:this.state.inApiGateway,
      internetApiGateway:this.state.internetApiGateway,
      outApiGateway:this.state.outApiGateway
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form; 
    const formItemLayout1 = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Card title={'网关信息'} bordered={false} style={{ margin: 24 }}>
          <Row>
            {this.state.apiKey ==='******'?
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>API-KEY：
                {this.state.apiKey}
                <Icon style={{ marginLeft:8,cursor:'pointer' }} type="eye-o" onClick={()=>{
                  if(this.apiKey === this.state.apiKey){
                    this.setState({apiKey:this.apikeyHide})
                  }else{
                    this.setState({apiKey:this.apiKey})
                  }
                }}/>
              </Col>
              :
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>API-KEY：
                <Tooltip title={'点击复制'}>
                <a onClick={() => { this._setClipboard(this.apiKey) }}>
                {this.state.apiKey}
                </a>
                </Tooltip>
                <Icon style={{ marginLeft:8,cursor:'pointer' }} type="eye" onClick={()=>{
                  if(this.apiKey === this.state.apiKey){
                    this.setState({apiKey:this.apikeyHide})
                  }else{
                    this.setState({apiKey:this.apiKey})
                  }
                }}/>
              </Col>
            }
            {this.state.securityKey ==='******'?
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>SECURITY：
              {this.state.securityKey}
              <Icon style={{ marginLeft:8,cursor:'pointer' }} type="eye-o" onClick={()=>{
                if(this.securityKey === this.state.securityKey){
                  this.setState({securityKey:this.securityKeyHide})
                }else{
                  this.setState({securityKey:this.securityKey})
                }
              }}/>
              </Col>
              :
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>SECURITY：
              <Tooltip title={'点击复制'}>
              <a onClick={() => { this._setClipboard(this.securityKey) }}>
              {this.state.securityKey}
              </a>
              </Tooltip>
              <Icon style={{ marginLeft:8,cursor:'pointer' }} type="eye" onClick={()=>{
                if(this.securityKey === this.state.securityKey){
                  this.setState({securityKey:this.securityKeyHide})
                }else{
                  this.setState({securityKey:this.securityKey})
                }
              }}/>
              </Col>
            }
              <Col style={{ paddingTop: 10, paddingBottom: 10,float:'right' }}>
                <a onClick={() => { this._resetApiKey() }}>重置凭证</a>
               {/*  <a style={{ marginLeft: 8 }} onClick={() => this.onEdit() }>修改</a>  */}
              </Col>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>{'网关集群内地址：' + this.state.inApiGateway}
              <Tooltip title="网关所在服务集群内的地址，仅集群内可访问"><Icon style={{marginLeft:8}} type="info-circle-o" /></Tooltip>
              </Col>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>{'网关集群外地址：' + this.state.outApiGateway}
              <Tooltip title="整个应用集群内可访问"><Icon style={{marginLeft:8}} type="info-circle-o" /></Tooltip>
              </Col>
              <Col span={8} style={{ paddingTop: 10, paddingBottom: 10 }}>{'网关互联网地址：' + this.state.internetApiGateway}
              <Tooltip title="外网访问地址"><Icon style={{marginLeft:8}} type="info-circle-o" /></Tooltip>
              </Col>
          </Row>
          <Modal 
            title="网关信息修改"
            visible={this.state.visibleModal}
            onOk={this.handleModalOk} 
            onCancel={()=>this.setState({visibleModal:false})}>
            <Form>
              <Form.Item {...formItemLayout1} label="网关集群内地址">
              {getFieldDecorator('inApiGateway', {
                rules: [
                  { required: true, message: '请输入网关集群内地址!' },
                ],
              })(
                <Input />
              )}
              </Form.Item>
              <Form.Item {...formItemLayout1} label="网关集群外地址">
              {getFieldDecorator('outApiGateway', {
                rules: [
                  { required: true, message: '请输入网关集群外地址!' },
                ],
              })(
                <Input />
              )}
              </Form.Item>
              <Form.Item {...formItemLayout1} label="网关互联网地址">
              {getFieldDecorator('internetApiGateway', {
                rules: [
                  { required: true, message: '请输入网关互联网地址!' },
                ],
              })(
                <Input />
              )}
              </Form.Item>
            </Form>
          </Modal>
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
const Antdes = Form.create()(AppApi);
export default Antdes;