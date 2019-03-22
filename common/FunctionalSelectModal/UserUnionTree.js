import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Input, Tabs, Tag, Form, Table, Button } from "antd";
import {  getUsergroups } from '../../services/uop';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import OrgJob from './OrgJob';
import OrgTree from './OrgTree';

const TabPane = Tabs.TabPane;
/* //初始三棵树的根节点
function treeDataOrgInit() {
  return [{
    id: 'org',
    title: '机构',
    key: 'org',
    disableCheckbox: true,
  }];
}
 */

class UserUnionTree extends Component {
  static propTypes = {
    prop: PropTypes.object,
    selectedKeys: PropTypes.array,
    onSelectedKeys: PropTypes.func.isRequired,//选中的key
    selectTitle: PropTypes.string,   //选中值label
  }

  static defaultProps = {
    selectedKeys: [],
  }
  state = {
    checkedOrgKeys: {
      checked: []
    },                   //选中的机构id数组
    checkedJobKeys: [],
    checkedUserunionKeys: [],
    treeDataOrg: [],           //机构树数据源
    treeDataJob: [],           //岗位树数据源
    treeDataUserunion: [],           //用户组树数据源
    categories: [],                   //下拉选择分类机构数据源
    categoryId: '',           //选择框的分类机构id  
    searchUserValue: '',
    searchJobValue: '',
    selectedKeys: this.props.selectedKeys || [],
    jobLoading: false,
    userLoading: false,
    orgs: [],
    total: '',
    current: '',
    pageSize: '',
    orgNum:0,
    groupNum:0,
    jobNum:0,
    newOrgs:[],
    newGroups:[],
    newJobs:[],
    oldSelectKeys:this.props.selectedKeys || [],
    disableds:[],//禁用项
    more:false
  }
  //设置默认选中值
  loadCheckedValues = () => {
    let checkedOrgKeys = {
      checked: []
    };
    let checkedJobKeys = [];
    let checkedUserunionKeys = [];
    // let ary = this.state.treeDataOrg;
    let orgNum = 0;
    let jobNum = 0;
    let groupNum = 0;
    let newOrgs = [];
    let newJobs = [];
    let newGroups = [];
    console.log(this.state.selectedKeys)
    this.state.selectedKeys.forEach(element => {
      let flag = true;
      let temp = [];
      if (this.props.disableSelectedKeys) {
        temp = this.props.disableSelectedKeys.filter(item => item.userCollectionId === element.userCollectionId);
        flag = temp.length > 0 ? false : true
      }
      element.closable = flag;
      if (element.userCollectionType === 'ORG') {
        orgNum += 1;
        checkedOrgKeys.checked.push(element.userCollectionId);
        newOrgs.push(element);
      } else if (element.userCollectionType === 'JOB') {
        jobNum += 1
        checkedJobKeys.push(element.userCollectionId);
        newJobs.push(element);
      } else if (element.userCollectionType === 'USERGROUP') {
        groupNum += 1;
        checkedUserunionKeys.push(element.userCollectionId);
        newGroups.push(element);
      }
    });
    let disableds = [];
    if(this.props.disableSelectedKeys){
      
      this.props.disableSelectedKeys.forEach(item =>{
        disableds.push(item.userCollectionId);
      })
    }
    this.setState({ checkedOrgKeys, checkedJobKeys, checkedUserunionKeys, orgNum, jobNum, groupNum,disableds,newJobs,newOrgs,newGroups})
  }
 
  //加载用户集合树数据
  loadtreeDataUserunion = (params) => {
    this.setState({ userLoading: true, })
    getUsergroups(params).then(data => {
      data.forEach(element => {
        element.key = element.id
      })
      this.setState({ treeDataUserunion: data, userLoading: false }, () => this.loadCheckedValues())
    }).catch(err => {
      this.setState({ userLoading: false })
    })
  }

  //机构树数据选中处理
  onOrgCheck = (checkedOrgKeys, e) => {
    if (e.checked) {
      let tag = {
        userCollectionName: e.node.props.dataRef.title,
        userCollectionId: e.node.props.dataRef.key,
        userCollectionType: 'ORG',
        closable:true
      }
      let newOrgs = [...this.state.newOrgs];
      newOrgs.push(tag);
      this.onAddSelectedKeys(tag, this.state.selectedKeys);
      this.setState({ checkedOrgKeys ,newOrgs});
    } else {
      let newOrgs = this.state.newOrgs.filter(item => item.userCollectionId !==  e.node.props.dataRef.key)//删除新选择的机构
      this.changeNum('cut','ORG');
      this.onDeleteSelectedKeys(e.node.props.dataRef.key);
      this.setState({ checkedOrgKeys ,newOrgs});
    }
  }
  //岗位树数据选中处理
  onJobCheck = (checkedJobKeys, e) => {
    if (e) {
      let tag = {
        userCollectionName: checkedJobKeys.name,
        userCollectionId: checkedJobKeys.id,
        userCollectionType: 'JOB',
        org:checkedJobKeys.categoryOrgName+"-"+checkedJobKeys.orgName,
        closable:true
      }
      this.onAddSelectedKeys(tag);
      let ary = [...this.state.checkedJobKeys];
      ary.push(checkedJobKeys.id);
      let newJobs = [...this.state.newJobs];//新选择的岗位
      newJobs.push(tag)
      this.setState({ checkedJobKeys: ary ,newJobs})
    } else {
      let newJobs = this.state.newJobs.filter(item => item.userCollectionId !==  checkedJobKeys.id)//删除新选择的岗位
      this.onDeleteSelectedKeys(checkedJobKeys.id);
      let jobNum = this.state.jobNum;
      jobNum -= 1;
      this.setState({ checkedJobKeys: this.state.checkedJobKeys.filter(i => i !== checkedJobKeys.id) ,newJobs,jobNum});
    }
  }
  //批量处理岗位数据选中第一个参数是所有选中的数据，第二个参数是变化的数据
  onAllCheck = (selectedRows, changeRows, selected, type) => {
    let ary = [];
    if (type === 'job') {
      ary = [...this.state.checkedJobKeys];
    } else if (type === 'user') {
      ary = this.state.checkedUserunionKeys;
    }
    let selectedKeys = this.state.selectedKeys.slice();
    //批量新增
    if (selected) {
      let newJobs = [...this.state.newJobs];
      let newGroups = [...this.state.newGroups];
      changeRows.forEach(i => {
        let tag = {
          userCollectionName: i.name,
          userCollectionId: i.id,
          userCollectionType: 'JOB',
          closable:true
        }
        if (type === 'job') {
          tag.userCollectionType = 'JOB'
          newJobs.push(tag);
        } else if (type === 'user') {
          tag.userCollectionType = 'USERGROUP'
          newGroups.push(tag);
        }
        let filterKeys = selectedKeys.filter(item => item.userCollectionId === i.id) || [];
        if (filterKeys.length === 0) {
          selectedKeys.push(tag)
        }
        ary.push(i.id)
      })
      if (type === 'job') {
        this.setState({ checkedJobKeys: ary,newJobs });
        this.changeNum('add','JOB',changeRows.length);

      } else if (type === 'user') {
        this.setState({ checkedUserunionKeys: ary ,newGroups});
        this.changeNum('add','USER',changeRows.length)
      }
      this.setState({ selectedKeys }, () => {
        this.props.onSelectedKeys(this.state.selectedKeys)
      });
    } else {
      //批量删除
      let keys = [];
      let newJobs = [...this.state.newJobs];
      let newGroups = [...this.state.newGroups];
      changeRows.forEach(i => {
        
        selectedKeys = selectedKeys.filter(item => item.userCollectionId !== i.id);
        newJobs = newJobs.filter(item => item.userCollectionId !== i.id);
        newGroups = newGroups.filter(item => item.userCollectionId !== i.id);
       
      })
      selectedRows.forEach(i => {
        keys.push(i.id);
      })
      if (type === 'job') {
        this.setState({ checkedJobKeys: keys,newJobs });
        this.changeNum('cut','JOB',changeRows.length)
      } else if (type === 'user') {
        this.setState({ checkedUserunionKeys: keys ,newGroups})
        this.changeNum('cut','USER',changeRows.length)
      }
      this.setState({ selectedKeys }, () => {
        this.props.onSelectedKeys(this.state.selectedKeys)
      }
      )
    }
  }

  //用户集合树数据选中处理
  onUserunionCheck = (checkedUserunionKeys, e) => {
    if (e) {
      let tag = {
        userCollectionName: checkedUserunionKeys.name,
        userCollectionId: checkedUserunionKeys.id,
        userCollectionType: 'USERGROUP',
        closable:true
      }
      this.onAddSelectedKeys(tag);
      let ary = this.state.checkedUserunionKeys;
      ary.push(checkedUserunionKeys.id);
      let newGroups = [...this.state.newGroups];
      newGroups.push(tag);
      this.setState({ checkedUserunionKeys: ary ,groupNum:ary.length,newGroups});
    } else {
      let newGroups = this.state.newGroups.filter(item => item.userCollectionId !==  checkedUserunionKeys.id)
      this.onDeleteSelectedKeys(checkedUserunionKeys.id);
      let groupNum = this.state.groupNum;
      groupNum -= 1;
      this.setState({ checkedUserunionKeys: this.state.checkedUserunionKeys.filter(i => i !== checkedUserunionKeys.id) ,newGroups,groupNum})
    }
  }

  changeNum = (opt,type,num) =>{
    let n = num ? num :1;
    if(type === 'ORG'){
      let orgNum = this.state.orgNum;
      if(opt === 'add'){
        orgNum += n;
      }else{
        orgNum -= n;
      }
      this.setState({orgNum});
    }else if(type === 'JOB'){
      let jobNum = this.state.jobNum;
      if(opt === 'add'){
        jobNum += n;
      }else{
        jobNum -= n;
      }      
      this.setState({jobNum})
    }else{
      let groupNum = this.state.groupNum;
      if(opt === 'add'){
        groupNum += n;
      }else{
        groupNum -= n;
      } 
      this.setState({groupNum});   
    }
  }

  //选中值标签关闭处理，取消选中对应值
  handleClose = (tag) => {
    let checkedKeys = [];
    if (tag.userCollectionType === 'ORG') {
      let tempCheckedKeys = {
        checked: this.state.checkedOrgKeys.checked.filter(element => element !== tag.userCollectionId)
      }
      let newOrgs = this.state.newOrgs.filter(item => item.userCollectionId !==  tag.userCollectionId)//删除新选择的机构
      this.setState({ checkedOrgKeys: tempCheckedKeys,newOrgs })
    } else if (tag.userCollectionType === 'JOB') {
      checkedKeys = this.state.checkedJobKeys.filter(element => element !== tag.userCollectionId);
      let newJobs = this.state.newJobs.filter(item => item.userCollectionId !==  tag.userCollectionId)//删除新选择的岗位
      this.setState({ checkedJobKeys: checkedKeys,newJobs })
    } else if (tag.userCollectionType === 'USERGROUP') {
      checkedKeys = this.state.checkedUserunionKeys.filter(element => element !== tag.userCollectionId);
      let newGroups = this.state.newGroups.filter(item => item.userCollectionId !==  tag.userCollectionId)//删除新选择的用户组
      this.setState({ checkedUserunionKeys: checkedKeys ,newGroups})
    }
    this.changeNum('cut',tag.userCollectionType)
    this.onDeleteSelectedKeys(tag.userCollectionId);
  }

  onTabChange = (key) => {
    if (key === '2') {
      if (!this.state.treeDataJob.length > 0) {
        // this.loadtreeDataJob({ page: 1, rows: 10 });
      }
    } else if (key === '3') {
      if (!this.state.treeDataUserunion.length > 0) this.loadtreeDataUserunion();
    }
  }

  onAddSelectedKeys = (selectedKey) => {
    this.changeNum('add',selectedKey.userCollectionType);

    let selectedKeys = this.state.selectedKeys.slice();
    let filterKeys = selectedKeys.filter(item => item.userCollectionId === selectedKey.userCollectionId) || [];
    if (filterKeys.length === 0) {
      selectedKeys.push(selectedKey)
      this.setState({ selectedKeys }, () => {
        this.props.onSelectedKeys(this.state.selectedKeys)
      });
    }
  }
  onDeleteSelectedKeys = (selectedKey) => {
    let selectedKeys = this.state.selectedKeys.filter(item => item.userCollectionId !== selectedKey)
    this.setState({ selectedKeys }, () => {
      this.props.onSelectedKeys(this.state.selectedKeys)
    }
    );
  }

  resetForm = (type) => {
    if (type === 'job') {
      this.setState({ searchJobValue: '' })
      this.loadtreeDataJob({ page: 1, rows: 10 });
    } else if (type === 'user') {
      this.setState({ searchUserValue: '' })
      this.loadtreeDataUserunion();
    }
  }
  //机构页面查询
  onSubmit = (type, e) => {
    e.preventDefault();
    if (type === 'job') {
      this.loadtreeDataJob({ name: this.state.searchJobValue || '', page: 1, rows: 10 })
    } else if (type === 'user') {
      this.loadtreeDataUserunion({ name: this.state.searchUserValue || '' })
    } else if (type === 'org') {

    }
  }
 
  render() {
    const columnUserunion = [{
      title: '用户组名称',
      dataIndex: 'name',
      width: 300
    }, {
      title: '描述',
      dataIndex: 'desc',
      render:(text)=>{
        return <Ellipsis tooltip lines={1}>{text}</Ellipsis>
      }
    }, {
      title: '用户数',
      dataIndex: 'userCount',
      align:'center',
      width:120
    }];
    const rowSelectionUserunion = {
      selectedRowKeys: this.state.checkedUserunionKeys,
      /* onChange: (selectedRowKeys) => this.setState({ checkedJobKeys: selectedRowKeys }), */
      onSelect: (record, selected) => {
        this.onUserunionCheck(record, selected);
      },
      getCheckboxProps: record => ({
        disabled: this.state.disableds.indexOf(record.id) !== -1, // Column configuration not to be checked
        name: record.name,
      }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.onAllCheck(selectedRows, changeRows, selected, 'user');
      }
    };

    return (
      <Fragment>
        {/* <div style={{ width: '100%', marginBottom: 16 ,display:'flex'}}><span style={{width:150}}>{(this.props.selectTitle ? this.props.selectTitle : '已选择的用户集合') + ('('+(this.state.oldSelectKeys.length) + ')')}</span>：
          {this.state.more?<div style={{marginTop:-8,width:800}}>{this.state.oldSelectKeys.map((element) => {
            let flag = true;
            let temp = [];
            if (this.props.disableSelectedKeys) {
              temp = this.props.disableSelectedKeys.filter(item => item.userCollectionId === element.userCollectionId);
              flag = temp.length > 0 ? false : true
            }
            return element.userCollectionType === 'JOB' ?<Tooltip title={element.org}><Tag style={{ marginTop: 8 }} key={element.userCollectionId} closable={flag}
            afterClose={() => this.handleClose(element)}>{`${element.userCollectionName}-${tagValue[element.userCollectionType]}`}</Tag></Tooltip>:<Tag style={{ marginTop: 8 }} key={element.userCollectionId} closable={flag}
            afterClose={() => this.handleClose(element)}>{`${element.userCollectionName}-${tagValue[element.userCollectionType]}`}</Tag>
          })}<span><a onClick={()=>{this.setState({more:false})}}><Icon type="double-left"/>收起</a></span></div>
          :
          <a onClick={()=>{this.setState({more:true})}}>展开<Icon type="double-right"/></a>
          }
        </div> */}
        {this.state.newOrgs.length > 0 ?<div style={{ width: '100%', marginBottom: 16 ,display:'flex'}}>机构({this.state.newOrgs.length})：
            <div style={{marginTop:-8}}>{this.state.newOrgs.map(element=>{
                
                return <Tag style={{ marginTop: 8 }} key={element.userCollectionId} closable={element.closable}
                afterClose={() => this.handleClose(element)}>{`${element.userCollectionName}`}</Tag>
            })}</div>
          </div> :''}
        {this.state.newJobs.length > 0 ?<div style={{ width: '100%', marginBottom: 16 ,display:'flex'}}>岗位({this.state.newJobs.length})：
          <div style={{marginTop:-8}}>{this.state.newJobs.map(element=>{
              return <Tooltip title={element.org}><Tag style={{ marginTop: 8 }} key={element.userCollectionId} closable={element.closable}
              afterClose={() => this.handleClose(element)}>{`${element.userCollectionName}`}</Tag></Tooltip>
          })}</div>
        </div> :''}
        {this.state.newGroups.length > 0 ?<div style={{ width: '100%', marginBottom: 16 ,display:'flex'}}>用户组({this.state.newGroups.length})：
            <div style={{marginTop:-8}}>{this.state.newGroups.map(element=>{
                return <Tag style={{ marginTop: 8 }} key={element.userCollectionId} closable={element.closable}
                afterClose={() => this.handleClose(element)}>{`${element.userCollectionName}`}</Tag>
            })}</div>
          </div> :''}
        
        <Tabs type="card" onChange={(activeKey) => this.onTabChange(activeKey)}>
          <TabPane tab={"机构"} key="1">
            <OrgTree disableSelectedKeys={this.props.disableSelectedKeys} onOrgCheck={this.onOrgCheck} checkedOrgKeys={this.state.checkedOrgKeys} loadCheckedValues={this.loadCheckedValues}/>
          </TabPane>
          <TabPane tab={"岗位"} key="2">
            <OrgJob onJobCheck={this.onJobCheck} onAllCheck={this.onAllCheck} loadCheckedValues={this.loadCheckedValues} selectedKeys={this.props.selectedKeys} checkedJobKeys={this.state.checkedJobKeys} disabledJobs={this.state.disableds}/>
          </TabPane>
          <TabPane tab={"用户组"} key="3" >
            <Form layout="inline" style={{ marginBottom: 16 }} onSubmit={(e) => this.onSubmit('user', e)}>
              <Form.Item label="用户组名称">
                <Input style={{ width: 200 }}
                  value={this.state.searchUserValue}
                  onChange={e => this.setState({ searchUserValue: e.target.value })} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" style={{ marginRight: 8 }} htmlType="submit">查询</Button>
                <Button onClick={() => { this.resetForm('user') }}>重置</Button>
              </Form.Item>
            </Form>
            <Table
              size='small'
              rowKey='id'
              rowSelection={rowSelectionUserunion}
              dataSource={this.state.treeDataUserunion}
              columns={columnUserunion}
              loading={this.state.userLoading}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    )
  }
}
export default Form.create()(UserUnionTree)