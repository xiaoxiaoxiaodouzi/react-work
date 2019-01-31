import React, { Component } from "react";
import { Modal, Row, Button, Tree, Tag } from "antd";
import C2Fetch from "../../utils/Fetch";

const TreeNode = Tree.TreeNode;

class OrgSelectModal extends Component {

    static defaultProps = {
        title: '机构选择',
        mark: '目标机构',
        defaultValue: [],
        multiple: false,
        checkableTopOrg: true,
        checkableCategoryOrg: true,
        checkableOrg: true 
    }

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            dataSource: [],
            selectedItems: [],
            selectedKeys: [],
            selectedValue: [],
            disabledOrg:props.disabledOrg
        }

        this.orgs = {};
        this.selectedItem = {};

        this._onClick = this._onClick.bind(this);
        this._handleOk = this._handleOk.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
        this._onLoadData = this._onLoadData.bind(this);
        this._onCheck = this._onCheck.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible != null){
            
            var selectedValue = [];
            var selectedKeys = [];
            if (nextProps.defaultValue instanceof Array) {
                for (var n = 0; n < nextProps.defaultValue.length; n++) {
                    selectedValue.push(nextProps.defaultValue[n].id + "&&" + nextProps.defaultValue[n].categoryOrgId);
                }
            } else {
                selectedKeys.push(nextProps.defaultValue)
            }
    
            this.setState({
                visible: nextProps.visible,
                selectedItems: nextProps.defaultValue,
                selectedKeys: selectedKeys,
                selectedValue: selectedValue,
                disabledOrg:nextProps.disabledOrg
            });
        }

        if(this.props.visible === false && nextProps.visible === true){
            this._pullData();
        }
    }
    //****************************************************************** */
    //*******************************EVENT****************************** */
    //****************************************************************** */

    _pullData() {

        Promise.all([C2Fetch.get('proxy/uop/v1/toporgs', {}, '获取顶级机构失败'), C2Fetch.get('proxy/uop/v1/categoryorgs', {}, '获取分类机构失败')])
            .then((response) => {
                var topOrgs = response[0];
                var categoryorgs = response[1];
                var result = [];
                for (var i = 0; i < topOrgs.length; i++) {
                    var topOrg = topOrgs[i];
                    this.orgs[topOrg.id + "&&"] = topOrg;
                    var pid = topOrg.id;
                    var children = [];
                    for (var n = 0; n < categoryorgs.length; n++) {
                        var categoryorg = categoryorgs[n];
                        if (categoryorg.pid === pid) {
                            var option = {
                                id: categoryorg.id,
                                categoryOrgId: categoryorg.id,
                                pid: 0,
                                orgType: categoryorg.orgType,
                                userType: categoryorg.userType,
                                name: categoryorg.name,
                                topOrgName: topOrg.name,
                                disabled: !this.props.checkableCategoryOrg,
                                categoryOrgName: categoryorg.name
                            }
                            this.orgs[option.id + "&&" + option.categoryOrgId] = option;
                            children.push(option);
                        }
                    }
                    topOrg.disabled = !this.props.checkableTopOrg;
                    if (children.length > 0) {
                        topOrg.children = children;
                        result.push(topOrg)
                    }
                }
                this.setState({
                    dataSource: result
                })
            })
            .catch((e) => {
            })
    }


    _onLoadData(treeNode) {
        var th = this;
        return new Promise((resolve) => {
            if (treeNode.props.dataRef.categoryOrgId == null) {
                resolve();
                return;
            }

            if (treeNode.props.dataRef.children != null) {
                resolve();
                return;
            }

            var categoryId = treeNode.props.dataRef.categoryOrgId;
            var orgId = treeNode.props.dataRef.id === treeNode.props.dataRef.categoryOrgId ? 0 : treeNode.props.dataRef.id;

            C2Fetch.get(`proxy/uop/v1/orgs/${orgId}/children`, { categoryId: categoryId }, "获取机构数据出错！")
                .then((orgs) => {
                    
                    orgs.forEach((element) => {
                        element.categoryOrgName = treeNode.props.dataRef.categoryOrgName;
                        //第一段处理分类机构下获取子机构，第二段处理机构下获取子机构
                        element.disabled = treeNode.props.dataRef.id === treeNode.props.dataRef.categoryOrgId ? !th.props.checkableOrg || treeNode.props.checked || false : 
                        !th.props.checkableOrg || treeNode.props.dataRef.disabled || treeNode.props.checked || false ;
                        if(!element.disabled){
                            if(this.state.disabledOrg.indexOf(element.id) !== -1){
                                element.disabled = true;
                            }
                        }
                        this.orgs[element.id + "&&" + element.categoryOrgId] = element;
                    })
                    treeNode.props.dataRef.children = orgs;
                    th.setState({
                        dataSource: [...th.state.dataSource]
                    })
                    resolve();
                })
                .catch((e) => {
                    resolve();
                });
        })
    }

    _disableNodeChild(child, disabled) {
        if (child === undefined || child.length === 0) {
            return;
        }
        for (var n = 0; n < child.length; n++) {
            child[n].disabled = disabled;
            if (child[n].checked === null || child[n].checked === false) {
                this._disableNodeChild(child[n].children, disabled);
            }
        }
    }

    _onCheck(checkedKeys, e) {
        // var checkedNodes = e.checkedNodes;
        var filterNodes = [];
        var isAdd = true;
        for (var n = 0; n < this.state.selectedItems.length; n++) {
            if (e.node.props.dataRef.id + "&&" + e.node.props.dataRef.categoryOrgId === this.state.selectedItems[n].id + "&&" + this.state.selectedItems[n].categoryOrgId) {
                isAdd = false;
                continue
            }
            filterNodes.push(this.state.selectedItems[n]);
        }

        e.node.props.dataRef.checked = e.checked;

        if (isAdd) {
            filterNodes.push(e.node.props.dataRef);
            this._disableNodeChild(e.node.props.dataRef.children, true)
        } else {
            this._disableNodeChild(e.node.props.dataRef.children, false)
        }

        var selectedItems = filterNodes;

        this.setState({
            selectedValue: checkedKeys.checked,
            selectedItems: selectedItems,
            dataSource: [...this.state.dataSource]
        });
    }

    _onDelete(element) {
        var checkedKeys = [];
        this.state.selectedValue.forEach((value) => {
            if (value !== element.id + "&&" + element.categoryOrgId) {
                checkedKeys.push(value)
            }
        })
        var selectedItems = [];
        this.state.selectedItems.forEach((value) => {
            if (value.id + "&&" + value.categoryOrgId !== element.id + "&&" + element.categoryOrgId) {
                selectedItems.push(this.orgs[value.id + "&&" + value.categoryOrgId] || value)
            }
        })

        this._disableNodeChild((this.orgs[element.id + "&&" + element.categoryOrgId] || element).children, false)

        this.setState({
            selectedValue: checkedKeys,
            selectedItems: selectedItems
        })
    }

    _onClick() {
        this._pullData();
        var selectedValue = [];
        var selectedKeys = [];
        if (this.props.defaultValue instanceof Array) {
            for (var n = 0; n < this.props.defaultValue.length; n++) {
                selectedValue.push(this.props.defaultValue[n].id + "&&" + this.props.defaultValue[n].categoryOrgId);
            }
        } else {
            selectedKeys.push(this.props.defaultValue)
        }

        this.setState({
            visible: true,
            selectedItems: this.props.defaultValue,
            selectedKeys: selectedKeys,
            selectedValue: selectedValue
        });
    }

    _onSelect(selectedKeys, e) {
        if (!this.props.multiple) {
            this.selectedItem = e.node.props.dataRef;
            this.setState({
                selectedKeys: [e.node.props.dataRef.id + "&&" + e.node.props.dataRef.categoryOrgId]
            })
        }
    }

    _handleOk() {
        if (this.state.selectedItems.length > 0 || this.state.selectedKeys.length > 0) {

            if (this.props.multiple) {
                var selectedItems = [];
                this.state.selectedItems.forEach((element) => {
                    if (!element.disabled) {
                        selectedItems.push(element)
                    }
                })
                this.props.onOk && (this.props.onOk(selectedItems));
            } else {
                this.props.onOk && (this.props.onOk(this.selectedItem));
            }

        } else{
            this.props.onOk && (this.props.onOk([]));
        }
        if (this.props.visible == null) {
            this.setState({
                visible: false,
                selectedValue: [],
                selectedItems: []
            });
        } else {
            this.setState({
                selectedValue: [],
                selectedItems: []
            });
        }
    }

    _handleCancel() {
        if(this.props.visible == null){
            this.setState({
                visible: false,
                selectedValue: [],
            });
        }else{
            this.props.onCancel && this.props.onCancel()
        }
    }

    //****************************************************************** */
    //*********************************UI******************************* */
    //****************************************************************** */
    renderTreeNode(data) {
        var tempDom = [];
        var th = this;
        data.forEach((item) => {
            if (item.children instanceof Array) {
                tempDom.push(
                    <TreeNode disableCheckbox={item.disabled} disabled={this.props.multiple ? false : item.disabled} title={item.name} key={item.id + "&&" + item.categoryOrgId} value={item.id + "&&" + item.categoryOrgId} dataRef={item}>
                        {th.renderTreeNode(item.children)}
                    </TreeNode>
                )
            } else {
                tempDom.push(<TreeNode disableCheckbox={item.disabled} disabled={this.props.multiple ? false : item.disabled} title={item.name} key={item.id + "&&" + item.categoryOrgId} value={item.id + "&&" + item.categoryOrgId} dataRef={item} />);
            }
        });
        return tempDom;
    }

    render() {

        var dom = null;
        if (this.props.visible == null) {
            if (this.props.renderButton) {
                dom = (<a onClick={this._onClick}>{this.props.renderButton()}</a>)
            } else {
                dom = (<a onClick={this._onClick}>修改</a>);
            }
        }

        return (
            <div>
                {dom}
                <Modal title={this.props.title} key={this.props.newkey} mask={this.props.isOffset?false:true}
                    style={this.props.isOffset?{top:40,left:'50%',marginLeft:-240}:{}}
                    visible={this.props.visible == null ? this.state.visible : this.props.visible}
                    onCancel={() => { this.props.visible != null ? this.props.onCancel && this.props.onCancel() : this.setState({ visible: false }) }}
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={[
                        <Button key='cancel' onClick={this._handleCancel}>取消</Button>,
                        <Button key='submit' loading={this.state.loading} type="primary" onClick={this._handleOk}>确定</Button>
                    ]}>
                    <Row type="flex" align="middle">
                        {!this.props.multiple ? null : this.state.selectedItems.map((element) => {
                            if (element.disabled === true) {
                                return null;
                            }
                            return <Tag closable key={element.id + "&&" + element.categoryOrgId} onClose={() => this._onDelete(element)} style={{ marginTop: 10 }}>{element.name}</Tag>
                        })}
                    </Row>
                    <Row type="flex" align="middle">
                        <Tree
                            loadData={this._onLoadData}
                            checkStrictly={true}
                            checkable={this.props.multiple}
                            onCheck={this._onCheck}
                            onSelect={this._onSelect}
                            selectedKeys={this.state.selectedKeys}
                            checkedKeys={this.state.selectedValue}>
                            {this.renderTreeNode(this.state.dataSource)}
                        </Tree>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default OrgSelectModal;
