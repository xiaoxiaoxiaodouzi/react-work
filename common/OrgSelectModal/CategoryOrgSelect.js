import React, { Component } from "react";
import { Select } from "antd";
// import RemoteData from "../utils/RemoteData"

class CategoryOrgSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryOrg: null
        };

        this._onSelect = this._onSelect.bind(this);
    }

    //****************************************************************** */
    //*******************************EVENT****************************** */
    //****************************************************************** */

    _onSelect(value) {
        this.setState({
            categoryOrg: value
        })
        this.props.onChange && this.props.onChange(value);
    }

    //****************************************************************** */
    //*********************************UI******************************* */
    //****************************************************************** */

    render() {

        return (
            <Select
                style={this.props.style}
                placeholder={"选择一个机构分类"}
                value={this.state.categoryOrg}
                onSelect={this._onSelect}
                dropdownMatchSelectWidth={false}>
                {this.props.dataSource.map(categoryOrg => {
                    return (
                        <Select.Option key={categoryOrg.id} value={categoryOrg.id}>
                            {categoryOrg.name}
                        </Select.Option>
                    )
                })}
            </Select>
        );
    }
}

export default CategoryOrgSelect;
