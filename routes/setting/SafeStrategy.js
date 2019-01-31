import React, { Component } from 'react';
import {BreadcrumbTitle} from '../../common/SimpleComponents';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import { AutoComplete, message, Card, InputNumber, Select, Form, Row ,Col, Input, Checkbox, Tooltip, Icon, Button, Switch} from 'antd';
import {getDataSource, updateSafeStrategy, getSafeStrategy} from '../../services/log'
const CheckboxGroup = Checkbox.Group;

const Option = Select.Option;

class SafeStrategyComponent extends Component {

    state={
        dataSource:[],
        switchEnable:{},
        display:{}
    }
    componentWillMount(){
        getDataSource().then(dataSource=>{
            getSafeStrategy().then((data)=>{
                dataSource.forEach((item,index)=>{
                        let code = item.code;
                        let obj = data[code];
                        item.securityPolicyConfigures.forEach((items)=>{
                            for(var key in obj){
                                if(key === items.code){
                                    items.defalutValue = obj[key];
                                }
                                if(key === "enable"){
                                    if(obj[key] === "true"){
                                        data[code].enable = true;
                                    }else if(obj[key] === "false"){
                                        data[code].enable = false;
                                    }
                                }
                            }
                        });
                    })
                this.setState({dataSource:dataSource,switchEnable:data});
            });
        })
    }

    //开关
    switchCheck(checked,code,index){
        let enable = this.state.switchEnable;
        enable[code].enable = checked;
        let date = [...this.state.dataSource];
        date[index].buttonEnable=true;
        this.setState({
            switchEnable:enable
        });
    }
    

    //保存
    submit(code,configures,index){
        let submitCode=[];
        configures.forEach((item)=>{
            submitCode.push(item.code);
        })
        this.props.form.validateFields(submitCode,(err)=>{
            if(!err){
                let bodyParams = this.props.form.getFieldsValue(submitCode);
                let enable = this.state.switchEnable;
                Object.assign(bodyParams,{enable:enable[code].enable})
                updateSafeStrategy(code,bodyParams)
                .then(()=>{
                    message.success('保存成功！');
                    let date = [...this.state.dataSource];
                    date[index].buttonEnable=false;
                    this.setState({dataSource:date})
                })
            }
        })
        
    }

    buttonEnable = (index)=>{
        let date = [...this.state.dataSource];
        date[index].buttonEnable=true;
        this.setState({dataSource:date})
    }

    renderCol = (arrays,index)=>{
        let dom = [];
        const {
            getFieldDecorator
          } = this.props.form;
        arrays.forEach((array)=>{
            if(array.type === "number"){
                dom.push(
                    <Col key={array.code} span={array.span} style={{ height: 110 }}>
                        <Form.Item style={{ height: '100%' }}>
                            <span>{array.name}</span>{array.desc?<Tooltip  title={array.desc}><Icon style={{marginLeft:5}} type="info-circle-o" /></Tooltip>:null}<br/>
                            {getFieldDecorator(array.code, {
                                initialValue:array.defalutValue,
                                rules: [{
                                    required: array.required,
                                    message:array.name + '必填',
                                  }],
                            })(<InputNumber onChange={()=>{this.buttonEnable(index)}}  min = {array.min} max={array.max} style={{ width: '60%',marginTop:10  }} />)}
                            {array.min||array.max?<span style={{marginLeft:5}}>({array.min?array.min:"-∞"}~{array.max?array.max:"∞"})</span>:null}  
                        </Form.Item>                      
                    </Col>
                )
            }else if(array.type === "select"){
                dom.push(
                    <Col key={array.code} span={array.span} style={{ height: 110 }}>
                        <Form.Item style={{ height: '100%' }}>
                            <span>{array.name}</span>{array.desc?<Tooltip  title={array.desc}><Icon style={{marginLeft:5}} type="info-circle-o" /></Tooltip>:null}<br/>
                            {getFieldDecorator(array.code, {
                                initialValue:array.defalutValue,
                                rules: [{
                                    required: array.required,
                                    message:array.name + '必填',
                                  }],
                            })(<Select onChange={()=>{this.buttonEnable(index)}} style={{ width:'60%', marginTop:10 }}  allowClear>
                                    {array.items.map((item)=>{
                                        return (<Option key={array.code} value={item.value}>{item.name}</Option>)
                                    })}  
                                </Select>)}
                        </Form.Item>
                    </Col>
                )
            }else if(array.type === "inputSelect"){
                dom.push(
                    <Col key={array.code} span={array.span} style={{ height: 110 }}>
                        <Form.Item style={{ height: '100%' }}>
                            <span>{array.name}</span>{array.desc?<Tooltip  title={array.desc}><Icon style={{marginLeft:5}} type="info-circle-o" /></Tooltip>:null}<br/>
                            {getFieldDecorator(array.code, {
                                initialValue:array.defalutValue,
                                rules: [{
                                    required: array.required,
                                    message:array.name + '必填',
                                  }],
                            })(<AutoComplete
                                dataSource={array.items.map((item)=>{
                                    return (<Option key={array.code} value={item.value}>{item.name}</Option>)
                                })}
                                onChange={()=>{this.buttonEnable(index)}}
                                dropdownMatchSelectWidth={true}
                                style={{ width: '60%', marginTop:10 }}
                            >
                                <Input onChange={()=>{this.buttonEnable(index)}}/>
                            </AutoComplete>)}
                        </Form.Item>
                    </Col>
                )
            }else if(array.type === "input"){
                dom.push(
                    <Col key={array.code} span={array.span} style={{ height: 110 }}>
                        <Form.Item style={{ height: '100%' }}>
                            <span>{array.name}</span>{array.desc?<Tooltip  title={array.desc}><Icon style={{marginLeft:5}} type="info-circle-o" /></Tooltip>:null}<br/>
                            {getFieldDecorator(array.code, {
                                initialValue:array.defalutValue,
                                rules: [{
                                    required: array.required,
                                    message:array.name + '必填',
                                  },{
                                    pattern:array.regex,
                                    message:array.name + '格式错误'
                                  }],
                            })(<Input onChange={(e)=>{this.buttonEnable(index)}}  style={{ width:'60%', marginTop:10 }}/>)}
                        </Form.Item>
                    </Col>
                )
            }else if(array.type === "checkbox"){
                dom.push(
                    <Col key={array.code} span={array.span} style={{ height: 110 }}>
                        <Form.Item style={{ height: '100%' }}>
                            <span>{array.name}</span>{array.desc?<Tooltip  title={array.desc}><Icon style={{marginLeft:5}} type="info-circle-o" /></Tooltip>:null}<br/>
                            {getFieldDecorator(array.code, {
                                initialValue:array.defalutValue,
                                rules: [{
                                    required: array.required,
                                    message:array.name + '必填',
                                  }],
                            })(<CheckboxGroup style={{ width:'60%', marginTop:10 }} onChange={()=>{this.buttonEnable(index)}} options={array.options}   />)}     
                        </Form.Item>
                    </Col>
                )
            }
        })
        return dom;
    }

    renderCard = (item,index)=>{
        let dom = [];
        dom.push(<Card key={item.code} bordered={false} title={item.name} style={{marginBottom:24}} extra={<div><Button onClick={()=>{this.submit(item.code,item.securityPolicyConfigures,index)}} type="primary" disabled={!this.state.dataSource[index].buttonEnable} style={{marginRight:20}} >保存</Button></div>}>
                    <Form onSubmit={this.submit} key={item.code}>
                        <Row style={{marginBottom:20}}>
                            <span>是否启用：</span><Switch style={{marginLeft:20}} size={"default"} onChange={(checked)=>{this.switchCheck(checked,item.code,index)}} checkedChildren="开" unCheckedChildren="关" checked={this.state.switchEnable[item.code].enable} />
                        </Row>
                        <Row key={item.code} style={{display:this.state.switchEnable[item.code].enable?null:'none'}}>
                            {this.renderCol(item.securityPolicyConfigures,index)}
                        </Row>
                    </Form>
                </Card>)
        return dom;
    }

    render(){    
        const breadcrumbTitle = BreadcrumbTitle([{name:'高级设置'},{name:'安全策略'}]);

        return (
          <PageHeaderLayout
            title={breadcrumbTitle}
            content="安全策略设置包括密码策略和登录策略的设置，用以保护系统的安全性。"
          >          
           {this.state.dataSource.map((item,index)=>{
                 let dom = this.renderCard(item,index);
                 return (dom)
           })}           
          </PageHeaderLayout>
        );
    }
} 


const SafeStrategy = Form.create()(SafeStrategyComponent);
export default SafeStrategy;