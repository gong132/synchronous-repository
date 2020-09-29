import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
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

    }
  }

  componentDidMount() {
    this.handleQueryDept()
  }

  // 查询部门
  handleQueryDept = (params) => {
    this.props.dispatch({
      type: 'demandForm/queryDept',
      payload: {
        ...params
      }
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

  render() {
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
            <RangePicker className={styles.rightTime_date} />
          </div>
        </div>
        {formType === 'demandSide' && <DemandSide />}
        {formType === 'receiverSide' && <ReceiverSide />}
      </Fragment>
    )
  }
}
export default Demand