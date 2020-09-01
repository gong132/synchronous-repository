import React, {Component, Fragment} from 'react'
import CustomBtn from '@/components/commonUseModule/customBtn'
import {connect} from 'dva'
import styles from './index.less'
import {
  Card,
  Table,
  Row,
  Col,
  Icon
} from 'antd'
class AuthorManage extends Component {
  constructor(props) {
    super(props);
    this.state={
    }
  }

  render() {
    return (
      <Fragment>
         <CustomBtn
          onClick={() => this.handleViewModal(true, '新建')}
          type='create' />
        <Card>
          <Row>
            <Col span={10}>
              <h4>选择角色</h4>
            </Col>
            <Col span={14}>
              <div className={styles.rightTitle}>
                <div className={styles.rightTitle_roleName}>角色1</div>
                <h4>选择功能</h4>
                <Icon type="plus-square" />
                <Icon type="minus-square" />
              </div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}

export default AuthorManage