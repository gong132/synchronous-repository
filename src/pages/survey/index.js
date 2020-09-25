import React, { useEffect } from 'react'
import { connect } from 'dva'
import {
  Form,
  Radio,
  Input,
  Icon,
  Rate,
  Row,
  Col,
  Button,
  Tooltip
} from 'antd'
import { getParam } from '@/utils/utils'

import styles from './index.less'

const FormItem = Form.Item
const Survey = (props) => {
  const { survey: { surveyInfo }, form } = props
  const {
    experiential,
    integrity,
    opinion,
    performance,
    totalAppraise,
  } = surveyInfo
  console.log(surveyInfo)
  const EVALUATE_ARR = [
    { key: '1', val: '优秀' },
    { key: '2', val: '良好' },
    { key: '3', val: '一般' },
  ]
  const FORM_LAYOUT = {
    labelCol: {
      span: 2
    },
    wrapperCol: {
      span: 8
    }
  }
  const no = getParam('no')
  const t = getParam('t')
  const handleQuery = (demandNumber) => {
    props.dispatch({
      type: 'survey/query',
      payload: {
        demandNumber
      }
    })
  }

  useEffect(() => {
    handleQuery(no)
  }, [])

  const handleAdd = () => {
    if (totalAppraise) {
      window.history.back()
      return true
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return true
      }
      values.totalAppraise = String(values.totalAppraise)
      values.demandNumber = no
      values.demandTitle = t
      console.log(values)
      props.dispatch({
        type: 'survey/add',
        payload: {
          ...values
        }
      }).then(res => {
        if (res) {
          window.history.back()
        }
      })
    })
  }

  return (
    <div className={styles.box}>
      <Row>
        <Col span={12} className={styles.box_header}>
          <span className={styles.box_header_title}>
            满意度调查
            <Tooltip title='需求编号' overlayClassName='tooTipStyle'>
              <span>{no || '1231241'}</span>
            </Tooltip>
          </span>
          <Icon
            onClick={() => window.history.back()}
            className={styles.box_header_btn}
            type='close'
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...FORM_LAYOUT} label='功能完整性'>
            <div className={performance && styles.radioDisabled}>
              {form.getFieldDecorator('integrity', {
                rules: [{ required: true, message: '请评价功能完整性!' }],
                initialValue: integrity ? String(integrity) : '1',
              })(
                <Radio.Group>
                  {EVALUATE_ARR.map(v => (
                    <Radio disabled={integrity} key={v.key} value={v.key}>{v.val}</Radio>
                  ))}
                </Radio.Group>
              )}
            </div>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...FORM_LAYOUT} label='用户体验性'>
            <div className={performance && styles.radioDisabled}>
              {form.getFieldDecorator('experiential', {
                rules: [{ required: true, message: '请评价用户体验性!' }],
                initialValue: experiential ? String(experiential) : '1',
              })(
                <Radio.Group>
                  {EVALUATE_ARR.map(v => (
                    <Radio disabled={experiential} key={v.key} value={v.key}>{v.val}</Radio>
                  ))}
                </Radio.Group>
              )}
            </div>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...FORM_LAYOUT} label='程序性能'>
            <div className={performance && styles.radioDisabled}>
              {form.getFieldDecorator('performance', {
                rules: [{ required: true, message: '请评价程序性能!' }],
                initialValue: performance ? String(performance) : '1',
              })(
                <Radio.Group>
                  {EVALUATE_ARR.map(v => (
                    <Radio disabled={performance} key={v.key} value={v.key}>{v.val}</Radio>
                  ))}
                </Radio.Group>
              )}
            </div>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...FORM_LAYOUT} label='总体评价'>
            <div className={totalAppraise ? styles.rateDisabled : styles.rate}>
              {form.getFieldDecorator('totalAppraise', {
                rules: [{ required: true, message: '请做总体评价!' }],
                initialValue: totalAppraise ? Number(totalAppraise) : 1,
              })(
                <Rate disabled={totalAppraise} />
                // <Rate disabled={totalAppraise} />
              )}
            </div>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: '10' }} label='意见'>

            {form.getFieldDecorator('opinion', {
              rules: [{ required: false, message: '意见!' }],
              initialValue: opinion,
            })(<Input.TextArea disabled rows={5} placeholder="请给出您的意见" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <Button
            onClick={handleAdd}
            style={{ float: 'right' }}
            type='primary'
          >确认
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default connect(({ survey }) => ({
  survey
}))(Form.create()(Survey)) 