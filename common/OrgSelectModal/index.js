import React, { Component } from "react";
import { Modal, Row, Col, message, Checkbox, Button } from "antd";
import OrgSelectTree from "./OrgSelectTree";
import CategoryOrgSelect from "./CategoryOrgSelect";
import C2Fetch from "../../utils/Fetch";
import QuickSearch from '../../utils/quickSearch';

class OrgSelectModal extends Component {

    static defaultProps = {
        title: '机构选择',
        mark: '目标机构',
        defaultValue: []
    }

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selectedValue: [],
            categoryOrgs: [],
            category: null,
            orgs: []
        }

        this.defaultValue = props.defaultValue;
        this.orgs = {};//已选二级机构
        this.categoryOrgs = {};//缓存顶级分类机构

        this._onClick = this._onClick.bind(this);
        this._handleOk = this._handleOk.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
        this._onCategoryOrgChange = this._onCategoryOrgChange.bind(this);
        this._onOrgChange = this._onOrgChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {

    }
    //****************************************************************** */
    //*******************************EVENT****************************** */
    //****************************************************************** */

    _pullData() {

        Promise.all([C2Fetch.get('proxy/uop/v1/toporgs', {}, '获取顶级机构失败'), C2Fetch.get('proxy/uop/v1/categoryorgs', {}, '获取分类机构失败')])
            .then((response) => {
                var topOrgs = response[0];
                var categoryorgs = response[1];
                var options = {}
                var result = [];
                for (var i = 0; i < topOrgs.length; i++) {
                    var topOrg = topOrgs[i];
                    var pid = topOrg.id;
                    for (var n = 0; n < categoryorgs.length; n++) {
                        var categoryorg = categoryorgs[n];
                        if (categoryorg.pid == pid) {
                            var option = {
                                id: categoryorg.id,
                                pid: pid,
                                orgType: categoryorg.orgType,
                                userType: categoryorg.userType,
                                name: topOrg.name + '-' + categoryorg.name,
                                topOrgName: topOrg.name,
                                categoryOrgName: categoryorg.name
                            }
                            result.push(option);
                            options[categoryorg.id] = option;
                        }
                    }
                }
                this.categoryOrgs = options;
                this.setState({
                    categoryOrgs: result
                })
            })
            .catch((e) => {
            })
    }

    _onClick() {
        this._pullData();
        var orgs = {};
        this.defaultValue = this.props.defaultValue;
        for (var n = 0; n < this.defaultValue.length; n++) {
            var defaultOrg = this.defaultValue[n];
            var categoryOrg = orgs[defaultOrg.categoryOrgId];
            if (categoryOrg == null) {
                if(defaultOrg.categoryOrgId == defaultOrg.orgId){
                    orgs[defaultOrg.categoryOrgId] = { id: defaultOrg.categoryOrgId, name: defaultOrg.categoryOrgName, children: [], selectedValue: [],selected:true };
                }else{
                    orgs[defaultOrg.categoryOrgId] = { id: defaultOrg.categoryOrgId, name: defaultOrg.categoryOrgName, children: [{ id: defaultOrg.orgId, name: defaultOrg.name }], selectedValue: [defaultOrg.orgId],selected:false };
                }
            } else {
                categoryOrg.children.push({ id: defaultOrg.orgId, name: defaultOrg.name })
                categoryOrg.selectedValue.push(defaultOrg.orgId)
            }
        }
        this.orgs = orgs;
        this.setState({ visible: true });
    }

    _handleOk() {

        if (this.orgs != null) {
            var result = [];
            for (const key in this.orgs) {
                var org = this.orgs[key];
                if (org != null) {
                    if (org.selected == true) {//分类机构选中
                        result.push({ categoryOrgId: org.id, categoryOrgName: org.name, id: org.id, name: org.name });
                    } else if (org.children != null) {//分类机构未选中,机构选中
                        var children = org.children;
                        children.forEach(element => {
                            result.push({ categoryOrgId: org.id, categoryOrgName: org.name, id: element.id, name: element.name });
                        });
                    }

                }
            }
            this.props.onOk && this.props.onOk(result);

            this.setState({
                visible: false,
                selectedValue: [],
                category: null,
                orgs: []
            });
            this.orgs = {};

        } else {
            message.warning('请选择机构');
        }
    }

    _handleCancel() {

        this.setState({
            visible: false,
            selectedValue: [],
            category: null,
            orgs: []
        });

        this.orgs = {};
    }

    getChildNode(orgs, pid) {
        var childNode = QuickSearch.query(orgs, ['pid', '==', pid])
        if (childNode.length > 0) {
            for (var n = 0; n < childNode.length; n++) {
                var result = this.getChildNode(orgs, childNode[n].id);
                if (result != null) {
                    childNode[n].children = result;
                }
            }
            return childNode;
        } else {
            return null
        }

    }

    _onCategoryOrgChange(id) {
        var categoryOrg = this.categoryOrgs[id];
        if(this.orgs[id] == null){
            this.orgs[id] = { id: id, name: categoryOrg.categoryOrgName, children: [], selectedValue: [], selected: false };
        }
        C2Fetch.get(`proxy/uop/v1/orgs/0/children`, { cascade: true, categoryId: categoryOrg.id }, "获取机构数据出错！")
            .then((orgs) => {
                var tmp = {};
                var topNode = QuickSearch.query(orgs, ['pid', '==', categoryOrg.id])
                for (var n = 0; n < topNode.length; n++) {
                    topNode[n].children = this.getChildNode(orgs, topNode[n].id);
                }
                this.setState({
                    category: categoryOrg,
                    orgs: topNode,
                    selectedValue: this.orgs[id] && this.orgs[id].selectedValue || []
                })
            })
            .catch((e) => { });
    }

    _onOrgChange(value, label, extra) {
        var children = [];
        for (var n = 0; n < value.length; n++) {
            children.push({ id: value[n], name: label[n] });
        }
        var categoryOrgId = this.state.category.id;
        this.orgs[categoryOrgId] = { id: categoryOrgId, name: this.categoryOrgs[categoryOrgId].categoryOrgName, children: children, selectedValue: value ,selected:false};
        this.setState({
            selectedValue: value
        })
    }
    //****************************************************************** */
    //*********************************UI******************************* */
    //****************************************************************** */
    render() {

        var dom = null;
        if (this.props.renderButton) {
            dom = this.props.renderButton()
        } else {
            dom = '修改';
        }
        return (
            <div>
                <a onClick={this._onClick}>{dom}</a>
                <Modal title={this.props.title} key={this.props.newkey}
                    visible={this.state.visible}
                    onCancel={() => { this.setState({ visible: false }) }}
                    maskClosable={false}
                    footer={[
                        <Button key='cancel' onClick={this._handleCancel}>取消</Button>,
                        <Button key='submit' loading={this.state.loading} type="primary" onClick={this._handleOk}>确定</Button>
                    ]}>
                    <Row type="flex" align="middle" className="search-result-list">
                        <Col style={{ paddingRight: 5 }}><label>{this.props.mark}:</label></Col>
                        <Col>
                            <CategoryOrgSelect
                                style={{ width: 195 }}
                                dataSource={this.state.categoryOrgs}
                                onChange={this._onCategoryOrgChange}
                            />
                        </Col>
                        <Col>
                            <OrgSelectTree
                                disabled={this.state.category && this.orgs[this.state.category.id].selected}
                                mode={'multiple'}
                                style={{ width: 195, marginLeft: 16 }}
                                value={this.state.selectedValue}
                                dataSource={this.state.orgs}
                                categoryId={this.state.category && this.state.category.id}
                                onChange={this._onOrgChange}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default OrgSelectModal;
