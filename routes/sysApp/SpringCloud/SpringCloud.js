import React from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import SpringCloudCard from '../../../components/sysApp/SpringCloud/SpringCloudCard'


export default class SpringCloud extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
       const breadcrumbList=[
            {title: '平台管理',href: '/'},
            {title: '业务环境',href: '/'},
            {title: 'Spring Cloud注册中心'}
        ]
        const content = <p>xxxxxxx</p>;
        
        return(
            <div style={{ margin: '-24px -24px 0' }}>
                <PageHeader title="Spring Cloud注册中心管理" breadcrumbList={breadcrumbList} content={content}/>
                <SpringCloudCard params='aa'/> 
            </div>
        )
    }
}