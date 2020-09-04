import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import CustomBtn from '@/components/commonUseModule/customBtn'
import Editor from "@/components/TinyEditor"
import styles from '../index.less'
import { Modal, Form, Select, Input, DatePicker, Col, Row, Table } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const CreateConstract = (props) => {
  const {
    form,
    deptList,
    visibleModal,
    modalTitle,
    recordValue,
    handleViewModal,
    loadingUpdate,
    loadingAdd
  } = props

  const [description, setDescription] = useState(recordValue.description || '');

  const submitAdd = (params) => {
    props.dispatch({
      type: 'constract/addData',
      payload: {
        ...params
      }
    })
  }

  const sumbitEdit = (params) => {
    props.dispatch({
      type: 'constract/updateData',
      payload: {
        ...params
      }
    })
  }

  const handleSubmitForm = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return
      values.description = description
      if (recordValue.id) {
        sumbitEdit(values)
        return
      }
      submitAdd(values)
      console.log(values)
    })
  }

  const payColumns = [
    {
      title: '付款顺序',
      dataIndex: 'payOrder',
      key: 'payOrder',
      width: '80px'
    },
    {
      title: '付款条件',
      dataIndex: 'payCondition',
      key: 'payCondition',
      render: (text, record) => {
        return (
          <Input />
        )
      }
    },
    {
      title: '付款金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      render: (text, record) => {
        return (
          <Input />
        )
      }
    },
    {
      title: '付款金额比例',
      dataIndex: 'payRatio',
      key: 'payRatio',
      render: (text, record) => {
        return (
          <Input />
        )
      }
    },
  ]

  const defaultData = [
    {
      payOrder: '第1笔',
      key: '1'
    }
  ]

  const [data, setData] = useState(defaultData)
  const addLine = () => {
    const len = data.length
    let obj = {
      payOrder: `第${len + 1}笔`,
      key: len.toString()
    }
    const copyArr = JSON.parse(JSON.stringify(data))
    copyArr.push(obj)
    setData(copyArr)
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
              {!_.isEmpty(deptList) && deptList.map(d => (
                <Option key={d.number} value={d.name}>{d.name}</Option>
              ))}
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
            })(<Input addonAfter='元' placeholder="请输入合同成交额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="首次报价金额">
            {form.getFieldDecorator('firstOfferAmount', {
              rules: [{ required: true, message: '请输入首次报价金额' }],
              // initialValue: values && values.name,
            })(<Input addonAfter='元' placeholder="请输入首次报价金额" />)}
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
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="免费维保期">
            {form.getFieldDecorator('headerGroupId', {
              rules: [{ required: true, message: '请输入免费维保期' }],
              // initialValue: values && values.name,
            })(<Input addonAfter='月' />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="维保支付日期">
            {form.getFieldDecorator('signingTime', {
              rules: [{ required: true, message: '请输入维保支付日期' }],
              // initialValue: values && values.name,
            })(<DatePicker placeholder="请输入维保支付日期" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="付款笔数">
            {form.getFieldDecorator('signingTime', {
              rules: [{ required: true, message: '请输入维保支付日期' }],
              // initialValue: values && values.name,
            })(
              <Fragment>
                <div
                  onClick={addLine}
                  className={styles.addBtn}
                >添加</div>
                <div className={styles.customTable}>
                  <Table
                    rowKey={(record, index) => index}
                    columns={payColumns}
                    pagination={false}
                    dataSource={data}
                  />
                </div>
              </Fragment>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="描述">
            <Editor
              editorKey='myContractAdd'
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
    deptList: constract.deptList,
    deptListMap: constract.deptListMap,
    loadingAdd: loading.effects['constract/addData'],
    loadingUpdate: loading.effects['constract/updateData'],
  })
)(Form.create()(CreateConstract))