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
    this.handleQueryDept()
    this.handleQuerySystem()
    this.handleQueryCluster()
    this.handleQueryDemand()
    this.handleQueryTeam()
    
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
      type: 'demandForm/queryDept',
      payload: {
        ...params
      }
    })
  }

  // 查询系统
  handleQuerySystem = (params) => {
    this.props.dispatch({
      type: 'demandForm/querySystemList',
      payload: {
        ...params
      }
    })
  }

  // 查询集群板块
  handleQueryCluster = (params) => {
    this.props.dispatch({
      type: 'demandForm/queryCluster',
      payload: {
        ...params
      }
    })
  }

  // 查需求和状态
  handleQueryDemand = () => {
    this.props.dispatch({
      type:'demandForm/queryDemandBoard',
      payload: {
        ids: '1,2,3,4,5,6,7,8,9,10',
      }
    })
  }

  // 查团队
  handleQueryTeam = () => {
    this.props.dispatch({
      type:'demandForm/queryTeam',
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
    const {rangeDate} = this.state
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
        {formType === 'demandSide' && <DemandSide />}
        {formType === 'receiverSide' && <ReceiverSide />}
      </Fragment>
    )
  }
}
export default Demand