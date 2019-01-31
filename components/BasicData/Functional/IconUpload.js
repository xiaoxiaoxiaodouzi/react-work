import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, Icon, Row, Col } from 'antd'
import {uploadIcon} from '../../../services/amp';

export default class IconUpload extends Component {
	static propTypes = {
		prop: PropTypes.object
	}

	state = {
		icon1: this.props.data?this.props.data.icon1:'',
		icon2: this.props.data?this.props.data.icon2:'',
		icon3: this.props.data?this.props.data.icon3:'',
		fileList: this.props.data?[{uid: '1',name: 'icon1.png',status: 'done',url:this.props.data.icon1 }]:[],
		previewVisible: false,
		previewImage: '',
		fileList1: this.props.data?[{uid: '2',name: 'icon2.png',status: 'done',url:this.props.data.icon2 }]:[],
		fileList2: this.props.data?[{uid: '3',name: 'icon3.png',status: 'done',url:this.props.data.icon3 }]:[]
	}

	handleChange = (type, data) => {
		if(type === 'fileList'){
			this.setState({icon1:data?data.path:''})
		}else if(type === 'fileList1'){
			this.setState({icon2:data?data.path:''})
		}else if(type === 'fileList2'){
			this.setState({icon3:data?data.path:''})
		}

		this.triggerChange(data);
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
		return true;
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
						//action="amp/v1/files"
						listType="picture-card"
						fileList={this.state.fileList}
						showUploadList={{showPreviewIcon:true}}
						accept='image/gif,image/jpeg,image/jpg,image/png,image/svg'
						onPreview={this.handlePreview}						
						beforeUpload={(file) => {
							return false;}}
						onChange={(info) => {
							
							if(info.fileList.length > 0){
								let filedata = new FormData();
								filedata.append('file', info.fileList[0].originFileObj);
								uploadIcon(filedata).then(data => {
									this.setState({fileList:[{uid: '1',name: 'icon1.png',status: 'done',url:data.path}]})
									this.handleChange('fileList', data)
								})
							}else{
								this.setState({fileList:[],icon1:''})
							}
						
						}}
					>
						{this.state.fileList && this.state.fileList.length >= 1 ? null : uploadButton}
					</Upload>
				</Col>
				<Col span={8}>
					<Upload
						listType="picture-card"
						fileList={this.state.fileList1}
						onPreview={this.handlePreview}
						beforeUpload={(file) => {return false;}}
						onChange={(info) => {
							if(info.fileList.length > 0){
								let filedata = new FormData();
								filedata.append('file', info.fileList[0].originFileObj);
								uploadIcon(filedata).then(data => {
									this.setState({fileList1:[{uid: '2',name: 'icon2.png',status: 'done',url:data.path}]})

									this.handleChange('fileList1', data)
								})
							}else{
								this.setState({fileList1:[],icon2:''})
								this.handleChange('fileList1', {})
							}
						}
						}
					>
						{this.state.fileList1 && this.state.fileList1.length >= 1 ? null : uploadButton}
					</Upload>
				</Col>
				<Col span={8}>
					<Upload
						listType="picture-card"
						fileList={this.state.fileList2}
						onPreview={this.handlePreview}
						beforeUpload={(file) => {return false;}}
						onChange={(info) => {
							if(info.fileList.length > 0){
								let filedata = new FormData();
								filedata.append('file', info.fileList[0].originFileObj);
								uploadIcon(filedata).then(data => {
									this.setState({fileList2:[{uid: '3',name: 'icon3.png',status: 'done',url:data.path}]})
									this.handleChange('fileList2', data)
								})
							}else{
								this.setState({fileList2:[],icon3:''})	
							}
						}}
					>
						{this.state.fileList2 && this.state.fileList2.length >= 1 ? null : uploadButton}
					</Upload>
				</Col>
				<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
				</Modal>
			</Row>
		)
	}
}
