import React, { Component } from 'react'
import { base } from '../../services/base';
import constants from '../../services/constants'
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'

export default class FunctionOverview extends Component {
  render() {
    
    return (
      <div style={{ margin: '-24px -24px 0 -24px' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'Dashboard'},{name:'功能概览'}]} action={<GlobalEnvironmentChange/>}/>
        <iframe title='功能概览' style={{border:0,height:1310,width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.functionOverview+'&var-env='+base.currentEnvironment.code}></iframe>
      </div>
    )
  }
}
