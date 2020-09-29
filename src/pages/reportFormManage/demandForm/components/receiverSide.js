import React, { PureComponent, Fragment } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import { connect } from 'dva'
import {
  Row,
  Col,
} from 'antd'

@connect(({ demandForm }) => ({
  demandForm
}))
class Receiver extends PureComponent {

  render() {
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
            <GlobalSandBox
              title='所属系统'
            >
              图
            </GlobalSandBox>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export default Receiver