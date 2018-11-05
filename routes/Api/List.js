import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Card ,Breadcrumb,Divider} from 'antd';
import ProvidedServicesTable from '../../components/Application/Api/ProvidedServices'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'



class ApiList extends React.Component {
  state = {}

  render() {
    //面包屑
    let breadcrumbList =<Breadcrumb style={{marginTop:6}}>
        <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 服务列表</Breadcrumb.Item>
      </Breadcrumb>;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={breadcrumbList}  action={<GlobalEnvironmentChange/>}/>
        <Card bordered={false} style={{ margin: 24 }}>
          <ProvidedServicesTable editable={false} />
        </Card>
      </div >
    );
  }
}

export default ApiList;