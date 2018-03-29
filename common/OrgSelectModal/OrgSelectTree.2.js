import React, { Component } from "react";
import { TreeSelect } from "antd";
import C2Fetch from "../../utils/Fetch"

const TreeNode = TreeSelect.TreeNode;

class OrgSelectTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            orgs: [],
            filteredOrgTree: [],
            status: "nocategory"
        };
    }

    componentDidMount() {
        if (this.props.category) this._onCategoryOrgChange(this.props.category, this.props.filterOrgId);
    }

    _onCategoryOrgChange = (category, filterOrgId) => {
        this.setState({ status: "loading" });
        let orgId = this.props.orgId;
        if (!orgId) orgId = "0";
        C2Fetch.get(`proxy/uop/v1/orgs/${orgId}/children`, { categoryId: category }, "获取机构数据出错！").then(orgs => {
            if (filterOrgId != null) {
                for (let i = 0; i < orgs.length; i++) {
                    if (orgs[i].id === filterOrgId) {//移除本身
                        orgs.splice(i, 1);
                        i--;
                        if (i < 0) i = 0;
                    }
                }
            }
            //调整结构
            //let orgTree = TreeHelper.toChildrenStruct(orgs, -1);
            this.setState({
                status: "loaded", orgs: orgs,
            });
            if (typeof this.state.value !== 'undefined') {
                if (this.state.value) {
                    this._onChange(this.state.value, null, null);
                } else if (orgs.length > 0) {
                    this._onChange({ label: orgs[0].name, value: orgs[0].id }, null, null);
                } else {
                    this._onChange({ label: '', value: '' }, null, null);
                }
            }
        });
    }
    _onChange = (value, label, extra) => {
        this.setState({ value: value });
        if (typeof this.props.onChange === "function") {
            this.props.onChange(value, label, extra, this.state.orgs);
        }
    }

    //异步加载数据
    loadData = (node) => {
        return new Promise((resolve) => {
            C2Fetch.get(`proxy/uop/v1/orgs/${node.props.eventKey}/children`, { categoryId: this.props.category }, "获取机构数据出错！")
                .then(data => {
                    if (this.props.filterOrgId != null) {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id === this.props.filterOrgId) {//移除本身
                                data.splice(i, 1);
                                i--;
                                if (i < 0) i = 0;
                            }
                        }
                    }
                    let parentOrgs = this.state.orgs.slice();
                    for (let o of parentOrgs) {
                        if (o.id === node.props.eventKey) {
                            if (data.length > 0) o.children = data;
                        } else {
                            this.childrenCall(o.children, node, data, this);
                        }
                    }
                    this.setState({ orgs: parentOrgs })
                })
            resolve();
        });
    }

    childrenCall(childrens, node, orgs, th) {
        if (childrens && childrens.length > 0) {
            for (let c of childrens) {
                if (c.id === node.props.eventKey) {
                    if (orgs.length > 0) c.children = orgs;
                } else {
                    th.childrenCall(c.children, node, orgs, th);
                }
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.category !== this.props.category || nextProps.filterOrgId !== this.props.filterOrgId) {
            this.setState({ value: nextProps.value })
            this._onCategoryOrgChange(nextProps.category, nextProps.filterOrgId);
        }
    }

    render() {
        const mapTreeNode = (data) => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode title={item.name} key={item.id} value={item.id}>
                            {mapTreeNode(item.children)}
                        </TreeNode>
                    )
                }
                return <TreeNode title={item.name} key={item.id} value={item.id} />;
            });
        }
        return (
            <TreeSelect
                showSearch
                allowClear={true}
                searchPlaceholder="输入名称过滤"
                treeNodeFilterProp="title"
                style={this.props.style}
                value={this.state.value}
                labelInValue
                multiple={true}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                dropdownMatchSelectWidth={false}
                loadData={this.loadData}
                placeholder={'请选择一个机构'}
                onChange={this._onChange}
            >
                {mapTreeNode(this.state.orgs)}
            </TreeSelect>
        );
    }
}

export default OrgSelectTree;
