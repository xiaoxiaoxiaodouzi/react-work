/* import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BlockPicker } from 'react-color'
import { Modal } from 'antd'


export default class ColorSelect extends Component {
	static propTypes = {
		prop: PropTypes.object,
		color: PropTypes.string,

	}

	state={
		visible:false,
	}

	handleClick = () => {
		this.setState({ visible: true })
	};

	handleChange = (color) => {
		this.setState({ color: color.rgb ,visible:false})
	};

	render() {
		return (
			<div>
				<div style={styles.swatch} onClick={this.handleClick}>
					<div style={{ color: this.props.color }} />
				</div>
				<Modal
					visible={this.state.visible}
					footer={null}
					onCancel={() => { this.setState({ visible: false }) }}
					onOk={this.handleOk}
				>
					<SketchPicker color={this.state.color} onChange={this.handleChange} />
				</Modal>
			</div>
		)
	}
}
 */