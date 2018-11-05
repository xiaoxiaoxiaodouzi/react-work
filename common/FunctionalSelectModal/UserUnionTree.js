import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Tree, Input, Select, Tabs, Tag, Form, Table, Button } from "antd";
import { getTopOrgs, getCategoryOrgs, getOrgsTree, getChildrenOrgs, getUsergroups, getUserCount, getJobs, searchOrgByName } from '../../services/functional'

const tagValue = {
  'ORG': '机构',
  'JOB': '岗位',
  'USERGROUP': '用户组'
}
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
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
  }

  componentDidMount() {
    this.loadOrgs();
  }
  //设置默认选中值
  loadCheckedValues = () => {
    let checkedOrgKeys = {
      checked: []
    };
    let checkedJobKeys = [];
    let checkedUserunionKeys = [];
    // let ary = this.state.treeDataOrg;
    this.state.selectedKeys.forEach(element => {
      if (element.userCollectionType === 'ORG') {
        checkedOrgKeys.checked.push(element.userCollectionId);
      } else if (element.userCollectionType === 'JOB') {
        checkedJobKeys.push(element.userCollectionId);
      } else if (element.userCollectionType === 'USERGROUP') {
        checkedUserunionKeys.push(element.userCollectionId);
      }
    });
    this.setState({ checkedOrgKeys, checkedJobKeys, checkedUserunionKeys })
  }
  //加载顶层分类机构数据
  loadOrgs = () => {
    Promise.all([getTopOrgs(), getCategoryOrgs()]).then(values => {
      let topOrgs = values[0];
      let categoryOrgs = values[1];
      var findTopOrg = function (id) {
        for (var topOrg of topOrgs) {
          if (topOrg.id === id) return topOrg;
        }
      };
      //屏蔽掉租户分类机构
      if (categoryOrgs) {
        for (let i = 0; i < categoryOrgs.length; i++) {
          if (categoryOrgs[i].id === '13-1') {
            categoryOrgs.splice(i, 1);
            i--;
            continue;
          }
          if (this.props.filterCategoryId !== null || this.props.filterCategoryId !== undefined) {
            if (categoryOrgs[i].id === this.props.filterCategoryId) {
              categoryOrgs.splice(i, 1);
              i--;
              continue;
            }
          }
          let topOrg = findTopOrg(categoryOrgs[i].pid);
          if (topOrg) categoryOrgs[i].name = topOrg.name + " - " + categoryOrgs[i].name;
        }
      }
      if (this.state.categoryId === '') {
        if (categoryOrgs) {
          if (categoryOrgs[0]) {
            //this.loadOrgsTree(categoryOrgs[0].id);

            this.setState({
              categories: categoryOrgs,
              categoryId: categoryOrgs[0].id
            }, () => {
              this.loadCategoryOrg();
            });
          }
        }

      } else {
        this.setState({
          categories: categoryOrgs,
        });
      }
    });
  }
  //简化树数据显示，只取id和userCollectionName值
  simplifyData = (data) => {
    let tempData = [];
    if (data.length) {
      data.forEach(element => {
        // let keys=this.props.disableSelectedKeys.filter(item=> item.userCollectionId === element.userCollectionId);
        if (this.props.disableSelectedKeys && this.props.disableSelectedKeys.filter(item => item.userCollectionId === element.userCollectionId).length > 0) {
          tempData.push({
            id: element.id ? element.id : '',
            key: element.userCollectionId ? element.userCollectionId : element.id,
            title: element.userCollectionName ? element.userCollectionName : element.name,
            disableCheckbox: true
          })
        } else {
          tempData.push({
            id: element.id ? element.id : '',
            key: element.userCollectionId ? element.userCollectionId : element.id,
            title: element.userCollectionName ? element.userCollectionName : element.name,
          })
        }
      });
    }
    return tempData;
  }
  //远程加载树数据
  loadtreeDataOrg = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let id = treeNode.props.dataRef.id;
      //展开第一层是org,第二层是机构id
      if (id === 'org') {
        let orgs = this.state.orgs;
        if (orgs.length > 0) {
          let ids = [];
          orgs.forEach(i => {
            //如果是分类机构则分类机构ID等于机构ID
            if (i.categoryOrgId === i.id) {
              i.userCollectionId = i.id;
            } else {
              i.userCollectionId = i.categoryOrgId + '-' + i.id;
            }
            i.userCollectionName = i.name;
            i.userCollectionType = 'ORG';
            ids.push(i.id);
          })
          let tempData = this.simplifyData(orgs);
          getUserCount(this.state.categoryId, ids, true).then(data => {
            tempData.forEach(element => {
              element.title = element.title + `(${data[element.id]})`
            })
            treeNode.props.dataRef.children = tempData;
            this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.loadCheckedValues())
            resolve();
          })
        } else {
          getOrgsTree(this.state.categoryId).then(data => {
            data.forEach(i => {
              //如果是分类机构则分类机构ID等于机构ID
              if (i.categoryOrgId === i.id) {
                i.userCollectionId = i.id;
              } else {
                i.userCollectionId = i.categoryOrgId + '-' + i.id;
              }
              i.userCollectionName = i.name;
              i.userCollectionType = 'ORG'
            })
            let tempData = this.simplifyData(data);
            let ids = [];
            tempData.forEach(element => {
              ids.push(element.key);
            })
            data.forEach(e => {
              ids.push(e.id);
            })
            getUserCount(this.state.categoryId, ids, true).then(data => {
              tempData.forEach(element => {
                element.title = element.title + `(${data[element.id]})`
              })
              treeNode.props.dataRef.children = tempData;
              this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.loadCheckedValues())
              resolve();
            })
          })
        }
      } else {
        getChildrenOrgs(id, { categoryId: this.state.categoryId }).then(data => {
          data.forEach(i => {
            //如果是分类机构则分类机构ID等于机构ID
            if (i.categoryOrgId === i.id) {
              i.userCollectionId = i.id;
            } else {
              i.userCollectionId = i.categoryOrgId + '-' + i.id;
            }
            i.userCollectionName = i.name;
            i.userCollectionType = 'ORG'
          })
          let tempData = this.simplifyData(data);
          let ids = [];
          tempData.forEach(element => {
            ids.push(element.id);
          })
          getUserCount(this.state.categoryId, ids, true).then(data => {
            tempData.forEach(element => {
              element.title = element.title + `(${data[element.id]})`
            })
            treeNode.props.dataRef.children = tempData;
            this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.loadCheckedValues())
            resolve();
          })
        })
      }
    });
  }

  //加载分类机构数据
  loadCategoryOrg = () => {
    getOrgsTree(this.state.categoryId).then(data => {
      data.forEach(i => {
        //如果是分类机构则分类机构ID等于机构ID
        if (i.categoryOrgId === i.id) {
          i.userCollectionId = i.id;
        } else {
          i.userCollectionId = i.categoryOrgId + '-' + i.id;
        }
        i.userCollectionName = i.name;
        i.userCollectionType = 'ORG'
      })
      let tempData = this.simplifyData(data);
      let ids = [];
      tempData.forEach(element => {
        ids.push(element.key);
      })
      data.forEach(e => {
        ids.push(e.id);
      })
      getUserCount(this.state.categoryId, ids, true).then(data => {
        tempData.forEach(element => {
          element.title = element.title + `(${data[element.id]})`
        })
        this.setState({ treeDataOrg: tempData }, () => this.loadCheckedValues())
      })
    })
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
  //加载岗位数据
  loadtreeDataJob = (params) => {
    this.setState({ jobLoading: true })
    getJobs(params).then(data => {

      data.contents.forEach(element => {
        element.key = element.id
      })
      this.setState({ treeDataJob: data.contents,total:data.total,pageSize:data.pageSize,current:data.pageIndex, jobLoading: false }, () => this.loadCheckedValues())
    }).catch(err => {
      this.setState({ jobLoading: false })
    })
  }
  //机构树数据选中处理
  onOrgCheck = (checkedOrgKeys, e) => {
    if (e.checked) {
      let tag = {
        userCollectionName: e.node.props.dataRef.title,
        userCollectionId: e.node.props.dataRef.key,
        userCollectionType: 'ORG'
      }
      this.onAddSelectedKeys(tag, this.state.selectedKeys);
    } else {
      this.onDeleteSelectedKeys(e.node.props.dataRef.key);
    }
    this.setState({ checkedOrgKeys });
  }
  //岗位树数据选中处理
  onJobCheck = (checkedJobKeys, e) => {
    if (e) {
      let tag = {
        userCollectionName: checkedJobKeys.name,
        userCollectionId: checkedJobKeys.id,
        userCollectionType: 'JOB'
      }
      this.onAddSelectedKeys(tag);
      let ary = this.state.checkedJobKeys;
      ary.push(checkedJobKeys.id);
      this.setState({ checkedJobKeys: ary })
    } else {
      this.onDeleteSelectedKeys(checkedJobKeys.id);
      this.setState({ checkedJobKeys: this.state.checkedJobKeys.filter(i => i !== checkedJobKeys.id) });
    }
  }
  //批量处理岗位数据选中第一个参数是所有选中的数据，第二个参数是变化的数据
  onAllCheck = (selectedRows, changeRows, selected, type) => {
    let ary = [];
    if (type === 'job') {
      ary = this.state.checkedJobKeys;
    } else if (type === 'user') {
      ary = this.state.checkedUserunionKeys;
    }
    let selectedKeys = this.state.selectedKeys.slice();
    //批量新增
    if (selected) {
      changeRows.forEach(i => {
        let tag = {
          userCollectionName: i.name,
          userCollectionId: i.id,
          userCollectionType: 'JOB'
        }
        if (type === 'job') {
          tag.userCollectionType = 'JOB'
        } else if (type === 'user') {
          tag.userCollectionType = 'USERGROUP'
        }
        let filterKeys = selectedKeys.filter(item => item.userCollectionId === i.id) || [];
        if (filterKeys.length === 0) {
          selectedKeys.push(tag)
        }
        ary.push(i.id)
      })
      if (type === 'job') {
        this.setState({ checkedJobKeys: ary })
      } else if (type === 'user') {
        this.setState({ checkedUserunionKeys: ary })
      }
      this.setState({ selectedKeys }, () => {
        this.props.onSelectedKeys(this.state.selectedKeys)
      });
    } else {
      //批量删除
      let keys = [];
      changeRows.forEach(i => {
        selectedKeys = selectedKeys.filter(item => item.userCollectionId !== i.id);
      })
      selectedRows.forEach(i => {
        keys.push(i.id);
      })
      if (type === 'job') {
        this.setState({ checkedJobKeys: keys })
      } else if (type === 'user') {
        this.setState({ checkedUserunionKeys: keys })
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
        userCollectionType: 'USERGROUP'
      }
      this.onAddSelectedKeys(tag);
      let ary = this.state.checkedUserunionKeys;
      ary.push(checkedUserunionKeys.id);
      this.setState({ checkedUserunionKeys: ary });
    } else {
      this.onDeleteSelectedKeys(checkedUserunionKeys.id);
      this.setState({ checkedUserunionKeys: this.state.checkedUserunionKeys.filter(i => i !== checkedUserunionKeys.id) })
    }
  }
  //分类机构select控件值改变处理
  handleSelectChange = (value) => {
    this.setState({ categoryId: value }, () => {
      this.loadCategoryOrg();
    })
  }

  handleSearch = (value) => {
    let params = {
      categoryId: this.state.categoryId,
      name: value
    }
    searchOrgByName(params).then(data => {
      this.setState({ orgs: data })
    })
  }

  handleSelect = (value, option) => {
    //设置树的数据
    this.setState({ treeDataOrg: [{ id: value, key: this.state.categoryId === value ? value : this.state.categoryId + '-' + value, title: option.props.title }], orgs: this.state.orgs.filter(i => i.id === value) })
  }
  //选中值标签关闭处理，取消选中对应值
  handleClose = (tag) => {
    let checkedKeys = [];
    if (tag.userCollectionType === 'ORG') {
      let tempCheckedKeys = {
        checked: this.state.checkedOrgKeys.checked.filter(element => element !== tag.userCollectionId)
      }
      this.setState({ checkedOrgKeys: tempCheckedKeys })
    } else if (tag.userCollectionType === 'JOB') {
      checkedKeys = this.state.checkedJobKeys.filter(element => element !== tag.userCollectionId);
      this.setState({ checkedJobKeys: checkedKeys })
    } else if (tag.userCollectionType === 'USERGROUP') {
      checkedKeys = this.state.checkedUserunionKeys.filter(element => element !== tag.userCollectionId);
      this.setState({ checkedUserunionKeys: checkedKeys })
    }
    this.onDeleteSelectedKeys(tag.userCollectionId);
  }

  onTabChange = (key) => {
    if (key === '2') {
      if (!this.state.treeDataJob.length > 0) {
        this.loadtreeDataJob({ page: 1, rows: 10 });
      }
    } else if (key === '3') {
      if (!this.state.treeDataUserunion.length > 0) this.loadtreeDataUserunion();
    }
  }

  onAddSelectedKeys = (selectedKey) => {
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
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} disableCheckbox={item.disableCheckbox} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} disableCheckbox={item.disableCheckbox} dataRef={item} />;
    });
  }
  render() {
    const columnJob = [{
      title: '岗位名称',
      dataIndex: 'name',
      width: '20%'
    }, {
      title: '机构名称',
      dataIndex: '',
      render: (text, record) => {
        return record.orgName + '-' + record.categoryOrgName
      }
    }, {
      title: '描述',
      dataIndex: 'desc',
      width: '30%'
    }, {
      title: '用户数',
      dataIndex: 'userCount'
    }];
    const columnUserunion = [{
      title: '用户组名称',
      dataIndex: 'name',
      width: '20%'
    }, {
      title: '描述',
      dataIndex: 'desc',
      width: '40%'
    }, {
      title: '用户数',
      dataIndex: 'userCount'
    }];
    const rowSelectionJob = {
      selectedRowKeys: this.state.checkedJobKeys,
      /*  onChange: (selectedRowKeys) => this.setState({ checkedJobKeys: selectedRowKeys }), */
      onSelect: (record, selected) => {
        this.onJobCheck(record, selected);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.onAllCheck(selectedRows, changeRows, selected, 'job');
      }
    };
    const rowSelectionUserunion = {
      selectedRowKeys: this.state.checkedUserunionKeys,
      /* onChange: (selectedRowKeys) => this.setState({ checkedJobKeys: selectedRowKeys }), */
      onSelect: (record, selected) => {
        this.onUserunionCheck(record, selected);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.onAllCheck(selectedRows, changeRows, selected, 'user');
      }
    };

    const jobPagination = {
      total: this.state.total,
      current: this.state.current,
      pageSize:this.state.pageSize,
      onChange: (current, pageSize) => {
        this.loadtreeDataJob({name: this.state.searchJobValue || '',page:current,rows:pageSize})
      },
    }
    return (
      <Fragment>
        <div style={{ width: '100%', marginBottom: 16 }}>{this.props.selectTitle ? this.props.selectTitle : '已选择的用户集合'}：
          {this.state.selectedKeys.map((element) => {
            let flag = true;
            let temp = [];
            if (this.props.disableSelectedKeys) {
              temp = this.props.disableSelectedKeys.filter(item => item.userCollectionId === element.userCollectionId);
              flag = temp.length > 0 ? false : true
            }
            return <Tag style={{ marginTop: 8 }} key={element.userCollectionId} closable={flag}
              afterClose={() => this.handleClose(element)}>{`${element.userCollectionName}-${tagValue[element.userCollectionType]}`}</Tag>
          })
          }
        </div>
        <Tabs type="card" onChange={(activeKey) => this.onTabChange(activeKey)}>
          <TabPane tab="机构" key="1">
            <Form layout="inline" style={{ marginBottom: 16 }} onSubmit={(e) => this.onSubmit('org', e)}>
              <Form.Item label="分类机构">
                <Select style={{ width: 300 }} value={this.state.categoryId} onChange={this.handleSelectChange} >
                  {this.state.categories.map((element, index) => {
                    return <Option key={index} value={element.id}>{element.name}</Option>
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="机构名称">
                <Select
                  showSearch
                  allowClear
                  style={{ width: 200 }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={(inputValue, option) => option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
                  onSearch={this.handleSearch}
                  onSelect={this.handleSelect}
                  notFoundContent={null} >
                  {this.state.orgs.map(item => {
                    return (
                      <Option key={item.id} title={item.name}>{item.name}</Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Form>


            {this.state.treeDataOrg.length
              ? <Tree
                loadData={this.loadtreeDataOrg}
                checkable
                checkStrictly={true}
                onCheck={this.onOrgCheck}
                checkedKeys={this.state.checkedOrgKeys} >
                {this.renderTreeNodes(this.state.treeDataOrg)}
              </Tree>
              : '数据加载中...'}
          </TabPane>
          <TabPane tab="岗位" key="2">
            <Form layout="inline" style={{ marginBottom: 16 }} onSubmit={(e) => this.onSubmit('job', e)}>
              {/* <Form.Item label="分类机构">
                <Select style={{ width: 300 }} value={this.state.categoryId} onChange={this.handleSelectChange} >
                  {this.state.categories.map((element, index) => {
                    return <Option key={index} value={element.id}>{element.name}</Option>
                  })}
                </Select>
              </Form.Item> */}
              <Form.Item label="岗位名称">
                <Input style={{ width: 200 }}
                  value={this.state.searchJobValue}
                  onChange={e => this.setState({ searchJobValue: e.target.value })} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" style={{ marginRight: 8 }} htmlType="submit">查询</Button>
                <Button onClick={() => { this.resetForm('job') }}>重置</Button>
              </Form.Item>
            </Form>
            <Table
              rowkey='id'
              size='small'
              rowSelection={rowSelectionJob}
              dataSource={this.state.treeDataJob}
              columns={columnJob}
              loading={this.state.jobLoading}
              pagination={jobPagination}
            />
          </TabPane>
          <TabPane tab="用户组" key="3" >
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
            {/* <div style={{width:'100%',marginBottom:16}}>用户集合搜索：
              <Search 
                placeholder="输入机构、岗位或用户组查询"
                value={this.state.searchValue}
                onSearch={this.onSearchValue}
                onChange={e=>this.setState({searchValue:e.target.value})}
                style={{width:400}} />
            </div>
            { this.state.treeDataUserunion.length
            ? <Tree
                onCheck={this.onUserunionCheck}
                checkedKeys={this.state.checkedUserunionKeys} 
                checkable >
                {this.renderTreeNodes(this.state.treeDataUserunion)}
              </Tree>
            : '数据加载中...'} */}
          </TabPane>
        </Tabs>
      </Fragment>
    )
  }
}
export default Form.create()(UserUnionTree)