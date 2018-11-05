import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Row } from 'antd'

export default class LogInputs extends Component {
	static propTypes = {
		prop: PropTypes.object
	}

	constructor(props) {
		super(props);

		const value = props.value || {};
		this.state = {
			IP1: value.IP1 || '',
			IP2: value.IP2 || '',
		};
	}

	onChangeIP1 = (e) => {
		this.setState({ IP1: e.target.value })
		this.triggerChange({IP1: e.target.value})
	}

	onChangeIP2 = (e) => {
		this.setState({ IP2: e.target.value })
		this.triggerChange({IP2: e.target.value})
	}

	//必须得提供triggerChange事件，父组件才能拿到input的值
	triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

	render() {
		return (
			<div>
				<Row>
					<Input style={{ width: '40%' }} onChange={this.onChangeIP1} value={this.state.IP1} />
					<span style={{ marginLeft: 8, marginRight: 8 }}>
						-
					</span>
					<Input style={{ width: '40%' }} onChange={this.onChangeIP2} value={this.state.IP2} />
				</Row>
			</div>
		)
	}
}
