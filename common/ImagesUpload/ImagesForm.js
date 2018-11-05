import React from 'react'
import { Form, Input, Button, Icon, Upload, message, Select } from 'antd';
import { getList, getDockerfileByArtifact, getDockerfileByType, getLogs, getCurrentUser, getImageCategorys, updateImages } from '../../services/images'
import { base } from '../../services/base'
import PropTypes from 'prop-types';
import constants from '../../services/constants'

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

class ImagesUploadForm extends React.Component {
  state = {
    artifact: '',          //镜像名称  
    tenant: '',            //租户信息
    visible: false,
    latest: '',        //最新版本号
    dockerfile: '',        //dockerfile
    fileList: [],        //文件列表
    uploading: false,
    categoryIds: [],     //镜像分类
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    getImageCategorys().then(data => {
      this.setState({
        categoryIds: data
      })
    })
    let tenant = this.props.tenant;
    this.setState({
      tenant: tenant
    })
    let artifact = this.props.artifact;
    const { setFieldsValue } = this.props.form;
    if (artifact) {
      setFieldsValue({
        imageName: artifact
      })

      getList(tenant, artifact).then(data => {
        this.setState({
          latest: data.contents[0].tag,
        })
      })

      //获取dockerfile
      getDockerfileByArtifact(artifact).then(data => {
        if (!data) {
          setFieldsValue({
            dockerfile: data.dockerfile
          })
        } else {
          //先默认写死war，目前只支持这个类型的程序包
          getDockerfileByType('java-web').then(datas => {
            setFieldsValue({
              dockerfile: datas.dockerfile
            })
          })
        }
      })
    } else {
      getDockerfileByType('java-web').then(datas => {
        setFieldsValue({
          dockerfile: datas.dockerfile
        })
        this.setState({
          latest: ''
        })
      })
    }
  }


  handleSubmit = () => {
    this.setState({
      uploading: true,
    });
    getCurrentUser().then(user => {
      const { validateFields } = this.props.form;
      validateFields((err, values) => {
        if (err) {
          return
        }
        if (!values.imageName) {
          message.error('请填写镜像名称')
          this.setState({
            uploading: false,
          });
          return;
        }
        if (!values.imageTag) {
          message.error('请填写镜像版本')
          this.setState({
            uploading: false,
          });
          return;
        }
        if (!values.categoryId) {
          message.error('请选择镜像分类')
          this.setState({
            uploading: false,
          });
          return;
        }
        let fileList = this.state.fileList
        let tenant = this.state.tenant
        if (fileList.length > 0) {
          let filedata = new FormData();
          filedata.append('files', fileList[0])
          filedata.append('tenant', tenant)
          filedata.append('packMethod', 0)
          filedata.append('fileInfo', fileList[0].name)
          filedata.append('imageName', values.imageName)
          filedata.append('imageTag', values.imageTag)
          filedata.append('dockerfile', values.dockerfile)
          filedata.append('createUser', user.name)
          const getAmpEnvId = () => {
            let evnId = base.currentEnvironment ? base.currentEnvironment.id : '1';
            return evnId;
          }
          fetch('proxy/cce/v1/buildimages', {
            method: 'POST',
            credentials: "include",
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'AMP-ENV-ID': getAmpEnvId()
            },
            body: filedata,
          }).then((response) =>
            response.json()
          ).then(data => {
            if (data) {
              let queryParams = {
                lines: 100
              }
              getLogs(data.taskid, queryParams).then(datas => {

              })
              this.setState({
                fileList: [],
                uploading: false,
                visible: false,
              })
              //关闭父的模态框
              if (this.props.onOk) {
                //新增镜像增添属性
                let item = {
                  taskId: data.taskid,
                  name: values.imageName,
                  namespace: tenant
                }
                this.props.onOk(item, values.imageTag, tenant, constants.MIRROR_ADDRESS_BASE);
              }
              message.success('编译镜像成功')
              let bodyParams = {
                categoryId: values.categoryId
              }
              //新增完之后修改
              updateImages(tenant, values.imageName, bodyParams).then(img => {
              })
            } else {
              message.error('编译失败，请联系管理员')
              this.setState({
                uploading: false
              })
            }
          })
        } else {
          message.error('请先上传文件在进行编译')
          this.setState({
            uploading: false
          })
        }
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const props = {
      name: 'file',
      action: '',
      headers: {
        authorization: 'authorization-text',
      },

      onRemove: (file) => {
        this.setState({
          fileList: []
        })
      },

      beforeUpload: (file) => {
        let query = [];
        query.push(file);
        this.setState({
          fileList: query
        })
        return false;
      },
      fileList: this.state.fileList,
    }
    return (
      <Form>
        <FormItem {...this.props.formItemLayout} label="程序包类型"
          validateStatus={this.state.validateStatus}
          help={this.state.help}
        >
          {getFieldDecorator('fileInfo', { initialValue: 'war' })(
            <Select>
              <Option value='war' key='war'>war</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...this.props.formItemLayout} label="镜像名称"
          validateStatus={this.state.validateStatus}
          help={this.state.help}
        >
          {getFieldDecorator('imageName')(
            <Input />
          )}
        </FormItem>
        <FormItem {...this.props.formItemLayout} label="镜像版本"
          validateStatus=''
          help={'最新版本:' + this.state.latest}
        >
          {getFieldDecorator('imageTag')(
            <Input onBlur={this.OnBlur} />
          )}
        </FormItem>

        {this.state.artifact ? ''
          :
          <FormItem {...this.props.formItemLayout} label="镜像分类"
          >
            {getFieldDecorator('categoryId', { initialValue: 'business' })(
              <Select>
                {this.state.categoryIds.map(item => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                })}
              </Select>
            )}
          </FormItem>}
        <FormItem {...this.props.formItemLayout} label="上传程序包"
          validateStatus=''
          help='只支持war包'
        >
          {getFieldDecorator('files')(
            <Upload {...props} accept='.war'>
              <Button>
                <Icon type="upload" /> 上传文件
                  </Button>
            </Upload>
          )}
        </FormItem>
        <FormItem {...this.props.formItemLayout} label="Dockerfile"
          validateStatus={this.state.validateStatus}
          help={this.state.help}
        >
          {getFieldDecorator('dockerfile')(
            <TextArea style={{ height: 300 }} onBlur={this.OnBlur} />
          )}
        </FormItem>
        <FormItem {...this.props.formItemLayout}
          style={{ paddingLeft: 260 }}
        >
          <Button type='primary' loading={this.state.uploading} onClick={this.handleSubmit}>{this.state.uploading ? '正在编译中...' : '提交编译'}</Button>
        </FormItem>
      </Form>
    );
  }
}
const ImagesForm = Form.create()(ImagesUploadForm)
export default ImagesForm;

ImagesForm.PropTypes = {
  tenant: PropTypes.string.isRequired,       //租户code
  artifact: PropTypes,       //镜像名称
  formItemLayout: PropTypes.object, //form表单的排版
  onOk: PropTypes.func,          //点击编译成功回调事件
}
ImagesForm.defaultProps = {
  formItemLayout: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 13 },
    },
  }
}

