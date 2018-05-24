import React, { PureComponent, Fragment } from 'react';
import { Button,Card,Form,Select,Row,Col,Input,message,Popconfirm,InputNumber } from 'antd';
import { queryAllEnvs,addEnv,deleteEnv,updateEnv } from '../../services/setting';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';

const { Description } = DescriptionList;
const { Option } = Select;

const urlReg=/(http|https):\/\/[\w\-_]+(.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])$/;
const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
//const innerUrlReg=
class EnvSetting extends PureComponent {
  state = {
    data:[],
    submitting:false,

  };
  loadData = ()=>{
    queryAllEnvs().then((data)=>{
      //console.log('queryallenvs11tsw',data);
      data.forEach(element=>{
        element.key = element.id;
      });
      this.setState({data});
    });
  }
  componentDidMount (){
    this.loadData();
  }
  newRecord = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key:newData.length,
      name:'',
      apiGatewaySchema:'https',
      apiGatewayHost:'',
      apiGatewayPort:8080,
      apiGatewayManagePort:8081,
      authServerAddress:'',
      authServerInnerAddress:'',
      subDomain:'',
      isEdit:true,
      isNew:true,
    });
    this.setState({data: newData});
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  clearCheckStatus = ()=>{
    this.setState({
      helpGatewayHost:null,
      helpServerAddress:null,
      helpServerInnerAddress:null,
      validateGatewayHost:'',
      validateServerAddress:'',
      validateServerInnerAddress:'',
    });
  }
  onEdit=(key)=>{
    const { setFieldsValue }=this.props.form;
    let newData = this.state.data.slice();
    this.clearCheckStatus();
    newData.forEach((element,index,arr)=>{
      if(element.key === key){
        arr[index].isEdit = true;
        this.setState({data:arr},()=>{
         // //console.log("onedit",element);  
          setFieldsValue({
            apiGatewaySchema:element.apiGatewaySchema,
            apiGatewayHost:element.apiGatewayHost,
            apiGatewayPort:element.apiGatewayPort,
            apiGatewayManagePort:element.apiGatewayManagePort,
            authServerAddress:element.authServerAddress,
            authServerInnerAddress:element.authServerInnerAddress,
            subDomain:element.subDomain,
            name:element.name,
          }); 
        });
       // //console.log("onedit",element);
      }
    });
    //this.setState({data:newData});
  }
  onDelete=(key)=>{
    const newData = this.state.data.filter(item => item.key !== key);
    deleteEnv(key).then(()=>{
      message.success('删除指定环境成功');
      this.setState({ data: newData });
    })
  }
  checkSubmitValues=(values)=>{
    if(!ipReg.test(values.apiGatewayHost)){
      this.setState({
        validateGatewayHost:'error',
        helpGatewayHost:'请输入正确的ip地址，格式：xxx.xxx.xxx.xxx'
      })
      return false;
    }
    if(!urlReg.test(values.authServerAddress)){
      this.setState({
        validateServerAddress:'error',
        helpServerAddress:'请输入正确的授权服务器地址'
      })
      return false;
    }
    /* const innerAddress = values.authServerInnerAddress.split(':');
    console.log("innerAddress",innerAddress,innerAddress[0]);
    let flag = false;
    if(innerAddress[0]!=='http'&&innerAddress[0]!=='https'){
      flag = true;
    }
    if(!ipReg.test(innerAddress[1].slice(2))){
      flag = true;
    }
    if(parseInt(innerAddress[2])<1 || parseInt(innerAddress[2])>65535){
      flag = true;
    }
    if(flag){
      this.setState({
        validateServerInnerAddress:'error',
        helpServerInnerAddress:'请输入正确的服务器内网地址'
      })
      return false;
    } */
    return true;
  }
  onSubmit = (e,key)=>{
    e.preventDefault();
    let newData = this.state.data.slice();
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if(!this.checkSubmitValues(values)){
          return;
        }
        // submit the values
        newData.forEach(element=>{
          if(element.key === key){
            ////console.log("values1",values,element);
            if(element.isNew){ //new
              element.isEdit = false;
              Object.assign(element, values);
              delete element.isNew;
              addEnv(element).then(()=>{
                message.success('添加环境成功');
                this.setState({data:newData});
              })
            }else{ //update
              element.isEdit = false;
              Object.assign(element, values);
              updateEnv(key,element).then(()=>{
                message.success('修改环境成功');
                this.setState({data:newData});
              });
            }
          }
        });
        //this.setState({data:newData});
      }
    });
  }
  onCancel= (e,key)=>{
    e.preventDefault();
    let newData = this.state.data.slice();
    newData.forEach((element,index,arr)=>{
      if(element.key === key){
        element.isEdit = false;
        if(element.isNew){
          arr.splice(index,1);
        }
      }
    });
    this.setState({data:newData});
  }
  render() {
    const { data,submitting } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Card 
        bordered={false}
        title='环境配置'
        style={{margin:'24px 0'}}
        bodyStyle={{padding:0}} >
        { 
          data.map((element)=>{
            return(
              <Card 
                type="inner" 
                style={{margin:16}} 
                title={element.isMain?element.name+' (主环境)':element.name}
                extra={!element.isEdit?
                  <Fragment>
                    <a onClick={()=>this.onEdit(element.key)}>编辑</a>&nbsp;&nbsp;
                    {element.isMain?'':
                    <Popconfirm title="是否要删除此行？" onConfirm={() => this.onDelete(element.key)}>
                      <a>删除</a>
                    </Popconfirm>}
                  </Fragment>
                :''} >
                {element.isEdit?
                  <Fragment>
                    <Form layout="vertical" hideRequiredMark>
                      <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                          <Form.Item label="环境名称">
                            {getFieldDecorator('name', {
                              rules: [{ required: true, message: '请输入环境名称' }],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                          <Form.Item label="网关协议">
                            {getFieldDecorator('apiGatewaySchema', {
                              rules: [{ required: true, message: '请选择网关协议' }],
                            })(
                              <Select placeholder="请选择">
                                <Option value="http">http</Option>
                                <Option value="https">https</Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                          <Form.Item 
                            label="网关地址"
                            validateStatus={this.state.validateGatewayHost}
                            help={this.state.helpGatewayHost} >
                            {getFieldDecorator('apiGatewayHost', {
                              rules: [{ required: true, message: '请输入网关地址' }],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                          <Form.Item label="网关端口">
                            {getFieldDecorator('apiGatewayPort', {
                              rules: [{ required: true, message: '请输入网关端口' }],
                            })(
                              <InputNumber style={{width:'100%'}} min={1} max={65535} placeholder="请输入网关端口:1~65535之间"/>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                          <Form.Item label="网关管理端口">
                            {getFieldDecorator('apiGatewayManagePort', {
                              rules: [{ required: true, message: '请输入网关管理端口' }],
                            })(
                              <InputNumber style={{width:'100%'}} min={1} max={65535} placeholder="请输入网关端口:1~65535之间"/>
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                          <Form.Item 
                            label="授权服务器地址"
                            validateStatus={this.state.validateServerAddress}
                            help={this.state.helpServerAddress} >
                            {getFieldDecorator('authServerAddress', {
                              rules: [{ required: true, message: '请选择' }],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                          <Form.Item 
                            label="授权服务器内网地址"
                            validateStatus={this.state.validateServerInnerAddress}
                            help={this.state.helpServerInnerAddress} >
                            {getFieldDecorator('authServerInnerAddress', {
                              rules: [{ required: true, message: '请输入授权服务器内网地址' }],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6} md={12} sm={24}>
                          <Form.Item label="子域名">
                            {getFieldDecorator('subDomain', {
                              rules: [{ required: true, message: '请输入子域名' }],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </Form.Item>
                        </Col>
                        <div style={{ position:'absolute',right:0,bottom:0 }}>
                          <Button style={{marginRight:16}} type="primary" onClick={e=>this.onSubmit(e,element.key)} loading={submitting}>
                            提交
                          </Button>
                          <Button type="default" onClick={e=>this.onCancel(e,element.key)}>
                            取消
                          </Button>
                        </div>
                      </Row>
                    </Form>
                  </Fragment>
                :
                <DescriptionList size="small">
                  <Description term="网关协议">{element.apiGatewaySchema}</Description>
                  <Description term="网关地址">{element.apiGatewayHost}</Description>
                  <Description term="网关端口">{element.apiGatewayPort}</Description>
                  <Description term="网关管理端口">{element.apiGatewayManagePort}</Description>
                  <Description term="授权服务器地址">{element.authServerAddress}</Description>
                  <Description term="授权服务器内网地址">{element.authServerInnerAddress}</Description>
                  <Description term="子域名">{element.subDomain}</Description>
                </DescriptionList>
                }
              </Card>
              )
          })
        }
        <div style={{padding:'0 16px 0 16px'}}>
          <Button
            style={{ width:'100%',marginBottom:24 }}
            type="dashed"
            onClick={this.newRecord}
            icon="plus" >
            添加环境
          </Button>
        </div>
      </Card>
    );
  }
}
const AntDe = Form.create()(EnvSetting);
export default AntDe;