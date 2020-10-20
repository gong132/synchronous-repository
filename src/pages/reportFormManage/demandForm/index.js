import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import DemandSide from './components/demandSide'
import ReceiverSide from './components/receiverSide'
import { DatePicker } from 'antd'
import styles from './index.less'

const { RangePicker } = DatePicker
@connect(({ demandForm }) => ({
  demandForm
}))
class Demand extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      rangeDate: []
    }
  }

  componentDidMount() {
    // this.handleQueryDept()
    // this.handleQuerySystem()
    // this.handleQueryCluster()
    // this.handleQueryDemand()
    // this.handleQueryTeam()

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
    }, () => {
      const { formType, currentNumber } = this.props
      const params = { type: 1 }
      if (formType === 'receiverSide') {
        params.type = 2
        params.currentNumber = currentNumber
      }
      this.handleQueryReportForm(params)
    })
  }

  handleFormMenuClick = (formType) => {
    this.props.dispatch({
      type: 'demandForm/saveData',
      payload: {
        formType
      }
    })
  }

  // 查报表
  handleQueryReportForm = (params) => {
    const { rangeDate } = this.state
    if (!_.isEmpty(rangeDate)) {
      params.startTime = moment(rangeDate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      params.endTime = moment(rangeDate[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    this.props.dispatch({
      type: 'demandForm/queryDemandReportForm',
      payload: {
        ...params,
      }
    })
  }

  render() {
    const { rangeDate } = this.state
    const { demandForm } = this.props
    const { formType } = demandForm
    return (
      <Fragment>
        <div className='yCenter-between'>
          <div className={styles.switch}>
            <div
              onClick={() => this.handleFormMenuClick('demandSide')}
              className={formType === 'demandSide' ? styles.switch__left : styles.switch__right}
            >
              需求方
            </div>
            <div
              onClick={() => this.handleFormMenuClick('receiverSide')}
              className={formType === 'receiverSide' ? styles.switch__left : styles.switch__right}
            >
              受理方
            </div>
          </div>
          <div className={styles.rightTime}>
            <span className={styles.rightTime_title}>需求创建日期</span>
            <RangePicker value={rangeDate} onChange={this.handleChangDate} className={styles.rightTime_date} />
          </div>
        </div>
        {formType === 'demandSide' && <DemandSide handleQueryReportForm={this.handleQueryReportForm} />}
        {formType === 'receiverSide' && <ReceiverSide handleQueryReportForm={this.handleQueryReportForm} />}
      </Fragment>
    )
  }
}
export default Demand