import React from 'react';
import { PageHeader, Card, Tabs, Button } from 'antd';
import { breadcrumbItemRender } from '../../../common/SimpleComponents';
import { getNodeList } from '../../../services/cce';

function createTemplate(e){
  return getNodeList().then(data=>{
    if(data.master && Array.isArray(data.master) && data.master.length>0){
      const masterNode = data.master[0];
      if(masterNode && masterNode.split('.')){
        const ip = masterNode.split('.')[0].replace(/-/g,'.');
        fetch(`http://${ip}:30010/_template/filebeat-6.3.1`,{method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body:'{"index_patterns":["filebeat-6.3.1-*"],"mappings":{"doc":{"_meta":{"version":"6.3.1"},"date_detection":false,"dynamic_templates":[{"fields":{"mapping":{"type":"keyword"},"match_mapping_type":"string","path_match":"fields.*"}},{"docker.container.labels":{"mapping":{"type":"keyword"},"match_mapping_type":"string","path_match":"docker.container.labels.*"}},{"strings_as_keyword":{"mapping":{"ignore_above":1024,"type":"keyword"},"match_mapping_type":"string"}}],"properties":{"@timestamp":{"type":"date"},"docker":{"properties":{"container":{"properties":{"id":{"ignore_above":1024,"type":"keyword"},"image":{"ignore_above":1024,"type":"keyword"},"labels":{"type":"object"},"name":{"ignore_above":1024,"type":"keyword"}}}}},"kubernetes":{"properties":{"annotations":{"type":"object"},"container":{"properties":{"image":{"ignore_above":1024,"type":"keyword"},"name":{"ignore_above":1024,"type":"keyword"}}},"labels":{"type":"object"},"namespace":{"ignore_above":1024,"type":"keyword"},"node":{"properties":{"name":{"ignore_above":1024,"type":"keyword"}}},"pod":{"properties":{"name":{"ignore_above":1024,"type":"keyword"}}}}},"oplog":{"properties":{"log":{"properties":{"ap":{"ignore_above":1024,"type":"keyword"},"apn":{"norms":false,"type":"text"},"env":{"ignore_above":1024,"type":"keyword"},"method":{"ignore_above":1024,"type":"keyword"},"url":{"ignore_above":1024,"type":"keyword"},"userAgent":{"ignore_above":1024,"type":"keyword"},"remark":{"norms":false,"type":"text"},"class":{"norms":false,"type":"text"},"co":{"norms":false,"type":"text"},"ip":{"type":"ip"},"level":{"ignore_above":1024,"type":"keyword"},"logmessage":{"norms":false,"type":"text"},"ob":{"ignore_above":1024,"type":"keyword"},"obn":{"norms":false,"type":"text"},"op":{"ignore_above":1024,"type":"keyword"},"opn":{"norms":false,"type":"text"},"optype":{"ignore_above":1024,"type":"keyword"},"st":{"type":"short"},"thread":{"norms":false,"type":"text"},"ty":{"ignore_above":1024,"type":"keyword"},"oty":{"ignore_above":1024,"type":"keyword"},"latency":{"type":"long"}}}}}}}},"order":1,"settings":{"index":{"mapping":{"total_fields":{"limit":10000}},"number_of_routing_shards":30,"number_of_shards":3,"refresh_interval":"5s"}}}'
        }).then(response=>{
        });
        fetch(`http://${ip}:30010/_ingest/pipeline/filebeat-6.3.1-oplog-log-pipeline`,{method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body:'{"description":"Pipeline for parsing oplog log logs","processors":[{"grok":{"field":"message","patterns":["\\[%{OPS:oplog.log.optype}\\] %{OPTIME:oplog.log.timestamp} %{NUMBER:oplog.log.st} %{DATA:oplog.log.ap} %{DATA:oplog.log.apn} %{DATA:oplog.log.env} %{DATA:oplog.log.op} %{DATA:oplog.log.opn} %{DATA:oplog.log.ip} %{USERNAME:oplog.log.ty} %{USERNAME:oplog.log.oty} %{DATA:oplog.log.ob} %{DATA:oplog.log.obn} %{DATA:oplog.log.method} %{DATA:oplog.log.url} %{DATA:oplog.log.userAgent} %{NUMBER:oplog.log.latency} %{DATA:oplog.log.remark} %{JAVALOGMESSAGE:oplog.log.co}","\\[%{OPS:oplog.log.optype}\\] %{OPTIME:oplog.log.timestamp} %{NUMBER:oplog.log.st} %{DATA:oplog.log.ap} %{DATA:oplog.log.apn} %{DATA:oplog.log.op} %{DATA:oplog.log.opn} %{DATA:oplog.log.ip} %{USERNAME:oplog.log.ty} %{USERNAME:oplog.log.oty} %{DATA:oplog.log.ob} %{DATA:oplog.log.obn} %{NUMBER:oplog.log.latency} %{JAVALOGMESSAGE:oplog.log.co}"],"pattern_definitions":{"OPS":"OP","OPTIME":"%{YEAR}/%{MONTHNUM}/%{MONTHDAY}[T ]%{ISO8601_HOUR}:?%{MINUTE}(?::?%{SECOND})?%{ISO8601_TIMEZONE}?"},"ignore_missing":true}},{"remove":{"field":"message"}},{"rename":{"field":"@timestamp","target_field":"read_timestamp"}},{"date":{"field":"oplog.log.timestamp","target_field":"@timestamp","formats":["YYYY/MM/dd H:m:s.SSS","YYYY-MM-dd H:m:s,SSS"],"timezone":"Asia/Shanghai"}},{"remove":{"field":"oplog.log.timestamp"}}],"on_failure":[{"set":{"field":"error.message","value":"{{ _ingest.on_failure_message }}"}}]}'
        }).then(response=>{
        });
      }
    }
  })
}
export default function LogDetail(props){
  const breadcrumbList=[
    {breadcrumbName: '平台管理',},
    {breadcrumbName: '系统设置',path:'/setting/syssetting'},
    {breadcrumbName: '平台引擎',path:'/setting/syssetting/platform'},
    {breadcrumbName: '日志',}
  ];

  const headTabs = (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="初始化elasticsearch" key="1" />
    </Tabs>
  );
  
  return (
    <div style={{ margin: '-24px -24px 0' }}>
      <PageHeader title='日志' breadcrumb={{ routes:breadcrumbList ,itemRender:breadcrumbItemRender}} footer={headTabs}>
      全局日志
      </PageHeader>
      <Card style={{margin:24,minHeight:window.innerHeight-305}}>
        <Button type='primary' onClick={createTemplate}>创建template</Button>
        <Button type='primary' style={{marginLeft:10}}>创建pipeline</Button>
      </Card>
    </div>
  )
}