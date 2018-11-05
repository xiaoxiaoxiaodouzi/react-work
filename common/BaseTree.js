import React, { Component } from 'react'
import { Form, Row, Col, Select, Input, Tree, Button, Divider, Icon } from 'antd'
import PropTypes from 'prop-types'
import TreeHelp from '../utils/TreeHelp'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import moment from 'moment'
import constants from '../services/constants'

const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { Description } = DescriptionList;
class BaseTree extends Component {
	static propTypes = {
		selectedKeys: PropTypes.object,				//选中的节点,antd取消父子关联
		treeNodes: PropTypes.array.isRequired,			//所有数据的节点
		onSelectKeys: PropTypes.func.isRequired,		//(selectKeys,selectNodes)第一个参数是所有选中的key，第二个参数是所有选中的节点
		pidName: PropTypes.string.isRequired,
		/* 	roleId:PropTypes.string,					//角色ID	
			appId:PropTypes.string			//应用ID */
	}

	state = {
		selectedKeys: { checked: [] },
		treeNodes: [],
		dataRef: {},
		loading: true
	}

	componentDidMount() {
		//首先对数据进行处理
		if (this.props.pidName) {
			this.props.treeNodes.forEach(i => {
				if (i.children) {
					delete i.children
				}
				i.pid = i[this.props.pidName]
			})
		}
		let treeNodes = Array.from(this.props.treeNodes);
		/* 	treeNodes[0].name=1;
			this.props.treeNodes[0].name=2;
			console.log(treeNodes[0].name,this.props.treeNodes[0].name) */
		this.setState({ dataRef: treeNodes.length > 0 ? treeNodes[0] : {}, treeNodes: TreeHelp.toChildrenStruct(treeNodes), selectedKeys: { checked: this.props.selectedNodes || [] }, loading: false })
	}

	/* loadDatas = (appId, resourcesId) => {
		let queryParams = {
			appId: appId,
			pid: resourcesId,
			cascaded: true,
		}
		getResources(queryParams).then(data => {
			let datas = this.state.datas;
			datas.forEach(i => {
				if (i.id === resourcesId) {
					i.childs = data;
				}
			})
			this.setState({ data })
		})
	} */

	/* onLoadData = (treeNode) => {
		return new Promise((resolve) => {
			if (treeNode.props.children) {
				resolve();
				return;
			}
			//查询资源下面的子资源
			let queryParams = {
				appId: this.props.appId,
				pid: treeNode.props.dataRef.id,
			}
			getResources(queryParams).then(data => {
				if (data.length > 0) {
					data.forEach(i => {
						i.title = i.name
						i.key = i.id
					})
				}
				treeNode.props.dataRef.children = data;
				this.setState({ treeData: [...this.state.treeData] })
				resolve();
			})

      /* setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000); 
		});
	} */

	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.children) {
				return (
					<TreeNode icon={<Icon type={item.type === 'function' ? 'folder' : 'file'} />} title={item.name} key={item.id} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode icon={<Icon type={item.type === 'function' ? 'folder' : 'file'} />} title={item.name} key={item.id} dataRef={item} />;
		});
	}

	handleClose = (tag) => {
		let nodes = this.getChildNode(tag, []);
		nodes.push(tag)
		this.onDeleteKeys(nodes);
	}
	onCheck = (checkedKeys, e) => {
		//如果是选中则往选中的key里面加
		let nodes = this.props.treeNodes || [];
		//选中的节点
		// let node = this.state.selectedKeys.checked;
		let addKeys = [];
		if (e.checked) {
			//勾选节点  遍历所有节点
			if (nodes.length > 0) {
				//判断下面有没有子节点，如果有，把所有子节点全部选中
				if (e.node.props.dataRef.children) {
					addKeys = addKeys.concat(this.getChildNode(e.node.props.dataRef, []));
				}
				//一定要将自己也加进去
				addKeys.push(e.node.props.dataRef);
				//找到所有的父节点 全部选中
				addKeys = addKeys.concat(this.getParentNode(e.node.props.dataRef, []));
			}
			//不在选中的集合里面才往里面丢
			this.onAddkeys(addKeys)
		} else {
			//所有要去除的节点
			let childs = this.getChildNode(e.node.props.dataRef, []);
			childs.push(e.node.props.dataRef)
			this.onDeleteKeys(childs);
		}
	}

	//第一个参数是 父节点集合 第二个数据是 返回的当前节点的子节点集合
	getChildNode = (parent, childNodes) => {
		if (parent.children) {
			parent.children.forEach(item => {
				childNodes.push(item)
				this.getChildNode(item, childNodes)
			})
		}
		return childNodes
	}


	//第一个是子节点集合 第二个参数是返回父节点的集合
	getParentNode = (child, parentNodes) => {
		let nodes = this.props.treeNodes;
		nodes.forEach(i => {
			if (child[this.props.pidName] === i.id) {
				parentNodes.push(i);
				this.getParentNode(i, parentNodes)
			}
		})
		return parentNodes;
	}


	//添加节点
	onAddkeys = (values) => {
		let keys = this.state.selectedKeys.checked;
		if (values.length > 0) {
			values.forEach(i => {
				//不存在再加入
				if (keys.filter(item => item.id === i.id).length === 0) {
					keys.push(i)
				}
			})
		}
		let node = [];
		if (keys.length > 0) {
			keys.forEach(i => {
				node.push(i.id)
			})
		}
		this.setState({ selectedKeys: { checked: keys } }, () => {
			this.props.onSelectKeys(node, this.state.selectedKeys.checked)
		})
	}

	//删除节点
	onDeleteKeys = (values) => {
		let node = this.state.selectedKeys.checked;
		values.forEach(i => {
			node = node.filter(item => item.id !== i.id)
		})
		let keys = [];
		if (node.length > 0) {
			node.forEach(i => {
				keys.push(i.id)
			})
		}
		this.setState({ selectedKeys: { checked: node } }, () => {
			this.props.onSelectKeys(keys, this.state.selectedKeys.checked)
		})
	}

	renderSimple = () => {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className='tableList'>
				<Form onSubmit={this.handleSearch} layout="inline">
					<Row style={{ marginBottom: 12 }} gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={8} sm={24}>
							<FormItem label="名称">
								{getFieldDecorator('name')(
									<Input placeholder="请输入" />
								)}
							</FormItem>
						</Col>
						<Col md={8} sm={24}>
							<FormItem label="标签">
								{getFieldDecorator('tag')(
									<Input placeholder="请输入" />
								)}
							</FormItem>
						</Col>
						<Col md={8} sm={24}>
							<FormItem label="角色">
								{getFieldDecorator('roles')(
									<Select placeholder="请选择"
										style={{ width: '100%' }}>
										{
											this.props.roleList.length > 0 ?
												this.props.roleList.map((value, index) => {
													return (
														<Option key={index} value={value.id}>{value.name}</Option>
													)
												}) : null
										}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row style={{ marginBottom: 12, textAlign: 'right' }} gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={8} sm={24} style={{ float: 'right' }}>
							<Button type="primary" htmlType="submit">查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}

	onSelect = (selectedKeys, e) => {
		if (e) {
			this.setState({ dataRef: e.node.props.dataRef })
		}
	}

	renderDescriptions = () => {
	}

	render() {
		let keys = [];
		if (this.state.selectedKeys.checked.length > 0) {
			this.state.selectedKeys.checked.forEach(i => {
				if (i) keys.push(i.id);
			})
		}
		return (
			<Row>
				<Col span={15}>
					{/* 	<div style={{ width: '100%', marginBottom: 16 }}>已选值：
          {this.state.selectedKeys.checked.map((element) => {
							return <Tag style={{ marginTop: 8 }} key={element.id} closable
								afterClose={() => this.handleClose(element)}>{`${element.name}`}</Tag>
						})
						}
					</div> */}
					{
						this.state.loading ? '数据加载中...' : (
							this.state.treeNodes.length > 0 ?
								<Tree showIcon defaultExpandParent checkStrictly checkable /* loadData={this.onLoadData} */ checkedKeys={keys} onCheck={this.onCheck} onSelect={this.onSelect} defaultSelectedKeys={[this.state.dataRef.id]}>
									{this.renderTreeNodes(this.state.treeNodes)}
								</Tree> : '暂无数据'
						)

					}
				</Col>
				<Col span={1} >
					<Divider style={{ height: '400px' }} type="vertical" />
				</Col>
				<Col span={8}>
					<DescriptionList style={{ marginTop: 45 }} size='large' col='1' title='功能详情'>
						<Description term='名称'>{this.state.dataRef.name}</Description>
						<Description term='类型'>{constants.functionResource.type[this.state.dataRef.type]}</Description>
						<Description term='编码'>{this.state.dataRef.code}</Description>
						<Description term='url'>{this.state.dataRef.uri}</Description>
						<Description term='创建时间'>{moment(this.state.dataRef.createtime).format('YYYY-MM-DD HH:mm:ss')}</Description>
						<Description term='描述'>{this.state.dataRef.desc || '--'}</Description>
						{
							// eslint-disable-next-line
							Object.keys(this.state.dataRef).map(i => {
								if (i === 'method') {
									return <Description term='方法'>{this.state.dataRef[i]}</Description>
								} else if (i === 'tag') {
									return <Description term='标签'>{this.state.dataRef[i]}</Description>
								} else if (i === 'icon') {
									return <Description term='图标'>{this.state.dataRef[i]}</Description>
								}
							})}
					</DescriptionList>
				</Col>
			</Row>
		)
	}
}

export default Form.create()(BaseTree);

