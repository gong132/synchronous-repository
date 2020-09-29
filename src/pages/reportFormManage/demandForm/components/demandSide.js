import React, { PureComponent, Fragment } from 'react'
import Bar from '@/components/EchartsComponents/barEcharts'
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

  render() {
    const { demandForm } = this.props
    const { deptList, deptNameArr } = demandForm
    const barProps = {
      xAxis: deptNameArr
    }

    return (
      <Fragment>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={24}>
            <Card
              style={{marginTop: '16px'}}
            >
              <Bar {...barProps} />
            </Card>
          </Col>
          <Col span={12}>
            <Card
            >
              图
            </Card>
          </Col>
          <Col span={12}>
            <Card
            >
              图
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default DemandSide