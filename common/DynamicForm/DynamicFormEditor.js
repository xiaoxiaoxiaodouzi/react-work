import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Button, Select,Checkbox, Switch  } from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

/**
 *动态表单编辑弹窗
 * 
 * data属性：
 * label,name,attribute,required,requiredMessage,regExp,regExpMessage,fieldDecoratorOptions
 * 
 * type: select,number,hidden,input(default)
 * 
 * options:{label,value}
 */
class DynamicFormEditor extends PureComponent {
  constructor (props){
    super(props);
    let formItems = this.initData(props.items,props.data);
    this.state = {
      formItems
    }
    if(typeof props.getForm === 'function')props.getForm(props.form);
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.data !== this.props.data || nextProps.items !== this.props.items){
      let formItems = this.initData(nextProps.items,nextProps.data);
      this.setState({formItems});
    }
  }

  initData = (items,data)=>{
    let formItems = [];
    if(items && items instanceof Array){
      formItems = [...items];
    }else if(items && items instanceof Object){
      formItems.push(items);
    }
    setTimeout(()=>{
      this.props.form.setFieldsValue(data);
    });
    return formItems;
  }
  handleSubmit = ()=>{
    this.props.form.validateFields((errors, values) => {
      this.props.onSubmit(errors,values);
    })
  }

  render() {
    let { formItems} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: this.props.labelSpan },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: this.props.wrapperSpan },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      }
    }
    const getElement = (item)=>{
      let rules = [];
      if(item.required)rules.push({required: true, message: item.requiredMessage?item.requiredMessage:'请填写'+item.label})
      if(item.regExp)rules.push({pattern: item.regExp,message:item.regExpMessage?item.regExpMessage:item.label+'格式错误'})
      let fieldDecoratorOptions = {rules};
      if(item.initialValue)fieldDecoratorOptions.initialValue = item.initialValue;
      if(item.fieldDecoratorOptions)fieldDecoratorOptions = item.fieldDecoratorOptions;
      switch (item.type) {
        case 'select':
          return getFieldDecorator(item.name,fieldDecoratorOptions)(
            <Select {...item.attribute}>
              {item.options&&item.options.map((o,i)=>
                <Option key={i} value={o.value}>{o.label}</Option>
              )}
            </Select>
          )

        case 'number':{
          return getFieldDecorator(item.name,fieldDecoratorOptions)(
            <InputNumber {...item.attribute} />
          )
        }
        case 'checkboxGroup':{
          return getFieldDecorator(item.name,fieldDecoratorOptions)(
            <CheckboxGroup options={item.options} {...item.attribute}/>
          )
        }
        case 'switch':{
          fieldDecoratorOptions.valuePropName = 'checked';
          return getFieldDecorator(item.name,fieldDecoratorOptions)(
            <Switch {...item.attribute}/>
          )
        }

        case 'hidden':{
          return getFieldDecorator(item.name,fieldDecoratorOptions)(
            <Input />
          )
        }
      
        default:
          return getFieldDecorator(item.name,fieldDecoratorOptions)(
            <Input {...item.attribute} />
          )
      }
    }

    const buttonItem = ()=>{
      if(this.props.footer === null)return '';
      else if(typeof this.props.footer === 'object'){
        return (
          <FormItem {...tailFormItemLayout}>
            {this.props.footer}
          </FormItem>
        )
      }else{
        return (
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.handleSubmit}>{this.props.submitText}</Button>
          </FormItem>
        )
      }
    }
    return (
      <Form layout='horizontal'>
        {
          formItems.map((item,index)=>
            <FormItem key={index} label={item.label} {...formItemLayout} style={{display:item.type==='hidden'?'none':'block'}}>
              {getElement(item)}
            </FormItem>
          )
        }
        
        {buttonItem}
      </Form>
    )
  }
}

DynamicFormEditor.propTypes  = {
  items:PropTypes.oneOfType([PropTypes.array,PropTypes.object]),//表单元素定义
  data:PropTypes.object,//数据
  getForm:PropTypes.func,//antd form对象
  onChange:PropTypes.func,//表单值改变事件
  onSubmit:PropTypes.func,//默认的提交按钮事件
  submitText:PropTypes.string,//提交按钮文本
  footer:PropTypes.node,//自定义底部提交按钮
  labelSpan:PropTypes.number,
  wrapperSpan:PropTypes.number,
}

DynamicFormEditor.defaultProps = {
  submitText: '提交',
  labelSpan: 8,
  wrapperSpan: 12
};

export default Form.create({
  //表单值变化事件，回调到
  onValuesChange:(props, changedValues, allValues)=>{
    if(typeof props.onChange === 'function')props.onChange(allValues);
  }
})(DynamicFormEditor);
