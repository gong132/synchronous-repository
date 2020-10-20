import React, { PureComponent, Fragment } from 'react'
import moment from 'moment'
import Bar from '@/components/EchartsComponents/Bar'
import Pie from '@/components/EchartsComponents/Pie'
import RadiusPie from '@/components/EchartsComponents/RadiusPie'
import { connect } from 'dva'
import {
  Row,
  Col,
  Card
} from 'antd'

@connect(({ demandForm }) => ({
  demandForm
}))
class DemandSide extends PureComponent {

  componentDidMount() {
    const dateStart = new Date()
    const dateEnd = moment(dateStart)
      .add(3, 'months')
      .format('YYYY-MM-DD');
    this.props.handleQueryReportForm({type:1, startTime: moment(dateStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), endTime: moment(dateEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')})
  }

   // 滑动滑块事件
   handleSlideBar = (params) => {
    console.log(params)
  }

  // 点击柱形图事件
  handleClickBar = (params) => {
    console.log(params)
  }

  // 点击饼图扇面事件
  handleClickPie = (params) => {
    console.log(params)
  }

  // 点击legend事件
  handleClickLegend = (params) => {
    console.log(params)
  }

  // 处理集群数据
  handleResolveCluster = (data) => {
    const arr = []
    data.map(v => {
      const obj = {
        name: v.clusterName,
        count: v.count,
      }
      arr.push(obj)
    })
    return arr
  }

  // 处理部门数据
  handleResolveDept = (data) => {
    const arr = []
    data.map(v => {
      const obj = {
        name: v.deptName,
        value: v.count,
      }
      arr.push(obj)
    })
    return arr
  }

  // 处理状态数据
  handleResolveStatus = (data) => {
    const arr = []
    data.map(v => {
      const obj = {
        name: v.statusName,
        count: v.count,
      }
      arr.push(obj)
    })
    return arr
  }

  render() {
    const { demandForm } = this.props
    const { clusterList, statusList, deptList } = demandForm
    console.log(clusterList, statusList, deptList)
    const barProps = {
      data: this.handleResolveDept(deptList),
      title: '需求发起部门',
      barColor: ['#FE9D4E'],
      handleClickBar: this.handleClickBar,
      handleSlideBar: this.handleSlideBar,
      cusConfigBool: true,
    }

    const pieProps = {
      title: '需求所属板块',
      data: this.handleResolveCluster(clusterList),
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    const radiusPieProps = {
      title: '需求状态',
      data: this.handleResolveStatus(statusList),
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    return (
      <Fragment>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={24}>
            <Card
              style={{ marginTop: '16px' }}
            >
              <Bar {...barProps} />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ marginTop: '16px' }}>
              <Pie {...pieProps} />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ marginTop: '16px' }}>
              <RadiusPie {...radiusPieProps} />
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default DemandSide