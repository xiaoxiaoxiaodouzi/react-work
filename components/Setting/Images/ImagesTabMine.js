import React,{Component} from 'react'
import { Form, Card,List,Input,Button,Icon,Tooltip,Row,Col } from 'antd';
import moment from 'moment';
import '../../../routes/setting/index.less'
import StandardFormRow from '../../../routes/setting/StandardFormRow'
import {getImages,getImageCategorys} from '../../../services/images'
import dockerImg from '../../../assets/images/docker.png'
import TagSelect from 'ant-design-pro/lib/TagSelect';
import ImagesUpload from '../../../common/ImagesUpload'
import Ellipsis from 'ant-design-pro/lib/Ellipsis';


const FormItem = Form.Item;
class ImagesFormTabMine extends Component{

  state={
    tenant:'',
    myList:[],
    platformList:[],  //平台镜像
    loading:false,
    tags:[],
    length:''     ,
    visible:false,    //新增镜像    
  }

  componentDidMount(){
    this.initDatas();
  }

  initDatas=()=>{
    let tenant=this.props.tenant;
    this.setState({
      loading:true,
      tenant:tenant,
    })
    if(tenant==='c2cloud'){
      let f1=getImages(tenant).then(data=>{
        data.push({new:true})
        this.setState({
          platformList:data
        })
      })
  
      let f2=getImageCategorys().then(data=>{
        this.setState({
          tags:data,
          length:data.length
        })
      })
      Promise.all([f1,f2]).then(data=>{
        this.setState({
          loading:false
        })
      }) 
    }else{
      getImages(tenant).then(data=>{
        data.push({new:true})
        this.setState({
          myList:data,
          loading:false
        })
      })
    }
    
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.tenant !==this.state.tenant){
      let form = this.props.form;
      
      form.resetFields();
      //当状态发生改变的时候在去调用
      let tenant=nextProps.tenant
      this.setState({
        loading:true,
        tenant:tenant,
      })
      if(tenant==='c2cloud'){
        let f1=getImages(tenant).then(data=>{
          data.push({new:true})
          this.setState({
            platformList:data
          })
        })
    
        let f2=getImageCategorys().then(data=>{
          this.setState({
            tags:data,
            length:data.length
          })
        })
        Promise.all([f1,f2]).then(data=>{
          this.setState({
            loading:false
          })
        }) 
      }else{
        getImages(tenant).then(data=>{
          data.push({new:true})
          this.setState({
            myList:data,
            loading:false
          })
        })
      }
    }
  }

  //点击查询
  handleFormSubmit=(checkedValue)=>{
    this.setState({
      loading:true
    })
    let tenant=this.state.tenant;
    const form=this.props.form;
    form.validateFields((err,values)=>{
      if(err){
        return;
      }
      let categoryids=[];
      if(checkedValue){
        checkedValue.forEach(item=>{
          categoryids.push(item)
        })
      }
      if(categoryids.length===this.state.length){
        categoryids=[];
      }

      //判断是点击tag出发还是点击搜索触发从而决定categoryids是从哪里取值
      //因为直接点击tag，从values.categoryid去取值的话会是点击之前的状态
      if(!checkedValue){
        if(values.categoryid){
          if(values.categoryid.length===this.state.length){
            values.categoryid=[];
          }
        }
        getImages(tenant,{name:values.name,categoryids:values.categoryid}).then(data=>{
          data.push({new:true})
          if(tenant!=='c2cloud'){
            this.setState({
              myList:data,
              loading:false,
            })
          }else{
            this.setState({
              platformList:data,
              loading:false,
            })
          }
          
        })
      }else{
        getImages(tenant,{name:values.name,categoryids:categoryids}).then(data=>{
          data.push({new:true})
          if(tenant!=='c2cloud'){
            this.setState({
              myList:data,
              loading:false,
            })
          }else{
            this.setState({
              platformList:data,
              loading:false,
            })
          }
        })
      }
    })
  }

  handleClick=(name)=>{
    let tenant=this.state.tenant;
    let names=name;
    let { history } = this.props;
    history.push({ pathname: `/setting/images/${names}?tenant=${tenant}`});
  }

  render(){
    const {getFieldDecorator} =this.props.form;
    const {myList,platformList}=this.state;
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const cardList=(
      <List
      rowKey="id"
      loading={this.state.loading}
      grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
      dataSource={this.state.tenant==='c2cloud'?platformList:myList}
      renderItem={item => (!item.new?
        <List.Item>
          <Card
            className='card'
            hoverable
            cover={<img src={dockerImg} alt='' height={154} onClick={e=>this.handleClick(item.name)}/>}
          >
            <Card.Meta
              title={<a onClick={e=>this.handleClick(item.name)}>
              <Tooltip title={item.name}>
                {item.name}
              </Tooltip>  
              </a>}      
              description={item.descri}
            />
            <div className='cardItemContent'>
              <span>{moment(item.updated).fromNow()}</span>
              {
                this.state.tenant!=='c2cloud'?
                  <div >
                    <ImagesUpload onOk={this.initDatas} tenant={this.state.tenant} artifact={item.name}
                      renderButton={
                      <Tooltip title='更新镜像' >
                        <Icon  style={{ fontSize: 26 }} type="cloud-upload-o" />
                      </Tooltip> 
                      }
                    />
                  </div>:''
              }
                
            </div>
          </Card>
        </List.Item>:
        <List.Item>
        <Card hoverable >
          <ImagesUpload renderButton={ 
            (<Button style={{height:'225.6px'}} type="dashed" className='newButton'>
              <Icon type="plus" /> 新增镜像
            </Button>)
          } onOk={this.initDatas} tenant={this.state.tenant}
        />
        </Card>
      </List.Item>
      )}
    />
    )
    return (
      <div style={{marginTop:24}} className='coverCardList'>
        <Card bordered={false}>
          <Form layout="inline">
            {this.state.tenant==='c2cloud'?
            <StandardFormRow title="镜像分类" block >
              <FormItem style={{top:'-24px'}}>
                {getFieldDecorator('categoryid')(
                    <TagSelect onChange={this.handleFormSubmit} >
                      {this.state.tags.map(item=>
                         <TagSelect.Option key={item.id} value={item.id}>{item.name}</TagSelect.Option>
                      )}
                    </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            :''
          }
            <StandardFormRow style={{marginTop:24}} title='应用名称'>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
              <FormItem
              style={{top:'-24px', maxWidth: 400, width: '100%'}}
                {...formItemLayout}
                >
                {getFieldDecorator('name')(
                  <Input.Search enterButton="搜索" placeholder='请输入' onSearch ={e=>this.handleFormSubmit()} />
                )}
							</FormItem>
							</Col>
							</Row>
            </StandardFormRow>
          </Form>
        </Card>
        <div style={{marginTop:24}} className='cardList'>
          {cardList}
        </div>
      </div>
    )
  }
}
const ImagesTabMine=Form.create()(ImagesFormTabMine);
export default ImagesTabMine;