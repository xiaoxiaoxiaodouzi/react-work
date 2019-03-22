import React, { Component } from "react";
import { getClustersByTenant, getClusterInfo } from '../../services/cce';
import ClusterServices from '../../common/ClusterServices';
import { getClusterDetail } from '../../services/monit';
import { getTenant } from '../../services/tp'
class TenantsServices extends Component {

  state = {
    tenantId: '',
    clusterData: [],
    tenants: [],
    loading: false,
    tenantCode: ''
  }

  componentDidMount() {
    this.setState({ tenenantCode: this.props.tenantCode })
    this.getClusters(this.props.tenantCode);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.tenantCode !== nextState.tenantCode) {
      nextState.tenantCode = nextProps.tenantCode;
      this.getClusters(nextProps.tenantCode);
    }
    return true;
  }

  getClusters = (tenantCode) => {
    this.setState({ loading: true })
    getTenant().then(data => {
      this.setState({ tenants: data })
    })
    getClusterInfo().then(data => {
      if (data) {
        this.setState({
          ...data
        })
      }
    })
    // eslint-disable-next-line
    let containTotal = 0;
    // eslint-disable-next-line
    let cpuTotal = 0;
    // eslint-disable-next-line
    let cpuUsedTotal = 0;
    // eslint-disable-next-line
    let memTotal = 0;
    // eslint-disable-next-line
    let memUsedTotal = 0;
    // eslint-disable-next-line
    let DiskTotal = 0;
    // eslint-disable-next-line
    let usedDiskNumTotal = 0;
    getClustersByTenant(tenantCode).then(data => {
      if (data && data.length > 0) {
        getClusterDetail().then(result => {
          //收集所有的节点详情
          let nodeList = [];
          result.forEach(j => {
            cpuTotal += parseInt(j.totalCpuNum, 10);
            cpuUsedTotal += parseInt(j.usedCpuNum, 10);
            memTotal += parseInt(j.totalMemNum, 10);
            memUsedTotal += parseInt(j.usedMemNum, 10);
            DiskTotal += parseInt(j.totalAppNum, 10);
            usedDiskNumTotal += parseInt(j.usedDiskNum, 10);
            nodeList.push(...j.nodeList);
          })
          data.forEach(i => {
            i.nodeDetailList = [];
            containTotal += i.nodeList ? i.nodeList.length : 0;
            if (i.nodeList) {
              i.nodeList.forEach(node => {
                //找到节点详情
                if (nodeList.length > 0) {
                  nodeList.forEach(item => {
                    if (item.nodeName === node) {
                      i.nodeDetailList.push(item);
                    }
                  })
                }
              })
            }

          })

          this.setState({ clusterData: data, loading: false })
        }).catch(err => {
          this.setState({ loading: false })
        })
      } else {
        this.setState({ loading: false })
      }
    })
  }

  render() {
    return <div>
      <ClusterServices loading={this.state.loading} clusterData={this.state.clusterData} {...this.props} {...this.state} opType={"look"} />
    </div>
  }
}
export default TenantsServices;