import React, { PureComponent } from 'react';
import { Switch,Modal,Form,Input,InputNumber,message } from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
class Component extends PureComponent {
  state = {
    visibleModal:false,
    healthChecked:false,
  };
  componentDidMount() {
    //console.log('healthcheck',this.props.probe);
    if(this.props.probe){
      this.setState({healthChecked:true});
    }else{
      this.setState({healthChecked:false});
    }
  }
  componentWillReceiveProps(nextProps) {
    //console.log('healthcheck11',nextProps.probe);
    if(nextProps.probe){
      this.setState({healthChecked:true});
    }else{
      this.setState({healthChecked:false});
    }
  }
  showConfirm = ()=>{
    confirm({
      title: '是否关闭健康检查?',
      onOk:()=> {
        this.props.onChangeProbe(null);
        this.setState({healthChecked:false});
      },
    });
  }
  handleHealtchClick = ()=>{
    if(!this.props.container){
      message.error('未填写容器名称，请先填写再开启健康检查');
      return;
    }
    if(!this.state.healthChecked){
      this.setState({visibleModal:true});
      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        portNumber:80,
        delay:100,
        period:30,
        interface:'',
      });
      this.setState({healthChecked:true});
    }else{
      this.showConfirm();
    }
    //this.setState({healthChecked:!this.state.healthChecked});
  }
  onOpenModal = ()=>{
    this.setState({visibleModal:true});
    const { setFieldsValue } = this.props.form;
    if(this.props.tcpSocket){
      setFieldsValue({
        portNumber:this.props.probe.tcpSocket.port.intVal,
        delay:this.props.probe.initialDelaySeconds,
        period:this.props.probe.periodSeconds,
        interface:'',
      });
    }
    if(this.props.httpGet){
      setFieldsValue({
        portNumber:this.props.probe.httpGet.port,
        delay:this.props.probe.initialDelaySeconds,
        period:this.props.probe.periodSeconds,
        interface:this.props.probe.httpGet.path,
      });
    }
  }
  handleModalOk = ()=>{
    const { validateFields } = this.props.form;
    validateFields((error, values) => {
      if (!error) {
        //console.log('ok',values);
        if(values.interface){
          let probe = {
            id: Math.random(),
            initialDelaySeconds: values.delay,
            timeoutSeconds: 5,
            periodSeconds: values.period,
            httpGet:{
              path: values.interface,
              port: {
                intVal:values.portNumber
              }
            }
          };
          this.setState({visibleModal:false});
          this.props.onChangeProbe(probe,true);
        }else{
          let probe = {
            id: Math.random(),
            initialDelaySeconds: values.delay,
            timeoutSeconds: 5,
            periodSeconds: values.period,
            tcpSocket: {
              port: {
                  intVal: values.portNumber
              }
            }
          };
          this.setState({visibleModal:false});
          this.props.onChangeProbe(probe);
        }
      }
    })
  }
  checkPath = ()=>{
    const { getFieldValue } = this.props.form;
     // eslint-disable-next-line
    let patt = /\/[^\s]*/;
    if(getFieldValue('interface') && !patt.test(getFieldValue('interface'))){
      this.setState({
        validatePath:'error',
        helpPath:'接口路径只能输入数字、字母、中文、下划线、横线、点、斜线,以斜线开头,如:/data'
      });
      return;
    }else{
      this.setState({
        validatePath:'',
        helpPath:''
      });
    }
  }
  render() {
    const { healthChecked,visibleModal } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    return (
      <div>
        <Switch style={{marginRight:16}} 
          checkedChildren="开" unCheckedChildren="关" checked={healthChecked} 
          onClick={this.handleHealtchClick} />
        {healthChecked?<a style={{fontSize:14}} onClick={this.onOpenModal}>修改</a>:''}
        <Modal 
          title="健康检查"
          visible={visibleModal}
          onOk={this.handleModalOk} 
          onCancel={()=>this.setState({visibleModal:false})} >
            <Form>
              <FormItem {...formItemLayout} label="端口">
                {getFieldDecorator('portNumber', {
                  rules: [{ required: true, message: '请输入端口' }],
                })(
                  <InputNumber min={1} max={65535} style={{width:'100%'}} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} 
                label="初始延时(s)">
                {getFieldDecorator('delay', {
                  rules: [{ required: true, message: '请输入初始延时' }],
                })(
                  <InputNumber min={1} max={10000} style={{width:'100%'}} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="周期(s)">
                {getFieldDecorator('period', {
                  rules: [{ required: true, message: '请输入周期' }],
                })(
                  <InputNumber min={1} max={10000} style={{width:'100%'}} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="接口"
                validateStatus={this.state.validatePath}
                help={this.state.helpPath} >
                {getFieldDecorator('interface')(
                  <Input onBlur={this.checkPath} placeholder="请输入接口路径，如：/path/test/xxx" />
                )}
              </FormItem>
            </Form>
        </Modal>
      </div>
    );
  }
}
const Antdes = Form.create({
  mapPropsToFields(props) {
    let path = '';
    let portNumber = 0 ;
    if(props.probe){
      if(props.probe.httpGet){
        path = props.probe.httpGet.path;
        portNumber = props.probe.httpGet.port.intVal;
      }else{
        portNumber = props.probe.tcpSocket?props.probe.tcpSocket.port.intVal:'';
      }
      return {
        portNumber: Form.createFormField({
          value: portNumber,
        }),
        delay: Form.createFormField({
          value: props.probe.initialDelaySeconds,
        }),
        period: Form.createFormField({
          value: props.probe.periodSeconds,
        }),
        interface: Form.createFormField({
          value: path,
        }), 
      };
    }
  }
})(Component);
export default Antdes;
