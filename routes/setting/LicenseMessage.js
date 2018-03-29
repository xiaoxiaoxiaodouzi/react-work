import React,{PureComponent,Fragment} from 'react';
import PageHeaderLayout from './layouts/PageHeaderLayout';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Result from 'ant-design-pro/lib/Result';
import { Button,message,Card,Table,Icon,Form,Input,Modal,Upload } from 'antd';
import moment from 'moment';
import { queryCurrentLicense,queryLicenses,updateLicense } from '../../services/setting';

const FormItem = Form.Item;
const { Description } = DescriptionList;

const breadcrumbList = [{
  title: '高级设置',
  href: '/#/setting',
}, {
  title: '许可信息'
}];

const licenses = [{
  name:'tsw',
  cluster:'test',
  createtime:'',
}];

class LicenseMessage extends PureComponent {
  state = {
    data:[],
    currentLicense:{},
    visibleModal:false,
    page:1,
    row:5,
    total:0,
  };
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  onUpdateLicense=()=>{
    console.log("update1");
    const { setFieldsValue }=this.props.form;
    setFieldsValue({
      remark:this.state.currentLicense.remark
    });
    this.setState({visibleModal:true});
  }
  componentDidMount(){
    queryCurrentLicense().then((data)=>{
      console.log("currentLicense",data);
      this.setState({currentLicense:data});
    });
    queryLicenses().then((data)=>{
      if(data && data.contents){
        this.setState({
          data:data.contents,
          page:1,
          row:5,
          total:data.total
        });
        console.log("currentLicense",data);
      }
    });
  }
  handleModalOk = ()=>{
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((error, values) => {
      console.log("formvalues",values);
      if (!error) {
        console.log("handleok");
        let params = {
          remark:values.remark,
          content:'test',
        };
        /* updateLicense(params).then(()=>{
          message.success('更新许可信息成功');
        }) */
      }
    });
    this.setState({visibleModal:false});
  }
  onFileUploadChange = (info)=>{
    console.log('onfileuploadchange',info);
    if (info.file.status === 'done') {
      message.success(`${info.file.name}文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}文件上传失败`);
    }
  }
  render() {
    const {data,page,row,total,currentLicense,visibleModal} = this.state;
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
      dataIndex: 'creatorname'  
    }, {
      title: '备注',
      dataIndex: 'remark',
    }, {
      title: '上传时间',
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
      },
      onChange:(current, pageSize) => {
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
    const description = (
      <div style={{wordWrap:'break-word',padding:'0px 64px'}}>
        <Ellipsis length={100}>{currentLicense.content}</Ellipsis>
      </div>
    );
    const formItemLayout1 = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };
    return (
      <PageHeaderLayout
        title="许可信息"
        content="全局应用许可，C2应用部署过程中可以选择使用共享许可来验证应用权限"
        breadcrumbList={breadcrumbList} >
        <Card 
          style={{marginBottom:24}}
          bordered={false}>
          <div style={{textAlign:'center',marginTop:32}}>
            <Icon type="key" style={{fontSize:64}}/>
          </div>
          <Result
            description={description}
            extra={extra}
            actions={<Button type="primary" size='large' onClick={this.onUpdateLicense}>更新许可</Button>} >
          </Result>
          <Modal 
            title="更新许可信息"
            visible={visibleModal}
            onOk={this.handleModalOk} 
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
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload 
                  name="logo" 
                  onChange={(info)=>this.onFileUploadChange(info)}
                  action="file/license" 
                  listType="text">
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
export default Antdes;