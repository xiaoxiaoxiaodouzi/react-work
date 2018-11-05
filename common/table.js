/* import React, { Fragment, Component } from 'react';
import { Table, Form, Input, Button, Modal, message, Tree, Divider, Pagination } from 'antd';
import { getRoles, addRole, getRolesByCode, deleteRole, updateRole, getResources, getRoleAllResources, updateRoleResources } from '../../../services/running'
import TreeHelp from '../../../utils/TreeHelp'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
class RoleForm extends Component {
  state = {
    data:[{
      name:'测试',
      desc:'没有描述',
      data1:'功能1',
      users:'测试',
    }
    ],
    current:1,
    total:1,
    pageSize:10,
  }

  loadDatas=(current,pageSize)=>{

  }

  render() {

    const {current,total,pageSize} =this.state;

    const columns=[
      {
        title:'名称',
        dataIndex:'name',
        width:'10%',
      },
      {
        title:'描述',
        dataIndex:'desc',
        width:'30%',
      },
      {
        title:'关联功能',
        dataIndex:'data1',
        width:'20%',
      },
      {
        title:'已授权用户集合',
        dataIndex:'users',
        width:'20%',
      },
      {
        title:'操作',
        width:'20%',
        render:(record,text)=>{
        return  (
            <Fragment>
              <a >授权</a>
              <Divider type='vertical'/>
              <a>详情</a>    
            </Fragment>  
        )
        }
      },
    ]
    
    const pagination=
    {
      total: total,
      current:current,
      pageSize: pageSize,
      showTotal:total=> `共有${total}条数据`,
      onChange:(current, pageSize) => {
          this.loadDatas(current, pageSize)
      },
      showQuickJumper:true
    }
    return (
      <div>
        <Table
          dataSource={this.state.data}
          columns={columns}
          rowKey={record => record.code}
          pagination={pagination}
        />
      </div>

    )
  }
}

const Role = Form.create()(RoleForm)
export default Role; */