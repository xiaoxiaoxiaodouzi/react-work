import React, { Component } from "react";
import { TreeSelect } from "antd";
import C2Fetch from '../../utils/Fetch';

const TreeNode = TreeSelect.TreeNode;

class OrgSelectTree extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: props.dataSource || [],
        };

        this.orgs = {};
        this.renderTreeNode = this.renderTreeNode.bind(this);
    }

    componentDidMount() {
        var dataSource = this.props.dataSource;
        for (var n = 0; n < dataSource.length; n++) {
            var org = dataSource[n];
            this.orgs[n] = org;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            this.setState({ dataSource: nextProps.dataSource })
        }
    }

    //****************************************************************** */
    //*******************************EVENT****************************** */
    //****************************************************************** */

    _onChange = (value, label, extra) => {
        this.props.onChange && this.props.onChange(value, label, extra);
    }

    //****************************************************************** */
    //*********************************UI******************************* */
    //****************************************************************** */
    renderTreeNode(data) {
        var tempDom = [];
        var th = this;
        data.map((item) => {
            if (item.children) {
                tempDom.push(
                    <TreeNode title={item.name} key={item.id} value={item.id}>
                        {th.renderTreeNode(item.children)}
                    </TreeNode>
                )
            } else {
                tempDom.push(<TreeNode title={item.name} key={item.id} value={item.id} />);
            }
        });
        return tempDom;
    }

    render() {

        return (
            <TreeSelect
                disabled={this.props.disabled}
                showSearch
                allowClear={true}
                searchPlaceholder="输入名称过滤"
                treeNodeFilterProp="title"
                multiple={true}
                treeCheckable={true}
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                style={this.props.style}
                value={this.props.value}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                dropdownMatchSelectWidth={false}
                placeholder={'请选择一个机构'}
                onChange={this._onChange}
            >
                {this.renderTreeNode(this.state.dataSource)}
            </TreeSelect>
        );
    }
}

export default OrgSelectTree;
