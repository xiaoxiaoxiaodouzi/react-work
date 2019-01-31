import React, { } from 'react';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import { base } from '../../services/base'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import constants from "../../services/constants";

class ApiDashboard extends React.Component {
  render() {
    return (
      <div style={{ margin: '-24px -24px 0 -24px' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'Dashboard'},{name:'功能概览'}]} action={<GlobalEnvironmentChange/>}/>
        <iframe title='Grafana' style={{border:0,height:1473,width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.apiOverview+`&var-env=${base.currentEnvironment.code}`}></iframe>
      </div>
    )
  }
}

export default ApiDashboard;