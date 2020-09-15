import React, { Component, Fragment } from 'react'
import CustomBtn from '@/components/commonUseModule/customBtn'
import CreateDemand from './components/createModal'
import DemandBoard from './demandBoard/index'
import DemandList from './demandList/index'
// import gzIcon from '@/assets/icon/Button_gz.svg'
import { connect } from 'dva'
import {
  Form,
  Input,
  Select,
  Card,
  Popover,
  Icon,
  Row,
  Col,
  Button,
  DatePicker
} from 'antd'
import _ from 'lodash'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker
@Form.create()
@connect(({ demand }) => ({
  demand
}))
class Demand extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: false,
      modalTitle: '创建需求',
      searchMore: false,
    }
  }

  handleViewModal = (bool, title) => {
    this.setState({
      visibleModal: bool,
      modalTitle: title,
    })
  }

  handleFormMenuClick = (formType) => {
    this.props.dispatch({
      type: 'demand/setData',
      payload: { formType: formType }
    })
  }


  render() {
    const { demand } = this.props
    const { formType } = demand
    const { visibleModal, modalTitle } = this.state
    const createModalProps = {
      visibleModal,
      modalTitle,
      handleViewModal: this.handleViewModal
    }
    return (
      <Fragment>
        {visibleModal && <CreateDemand {...createModalProps} />}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CustomBtn
            onClick={() => this.handleViewModal(true, '创建')}
            type='create'
            title='创建需求'
          />
          <div style={{ display: 'flex' }}>
            <div className={styles.switch}>
              <span
                onClick={() => this.handleFormMenuClick('board')}
                className={
                  formType === 'board'
                    ? styles.switch__left
                    : styles.switch__right
                }
              >看板</span>
              <span
                onClick={() => this.handleFormMenuClick('list')}
                className={
                  formType === 'list'
                    ? styles.switch__left
                    : styles.switch__right
                }
              >列表</span>
            </div>
            <CustomBtn
              onClick={() => this.handleViewModal(true, '创建')}
              type='others'
              title='发起OA审批'
              style={{marginLeft: '16px'}}
            />
            <CustomBtn
              onClick={() => this.handleViewModal(true, '创建')}
              type='others'
              // icon='gzIcon'
              title='我的关注'
              style={{marginLeft: '16px'}}
            />
            
          </div >

        </div>
        {formType === 'list' && <DemandList />}
        {formType === 'board' && <DemandBoard />}
      </Fragment>

    )
  }
}

export default Demand
