import React ,{PureComponent} from 'react';
import {OrgCategorySelectTree}  from 'c2-orguser';
import { Select,Tree,  Form } from "antd";
import { getUserCount, getOrgsTree, getChildrenOrgs, searchOrgByName } from '../../services/uop';
import { base } from '../../services/base';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
class OrgTree extends PureComponent{
    state = {
        checkedOrgKeys: {
          checked: []
        },                   //选中的机构id数组
        checkedJobKeys: [],
        treeDataOrg: [],           //机构树数据源
        categories: [],                   //下拉选择分类机构数据源
        categoryId: '',           //选择框的分类机构id  
        selectedKeys: this.props.selectedKeys || [],
        orgs: [],
        total: '',
        current: '',
        pageSize: '',
      }
    handleSelect = (value, option) => {
        //设置树的数据
        this.setState({ treeDataOrg: [{ id: value, key: this.state.categoryId === value ? value : this.state.categoryId + '-' + value, title: option.props.title }], orgs: this.state.orgs.filter(i => i.id === value) })
    }

    onSelect=(keys,e)=>{
        this.setState({
            selectedKeys:[keys[0]]
        })
        this.props.onSelect(keys[0],this.state.categoryId);
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
                if(!this.props.simple){
                    getUserCount(this.state.categoryId, ids, true).then(data => {
                        tempData.forEach(element => {
                        element.title = element.title + `(${data[element.id]})`
                        })
                        treeNode.props.dataRef.children = tempData;
                        this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
                        resolve();
                    })
                }else{
                    treeNode.props.dataRef.children = tempData;
                    this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
                    resolve();
                }
                
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
                if(!this.props.simple){
                    getUserCount(this.state.categoryId, ids, true).then(data => {
                        tempData.forEach(element => {
                        element.title = element.title + `(${data[element.id]})`
                        })
                        treeNode.props.dataRef.children = tempData;
                        this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
                        resolve();
                    })
                }else{
                    treeNode.props.dataRef.children = tempData;
                    this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
                    resolve();
                }
                
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
                if(!this.props.simple){
                    getUserCount(this.state.categoryId, ids, true).then(data => {
                        tempData.forEach(element => {
                        element.title = element.title + `(${data[element.id]})`
                        })
                        treeNode.props.dataRef.children = tempData;
                        this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
                        resolve();
                    })
                }else{
                    treeNode.props.dataRef.children = tempData;
                    this.setState({ treeDataOrg: [...this.state.treeDataOrg] }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
                    resolve();
                }
            
            })
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
      if(!this.props.simple){
        getUserCount(this.state.categoryId, ids, true).then(data => {
            tempData.forEach(element => {
              element.title = element.title + `(${data[element.id]})`
            })
            this.setState({ treeDataOrg: tempData }, () => this.props.loadCheckedValues?this.props.loadCheckedValues():null)
          })
      }else{
        this.props.onSelect(data[0].id,this.state.categoryId);
        this.setState({ treeDataOrg: tempData ,selectedKeys:[data[0].id]})
      }
      
    })
  }

    renderTreeNodes = (data) => {
        return data.map((item) => {
        if (item.children) {
            return (
            <TreeNode title={item.title} key={this.props.simple?item.id:item.key} disableCheckbox={item.disableCheckbox} dataRef={item}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode title={item.title} key={this.props.simple?item.id:item.key} disableCheckbox={item.disableCheckbox} dataRef={item} />;
        });
    }

    render(){
        return(
            <div>
                 <Form layout="inline" style={{ marginBottom: 16 }} onSubmit={(e) => this.onSubmit('org', e)}>
                    <Form.Item label="分类机构">
                        <OrgCategorySelectTree 
                        style={{ width: "160px" }}
                        value={this.state.categoryId}
                        onSelect={this.handleSelectChange}
                        ref="categoryOrgSelect"
                        ampEnvId={base.environment}
                        />
                    </Form.Item>
                    {this.props.simple?"":<Form.Item label="机构名称">
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
                    </Form.Item>}
                </Form>

                {this.state.treeDataOrg && this.state.treeDataOrg.length > 0
                ? this.props.simple?
                    <Tree
                    loadData={this.loadtreeDataOrg}
                    checkable={false}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                    >
                    {this.renderTreeNodes(this.state.treeDataOrg)}
                </Tree>:
                <Tree
                    loadData={this.loadtreeDataOrg}
                    checkable={!this.props.simple}
                    checkStrictly={true}
                    onCheck={this.props.onOrgCheck}
                    checkedKeys={this.props.checkedOrgKeys}
                    onSelect={this.props.onSelect}
                    >
                    {this.renderTreeNodes(this.state.treeDataOrg)}
                </Tree>
                :this.state.treeDataOrg.length===0?"无数据":'数据加载中...'}
            </div>
        )
    }

}

export default OrgTree;