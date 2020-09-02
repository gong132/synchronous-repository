import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import CustomBtn from '@/components/commonUseModule/customBtn'
import Editor from "@/components/TinyEditor"
import { Modal, Form, Select, Input, DatePicker, Col, Row } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const CreateConstract = (props) => {
  const {
    form,
    visibleModal,
    modalTitle,
    recordValue,
    handleViewModal,
    loadingUpdate,
    loadingAdd
  } = props

  const [description, setDescription] = useState(recordValue.description || '');

  const handleSubmitForm = () => {
    form.validateFields((err, values) => {
      if (err) return
      console.log(values)
    })
  }

  const renderForm = () => (
    <Form>
      <Row>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="标题">
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              // initialValue: values && values.name,
            })(<Input placeholder="请输入标题" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预算编号">
            {form.getFieldDecorator('budgetNumber', {
              rules: [{ required: true, message: '请输入预算编号' }],
              // initialValue: values && values.name,
            })(<Input placeholder="请输入预算编号" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属项目">
            {form.getFieldDecorator('projectNumber', {
              rules: [{ required: true, message: '请输入所属项目' }],
              // initialValue: values && values.name,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入所属项目"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属部门">
            {form.getFieldDecorator('deptId', {
              rules: [{ required: true, message: '请输入所属部门' }],
              // initialValue: values && values.name,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入所属部门"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属系统">
            {form.getFieldDecorator('systemId', {
              rules: [{ required: true, message: '请输入所属系统' }],
              // initialValue: values && values.name,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入所属系统"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同成交额">
            {form.getFieldDecorator('transactionAmount', {
              rules: [{ required: true, message: '请输入合同成交额' }],
              // initialValue: values && values.name,
            })(<Input placeholder="请输入合同成交额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="首次报价金额">
            {form.getFieldDecorator('firstOfferAmount', {
              rules: [{ required: true, message: '请输入首次报价金额' }],
              // initialValue: values && values.name,
            })(<Input placeholder="请输入首次报价金额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同签订时间">
            {form.getFieldDecorator('signingTime', {
              rules: [{ required: true, message: '请输入合同签订时间' }],
              // initialValue: values && values.name,
            })(<DatePicker placeholder="请输入首次报价金额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="供应商">
            {form.getFieldDecorator('providerCompanyId', {
              rules: [{ required: true, message: '请输入供应商' }],
              // initialValue: values && values.name,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入供应商"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同已支付金额">
            {form.getFieldDecorator('payAmount', {
              rules: [{ required: true, message: '请输入合同已支付金额' }],
              // initialValue: values && values.name,
            })(<Input placeholder="请输入合同已支付金额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同待支付金额">
            {form.getFieldDecorator('notPayAmount', {
              rules: [{ required: true, message: '请输入合同待支付金额' }],
              // initialValue: values && values.name,
            })(<Input placeholder="请输入合同待支付金额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同负责人">
            {form.getFieldDecorator('headerId', {
              rules: [{ required: true, message: '请输入合同负责人' }],
              // initialValue: values && values.name,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入合同负责人"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同负责人团队">
            {form.getFieldDecorator('headerGroupId', {
              rules: [{ required: true, message: '请输入合同负责人团队' }],
              // initialValue: values && values.name,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入合同负责人团队"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="描述">
            <Editor
              height={300}
              content={description}
              onContentChange={content => setDescription(content)}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Modal
      width={794}
      title={`${modalTitle}合同`}
      visible={visibleModal}
      onCancel={() => handleViewModal(false)}
      confirmLoading={loadingAdd || loadingUpdate}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomBtn
            onClick={() => handleViewModal(false)}
            type='cancel'
            style={{ marginRight: '18px' }}
          />
          <CustomBtn
            onClick={handleSubmitForm}
            type='save' />
        </div>}
    >
      {renderForm()}
    </Modal>
  )
}

export default connect(
  ({ constract, loading }) => ({
    constract,
    loadingAdd: loading.effects['constract/addData'],
    loadingUpdate: loading.effects['constract/updateData'],
  })
)(Form.create()(CreateConstract))