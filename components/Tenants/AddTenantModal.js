import React, { Component } from "react";
import { Modal,Button,Form,Input,Row,Col,Message} from "antd";
import OrgSelectModal from '../../common/OrgSelectModal';
import { AddTenant, DeleteTenant } from '../../services/tp';
import { AddCCETenant } from '../../services/cce'
import constants from '../../services/constants';
import { base } from '../../services/base'

const FormItem = Form.Item;
class AddTenantModal extends Component{

    constructor(props){
        super(props);
        this.state = {
          loading:false,
          org:{},
          validateStatus:'success',
          errorMessage:'',
          tenantIds:[]
        }
        this.name = '';
        this.value = '';
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount(){
        this.props.form.setFieldsValue({
            name:'',
            code:''
          });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.tenantIds && nextProps.tenantIds !== this.props.tenantIds){
            this.setState({
                tenantIds:nextProps.tenantIds
            })
        }
    }

    addTenants=(org)=>{
        this.props.form.setFieldsValue({
            name:org.name,
            code:org.code
          });
        this.setState({
            org:org
        });
        
       this._hanldeCodeChange(org.code);
       this._hanldeNameChange(org.name);
    }

    _hanldeNameChange = (e) =>{
        this.name = e;
    }

    _hanldeCodeChange = (e) =>{

        if(e == null || e === ""){
            return ;
        }
          let tenantCodes = this.props.tenantCodes;
          let j = 0;
          if(tenantCodes != null && tenantCodes.length > 0){
            for(let i = 0 ; i < tenantCodes.length ; i++){
                if(e === tenantCodes[i]){
                   //提示租户编码已存在
                   this.setState({
                       validateStatus:'error',
                       errorMessage:'租户编码已存在'
                   });
                   break;
                }else{
                    j ++ ;
                }
            }
   
            if(j === tenantCodes.length){             
               //租户编码未被使用过
               this.code = e;
               this.setState({
                   validateStatus:'success',
                   errorMessage:''              
               });
            }
          }
         
      }

    handleOk = (e) => {
        if(this.state.validateStatus !== 'error'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.setState({
                        loading:true,
                        validateStatus:'success',
                        errorMessage:''
                      })
                      let bodyParams={
                        code:constants.TENANT_CODE[0],
                        id:this.state.org.id,
                        name:this.name,
                        tenant_code:this.code.slice(0,20)
                      }
                      AddTenant(bodyParams).then(data=>{
                        if(data){
                            bodyParams.name = this.code;
                            //cce权限
                            if(base.configs.passEnabled){
                                AddCCETenant(bodyParams).then(response=>{
                                    if(response){
                                        Message.success('新增租户成功！');
                                        this.setState({
                                            loading: false
                                        })
                                        this.handleCancel(data);
                                        
                                    }
                                }).catch(e=>{
                                    base.ampMessage('新增租户出错' );
                                    this.setState({
                                    loading: false
                                    })
                                    DeleteTenant(data.id,data.code).then();
                                });
                            }else{
                                this.setState({
                                    loading: false
                                });
                                this.handleCancel(data);
                            }
                        }
                      }).catch(e=>{
                        base.ampMessage('新增租户出错' )
                        this.setState({
                          loading: false
                        })
                      })
                }else{
    
                    if(err.code.errors){
                        let errors = err.code.errors;
                        for(let i = 0 ; i < errors.length ; i ++){
                            if(errors[i].field === 'code'){
                                this.setState({
                                    validateStatus:'error',
                                    errorMessage:errors.message
                                });
                            }
                        }
                    }
                }
            });
        }
        
    }

    handleCancel = (e) => {
        //this.props.onCancle(e);
        this.setState({
            visible:false
        });
        this.props.transferVisible(false);
    }

    _compareCodeLength = (rule, value, callback) =>{
        const form = this.props.form;
        if (value && value !== form.getFieldValue('code')) {
            callback('编码长度!');
        } else {
            callback();
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 7 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
              md: { span: 13 },
            },
          };
        return (
            <Modal title="新增租户"
                style={{top:20}}
                visible={this.props.visible}
                onOk={this.handleOk} 
                onCancel={this.handleCancel}
                destroyOnClose={true}
                footer={[<Button key='cancel' onClick={this.handleCancel}>取消</Button>,
               	   <Button key='submit' loading={this.state.loading} type="primary" onClick={this.handleOk}>确定</Button>
               	]}
            >
                <Form>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={18} sm={48}>
                            <FormItem {...formItemLayout} 
                                style={{ marginBottom: 12 }} label="租户名称">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入租户名称' }],
                                    })(
                                    <Input onChange={e=>this._hanldeNameChange(e.target.value)}/>
                                 )}
                                
                            </FormItem>
                        </Col>
                        <Col md={6} sm={24}>
                            <FormItem {...formItemLayout}>
                                <OrgSelectModal isOffset={true} renderButton={() => { return <Button type='primary'>选择机构</Button> }} onOk={org => this.addTenants(org)} checkableTopOrg={false} checkableCategoryOrg={false} disabledOrg={this.state.tenantIds}/>
                             </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={18} sm={48}>
                            <FormItem {...formItemLayout} style={{ marginBottom: 12 }} label="租户编码" 
                                 validateStatus={this.state.validateStatus}
                                 help={this.state.errorMessage}
                            >
                             {getFieldDecorator('code', {
                                    rules: [{ required: true, message: '请输入租户编码' },
                                    {pattern: '^[A-Za-z0-9_]+$',message: '只支持英文、数字、下划线!'},
                                    {max:20,message: '编码长度不能超过20!'}
                                ],})(
                                    <Input onChange={e=>this._hanldeCodeChange(e.target.value)}/>
                            )}
                               
                            </FormItem>
                        </Col>
                     
                    </Row>
                </Form>
                
     
             </Modal>)
    };
}

const Antdes = Form.create()(AddTenantModal);
export default Antdes;