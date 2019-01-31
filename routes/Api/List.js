import React from 'react'
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import { Card} from 'antd';
import ProvidedServicesTable from '../../components/Application/Api/ProvidedServices'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'



class ApiList extends React.Component {
  state = {}

  render() {
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'服务列表'}]} action={<GlobalEnvironmentChange/>}/>
        <Card bordered={false} style={{ margin: 24 }}>
          <ProvidedServicesTable editable={false} />
        </Card>
      </div >
    );
  }
}

export default ApiList;