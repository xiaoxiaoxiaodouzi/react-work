import React, { Component } from 'react'
import { Card, Table, Button, Input,message, Popconfirm, Divider, Select ,Icon } from 'antd';
import {entrypoints,addEntrypoints,editEntrypoints,deleteEntrypoints} from '../../../services/running'
import IconSelectModal from '../../../common/IconSelectModal'

const Option = Select.Option;
class Entrance extends Component {
    componentDidMount(){
        const appid=this.props.appid;
        entrypoints(appid).then(data=>{
					this.setState({
						data:data
					})
        });
      }
    constructor(props) {
        super(props);
        this.state = {
            data: [],
						loading: false,
						id:'',
						isEditing:false,
        };
    }
    index = 0;
    cacheOriginData=[];
    newMember = () => {
			if(!this.state.isEditing){
        const newData = this.state.data.map(item => ({ ...item }));
        newData.push({
            key: `NEW_TEMP_ID_${this.index}`,
            name: '',
            desc: '',
            type:'_web',
            url:'',
            target:'_self',
            icon:'',
            operation:'',
            editable: true,
            isNew: true,
        });
        this.index += 1;
        this.setState({ data: newData ,isEditing:true});
			}else{
				message.error('有未保存的数据，请先保存之后再进行添加')
			}
    }

	toggleEditable = (e, record)=>{
		if(!this.state.isEditing){
			this.setState({id:record.id,isEditing:true})
			const id=record.id;
			const newData = this.state.data.map(item => ({ ...item }));
			const target = this.getRowByKey(id, newData);
			if (target) {
					// 进入编辑状态时保存原始数据
					if (!target.editable) {
							this.cacheOriginData[id] = { ...target };
					}
					target.editable = true;
					this.setState({ data: newData });
			}
		}else{
			message.error('有未保存到数据，请先保存后在进行编辑')
		}
	}
    saveRow=(e,record)=>{
			this.setState({
				loading:true
			})
			if(record.isNew){
				const key=record.key
				const newData = this.state.data.map(item => ({ ...item }));
				const target = newData.filter(item => key === item.key)[0];
			}	
			const appid=this.props.appid;
			const id=record.id;
			const newData = this.state.data.map(item => ({ ...item }));
			const target = newData.filter(item => id === item.id)[0];
			console.log("newdata",newData);
			if(target){
				delete target.editable;
				if(target.type==='_web'){
					target.type="web"
				}
				if (target.type === '_app') {
					target.type = "app"
				}
				if (target.target === '_self') {
					target.target = "本窗口"
				}
				if (target.target === '_blank') {
					target.target = "新窗口"
				}
				target.appid=appid;
				//调用新增入口配置
				if(target.isNew){
					delete target.isNew;
					delete target.key;
					if(!target.name){
						message.error('入口配置名称未填写')
						this.setState({
							loading:false
						})
						return;
					}
					if(!target.url){
						message.error('入口配置地址未填写')
						this.setState({
							loading:false
						})
						return;
					}
					let regex=/^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig;
					//地址验证成功
					if(regex.test(target.url)){
						addEntrypoints(appid,target).then(data=>{
							entrypoints(appid).then(datas=>{
									this.setState({
											id:'',
											data:datas,
											isEditing:false,
											loading:false,
									})
									message.success('新增成功')
							}).catch(err=>{
								message.error('获取入口配置信息出错')
								this.setState({loading:false})
							});
						}).catch(err=>{
							message.error('新增入口配置信息出错')
							this.setState({loading:false})
						});; 
					}else{
						message.error('地址格式错误');
						this.setState({
							loading:false
						})
					} 
				}else{
					if(!target.name){
						message.error('入口配置名称未填写')
						return;
					}
					if(!target.url){
						message.error('入口配置地址未填写')
						return;
					}
					let regex=/^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig;
					if(regex.test(target.url)){
						editEntrypoints(appid,target.id,target).then(data=>{
								entrypoints(appid).then(datas=>{
										this.setState({
												id:'',
												data:datas,
												isEditing:false,
												loading:false,
										})
										message.success('修改成功')
								}).catch(err=>{
									message.error('获取入口配置信息出错')
									this.setState({loading:false})
								});
						}).catch(err=>{
							message.error('修改入口配置信息出错')
							this.setState({loading:false})
						});
					}else{
						message.error('地址格式错误');
						this.setState({
							loading:false
						})
					}
				}
			}
		}
		
    //删除行
    deleteRow=(record)=>{
			this.setState({loading:true})
			const appid=this.props.appid;
			const id=record.id;
			const newData = this.state.data.filter(item => item.id !== id && item.key !==item.id);
			console.log(newData);
			deleteEntrypoints(appid,id).then(e=>{
				message.success('删除成功');
				this.setState({ data: newData,loading:false });
			}).catch(error=>{
				message.error('删除入口配置出错');
				this.setState({
					loading:false
				})
			})
    }
    //取消
    cancleRow=(e,record)=>{
        const appid=this.props.appid;
        delete record.editable;
        entrypoints(appid).then(data=>{
            this.setState({
								id:'',
								data:data,
								isEditing:false,
								loading:false
            })
        }).catch(err=>{
					message.error('获取入口配置信息出错')
					this.setState({loading:false})
				});
    }
    getRowByKey(id, newData) {
        return (newData || this.state.data).filter(item => item.key === id || item.id===id)[0];
    }

    handleFieldChange(e, fieldName, record) {
				const newData = this.state.data.map(item => ({ ...item }));
				//判断是新增还是修改，从而决定改行记录是否有id或者是key
				let target={}
				if(record.id){
					target = this.getRowByKey(record.id, newData);
				}else if(record.key){
					target=this.getRowByKey(record.key, newData);
				}
        if (target) {
					target[fieldName] = e.target.value;
					this.setState({ data: newData });
        }
		}
		
		selectIcon=(icon,record)=>{
			console.log('icon',icon)
			let id=this.state.id;
			const newData = this.state.data.map(item => ({ ...item }));
			//判断是新增还是编辑来看是否id存在
			let target={};
			if(id){
				target = this.getRowByKey(id, newData);
			}else{
				target = this.getRowByKey(record.key, newData);
			}
			if (target) {
				target.icon = icon;
				console.log("changedata",newData);
				this.setState({ data: newData });
			}
		} 
    
    render() {
        const columns=[
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width: '10%',
                render:(text,record)=>{
                    if (record.editable) {
                        return (
                            <Input
                                defaultValue={text}
                                onChange={e => this.handleFieldChange(e, 'name', record)}
                                autoFocus
                                placeholder="入口名称"
                            />
                        );
                    }
                    return text;
                }
            },
            {
                title: '描述',
                dataIndex: 'desc',
                key: 'desc',
                width: '30%',  
                render:(text,record)=>{
                    if (record.editable) {
                        return (
                            <Input
                                defaultValue={text}
                                onChange={e => this.handleFieldChange(e, 'desc', record)}
                                placeholder="描述内容"
                            />
                        );
                    }
                    return text;
                }
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: '10%', 
                render:(text,record)=>{
                    if (record.editable) {
                        return (
                            <Select defaultValue={record.type} onChange={value => record.type = value}>
                                <Option value="_web">web</Option>
                                <Option value="_app">app</Option>
                            </Select>    
                        );
                    }
                    return text;
                }
            },
            {
                title: '地址',
                dataIndex: 'url',
                key: 'url',
                width: '20%',
                render:(text,record)=>{
                    if (record.editable) {
                        return (
                            <Input
                                type="url"
                                defaultValue={text}
                                onChange={e => this.handleFieldChange(e, 'url', record)}
                                placeholder="http://xxx.com"
                            />
                        );
                    }
                    return text;
                } 
            },
            {
                title: '打开方式',
                dataIndex: 'target',
                key: 'target',
                width: '10%',  
                render:(text,record)=>{
                    if (record.editable) {
                        return (
                            <Select defaultValue={record.target}  onChange={value => record.target=value}>
                                <Option value="_self">本窗口</Option>
                                <Option value="_blank">新窗口</Option>
                            </Select>
                        );
                    }
                    return text==='_self'?"本窗口":"新窗口";
                }
            },
            {
                title: '图标',
                dataIndex: 'icon',
                key: 'icon',
                width: '10%', 
                render:(text,record)=>{
									if(text){
										if (record.editable) {
											return (
												<IconSelectModal  renderButton={ <Button style={{marginTop:15}} type="dashed" icon={text} />} selectIcon={(icon)=>this.selectIcon(icon,record)}/>
											);
										}else{
											return  <Icon style={{fontSize:16}} type={text}/>	//<Button type="dashed" icon={text}/>;
										} 
									}else{
										if(record.editable){
											return <IconSelectModal  selectIcon={(icon)=>this.selectIcon(icon,record)}/>
										}else{
											return '' 
										}
									}
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '10%',
                render: (text,record)=>{
                    if(record.editable){
                        return(
                            <span>
                                <a onClick={e => this.saveRow(e,record)}>保存</a>
                                <Divider type="vertical" />
                                <a onClick={e=>	this.cancleRow(e,record)}>取消</a>
                            </span>
                        )
                    }
                    return(
                        <div>
                            <a onClick={e => this.toggleEditable(e, record)}>编辑</a>
                            <Divider type="vertical" />
                            <Popconfirm title="确认删除??" onConfirm={() => this.deleteRow(record)}>
                                <a>删除</a>
                            </Popconfirm>
                        </div>
                    )
                }
            }];
        return (
            <Card title="入口配置" style={{ margin: 24 }} bordered={false}>
								<Table
									rowKey={record => record.id}
									loading={this.state.loading}
									columns={columns}
									dataSource={this.state.data}
									pagination={false}
                />
                <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    onClick={this.newMember}
                    icon="plus"
                >
                    新增
                </Button>
            </Card>
        )
    }
}

export default Entrance;