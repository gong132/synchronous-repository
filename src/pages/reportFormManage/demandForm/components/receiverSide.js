import React, { PureComponent, Fragment } from 'react'
import Bar from '@/components/EchartsComponents/Bar'
import Pie from '@/components/EchartsComponents/Pie'
import MultiPie from '@/components/EchartsComponents/MultiPie/index'
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
    this.handleSlideBar = _.throttle(this.handleSlideBar, 1000)
  }

  // 点击柱形事件
  handleClickBar = (params) => {
    console.log(params)
  }

  // 滑动滑块事件
  handleSlideBar = (params) => {
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
    const { systemList, teamData } = demandForm
    console.log(systemList)
    const barProps = {
      data: systemList,
      title: '所属系统',
      barColor: ['#6395F9'],
      cusConfigBool: false,
      handleClickBar: this.handleClickBar,
      handleSlideBar: this.handleSlideBar
    }

    const pieProps = {
      title: '整体完成度',
      data: [
        { name: '未完成' },
        { name: '已完成' }
      ],
      barColor: ['#E96C5B', '#6395F9'],
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    teamData.map((v, i) => {
      v.unfinished = Math.ceil((Math.random() + i) * 10)
      v.finished = Math.ceil((Math.random() + i) * 10)
      return true
    })

    const multiPieProps = {
      title: '团队分布',
      data: teamData,
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    return (
      <Fragment>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={12}>
            <Card
              style={{ marginTop: '16px' }}
            >
              <Pie {...pieProps} />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              style={{ marginTop: '16px' }}
            >
              <MultiPie {...multiPieProps} />
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{ marginTop: '16px' }}
              headStyle={{
                borderBottom: 'none'
              }}
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