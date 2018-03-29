import React,{Link,Component} from 'react'
import { Card,Alert ,Button} from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Setting from '../../components/Application/Running/Setting'
import {queryRoutes,queryNetwork} from '../../services/deploy'
const { Description } = DescriptionList;
export default class AppSetting extends Component {
  state={
    url1s:'',   //域名绑定
    visible:false,
    urls: '',      //内部地址
    url3s:'',       
    code:'',
    url2s:'',      //上下文
    inputVisible: false,
    inputVisible1: false,
    inputVisible2: false,
    inputValue: '',
    deleteLoading:false,
  }

  componentDidMount(){
    let code='';
    if(this.props.appCode){
      code=this.props.appCode
    }
    if(this.state.code){
      code=this.state.code;
    }
    //如果有code的话则刷新
			if(code){
        queryRoutes(code).then(data=>{
					if(data){
						let array=[];
						data.forEach(item=>{
							array.push(item.ip+'('+item.containerName+')');
						})
            this.setState({urls:array.join(',')})
            queryNetwork(code).then(datas=>{
              if(datas.contents){
                let arrays=[];
                datas.contents.forEach(items=>{
                  arrays.push(items.ip+':'+items.targetPort+'('+items.containerName+' 内部地址)')
                })
                let url3s=this.state.url3s;
                url3s=[...array.join(','),...arrays.join(',')]
                this.setState({url3s})
              }
            })
					}
        })
			}
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.appCode!==this.state.code){
			this.setState({code:nextProps.appCode})
			let code=nextProps.appCode;
    //如果有code的话则刷新
			if(code){
				queryRoutes(code).then(data=>{
					if(data){
						let array=[];
						data.forEach(item=>{
							array.push(item.ip+'('+item.containerName+')');
						})
            this.setState({urls:array.join(',')})
            queryNetwork(code).then(datas=>{
              if(datas.contents){
                let arrays=[];
                datas.contents.forEach(items=>{
                  arrays.push(items.ip+':'+items.targetPort+'('+items.containerName+' 内部地址)')
                })
                let url3s=this.state.url3s;
                url3s=[...array.join(','),...arrays.join(',')]
                this.setState({url3s})
              }
            })
					}
        })
        
			}
		}
  }

  loadData=()=>{
    let code=this.state.code;
    queryRoutes(code).then(data=>{
      if(data){
        let array=[];
        data.forEach(item=>{
          array.push(item.ip+'('+item.containerName+')');
        })
        this.setState({urls:array.join(',')})
      }
    })
  }
  render(){
    const {inputVisible,urls,inputValue,url1s,url2s,inputVisible1,inputVisible2,url3s}=this.state;
    const action=<Setting appCode={this.props.appCode} onOk={()=>this.loadData}/>
    
    return (
      <div>
        <Card bordered={false} style={{margin:24}} title='应用访问地址设置'>
          <DescriptionList col={1} title={action}>

            <Description term='应用访问地址' style={{ marginBottom: 24 }}>
              {urls}
            </Description>
            <Description term='域名绑定' style={{ marginBottom: 24 }}>

            </Description>
            <Description term='内部地址' style={{ marginBottom: 24 }}>
              {url3s}
            </Description>
            <Description term='上下文' style={{ marginBottom: 24 }}>

            </Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} style={{margin:24}} title='应用删除'>
          <Alert message="删除应用时，应用相关的所有资源都会被删除，此操作不能够撤销 !" type="error" style={{marginBottom:10}}/>
          <Button loading={this.state.deleteLoading} type='danger'size='large' icon='delete' onClick={this.handleDelete}>删除</Button>
        </Card>
      </div>
    )
  }
}