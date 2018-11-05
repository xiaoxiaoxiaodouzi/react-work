import React, { PureComponent,Fragment } from 'react'
import PropTypes from 'prop-types'
import { Modal,Select, Button, Input, Col, Row, Table,Form } from "antd";
import { getCollectionUsers } from '../../services/functional'
import constants from '../../services/constants'

const Option = Select.Option;
const FormItem = Form.Item;

//集合用户详情授权modal组件，接受selectedKeys对象数组
class CollectionUsersModal extends PureComponent {
  static propTypes = {
    visible:PropTypes.bool,  //modal是否可见
    title: PropTypes.string,  //modal标题
    collections:PropTypes.array   //默认选中的值,是一个用户集合对象列表，对象包含name、id、type属性
  }

  state={
    collections:[],
    dataSource:[],
    loading:false,
    total: 0,
    pageSize: 10,
    current: 1,
    totalPage: 1,
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.visible){
      this.setState({dataSource:[],collections:[]});
    }
    if(nextProps.collections !== this.state.collections){
      this.setState({collections:nextProps.collections});
      this.userCollectionIds = [];
      if(nextProps.collections!==null && nextProps.collections.length>0){
        for(var i of nextProps.collections){
          this.userCollectionIds.push(i.userCollectionId);
        }
        this.loadData(1,10,{name:this.state.search,userCollectionIds:this.userCollectionIds});
      } 
    }
  }

  loadData = (current, pageSize, params) => {

    this.setState({loading:true})
    let queryParams = {
      page: current,
      rows: pageSize
    }
    let query = Object.assign({}, queryParams, params);
    getCollectionUsers(query).then(data=>{
      this.setState({loading:false,dataSource: data.contents, current: data.pageIndex, pageSize: data.pageSize, total: data.total, totalPage: data.totalPage})
    }).catch(err=>{
      this.setState({loading:false})
    })
  }

  //表格参数重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.loadData(1,10,{userCollectionIds:this.userCollectionIds})
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.userCollectionIds = [];
        if(values.userCollectionIds !== undefined){
          this.userCollectionIds.push(values.userCollectionIds);
        }else{
          if(this.state.collections!==null && this.state.collections.length>0){
            for(var i of this.state.collections){
              this.userCollectionIds.push(i.userCollectionId);
            }
          }
        }
        if(this.userCollectionIds.length>0){ 
          this.loadData(1, 10, {name:values.name,userCollectionIds:this.userCollectionIds});
        }
      }
    });
  }

  //选择用户集合
  selectChange = (id) =>{
    this.setState({userCollectionIds:id});
    this.loadData(1, 10, {name:this.state.name,userCollectionIds:[id]});
  }

  render() {
 
    const { getFieldDecorator } = this.props.form;
    const pagination = {
      showTotal: total => `共 ${total} 条记录  第 ${this.state.current}/${this.state.totalPage} 页`,
      total: this.state.total,
      pageSize: this.state.pageSize,
      current: this.state.current,
      totalPage: this.state.totalPage,
      onChange: (current, pageSize) => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.userCollectionIds = [];
            if(values.userCollectionIds !== undefined){
              this.userCollectionIds.push(values.userCollectionIds);
            }else{
              if(this.state.collections!==null && this.state.collections.length>0){
                for(var i of this.state.collections){
                  this.userCollectionIds.push(i.userCollectionId);
                }
              }
            }
            if(this.userCollectionIds.length>0) {
              this.loadData(current, pageSize, {name:values.name,userCollectionIds:this.userCollectionIds});
            }
          }
        });
      }
    }

    const columns = [{
      title: '用户',
      dataIndex: 'userName',

    }, {
      title: '权限来源',
      dataIndex: 'userCollections',
      render: (value,record)=>{
        return value.length>0?value.map(u=>{
          return <Fragment key={u.userCollectionId}><span style={{marginRight:5,whiteSpace:'nowrap'}}>[{constants.functionResource.userCollectionType[u.userCollectionType]}]{u.userCollectionName}</span> </Fragment>;
        }):'--';
      }
    }];

    let modalStyle = {
      top:120,
      left:20
    }
    // if(this.props.isOffset){
    //   modalStyle = {
    //     top:110,
    //     left:10
    //   }
    // }

    return (
      <Modal 
        title={'角色['+this.props.title+']授权的用户列表'} 
        style={modalStyle} 
        visible={this.props.visible} 
        footer={null}
        bodyStyle={{overflowY:'auto',maxHeight:500}}
        width={800} destroyOnClose mask={true}
        onCancel={()=>this.props.handleModal()}>
          <Form layout="inline" onSubmit={this.handleSearch}>
            <Row gutter={24}>
                <Col md={9} sm={24}>
                    <FormItem label="用户名称">
                    {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                    </FormItem>
                </Col>
                <Col md={9} sm={24}>
                    <FormItem label="所属集合">
                        {getFieldDecorator('userCollectionIds')(
                        <Select 
                          placeholder="请选择"
                          onSelect={this.selectChange}
                          style={{ width: '165px' }}
                        >
                          {this.state.collections.map(e => {
                            return <Option key={e.userCollectionId} value={e.userCollectionId}>{e.userCollectionName}</Option>
                          })}
                        </Select>
                      )}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </Col>
            </Row>
            </Form>
            <Table 
            style={{ marginTop: 12}}
              rowKey='id'
              dataSource={this.state.dataSource}
              pagination={this.state.dataSource?pagination:null}
              columns={columns} 
              loading={this.state.loading}
              />
      </Modal>
    )
  }
}

export default CollectionUsersModal = Form.create()(CollectionUsersModal);
