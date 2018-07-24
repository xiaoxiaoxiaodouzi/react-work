import React,{Fragment,Component} from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import './ImageDetails.less'
import {Card,Table,Divider,Modal,Form,Input,message,Popconfirm,Select} from 'antd'
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import dockerPNG from '../../../assets/images/docker.png'
import {getDetail,getList,updateList,deleteList,updateImages,getImageCategorys} from '../../../services/images'
import moment from 'moment';
import ImageTableList from './ImageTableList'
import constants from '../../../services/constants'
import InputInline from '../../../common/Input'


const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;
const Option=Select.Option
const breadcrumbList=[{
  title: '高级设置',
  href:'/'
},{
  title:'镜像管理',
  href:'/#/setting/images'
},{
  title:'镜像详情',
}]
class ImageDetailsForm extends Component{
  state={
    desc:'',
    date:'',
    latest:'',
    datas:[],          //镜像配置列表
    tag:'',           //镜像版本
    visible:false,    //镜像编辑模态框
    appContext:'',    //上下文
    descri:'',        //版本说明
    address:'',
    tenant:'',        //租户名称
    artifact:'',          //镜像名称
    categoryId:'',      //镜像分类名称
    categoryIds:[],
    total:'',         //镜像版本数量
    current:'1',
    pageSize:'10',
    loading:false,
  }
  
  componentDidMount(){
    getImageCategorys().then(data=>{
      this.setState({
        categoryIds:data
      })
    })
    let name=this.props.match.params.name;
    //根据url上来拆分镜像名称跟租户名字
    let q=this.props.location.search.substring(1);
    let artifact=name;
    let tenant=q;
    this.setState({
      tenant:tenant,
      artifact:artifact,
    },()=>{
      this.loadDatas();
      this.initDatas(1,10);
    })
  }
  //查询镜像详情
  loadDatas=()=>{
    let artifact = this.state.artifact;
    let tenant = this.state.tenant;
    getDetail(tenant, artifact).then(data => {
      this.setState({
        categoryId: data.categoryId,
        address: constants.MIRROR_ADDRESS_BASE + '/' + tenant + '/' + artifact,
        desc: data.descri,
        date: moment(data.updated).format('YYYY-MM-DD HH:mm:ss')
      })
    })
  }

  //部署按钮
  handleDeployment=()=>{

  }

  //镜像编辑
  handleUpdate=(record)=>{
    const form=this.props.form;
    form.setFieldsValue({
      appContext:record.ctx,
      descri:record.desc
    })
    this.setState({
      tag:record.tag,
      visible:true,
      appContext:record.ctx,
      descri:record.descri
    })
  }

  initDatas=(current,pageSize)=>{
    this.setState({loading:true})
    let tenant=this.state.tenant;
    let artifact=this.state.artifact;
    let queryParams={
      page:current,
      rows:pageSize
    }
    getList(tenant,artifact,queryParams).then(datas=>{
      this.setState({
        current:datas.pageIndex,
        pageSize:datas.pageSize,
        total:datas.total,
        appContext:'',
        tag:'',
        descri:'',
        visible:false,
        datas:datas.contents,
        latest:datas.contents[0].tag,
        loading:false
      })
    }).catch(err=>{
      message.error('获取镜像配置失败')
      this.setState({loading:false})
    })
}
  //镜像版本编辑模态框确认按钮
  handleOk=()=>{
    const form =this.props.form;
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      let tag=this.state.tag;
      
      let tenant=this.state.tenant;
      let artifact=this.state.artifact;
      let bodyParams={
        appContext:values.appContext,
        descri:values.descri
      }
      updateList(tenant,artifact,tag,bodyParams).then(data=>{
        if(data){
          this.initDatas();
          message.success('更新成功')
        }
      })
    })
  }

  handleCancle=()=>{
    this.setState({
      visible:false,
      appContext:'',
      tag:'',
      descri:''
    })
  }

  //镜像删除
  handleDelete=(record)=>{
    let tenant=this.state.tenant;
    let artifact=this.state.artifact;
    deleteList(tenant,artifact,record.tag).then(data=>{
      message.success("删除成功");
      if(this.state.total===1){
        let { history } = this.props;
        history.push({ pathname: `/setting/images` });
      }else{
        this.initDatas();
      }
    })
  }

  handleChange=(selectValue)=>{
    let tenant=this.state.tenant;
    let artifact=this.state.artifact;
    let bodyParams={
      categoryId:selectValue
    }
    updateImages(tenant,artifact,bodyParams).then(data=>{
      if(data){
        message.success('镜像分类修改成功');
        this.setState({
          categoryId:selectValue
        })
      }
    })
  }

  handleDescChange=(desc)=>{
    let tenant=this.state.tenant;
    let artifact=this.state.artifact;
    let bodyParams={
      descri:desc
    }
    updateImages(tenant,artifact,bodyParams).then(data=>{
      if(data){
        this.loadDatas();
        message.success('镜像描述修改成功')
      }
    })
  }
  render(){
    const description = (
      <div>
        <DescriptionList className='headerList' size="small" col="2">
          <Description term="最新版本">{this.state.latest}</Description>
          <Description term="最近更新">{this.state.date}</Description>
          <Description term="镜像地址">{this.state.address} </Description>
          <Description term="镜像分类"> 
            <Select style={{width:100}} value={this.state.categoryId} onChange={this.handleChange}>
              {this.state.categoryIds.map(item=>{
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              })}
            </Select> 
          </Description>
        </DescriptionList>

        <DescriptionList className='headerList' style={{paddingLeft:'15px'}} size="small" col="1">
          <InputInline  title={'描述'} value={this.state.desc} onChange={this.handleDescChange} dataType={'TextArea'} mode={'inline'}/>
        </DescriptionList>
      </div>
    );

    const columns=[
      {
        title:'版本号',
        dataIndex:'tag',
        width:'20%'
      },
      {
        title:'版本描述',
        dataIndex:'desc',
        width:'20%',
        render:(text,record)=>{
          if(text){
            return text;
          }
          return '暂无'
        }
      },
      {
        title:'上下文',
        dataIndex:'ctx',
        width:'20%'
      },
      {
        title:'最后更新时间',
        dataIndex:'time',
        width:'20%',
        render:(text,record)=>{
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title:'操作',
        width:'20%',
        render:(text,record)=>{
          return <Fragment>
              <a onClick={e => {
                  this.handleDeployment();
                }}>
                部署
              </a>
              <Divider type="vertical" />
              <a onClick={e => this.handleUpdate(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title={this.state.total === 1 ? "删除最后一个版本之后此镜像将会被删除！！！" : "确认删除？"} onConfirm={e => {
                  this.handleDelete(record);
                }}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>;
        }
      },

    ]

    const formItemLayout = {
      labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 13 },
      },
     };
     const { getFieldDecorator } = this.props.form;
     const pagination={
       current:this.state.current,
       pageSize:this.state.pageSize,
       total:this.state.total,
       onChange:(current,pageSize)=>{
         this.initDatas(current,pageSize)
       }
     }
    return(
      <div className='image-detail'>
        <PageHeader
          title={this.state.artifact}
          content={description}
          breadcrumbList={breadcrumbList}
          logo={<img alt='' src={dockerPNG}/>}
        />
        <Card title="版本" style={{ marginTop:24, marginBottom: 24 }} bordered={false}>
        <Table
          rowKey={record=>record.tag}
          dataSource={this.state.datas}
          columns={columns}
          pagination={pagination}
          loading={this.state.loading}
          />
        </Card>

        <Card title="环境变量" style={{ marginBottom: 24 }} bordered={false}>
          <ImageTableList  artifact={this.state.artifact}  tenant={this.state.tenant}/>
        </Card>

        <Modal
          title='编辑版本信息'
          visible={this.state.visible}
          onCancel={this.handleCancle}
          onOk={this.handleOk}
        >
        <Form>
          <FormItem {...formItemLayout} label="版本号" 
            >
                {getFieldDecorator('tag',{initialValue:this.state.tag})(
                    <Input  disabled={true} />
                )}
          </FormItem>
          <FormItem {...formItemLayout} label="上下文" 
            >
                {getFieldDecorator('appContext')(
                    <Input   />
                )}
          </FormItem>
          <FormItem {...formItemLayout} label="版本说明" 
            >
                {getFieldDecorator('descri')(
                    <TextArea  />
                )}
          </FormItem>
        </Form>
        </Modal>
      </div>
    )
  }
}

const ImageDetails=Form.create()(ImageDetailsForm);
export default ImageDetails;