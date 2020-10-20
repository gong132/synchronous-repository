import React, { PureComponent, Fragment } from 'react'
import moment from 'moment'
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
    this.handleClickOther = this.handleClickOther.bind(this)
  }

  componentDidMount() {
    const { demandForm: { currentNumber } } = this.props
    const dateStart = new Date()
    const dateEnd = moment(dateStart)
      .add(3, 'months')
      .format('YYYY-MM-DD');
    this.props.handleQueryReportForm({ currentNumber, type: 2, startTime: moment(dateStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'), endTime: moment(dateEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss') })
    // this.props.handleQueryReportForm({currentNumber, type: 2,})
  }

  // 点击其他
  handleClickOther = () => {
    const { demandForm: { currentNumber } } = this.props
    this.props.handleQueryReportForm({ currentNumber, type: 2 })
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

  // 处理系统数据
  handleResolveSystem = (data) => {
    const arr = []
    data.map(v => {
      const obj = {
        name: v.systemName,
        value: v.count,
      }
      arr.push(obj)
    })
    return arr
  }

  // 处理团队数据
  handleResolveTeam = (data) => {
    let arr = []
    data.map((v, i) => {
      const per = v.overCount / v.count
      arr = arr.concat(
        [
          {
            team: v.teamName,
            value: v.overCount || null,
            type: `${i}完成`,
            per: v.count ? per : 0,
            total: v.count,
          },
          {
            team: v.teamName,
            value: v.goingCount || null,
            type: `${i}未完成`,
            per: v.count ? (1 - per) : 0,
            total: v.count,
          },
        ]
      )
    })
    return arr
  }

  // 处理未完成和已完成数据
  handleFinished = (data) => {
    const arr = []
    data.map(v => {
      const obj = {
        name: v.systemName,
        value: v.count,
      }
      arr.push(obj)
    })
    return arr
  }

  render() {
    const { demandForm } = this.props
    const { systemList,
      teamData,
      finishData,
      showOtherFlag, } = demandForm
    const barProps = {
      data: this.handleResolveSystem(systemList),
      title: '所属系统',
      barColor: ['#6395F9'],
      cusConfigBool: false,
      handleClickBar: this.handleClickBar,
      handleSlideBar: this.handleSlideBar
    }

    const pieProps = {
      title: '整体完成度',
      data: finishData,
      barColor: ['#E96C5B', '#6395F9'],
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    const multiPieProps = {
      title: '团队分布',
      showOtherFlag: showOtherFlag,
      data: this.handleResolveTeam(teamData),
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
      handleClickOther: this.handleClickOther
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