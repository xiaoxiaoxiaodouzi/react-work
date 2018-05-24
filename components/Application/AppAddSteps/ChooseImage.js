import React, { Component } from "react";
import { Select,Alert, List, Input, Button, Radio, Avatar, Dropdown, Menu, Tooltip } from "antd";
import {queryImagePath, queryCategorys,queryImages, queryImageVersions, queryLatestVersion } from '../../../services/apps';
import DataFormate from '../../../utils/DataFormate';
import {base} from '../../../services/base'

const Search = Input.Search;
const Option = Select.Option;

export default class ChooseImage extends Component {
    state = {
        imagePath:"",//镜像地址
        searchValue:"",
        buttonValue: "",//镜像的大分类的值
        data: [],//镜像列表的数据
        imageVersions: null,//镜像版本的数据
        onDropDownItem: null,//下拉菜单显示的那一行镜像的数据
        loading: false,//镜像列表的加载状态
        versionLoading: false,//版本数据的加载状态
        deployPath:"",//自定义部署的镜像路径
        imageCategorys:[],//镜像分类数据
        imageCategoryId:"",//当前镜像分类
    }
    componentDidMount() {
        this.setState({
            buttonValue:base.tenant
        })
        if(!this.props.check){
            this.getImagePath();
            this.getImages(base.tenant,null);
        }
    }
    
    //获取镜像版本
    getImageVersions = (tenant, artifact, params) => {
        this.setState({
            versionLoading: true
        })
        queryImageVersions(tenant, artifact, params).then(data => {
            this.setState({
                imageVersions: data.contents,
                versionLoading: false
            })
        })
    }
    //获取镜像数据
    getImages = (tenant, params) => {
        this.setState({
            loading: true
        })
        queryImages(tenant, params).then(data => {
            this.setState({
                data,
                loading: false
            })
        });
    }

    //获取镜像分类列表，并根据分类列表的第一个分类获取镜像列表
    getImageCategorys = () => {
        this.setState({
            loading: true
        })
        queryCategorys().then(data=>{
            let newData=null;
            if(this.props.type==='middleware'){
                newData=data.filter(item => {
                    if(item.id === 'basic'){
                        return false;
                    }
                    if(item.id === 'business'){
                        return false;
                    }
                    return true;
                });
            }else{
                newData=data.filter(item => {
                    if(item.id === 'basic'){
                        return true;
                    }
                    if(item.id === 'business'){
                        return true;
                    }
                    return false;
                });
            }
            this.getImages("c2cloud", {categoryid:newData[0].id});
            this.setState({
                imageCategorys:newData,
                imageCategoryId:newData[0].id,
            })
        })
    }
    //镜像的大分类改变后，修改 buttonValue 状态,并将搜索框的值设为空
    handleButtonChange = (e) => {
        const buttonValue = e.target.value;
        this.setState({
            buttonValue,
            searchValue:""
        })
        if (buttonValue === 'c2cloud') {
            this.getImageCategorys();
        }else if(buttonValue === this.tenant){
            this.getImages(this.tenant,null)
        }
    }
    //搜索框的值改变后修改 searchValue 状态
    handleSearchChange = (e) => {
        this.setState({
            searchValue:e.target.value
        })
    }
    //搜索框按enter键后搜索
    onSearch = () => {
        const params = { name: this.state.searchValue,categoryid:this.state.imageCategoryId };
        this.getImages(this.state.buttonValue, params);
    }
    //点击选择按钮时跳转
    handleButtonClick = (item) => {
        queryLatestVersion(this.state.buttonValue, item.name).then(data => {
            this.props.afterchoose(item, data[0].tag,this.state.buttonValue,this.state.imagePath);
        })
    }
    //选择下拉菜单项时跳转
    handleMenuClick = (e) => {
        this.props.afterchoose(this.state.onDropDownItem, e.key,this.state.buttonValue,this.state.imagePath)
    }
    //获取镜像地址
    getImagePath = () => {
        queryImagePath().then(data => {
            this.setState({
                imagePath: data.url.split("https://")[1],
            })
        })
    }
    //在下拉菜单显示时获取镜像版本
    onDropDown = (visible, item) => {
        if (visible) {
            this.setState({
                imageVersions: null,
                onDropDownItem: item,
            })
            this.getImageVersions(this.state.buttonValue, item.name, { page: 1, rows: 999 });
        }
    }
    //点击部署按钮后跳转
    deployClick = (e) => {
        e.preventDefault();

        // const newDeployPath=this.state.deployPath.split(':');
        // if(newDeployPath>1){
        //     this.props.afterchoose({imagePath:newDeployPath[0]}, newDeployPath[1]);
        // }else{
        //     this.props.afterchoose({imagePath:newDeployPath[0]}, 'latest');
        // }

        this.props.afterchoose({imagePath:this.state.deployPath}, '',this.state.buttonValue,this.state.imagePath);
    }
    //镜像地址输入框的值改变后修改deployPath状态
    inputOnChange = (e) => {
        this.setState({
            deployPath:e.target.value
        })
    }
    //镜像分类下拉改变后，修改 imageCategoryId 状态，并重新获取镜像列表
    handleCategoryChange = (value) =>{
        this.setState({
            imageCategoryId:value
        })
        const params = { name:this.state.searchValue,categoryid:value };
        this.getImages(this.state.buttonValue, params);
    }
    render() {
        const menu = (
            <Menu style={{maxHeight:250,overflowY:'auto'}} onClick={this.handleMenuClick}>
                {
                    this.state.imageVersions ? this.state.imageVersions.map((item, index) => {
                        const dateStr = DataFormate.dateFomate(item.time);
                        return <Menu.Item key={item.tag}>@{item.tag} : {dateStr}</Menu.Item>
                    }) : ''
                }
            </Menu>
        );
        const searchMargin=(
            this.state.buttonValue==='c2cloud'?{marginLeft:150}:{marginLeft:460}
        )
        return (
            <span style={{ display: this.props.display ? 'block' : 'none' }}>
                <span>
                    <Radio.Group value={this.state.buttonValue}
                        onChange={this.handleButtonChange} >
                        <Radio.Button value={this.tenant}>我的镜像</Radio.Button>
                        <Radio.Button value="c2cloud">平台镜像</Radio.Button>
                        <Radio.Button value="custom">自定义镜像</Radio.Button>
                    </Radio.Group>
                </span>
                {
                    this.state.buttonValue === 'custom' ?
                        <span>
                            <div>
                                镜像地址：<Input style={{width:'520px',marginLeft:'10px',marginTop: '48px'}}
                                    onChange={this.inputOnChange} />
                                <Button type="primary" onClick={this.deployClick} style={{marginLeft:'10px'}}>部署</Button>
                            </div>
                            <div>
                                <Alert
                                    showIcon
                                    message='用户可以输入来自网络上的第三方的镜像地址如Docker Hub上，系统不会校验镜像地址的准确性，请输入准确的镜像地址。如果当前镜像为私有镜像，需要权限才能下载，
                                        请确保当前用户的账号密码和私有仓库的账号密码一致。镜像地址格式为repository:tag，repository为仓库地址，tag为镜像版本，tag如果不填，默认为latest.'
                                    style={{ marginTop: '32px' }}
                                />
                            </div>
                        </span>
                        :
                        <span>
                            {
                                this.state.buttonValue==='c2cloud'?
                                <span style={{marginLeft:160}}>
                                    分类：
                                    <Select onChange={this.handleCategoryChange}
                                        style={{width:100}} value={this.state.imageCategoryId}>
                                        {
                                            this.state.imageCategorys.length>0?
                                            this.state.imageCategorys.map((val,index)=>{
                                                return <Option key={val.id} value={val.id}>{val.name}</Option>
                                            }):null
                                        }
                                    </Select>
                                </span>:""
                            }
                            <span style={searchMargin}>
                                <Search
                                    value={this.state.searchValue}
                                    placeholder="请输入"
                                    onChange={this.handleSearchChange}
                                    onSearch={this.onSearch}
                                    enterButton
                                    style={{ width: 150,marginLeft:'10px' }}
                                    />
                            </span>
                            <List
                                style={{ marginTop: '20px' }}
                                size="large"
                                itemLayout="horizontal"
                                loading={this.state.loading}
                                dataSource={this.state.data}
                                renderItem={item => {
                                    const path = require("../../../" + item.icon);
                                    return (
                                        <List.Item
                                            actions={[
                                                <Dropdown.Button type="primary" onClick={() => this.handleButtonClick(item)}
                                                    overlay={menu} trigger={['click']} placement="bottomRight"
                                                    onVisibleChange={(visible) => this.onDropDown(visible, item)}>
                                                    <Tooltip title="选择最新版本">
                                                        <span>选择</span>
                                                    </Tooltip>
                                                </Dropdown.Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar src={path} />}
                                                title={item.name}
                                                description={item.descri}
                                            />
                                        </List.Item>
                                    )
                                }}
                            />
                            {
                                this.props.isStepBack?
                                <Button onClick={this.props.stepto2}
                                    type="primary"
                                    style={{margin:'40px 0 0 450px'}}>下一步</Button>
                                :""
                            }
                        </span>
                }
            </span>
        )
    }
}