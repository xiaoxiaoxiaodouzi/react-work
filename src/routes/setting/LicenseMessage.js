import React,{PureComponent,Fragment} from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import Result from 'ant-design-pro/lib/Result';
import { Button,message,Card,Table,Icon,Form,Input,Modal,Upload } from 'antd';
import moment from 'moment';
import { queryCurrentLicense,queryLicenses } from '../../services/setting';
import {base} from '../../services/base'
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'

const FormItem = Form.Item;

const breadcrumbList = [{
  title: '高级设置',
  href: '/#/setting',
}, {
  title: '许可信息'
}];

class LicenseMessage extends PureComponent {
  state = {
    data:[],
    currentLicense:{},
    visibleModal:false,
    page:1,
    row:5,
    total:0,
    uploading:false,
    fileList: [],
  };
  onUpdateLicense=()=>{
    const { setFieldsValue }=this.props.form;
    setFieldsValue({
      remark:''
    });
    this.setState({visibleModal:true});
  }
  getCurrentLicense=()=>{
    queryCurrentLicense().then((data)=>{
      if(data){
        this.setState({currentLicense:data});
      }
    });
  }
  getAllLicenses=(page,rows)=>{
    queryLicenses(page,rows).then((data)=>{
      if(data && data.contents.length>0 ){
        this.setState({
          data:data.contents,
          page:data.pageIndex,
          row:data.pageSize,
          total:data.total
        });
      }
    });
  }
  componentDidMount(){
    this.getCurrentLicense();
    this.getAllLicenses(1,5);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.tenant !== nextProps.tenant){
      this.getCurrentLicense();
      this.getAllLicenses(1,5);
    }
  }
  handleModalOk = ()=>{
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        let fileList=this.state.fileList;
        let tenant = base.tenant;
        if(fileList.length>0){
          if(fileList[0].name.indexOf('.lic')<0){
            message.error('许可信息文件类型错误，请选择正确的许可文件');
            this.setState({fileList:[]});
            return;
          }
          let filedata=new FormData();
          filedata.append('files',fileList[0]);
          filedata.append('remark',values.remark);
          filedata.append('tenant',tenant);
          const getAmpEnvId = () => {
            let evnId = base.currentEnvironment ? base.currentEnvironment.id : '1';
            return evnId;
          }
          this.setState({uploading:true});
          fetch(`proxy/cce/v2/tenant/${tenant}/license`,{
            method:'POST',
            credentials: "include",
            headers:{
              'X-Requested-With': 'XMLHttpRequest', 
              'AMP-ENV-ID': getAmpEnvId() 
            }, 
            body:filedata,
          }).then((response) => 
            response.json() // << This is the problem
          ).then(data=>{
              this.setState({
                fileList:[],
                uploading:false,
              });
              message.success('许可信息文件上传成功');
              this.getCurrentLicense();
              this.getAllLicenses(this.state.page,this.state.row);
              this.setState({visibleModal:false});
          }).catch(err=>{
            message.error('许可信息文件上传失败，请重试');
            this.setState({
              uploading:false
            });
          })
        }else{
          message.error('请先选择待上传许可信息文件');
          this.setState({
            uploading:false
          })
        }
      }
    });
  }
  render() {
    const {data,page,row,total,currentLicense,visibleModal,uploading} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const columns = [{
      title: '上传人',
      width:'20%',
      dataIndex: 'creatorname'  
    }, {
      title: '备注',
      width:'60%',
      dataIndex: 'remark',
    }, {
      title: '上传时间',
      width:'20%',
      dataIndex: 'createtime',
      render: (value, record) => {
        return moment(value).format('YYYY-MM-DD hh:mm');
      }
    }]; 
    const pagination = {
      total: total,
      current:page,
      pageSize: row,
      showSizeChanger: true, 
      pageSizeOptions:['5','10','20'],
      onShowSizeChange:(current, pageSize) =>{
        this.setState({page:current,row:pageSize});
        this.getAllLicenses(current,pageSize);
      },
      onChange:(current, pageSize) => {
        this.getAllLicenses(current,pageSize);
        this.setState({page:current,row:pageSize});
      },
    };
    const extra =(
      <Form>
        <FormItem {...formItemLayout} style={{marginBottom:0}} label="上传人">
          <span>{currentLicense.creatorname}</span>
        </FormItem>
        <FormItem {...formItemLayout} style={{marginBottom:0}} label="上传时间">
          <span>{moment(currentLicense.createtime).format('YYYY-MM-DD hh:mm')}</span>
        </FormItem>
        <FormItem {...formItemLayout} style={{marginBottom:0}} label="备注">
          <span>{currentLicense.remark}</span>
        </FormItem>
        {/* <FormItem {...formItemLayout} label="过期时间">
          <span>{moment(currentLicense.createtime).format('YYYY-MM-DD hh:mm')}</span>
        </FormItem> */}
      </Form>
    );
    /* const description = (
      <div style={{wordWrap:'break-word',padding:'0px 64px'}}>
        <Ellipsis length={100}>{currentLicense.content}</Ellipsis>
      </div>
    ); */
    const formItemLayout1 = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    const props = {
      accept:'.lic',
      headers: {
        authorization: 'authorization-text',
      },
      onRemove:(file)=>{
        this.setState({fileList:[]})
      },
      beforeUpload:(file)=>{
        this.setState({fileList:[file]})
        return false;
      },
      fileList:this.state.fileList,
    }
    return (
      <PageHeaderLayout
        title="许可信息"
        content="全局应用许可，C2应用部署过程中可以选择使用共享许可来验证应用权限"
        breadcrumbList={breadcrumbList} >
        <Card 
          style={{marginBottom:24}}
          bordered={false} >
          {currentLicense.content?
            <Fragment>
              <div style={{textAlign:'center',marginTop:32}}>
                <Icon type="key" style={{fontSize:64}}/>
              </div>
              <Result
                extra={extra}
                actions={<Button type="primary" size='large' onClick={this.onUpdateLicense}>更新许可</Button>} >
              </Result>
            </Fragment>
          : <Button type="primary" onClick={this.onUpdateLicense}>上传许可</Button>}
          <Modal 
            title="更新许可信息"
            visible={visibleModal}
            onOk={this.handleModalOk} 
            confirmLoading={uploading}
            onCancel={()=>this.setState({visibleModal:false})}>
            <Form>
              <Form.Item {...formItemLayout1} label="备注">
              {getFieldDecorator('remark', {
                rules: [
                  { required: true, message: '请输入备注信息!' },
                ],
              })(
                <Input.TextArea rows={4}/>
              )}
              </Form.Item>
              <Form.Item {...formItemLayout1} label="License上传">
              {getFieldDecorator('upload')(
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" />上传License文件
                  </Button>
                </Upload>
              )}
              </Form.Item>
            </Form>
          </Modal>
        </Card>
        <Card title='许可历史记录' >
          <Table 
            dataSource={data} 
            columns={columns} 
            pagination={pagination} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
const Antdes = Form.create()(LicenseMessage);

export default props=>(
  <GlobalHeaderContext.Consumer>
    {context=><Antdes {...props} tenant={context.tenant} />}
  </GlobalHeaderContext.Consumer>
);