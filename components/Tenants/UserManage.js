import React, { Component } from "react";
import { Table, Card, Popconfirm, message, Row, Col, Button, Input,Modal,Form,Select } from "antd";
import { getUserDictdata } from "../../services/uop";
import { getTenantUsers, deleteTenantUser, addTenantUser } from '../../services/tp';
import UserSelectModal from '../../common/UserSelectModal';
import moment from 'moment';
import constants from '../../services/constants';
import Authorized from "../../common/Authorized";

const Option = Select.Option;

class Components extends Component {
  state = {
    loading: false,
    data: [],
    page: 1,
    row: 10,
    total: 0,
    visibleModal:false,
    searchText:'',
    dictdata:{},
  };
  tempData = [];
  componentDidMount() {
    this.loadData(this.props.tenantId);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.tenantId && this.props.tenantId !==nextProps.tenantId){
      this.loadData(nextProps.tenantId);
    }
  }
  loadData = (tenantId) => {
    if(tenantId && tenantId !== ''){
      this.setState({loading:true});
      getTenantUsers(tenantId).then(data => {
        this.setState({ 
          data,
          loading:false,
          page:1,
          row:10,
          total:data.length
        });
        this.tempData = data;
      }).catch(err=> this.setState({ loading:false }));
      getUserDictdata().then(data=>{
        this.setState({dictdata:data});
      });
    }
    
  };
  onManagerChange = (users) => {
    addTenantUser(this.props.tenantId,users).then(values=>{
      message.success('添加用户到指定租户成功');
      this.loadData(this.props.tenantId);
    });
  }
  handleModalOk = ()=>{
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if(values.email && !constants.reg.email.test(values.email)){
          this.setState({
            validateEmail:'error',
            helpEmail:'请输入正确的邮箱地址'
          });
          return;
        }else{
          this.setState({
            validateEmail:'',
            helpEmail:''
          });
        }
        if(values.certificateNum && values.certificateType!=='other' &&!constants.reg.certificateNum.test(values.certificateNum)){
          this.setState({
            validateCertificateNum:'error',
            helpCertificateNum:'请输入正确的证件号码'
          });
          return;
        }else if(values.certificateNum && constants.reg.certificateNum.test(values.certificateNum)){
          this.setState({
            validateCertificateNum:'',
            helpCertificateNum:''
          });
        }
        this.setState({visibleModal:false});
        addTenantUser(this.props.tenantId,[values]).then(data=>{
          message.success('添加用户到指定租户成功');
          this.loadData(this.props.tenantId);
        }); 
      }else{
        if(!values.certificateNum){
          this.setState({
            validateCertificateNum:'error',
            helpCertificateNum:'请输入证件号码'
          });
        }
      }
    });
  }
  onDelete=(id)=>{
    deleteTenantUser(this.props.tenantId,id).then(data=>{
      this.loadData(this.props.tenantId);
      message.success('从租户中删除指定用户成功');
    })
  }
  onSearchUser=(searchText)=>{
    let data = this.tempData;
    if(searchText){
      data = this.tempData.filter(element=>{
        return element.name.indexOf(searchText) > -1
      })
    }
    this.setState({data});
  }
  onAddUser = ()=>{
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      sex:this.state.dictdata['sex'][0].value,
      state:this.state.dictdata['state'][0].value,
      certificateType:this.state.dictdata['certificateType'][2].value
    });
    this.setState({
      visibleModal:true,
      validateCertificateNum:'',
      helpCertificateNum:'',
      validateEmail:'',
      helpEmail:''
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: "姓名",
      dataIndex: "name",
      width: "15%",
      render:(text,record)=>{
        return record.name?record.name:record.userName;
      }
    }, {
      title: "工号",
      dataIndex: "workno",
      width: "15%"
    }, {
      title: "邮箱",
      dataIndex: "email",
      width: "25%"
    }, {
      title: "联系电话",
      dataIndex: "phone",
      width: "15%",
    }, {
      title: "创建时间",
      dataIndex: "createAt",
      width: "15%",
      render: (text, record) => {
        return moment(text).format("YYYY-MM-DD HH:mm");
      }
    }, {
      title: "操作",
      width: "15%",
      render: (text, record) =>  
      <Authorized authority={'tenant_deleteUser'} noMatch={<a disabled='true'>删除</a>}>
        <Popconfirm title="是否要将此用户从当前租户移除？" onConfirm={() => this.onDelete(record.id)}>
            <a>删除</a>  
        </Popconfirm> 
      </Authorized>
    }];
    const pagination = {
      total: this.state.total,
      current: this.state.page,
      pageSize: this.state.row,
      onChange: (current, pageSize) => {
        this.setState({
          page: current,
          row: pageSize
        })
      },
    };
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Card style={{ margin: '24px 24px 0 24px' }}>
        <Row style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Row type={'flex'} align='middle'>
              <Col style={{width:70}} span={6}>用户名称:</Col>
              <Col span={18}>
                <Input
                  onPressEnter={e => { e.preventDefault();this.onSearchUser(e.target.value) }}
                  onChange={(e) => { this.setState({ searchText: e.target.value }) }}
                  value={this.state.searchText} placeholder="请输入" />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
          </Col>
          <Col span={8}>
            <Button type="primary" htmlType="submit" onClick={() => this.onSearchUser(this.state.searchText)}>查询</Button>
            <Button style={{ marginLeft: 8 }} 
              onClick={() => { this.setState({ data:this.tempData,searchText:'' }) }}>重置</Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: 24 }} type='flex'>
          <Authorized authority={'tenant_addUser'} noMatch={null}>
            <Button type="primary" onClick={() => this.onAddUser()}>添加</Button>
          </Authorized>
          <UserSelectModal
            renderButton={() => { return <Authorized authority={'tenant_importUser'} noMatch={null}><Button style={{marginLeft:8}}>导入</Button></Authorized> }}
            title='导入用户'
            mark='待添加租户用户'
            description=''
            dataIndex={{ dataIdIndex: 'id', dataNameIndex: 'name' }}
            onOk={(users) => { this.onManagerChange(users) }} 
            disableUsers={ this.state.data}
            />
        </Row>
        <Modal width={800}
          title="添加用户"
          visible={this.state.visibleModal}
          onOk={this.handleModalOk} 
          onCancel={()=>this.setState({visibleModal:false})}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="姓名">
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入姓名!' },
                  ],
                })(
                  <Input />
                )}
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item {...formItemLayout} label="工号">
              {getFieldDecorator('workno', {
                rules: [
                  { required: true, message: '请输入工号!' },
                ],
              })(
                <Input />
              )}
              </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} 
                  validateStatus={this.state.validateEmail}
                  help={this.state.helpEmail} label="邮箱">
                {getFieldDecorator('email')(
                  <Input />
                )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="电话">
                  {getFieldDecorator('phone')(
                    <Input />
                  )}
                  </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="性别">
                {getFieldDecorator('sex')(
                  <Select>
                    {this.state.dictdata['sex']?
                      this.state.dictdata['sex'].map(element=>{
                        return <Option key={element.value} value={element.value}>{element.name}</Option>
                      }) :''
                    }
                  </Select>
                )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} 
                  validateStatus={this.state.validateCertificateNum}
                  help={this.state.helpCertificateNum} label="证件号">
                {getFieldDecorator('certificateNum', {
                  rules: [
                    { required: true },
                  ],
                })(
                  <Input />
                )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="证件类型">
                {getFieldDecorator('certificateType')(
                  <Select>
                    {this.state.dictdata['certificateType']?
                      this.state.dictdata['certificateType'].map(element=>{
                        return <Option key={element.value} value={element.value}>{element.name}</Option>
                      }) :''
                    }
                  </Select>
                )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('state')(
                  <Select>
                    {this.state.dictdata['certificateType']?
                      this.state.dictdata['state'].map(element=>{
                        return <Option key={element.value} value={element.value}>{element.name}</Option>
                      }) :''
                    }
                  </Select>
                )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Table
          columns={columns}
          pagination={pagination}
          dataSource={this.state.data}
          loading={this.state.loading}
        />
      </Card>
    );
  }
}
const UserManage = Form.create()(Components);
export default UserManage;

