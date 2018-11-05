import React, { Component,Fragment } from 'react';
import { Table, Row, Col, Form, Input, Select, Button} from 'antd';
import { getResourceUser,getResourceUserCollections} from '../../../services/functional'
import PropTypes from 'prop-types'
import Link from 'react-router-dom/Link';
import constants from '../../../services/constants'
import { ObjectDetailContext } from '../../../context/ObjectDetailContext'
import {FastJson} from '../../../utils/utils'
const FormItem = Form.Item;
const { Option,OptGroup } = Select;

class ResourceUserForm extends Component {
  static propTypes = {
    prop: PropTypes.object,
  }

  state = {
    data: [],
    current: 1,
    total: 0,
    pageSize: 10,
    loading: false,
    userCollections:[],
    jobs:[],
    orgs:[],
    groups:[]
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.roleList!==this.props.roleList){
      this.loadDatas(1,10);
      this.loadCollections();
    }
  }

  loadDatas = (current,pageSize,params) => {
    this.setState({ loading: true })
    getResourceUser(this.props.appId, this.props.id, Object.assign({},params,{page:current,rows:pageSize})).then(datas => {
      FastJson.format(datas);
      this.setState({ loading: false, total: datas.total, data: datas.contents})
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  loadCollections = () =>{
    getResourceUserCollections(this.props.appId, this.props.id,).then(data=>{
      if(data){
        let jobs = [];
        let orgs = [];
        let groups = [];
        data.forEach(element => {
          if(element.userCollectionType === "USERGROUP"){
            groups.push(element);
          }else if(element.userCollectionType === "JOB"){
            jobs.push(element);
          }else{
            orgs.push(element);
          }
        
        });
        this.setState({
          jobs:jobs,
          orgs:orgs,
          groups:groups
        });
      }

   })
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.loadDatas(this.state.current,this.state.pageSize,values)
      };
    });
  }

  onSelect = (value) =>{
    let roleId = this.props.form.getFieldValue('roleId');
    this.loadDatas(1,10,{userCollectionId:value,roleId:roleId});
  }

  onRoleSelect = (value) =>{
    let userCollectionId = this.props.form.getFieldValue('userCollectionId');
    this.loadDatas(1,10,{userCollectionId:userCollectionId,roleId:value});
  }


  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.loadDatas(this.state.current,this.state.pageSize);
  }

  renderSimple = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='tableList'>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row style={{ marginBottom: 12 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="用户名">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="用户集合">
                {getFieldDecorator('userCollectionId')(
                  <Select placeholder="请选择" notFoundContent='无数据' onSelect={this.onSelect}>
                    {this.state.jobs.length > 0 ?

                      <OptGroup label="岗位">
                         {this.state.jobs.map((value, index) => {
                          return (
                            <Option key={index} value={value.userCollectionId}>{value.userCollectionName}</Option>
                          )
                         })}
                      </OptGroup>

                      : null
                    }
                    {this.state.orgs.length > 0 ?

                      <OptGroup label="机构">
                        {this.state.orgs.map((value, index) => {
                          return (
                            <Option key={index} value={value.userCollectionId}>{value.userCollectionName}</Option>
                          )
                       })}
                      </OptGroup>

                      : null
                    }
                    {this.state.groups.length > 0 ?

                        <OptGroup label="用户组">
                          {this.state.groups.map((value, index) => {
                            return (
                              <Option key={index} value={value.userCollectionId}>{value.userCollectionName}</Option>
                            )
                           })}
                        </OptGroup>

                         : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="功能角色">
                {getFieldDecorator('roleId')(
                  <Select placeholder="请选择" onSelect={this.onRoleSelect}>
                    {this.props.roleList.length > 0 ?
                      this.props.roleList.map((value, index) => {
                        return (
                          <Option key={index} value={value.id}>{value.name}</Option>
                        )
                      }) : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <span style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  render() {

    const { current, total, pageSize, loading, data } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        width:'20%',
      },
      {
        title: '角色',
        dataIndex: 'roleList',
        width:'30%',
        render: (text, record) => {
          if (record.roleList) {
            return record.roleList.map(element => {
              if(element){
                return <Link style={{ marginLeft: 6 }} to={`/applications/${element.appId}/functionalroles/${element.id}`}>{element.name}</Link>
              }else{
                return ''
              }
            })
          } else {
            return '--'
          }
        }
      },
      {
        title: '权限来源',
        dataIndex: 'userCollections',
        width:'50%',
        render: (value, record) => {
          return value.length>0?value.map(u=>{
            return <Fragment><span style={{marginRight:5,whiteSpace:'nowrap'}}>[{constants.functionResource.userCollectionType[u.userCollectionType]}]{u.userCollectionName}</span> </Fragment>;
          }):'--';
        }
      },
    ]

    const pagination =
      {
        total: total,
        current: current,
        pageSize: pageSize,
        showTotal: total => `共有${total}条数据`,
        onChange: (current, pageSize) => {
          this.props.form.validateFields((err, values) => {
            if (!err) {
              this.loadDatas(current,pageSize,values)
            };
          });
        },
        showQuickJumper: true
      }
    return (
      <div>
        {this.renderSimple()}
        <Table
          dataSource={data}
          columns={columns}
          rowKey={record => record.code}
          pagination={pagination}
          loading={loading}
        />
      </div>
    )
  }
}

const ResourceUser = Form.create()(ResourceUserForm)
export default props => (
  <ObjectDetailContext.Consumer>
    {context => <ResourceUser {...props} roleList={context.roleList} id={context.id} userCollections={context.userCollections} appId={context.appId} />}
  </ObjectDetailContext.Consumer>
)