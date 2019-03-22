import React, { useState, Fragment } from 'react';
import { Divider, Breadcrumb, Modal, Button, Progress, Input } from 'antd';
import ErrorBoundary from './ErrorBoundary';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import constants from '../services/constants';
import Link from 'react-router-dom/Link';

export function BreadcrumbTitle(breadcrumbList) {
  return (
    <Breadcrumb style={{ marginTop: 6, marginLeft: -18 }}>
      <Divider type="vertical" style={{ width: "2px", height: "15px", backgroundColor: "#15469a", verticalAlign: "text-bottom" }} />
      {breadcrumbList.map(crumb => <Breadcrumb.Item key={crumb.name}>{crumb.url ? <a href={crumb.url}>{crumb.name}</a> : crumb.name}</Breadcrumb.Item>)}
    </Breadcrumb>
  )
}

export function GrafanaModal(props) {
  const footer = (
    <Button onClick={props.onCancel}>关闭</Button>
  )
  return (
    <Modal visible={props.visible} title={props.title} width='85%' footer={footer} onCancel={props.onCancel} destroyOnClose={true} maskClosable={false} bodyStyle={{ padding: 0 }}>
      <iframe title='Grafana' style={{ border: 0, height: 420, width: '100%', marginBottom: -5 }} src={props.url}></iframe>
    </Modal>
  )
}

export function BaseProgress({ percent, style }) {
  // eslint-disable-next-line
  percent = parseInt(percent);
  if (percent < constants.PROGRESS_STATUS[0]) {
    return <Progress percent={percent} status='normal' className='normal' style={style} />
  } else if (percent >= constants.PROGRESS_STATUS[0] && percent < constants.PROGRESS_STATUS[1]) {
    return <Progress percent={percent} status='normal' className='warning' style={style} />
  } else {
    return <Progress percent={percent} status='normal' className='danger' style={style} />
  }
}
/**
 *错误组件包装方法
 */
export function ErrorComponentCatch(Target) {
  class Wrap extends React.Component {
    render() {
      return (
        <ErrorBoundary>
          <Target {...this.props} />
        </ErrorBoundary>
      )
    }
  }
  return Wrap;
}

export function AmpDoc() {
  const [md, setMd] = useState();
  if (md === undefined) {
    const mdFile = require('../assets/doc.md');
    fetch(mdFile).then(response => {
      response.text().then(md => {
        setMd(md);
      })
    })
  }
  const DocMarkdown = styled(ReactMarkdown)`
    margin:24px;
  `;
  return <DocMarkdown source={md} escapeHtml={false} />
}
export function breadcrumbItemRender(route, params, routes, paths) {
  const isFirst = routes.indexOf(route) === 0;
  return route.path?<Fragment key={routes.indexOf(route)}>
    {isFirst&&<Divider type='vertical' className='crumb-divider'/>}
    <Link to={route.path}>{route.breadcrumbName}</Link>
  </Fragment>:<Fragment key={routes.indexOf(route)}>
  {isFirst&&<Divider type='vertical' className='crumb-divider'/>}{route.breadcrumbName}
  </Fragment>
}

export function breadcrumbDataGenerate({url,params,path},type){
  let breadcrumbList = [];
  switch (type) {
    case 'role':
      if(url.startsWith('/functions'))breadcrumbList.push({title:<Link to='/funcs'>功能权限与导航</Link>});
      if(url.startsWith('/applications')){
        breadcrumbList.push(
          {title:<Link to='/apps'>应用列表</Link>},
          {title:<Link to={`/apps/${params.appid}/resource`}>权限</Link>},
        );
      }
      breadcrumbList.push({title:'角色详情'});
      break;
    case 'app':
      if(url.startsWith('/functions'))breadcrumbList.push({title:<Link to='/funcs'>功能权限与导航</Link>});
      else breadcrumbList.push({title:<Link to='/apps'>应用列表</Link>});
      breadcrumbList.push({title:'应用详情'});
      break;
    case 'middleware':
      breadcrumbList.push({title:<Link to='/middlewares'>中间件列表</Link>});
      breadcrumbList.push({title:'中间件详情'});
      break;
    case 'api':
      if(url.startsWith('/apis'))breadcrumbList.push({title:<Link to='/apis'>服务列表</Link>});
      if(url.startsWith('/applications')){
        breadcrumbList.push(
          {title:<Link to='/apps'>应用列表</Link>},
          {title:<Link to={`/apps/${params.appid}/api`}>服务</Link>},
        );
      }
      breadcrumbList.push({title:'服务详情'});
      break;
  
    default:
      break;
  }

  
  return breadcrumbList;
}

export function ClusterDocModal(props) {
  const [ip, setIp] = useState('主机IP');
  return (
    <Modal
      style={{ top: 20 }}
      bodyStyle={{ height: 700, overflow: 'auto' }}
      title='内网生成集群主机添加'
      onCancel={props.onCancel}
      visible={props.visibleMaAdd}
      width='900px'
      footer={null}
    >
      <p>更全面的文档介绍 <a href="https://docs.docker.com/engine/installation/linux/docker-ee/centos/#install-docker-ee">请参考</a>（主机已安装Docker,请跳过） </p>
      <p>执行以下一条安装脚本即可</p>
      <pre className='preStyle' >{
        `curl -sS http://s3.c2cloud.cn/k8s-builder/install-docker.sh | sh -s`} {props.masterIP}
      </pre>
      <p>配置Docker存储驱动为devicemapper direct-lvm，请在生产环境配置。详细文档<a href="https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/#configure-direct-lvm-mode-for-production">请参考</a></p>
      <p>1） 磁盘分区</p>
      <pre className='preStyle'>
        {`
  fdisk /dev/vdb#/dev/vdb为新挂载的设备块
  Command (m for help): n    # n表示新建一个新分区。
  出现“First cylinder(n-xxx, default m) ：”表示要你输入的分区开始的位置。直接回车选择默认值
  出现“Last cylinder or +size or +sizeM or +sizeK (n-xxx, default xxx):”表示分区的结束位置。直接回车选择默认值
  Command (m for help): wq            # 保存信息
  fdisk -l /dev/vdb                   # 查看硬盘/dev/vdb的信息`}
      </pre>
      <p>2） 创建逻辑卷</p>
      <pre className='preStyle'>
        {`
  pvcreate /dev/vdb1 
  vgcreate docker /dev/vdb1
  lvcreate --wipesignatures y -n thinpool docker -l 95%VG
  lvcreate --wipesignatures y -n thinpoolmeta docker -l 1%VG
  lvconvert -y --zero n -c 512K --thinpool docker/thinpool --poolmetadata docker/thinpoolmeta`}
      </pre>
      <p>3） 修改配置文件</p>
      <pre className='preStyle'>
        {`
  vi /etc/lvm/profile/docker-thinpool.profile 
  activation {
    thin_pool_autoextend_threshold=80
    thin_pool_autoextend_percent=20
  }
  lvchange --metadataprofile docker-thinpool docker/thinpool        # 添加新的lv profile
  lvs -o+seg_monitor`}
      </pre>
      <p>4）修改Docker启动参数ExecStart，重启Docker</p>
      <pre className='preStyle'>
        {`
  vi /usr/lib/systemd/system/docker.service
  ExecStart=/usr/bin/dockerd $OPTIONS --bip=192.168.1.1/16 
    --storage-driver=devicemapper 
    --storage-opt=dm.thinpooldev=/dev/mapper/docker-thinpool 
    --storage-opt=dm.use_deferred_remova
  sudo systemctl restart docker            # Docker重启l=true 
    --storage-opt=dm.use_deferred_deletion=true`}
      </pre>
      <span style={{ marginBottom: 24, marginTop: 24 }}>1）请输入主机IP：<Input style={{ marginBottom: 24, marginTop: 24 }} value={ip} onChange={e => setIp(e.target.value)} /></span>
      <p>2）安装好docker后，请在第一步填写您的主机IP，然后在您的主机上运行命令</p>
      <pre className='preStyle' style={{ 'white-space': 'pre-wrap' }}>
        {`curl -sS http://s3.c2cloud.cn/k8s-builder/install.sh | sh -s ${props.token} ${ip} ${props.masterIP}`}
      </pre>
      <p>
        3）当看到您的主机输出【 Run 'kubectl get nodes' on the master to see this machine join.】后，
        点击加入集群按钮，将主机加入内网生产集群。<Button type='primary' onClick={props.handleBtnAdd}>加入集群</Button>
      </p>
    </Modal>)
}