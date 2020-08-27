import React, {memo} from "react";
import { connect } from "dva";
import moment from "moment";
import {Col, DatePicker, Form, Input, Modal, Row, Select} from "antd";
import {isEmpty} from "@/utils/lang";
import { formLayoutItemAddDouble } from "@/utils/constant";
import {BUDGET_TYPE, PROJECT_TYPE} from "@/pages/contractBudget/util/constant";

const FormItem = Form.Item;
const { Option } = Select;
const Index = memo(props => {
  const { dispatch, modalVisible, handleModalVisible,
    values, addLoading, updateLoading, form } = props;
  const handleSubmitForm = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.expectSetTime = fieldsValue.expectSetTime ? fieldsValue.expectSetTime.format('YYYY-MM-DD') : null
      dispatch({
        type: isEmpty(values) ? 'budgetManage/addBudget' : 'budgetManage/update',
        payload: fieldsValue,
      })
    })
  };
  return (
    <Modal
      width={794}
      title={isEmpty(values) ? '新增预算' : '编辑预算'}
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleSubmitForm}
      confirmLoading={addLoading || updateLoading}
    >
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目名称">
              {form.getFieldDecorator('name', {
                rules: [{required: true, message: '请输入项目名称'}],
                initialValue: values && values.name
              })(<Input placeholder="请输入项目名称"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目类型">
              {form.getFieldDecorator('type', {
                rules: [{required: true, message: '请选择项目类型'}],
                initialValue: values && values.type
              })(
                <Select
                  placeholder="请选择项目类型"
                >
                  {
                    PROJECT_TYPE.map(v => (
                      <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="所属集群或板块">
              {form.getFieldDecorator('clusterId', {
                rules: [{required: true, message: '请选择所属集群或板块'}],
                initialValue: values && values.clusterId
              })(<Input placeholder="请选择所属集群或板块"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="需求部门">
              {form.getFieldDecorator('deptId', {
                rules: [{required: true, message: '请选择需求部门'}],
                initialValue: values && values.deptId
              })(<Input disabled={!form.getFieldValue('clusterId')} placeholder="请选择需求部门"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="预计立项时间">
              {form.getFieldDecorator('expectSetTime', {
                rules: [{required: true, message: '请选择预计立项时间'}],
                initialValue: values && values.expectSetTime && moment(values.expectSetTime)
              })(<DatePicker
                format="YYYY-MM-DD"
              />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="预算总金额">
              {form.getFieldDecorator('expectTotalAmount', {
                rules: [{required: true, message: '请输入预算总金额'}],
                initialValue: values && values.expectTotalAmount
              })(<Input placeholder="请输入预算总金额"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="硬件预算金额">
              {form.getFieldDecorator('hardwareExpectAmount', {
                rules: [{required: true, message: '请输入硬件预算金额'}],
                initialValue: values && values.hardwareExpectAmount
              })(<Input placeholder="请输入硬件预算金额"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="软件预算金额">
              {form.getFieldDecorator('softwareExpectAmount', {
                rules: [{required: true, message: '请输入软件预算金额'}],
                initialValue: values && values.softwareExpectAmount
              })(<Input placeholder="请输入软件预算金额"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="承建团队">
              {form.getFieldDecorator('receiveGroupId', {
                rules: [{required: true, message: '请选择承建团队'}],
                initialValue: values && values.receiveGroupId
              })(<Input placeholder="请选择承建团队"/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="预算类型">
              {form.getFieldDecorator('budgetType', {
                rules: [{required: true, message: '请选择预算类型'}],
                initialValue: values && values.budgetType
              })(<Select
                placeholder="请选择项目类型"
              >
                {
                  BUDGET_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
      )
});

export default connect(
  ({ budgetManage, loading }) => ({
    budgetManage,
    addLoading: loading.effects['budgetManage/addBudget'],
    updateLoading: loading.effects['budgetManage/update'],
  })
)(Form.create()(Index))
