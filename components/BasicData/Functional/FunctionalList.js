import React, { PureComponent,Fragment } from 'react';
import { Row, Col, Form, Input, Select, Button, Table, Icon, Divider,message} from 'antd';
import Link from 'react-router-dom/Link';
import { getResources, queryAppAIP } from '../../../services/aip'
import { GlobalHeaderContext } from '../../../context/GlobalHeaderContext'
import constants from '../../../services/constants'
import RoleResourceModal from './RoleResourceModal'
import { base } from '../../../services/base';
import Authorized from '../../../common/Authorized';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';


const FormItem = Form.Item;
const { Option } = Select;
class TableList extends PureComponent {

  state = {
    total: 0,
    pageSize: 10,
    current: 1,
    totalPage: 1,
    expandForm: false,
    visible: false,
    dataSource: [],
    apps: [],
    selectedKeys:[],
    disableSelectedKeys:[],
    onSelectedKeys:[],
    roleList:[],        //所有角色列表
    checkedValues:[],      //选中的角色
    RoleResources:[] ,     //选中角色的资源
    record:{},        //选中行数据
    title:'',           //模态框title
    loading:false,
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.environment!== this.props.environment){
      queryAppAIP(null,{'AMP-ENV-ID':base.environment}).then(data => {
        this.setState({ apps: data })
      })
      this.loadData(1, 10);
    }
  }
  componentDidMount() {
    if(this.props.permissions)base.allpermissions = this.props.permissions;
    queryAppAIP(null,{'AMP-ENV-ID':base.environment}).then(data => {
      this.setState({ apps: data })
    })
    this.loadData(1, 10);
  }

  loadData = (current, pageSize, params) => {
    this.setState({loading:true})
    let queryParams = {
      type: 'function',    //只查功能
      page: current,
      rows: pageSize
    }
    //if(base.isAdmin) queryParams.withOutAuthorize = true;
    let query = Object.assign({}, queryParams, params);
    getResources(query).then(data => {
      this.setState({loading:false, dataSource: data.contents, current: data.pageIndex, pageSize: data.pageSize, total: data.total, totalPage: data.totalPage })
    }).catch(err=>{
      this.setState({loading:false})
    })
  }

  //切换查询表格
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    })
  }
  //表格参数重置
  handleFormReset = () => {
    this.loadData(1, 10);
    const { form } = this.props;
    form.resetFields();
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // if(values.functionType === 'all'){
        //   delete values['functionType'];
        // }
        this.loadData(1, 10, values);
      }
    });
  }

  //处理功能管理员设置modal回调
  handleAuthorizeModal = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.loadData(this.state.current, this.state.pageSize, values);
        this.setState({authorizeVisible:false})
      }
    });
  }

  handleSelect = (id) => {
    this.loadData(1, 10, { appId: id });
  }

  onManagerModal = (userCollection,record,type,title)=>{
    if(record.roleList.length===0){
      message.warning('该功能没有授予任何角色，不能够进行'+title+'！');
      return ;
    }
    record.roleList.forEach(i=>{
      i.label=i.name;
      i.value=i.id;
    })
    this.setState({ authorizeVisible: true,selectedKeys:userCollection ,roleList:record.roleList,record,type,title});
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
    return (
      <div className='tableList'>
        <Form onSubmit={this.handleSearch}>
        <Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
            <Col span={7}>
              <FormItem {...formItemLayout} label="功能名称">
                {getFieldDecorator('name')(<Input onChange={(value) => {this.name=value}} placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="所属应用">
                {getFieldDecorator('appId')(
                  <Select 
                  showSearch
                    placeholder="请选择"
                    onSelect={this.handleSelect}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input.toLowerCase()) >= 0 }
                  >
                    {this.state.apps.map(e => {
                      return <Option key={e.id} value={e.id}>{e.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
                <FormItem {...formItemLayout} label="功能分类">
                {getFieldDecorator('functionType')(
                    <Select>
                        <Option key='web' value = 'web'>WEB</Option>
                        <Option key='app' value = 'app'>APP</Option>
                    </Select>
                )}
                </FormItem>
            </Col>
            <Col span={5}>
              <span>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a> */}
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
    return (
      <div className='tableList'>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row style={{ marginBottom: 12 }} gutter={{ md: 4, lg: 12, xl: 18 }}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="功能名称">
                {getFieldDecorator('name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="所属应用">
                {getFieldDecorator('app')(
                  <Select
                    showSearch
                    placeholder="请选择"
                    onSelect={this.handleSelect}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.indexOf(input.toLowerCase()) >= 0 }
                  >
                    {this.state.apps.map(e => {
                      return <Option key={e.id} value={e.id}>{e.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="管理员">
                {getFieldDecorator('admin')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 4, lg: 12, xl: 18 }}>
            <Col style={{ marginTop: 16 }} span={8}>
              <FormItem label="已授权用户集合">
                {getFieldDecorator('users')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{ overflow: 'hidden', marginBottom: 12 }}>
            <span style={{ float: 'right', marginTop: 16 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </div>
        </Form>
      </div >
    )
  }

  render() {
    const pagination = {
      showTotal: total => `共 ${total} 条记录  第 ${this.state.current}/${this.state.totalPage} 页`,
      total: this.state.total,
      pageSize: this.state.pageSize,
      current: this.state.current,
      totalPage: this.state.totalPage,
      onChange: (current, pageSize) => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.loadData(current, pageSize, values);
          }
        });
      }
    }

    const columns = [{
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => {
        return <Link style={{whiteSpace:'nowrap'}} to={`applications/${record.appId}/functional/${record.id}`}>{text}</Link>
      }
    }, {
      title: '所属应用',
      dataIndex: 'appName',
      render: (text, record) => {
        return (
          <Authorized authority='functional_appRedirect' noMatch={<span style={{whiteSpace:'nowrap'}}>{text}</span>}>
            <Link style={{whiteSpace:'nowrap'}} to={`apps/${record.appId}`}>{text}</Link>
          </Authorized>
        )
      }
    },{
      title: '所属角色',
      dataIndex: 'roleList',
      render: (values, record) => {
        return values.length>0?values.map((element,index)=>{
          return <Fragment key={index}><Link style={{marginRight:5,whiteSpace:'nowrap'}} to={`/applications/${element.appId}/functionalroles/${element.id}`}>{element.name}</Link> </Fragment>;
        }):'--';
      }
    }, {
      title: '管理员',
      dataIndex: 'managers',
      render: (value,record)=>{
        let newArray=[];
        value.forEach(i=>{
          if(newArray.filter(t=>t.id!==i.id).length===0){
            newArray.push(i)
          }
        })
        return <Ellipsis tooltip lines={1}>
          {newArray.length>0?newArray.map((u,index)=>{
            return <Fragment key={index}><span style={{marginRight:5}}>[{constants.functionResource.userCollectionType[u.userCollectionType]}]{u.userCollectionName}</span> </Fragment>;
          }):'--'}
        </Ellipsis>
      }
    }, {
      title: '已授权用户集合',
      dataIndex: 'userCollections',
      render: (value,record)=>{
        return <Ellipsis tooltip lines={1}>
          {value.length>0?value.map((u,index)=>{
            return <Fragment key={index}><span style={{marginRight:5}}>[{constants.functionResource.userCollectionType[u.userCollectionType]}]{u.userCollectionName}</span> </Fragment>;
          }):'--'}
        </Ellipsis>
      }
    }, {
      title: '操作',
      width: '180px',
      key: 'action',
      render: (text, record) => {
        return (
          <span style={{whiteSpace: 'nowrap'}}>
            <Authorized authority='functional_roleUser' noMatch={<a disabled='true' onClick={() => this.onManagerModal(record.userCollections,record,'addUsers','角色授权用户设置')} >授权用户</a>}>
              <a onClick={() => this.onManagerModal(record.userCollections,record,'addUsers','角色授权用户设置')} >授权用户</a>
            </Authorized>
            <Divider type='vertical' />
            <Authorized authority='functional_setManager' noMatch={<a disabled='true' onClick={() => this.onManagerModal(record.managers,record,'addManagers','功能管理员设置')} >设置管理员</a>}>
              <a onClick={() => this.onManagerModal(record.managers,record,'addManagers','功能管理员设置')} >设置管理员</a>
            </Authorized>
          </span>
        )
      }
    }];
    
    return (
      <div>
        {this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}
        <Table 
        style={{ marginTop: 24 }}
          rowKey='id'
          dataSource={this.state.dataSource}
          pagination={this.state.dataSource?pagination:null}
          columns={columns} 
          loading={this.state.loading}
          />
        <RoleResourceModal title={this.state.title} type={this.state.type} record={this.state.record} visible={this.state.authorizeVisible} handleAuthorizeModal={this.handleAuthorizeModal}/>
      </div>
    );
  }
}
const FunctionlaList = Form.create()(TableList);
export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <FunctionlaList {...props} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
)