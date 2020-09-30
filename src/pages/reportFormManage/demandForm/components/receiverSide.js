import React, { PureComponent, Fragment } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import Bar from '@/components/EchartsComponents/Bar'
import _ from 'lodash'
import { connect } from 'dva'
import {
  Row,
  Col,
  Card,
} from 'antd'

@connect(({ demandForm }) => ({
  demandForm
}))
class Receiver extends PureComponent {
  constructor(props) {
    super(props)
    this.handleSlideBar=_.throttle(this.handleSlideBar, 1000)
  }

  // 点击柱形事件
  handleClickBar = (params) => {
    console.log(params)
  }

  // 滑动滑块事件
  handleSlideBar = (params) => {
    console.log(params)
  }

  render() {
    const { demandForm } = this.props
    const { systemNameArr } = demandForm
    const barProps = {
      data: systemNameArr,
      title: '所属系统',
      barColor: ['#6395F9'],
      cusConfig:{
        dataZoom: [{
          height: 24,
          bottom: 0,
          throttle: 500,
          zoomOnMouseWheel: true
        }],
      },
      handleClickBar: this.handleClickBar,
      handleSlideBar: this.handleSlideBar
    }

    return (
      <Fragment>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={12}>
            <GlobalSandBox
              title='整体完成度'
              sandboxStyle={{ marginTop: '16px' }}
            >
              图
            </GlobalSandBox>
          </Col>
          <Col span={12}>
            <GlobalSandBox
              title='团队分布'
              sandboxStyle={{ marginTop: '16px' }}
            >
              图
            </GlobalSandBox>
          </Col>
          <Col span={24}>
            <Card
              style={{ marginTop: '16px' }}
            >
              <Bar {...barProps} />
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default Receiver