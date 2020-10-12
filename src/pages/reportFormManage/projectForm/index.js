import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import Pie from '@/components/EchartsComponents/Pie'
import PieRose from '@/components/EchartsComponents/RosePie'
import { DatePicker, Card, Row, Col } from 'antd'
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
    this.handleQueryDept()
    this.handleQueryCluster()
    this.handleQueryTeam()
    this.handleQueryStage()

    const dateStart = new Date()
    const dateEnd = moment(dateStart)
      .add(3, 'months')
      .format('YYYY-MM-DD');

    this.setState({
      rangeDate: [moment(dateStart), moment(dateEnd)]
    })
  }

  // 更改日期
  handleChangDate = value => {
    this.setState({
      rangeDate: value
    })
  }

  // 查询部门
  handleQueryDept = (params) => {
    this.props.dispatch({
      type: 'projectForm/queryDept',
      payload: {
        ...params
      }
    })
  }

  // 

  // 查询集群板块
  handleQueryCluster = (params) => {
    this.props.dispatch({
      type: 'projectForm/queryCluster',
      payload: {
        ...params
      }
    })
  }

  // 查需求和状态
  handleQueryStage = () => {
    this.props.dispatch({
      type: 'projectForm/queryAllStageStatus',
    })
  }

  // 查团队
  handleQueryTeam = () => {
    this.props.dispatch({
      type: 'projectForm/queryTeam',
    })
  }

  handleFormMenuClick = (formType) => {
    this.props.dispatch({
      type: 'projectForm/saveData',
      payload: {
        formType
      }
    })
  }

  render() {
    const { rangeDate } = this.state
    const { projectForm } = this.props
    const { clusterList, stageStatus } = projectForm
    console.log(clusterList, stageStatus)
    stageStatus.map(v => {
      v.name=v.pjStageName
      return true
    })
    const pieProps = {
      title: '集群/板块分布',
      data: clusterList,
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
    }

    const pieRoseProps = {
      title: '项目阶段分布',
      data: stageStatus,
      roseType: 'radius',
      handleClickPie: this.handleClickPie,
      handleClickLegend: this.handleClickLegend,
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
              <Pie {...pieProps} />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ marginTop: '16px' }}>
              <PieRose {...pieRoseProps} />
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{ marginTop: '16px' }}
            >
              {/* <Bar {...barProps} /> */}
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default Project