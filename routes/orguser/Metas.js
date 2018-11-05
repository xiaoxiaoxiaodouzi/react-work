import React from 'react';
import { Metadatas} from 'c2-orguser';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import {Breadcrumb,Divider} from 'antd';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import { base } from '../../services/base';

class metas extends React.Component{

    render(){
        let breadcrumbList =<Breadcrumb style={{marginTop:6}}>

        <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/>基础数据 </Breadcrumb.Item>
        <Breadcrumb.Item> 维度列表</Breadcrumb.Item>
      </Breadcrumb>;
        return (
            <div style={{ margin: '-24px -24px 0' }}>
            <PageHeader title={breadcrumbList}  action={<GlobalEnvironmentChange/>}/>
            <div style={{ margin:24 }}>
                <Metadatas ampEnvId={base.currentEnvironment.id} permissions={base.allpermissions}/>
            </div>
            
           </div >
        )
    }
}
export default metas;