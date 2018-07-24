import React, { Component } from "react";
import {Form , Button, Icon,Input,Col,message,InputNumber } from 'antd'
import constants from '../../../services/constants'
const FormItem=Form.Item;
let uuid=0
class ClusterForm extends Component{
  state={
    ip:[]
  }


  addUrls=()=>{
    const {form}=this.props;
		const keys=	form.getFieldValue('ip');
		const nextKeys = keys.concat(uuid);
		uuid++
		form.setFieldsValue({
			ip: nextKeys
		})
  }

  //输入框删除
  handleIpClose = (removedUrl) => {
    const {form} =this.props;
    const ip=form.getFieldValue('ip');
    //当input框是最后一个 则只是清除input框的值
    form.setFieldsValue({
      ip: ip.filter(key => key !== removedUrl)
    })
  }

  addCTXs=()=>{
    const {form}=this.props;
		const keys=	form.getFieldValue('ctx');
		const nextKeys = keys.concat(uuid);
		uuid++
		form.setFieldsValue({
			ctx: nextKeys
		})
  }
    //输入框删除
    handleCtxClose = (removedUrl) => {
      const {form} =this.props;
      const ctx=form.getFieldValue('ctx');
      //当input框是最后一个 则只是清除input框的值
      form.setFieldsValue({
        ctx: ctx.filter(key => key !== removedUrl)
      })
    }

  //创建
  handleClick=()=>{
    let reg=constants.reg.ip
    let flag=false;
    this.props.form.validateFields((err, values) => {
      let arys=[];
      let ary=[];
      if(values.ip){
        let ips=[];
        values.ip.forEach(item=>{
          let queryParams={
            ip:values['ips'+item],
            port:values['port'+item]
          }
          if(!reg.test(values['ips'+item])){
            message.error('集群IP格式错误,请参考127.0.0.1');
            flag=true;
            return ;
          }
          if(ips.indexOf(values['ips'+item])===-1){
            ips.push(values['ips'+item])
          }else{
            message.error('有重复数据，请先删除重复数据再提交');
            flag=true;
            return;
          }
          ary.push(queryParams)
        })
      }
      
      //将集群以及上下文都放入到arys里面
      arys.push({ip:ary,ctx:values.ctx})
      if(flag){
        return;
      }
      this.props.onOk(arys);
    })
  }

  render(){
		const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('ip',{ initialValue: [] })
    const ip = getFieldValue('ip');
    const formItemLayoutWithOutLabel = {
			wrapperCol: {
				xs: { span: 24, offset: 0 },
				sm: { span: 12, offset: 3 },
				md: {span:12,offset:5}
			},
    };

    const formTailLayout = {
      wrapperCol: {
        span: 6,
        offset: 17
      },
    };
		const formItemLayout = {
			labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    
    };
    
    const formItems = ip.map((k, index) => {
			return (
				<FormItem
					{...(index===0?formItemLayout:formItemLayoutWithOutLabel)}
					label={index === 0 ? '应用地址' : ''}
					key={k}
					>
            <Col span={10}>
              <FormItem >
              {getFieldDecorator(`ips${k}`)(<Input placeholder='IP'/>)}
              </FormItem>
            </Col>
            <Col span={2}>
              <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                -
              </span>
            </Col>
            <Col span={6}>
              <FormItem>
              {getFieldDecorator(`port${k}`)(<InputNumber placeholder='端口' min={0} max={65535}/>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={e => this.handleIpClose(k)}
              style={{marginLeft:20}}
              />
            </Col>
				</FormItem>
			);
    })
    
    return (
      <Form>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.addUrls} style={{ width: '60%' }}>
            <Icon type="plus" />新增应用地址
          </Button>
        </FormItem>

        <FormItem {...formItemLayout} label='上下文'>
							{getFieldDecorator('ctx')(
								<Input style={{ width: '60%', marginRight: 8 }}/>
							)}
				</FormItem>

        <FormItem {...formTailLayout}>
          <Button onClick = {this.props.stepback} > 上一步 </Button>
          <Button style={{marginLeft:24}} type='primary' onClick={this.handleClick}>创建</Button>
        </FormItem>
      </Form>
    )
  }
}
const Cluster=Form.create()(ClusterForm);
export default Cluster;