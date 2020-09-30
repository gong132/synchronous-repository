import React, { PureComponent, Fragment } from 'react'
import Bar from '@/components/EchartsComponents/Bar'
import Pie from '@/components/EchartsComponents/Pie'
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

  // 点击柱形图事件
  handleClickBar = (params) => {
    console.log(params)
  }

  render() {
    const { demandForm } = this.props
    const { deptNameArr, clusterList } = demandForm
    console.log(clusterList, deptNameArr)
    const barProps = {
      data: deptNameArr,
      title: '需求发起部门',
      barColor: ['#FE9D4E'],
      handleClickBar: this.handleClickBar
    }

    const pieProps = {
      title: '需求所属板块',
      data: clusterList
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
            <Card>
              图
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default DemandSide