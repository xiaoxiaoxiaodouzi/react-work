import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, Icon, Row, Col } from 'antd'

export default class IconUpload extends Component {
	static propTypes = {
		prop: PropTypes.object
	}

	state = {
		icon1: '',
		icon2: '',
		icon3: '',
		fileList: [],
		previewVisible: false,
		previewImage: '',
		fileList1: [],
		fileList2: [],
	}

	handleChange = (type, { fileList }) => {
		if (type === 'fileList') {
			this.setState({ fileList }, () => {
				this.triggerChange({ fileList })
			})
		} else if (type === 'fileList1') {
			this.setState({ fileList1: fileList }, () => {
				this.triggerChange({ fileList1: fileList })
			})
		} else if (type === 'fileList2') {
			this.setState({ fileList2: fileList }, () => {
				this.triggerChange({ fileList2: fileList })
			})
		}
	}

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue));
		}
	}

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	beforeUpload = (type, file) => {
		let query = [];
		query.push(file);
		if (type === 'fileList') {
			this.setState({ fileList: query })
		} else if (type === 'fileList1') {
			this.setState({ fileList1: query })
		} else if (type === 'fileList2') {
			this.setState({ fileList2: query })
		}
		return false;
	}

	handleCancel = () => this.setState({ previewVisible: false })
	render() {
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);


		return (
			<Row >
				<Col span={8}>
					<Upload
						action=""
						listType="picture-card"
						fileList={this.state.fileList}
						onPreview={this.handlePreview}
						beforeUpload={(fileList) => this.beforeUpload('fileList', fileList)}
						onChange={(fileList) => this.handleChange('fileList', fileList)}
					>
						{this.state.fileList.length >= 1 ? null : uploadButton}
					</Upload>
				</Col>
				<Col span={8}>
					<Upload
						action="//jsonplaceholder.typicode.com/posts/"
						listType="picture-card"
						fileList={this.state.fileList1}
						onPreview={this.handlePreview}
						beforeUpload={(fileList) => this.beforeUpload('fileList1', fileList)}
						onChange={(fileList) => this.handleChange('fileList1', fileList)}
					>
						{this.state.fileList1.length >= 1 ? null : uploadButton}
					</Upload>
				</Col>
				<Col span={8}>
					<Upload
						action="//jsonplaceholder.typicode.com/posts/"
						listType="picture-card"
						fileList={this.state.fileList2}
						onPreview={this.handlePreview}
						beforeUpload={(fileList) => this.beforeUpload('fileList2', fileList)}
						onChange={(fileList) => this.handleChange('fileList2', fileList)}
					>
						{this.state.fileList2.length >= 1 ? null : uploadButton}
					</Upload>
				</Col>
				<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
				</Modal>
			</Row>
		)
	}
}
