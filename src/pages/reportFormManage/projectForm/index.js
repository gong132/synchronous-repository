import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import Pie from '@/components/EchartsComponents/Pie'
import PieRose from '@/components/EchartsComponents/RosePie'
import StackBar from '@/components/EchartsComponents/StackBar'
import { DatePicker, Card, Row, Col, Empty } from 'antd'
import styles from './index.less'

const { RangePicker } = DatePicker
@connect(({ projectForm }) => ({
  projectForm
}))
class Project extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rangeDate: []
    }
  }

  componentDidMount() {


    const dateStart = new Date()
    const dateEnd = moment(dateStart)
      .add(3, 'months')
      .format('YYYY-MM-DD');
    this.handleQueryProjectReport({ startTime: moment(dateStart).format('YYYY-MM-DD'), endTime: moment(dateEnd).format('YYYY-MM-DD') })
    this.setState({
      rangeDate: [moment(dateStart), moment(dateEnd)]
    })
  }

  // 更改日期
  handleChangDate = value => {
    this.setState({
      rangeDate: value
    }, () => {
      this.handleQueryProjectReport()
    })
  }

  // 查询项目报表
  handleQueryProjectReport = (params) => {
    const { rangeDate } = this.state
    if (!_.isEmpty(rangeDate)) {
      params.startTime = moment(rangeDate[0]).format('YYYY-MM-DD')
      params.endTime = moment(rangeDate[1]).format('YYYY-MM-DD')
    }
    this.props.dispatch({
      type: 'projectForm/queryProjectReportForm',
      payload: {
        ...params
      }
    })
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

  // 处理项目阶段数据
  handleResolveStage = (data) => {
    const arr = []
    data.map(v => {
      const obj = {
        name: v.stageName,
        count: v.count,
      }
      arr.push(obj)
    })
    return arr
  }

  // 判断是否全部为空
  judgeEmpty = (arr) => {
    let bool = true
    arr.map(v => {
      if (v.count !== 0) {
        bool = true
      }
    })
    return bool
  }

  render() {
    const { rangeDate } = this.state
    const { projectForm } = this.props
    const {
      clusterList,
      stageList,
      teamList,
      projectTotal,
      contractAmountTotal,
      estAmountTotal
    } = projectForm

    const pieProps = {
      title: '集群/板块分布',
      data: this.handleResolveCluster(clusterList),
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    const pieRoseProps = {
      title: '项目阶段分布',
      data: this.handleResolveStage(stageList),
      roseType: 'radius',
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    const StackBarProps = {
      data: teamList,
      title: '团队分布',
      barColor: ['#826AF9', '#D0AEFF'],
      handleClickBar: this.handleClickBar,
      handleSlideBar: this.handleSlideBar,
      cusConfigBool: true,
    }

    return (
      <Fragment>
        <div className={styles.rightTime}>
          <span className={styles.rightTime_title}>项目日期</span>
          <RangePicker value={rangeDate} onChange={this.handleChangDate} className={styles.rightTime_date} />
        </div>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={12}>
            <Card style={{ marginTop: '16px' }}>
              {console.log(this.judgeEmpty(clusterList))}
              {!this.judgeEmpty(clusterList) ? <Pie {...pieProps} /> : <Empty description='集群/板块分布暂无数据' />}
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ marginTop: '16px' }}>
              {!this.judgeEmpty(clusterList) ? <PieRose {...pieRoseProps} /> : <Empty description='项目阶段分布暂无数据' />}
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{ marginTop: '16px' }}
            >
              <div className={styles.rightContent}>
                <span className={styles.rightContent_title}>项目总数: </span>
                <span className={styles.rightContent_value}>{projectTotal}</span>
                <span className={styles.rightContent_title}>立项总金额(元)：</span>
                <span className={styles.rightContent_value}>{estAmountTotal}</span>
                <span className={styles.rightContent_title}>
                  合同成交总金额(元)：
                </span>
                <span className={styles.rightContent_value}>{contractAmountTotal}</span>
              </div>
              {_.isEmpty(teamList) ? <Empty description="团队分布无项目" /> : <StackBar {...StackBarProps} />}
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default Project