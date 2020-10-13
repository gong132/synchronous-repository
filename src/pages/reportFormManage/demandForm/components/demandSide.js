import React, { PureComponent, Fragment } from 'react'
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

  render() {
    const { demandForm } = this.props
    const { clusterList, demandData, deptList } = demandForm
    console.log(deptList)
    const barProps = {
      data: deptList,
      title: '需求发起部门',
      barColor: ['#FE9D4E'],
      handleClickBar: this.handleClickBar,
      handleSlideBar: this.handleSlideBar,
      cusConfigBool: true,
    }

    const pieProps = {
      title: '需求所属板块',
      data: clusterList,
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    const radiusPieProps = {
      title: '需求状态',
      data: demandData,
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