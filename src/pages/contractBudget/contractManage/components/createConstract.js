import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import numeral from 'numeral'
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import CustomBtn from '@/components/commonUseModule/customBtn'
import Editor from "@/components/TinyEditor"
import UploadFile from '@/components/FileUpload'
import styles from '../index.less'
import { Modal, Form, Select, Input, DatePicker, Col, Row, Table, message, Upload, Button } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const CreateConstract = (props) => {
  const {
    form,
    deptList,
    deptListMap,
    projectList,
    projectMap,
    systemList,
    systemMap,
    supplierList,
    supplierMap,
    headerList,
    headerMap,
    groupMap,
    visibleModal,
    modalTitle,
    recordValue,
    handleViewModal,
    handleQueryData,
    loadingUpdate,
    loadingAdd
  } = props

  console.log(recordValue)
  const [description, setDescription] = useState('');
  const [urls, setUrls] = useState('')
  useEffect(() => {
    setDescription(recordValue.description)
  }, [recordValue.description])
  const {
    name,
    budgetNumber,
    projectNumber,
    systemId,
    deptId,
    firstOfferAmount,
    transactionAmount,
    providerCompanyId,
    signingTime,
    headerId,
    headerGroupId,
    payRecords,
  } = recordValue

  const submitAdd = (params) => {
    props.dispatch({
      type: 'constract/addData',
      payload: {
        ...params
      }
    }).then(res => {
      if (res) {
        handleViewModal(false)
        handleQueryData()
      }
    })
  }

  const sumbitEdit = (params) => {
    props.dispatch({
      type: 'constract/updateData',
      payload: {
        ...params
      }
    }).then(res => {
      if (res) {
        handleViewModal(false)
        handleQueryData()
      }
    })
  }

  const handleSaveFileUrl = (arrUrl) => {
    setUrls(arrUrl)
  }

  const defaultData = [
    // {
    //   payOrder: '第1笔',
    //   key: '1'
    // }
  ]

  const [data, setData] = useState(defaultData)
  useEffect(() => {
    if (payRecords) {
      setData(payRecords)
    }
  }, [JSON.stringify(payRecords)])
  const [calcMoney, setCalcMoney] = useState(0)
  const changeTotalMoney = (e) => {
    console.log(e.target.value)
    const money = Number(e.target.value.replace(/,/g, ''))
    // 如果修改了总金额，要将table中所有的金额再计算一遍
    const copyArr = JSON.parse(JSON.stringify(data))
    copyArr.map(v => {
      if (_.isEmpty(v.payProportion)) return
      const n = Number(v.payProportion)
      console.log(n, money)

      v.payAmount = money * n / 100
    })
    setData(copyArr)
  }
  const handleChangeColumns = (e) => {
    let copyArr = JSON.parse(JSON.stringify(data))
    if (!/[0-9]/.test(Number(e.target.value))) return
    const count = Number(e.target.value)
    const arr = []
    new Array(count).fill('').map((v, i) => {
      const obj = {
        paySequence: `第${i + 1}笔`,
        key: (i + 1).toString()
      }
      arr.push(obj)
    })
    if (arr.length === 0) return
    if (copyArr.length > arr.length) {
      copyArr = copyArr.splice(0, arr.length)
    } else if (copyArr.length < arr.length) {
      const sArr = arr.splice(copyArr.length)
      copyArr = copyArr.concat(sArr)
    }
    setData(copyArr)
  }

  const saveTableValue = (e, type, record) => {
    let val = e.target.value
    const copyData = JSON.parse(JSON.stringify(data))
    const i = _.findIndex(data, d => d.key === record.key)
    if (type === 'payProportion') {
      console.log(val)
      val = val.replace(/\D/, '')
      const totalMoney = form.getFieldValue('transactionAmount') && form.getFieldValue('transactionAmount').replace(/,/g, '')
      console.log(totalMoney, 'totalMoney')
      if (totalMoney * 1 > 1) {
        const resMoney = totalMoney * val / 100
        copyData[i].payAmount = resMoney
      }
    }
    // 控制付款比例输入
    copyData[i][type] = val
    setData(copyData)
  }

  const payColumns = [
    {
      title: '付款顺序',
      dataIndex: 'paySequence',
      key: 'paySequence',
      width: '80px'
    },
    {
      title: '付款条件',
      dataIndex: 'payCondition',
      key: 'payCondition',
      render: (text, record) => {
        return (
          <Input
            onChange={(e) => saveTableValue(e, 'payCondition', record)}
            placeholder='请输入付款条件'
          />
        )
      }
    },
    {
      title: '付款金额比例',
      dataIndex: 'payProportion',
      key: 'payProportion',
      render: (text, record) => {
        console.log(record)
        return (
          <Input
            value={text}
            addonAfter='%'
            placeholder="请输入付款比例"
            onChange={(e) => saveTableValue(e, 'payProportion', record)}
          />
        )
      }
    },
    {
      title: '付款金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      render: (text, record) => {
        console.log(record, 'record')
        return (
          <Input value={text} disabled />
        )
      }
    },
  ]

  // 格式化输入金额
  const formatMoney = value => {
    if (!Boolean(value)) return

    return numeral(value).format('0,0')
  }

  // 格式化整数
  const formatCount = (value) => {
    return numeral(value).format()
  }

  const handleSubmitForm = () => {
    console.log(data)
    let bool = false
    form.validateFieldsAndScroll((err, values) => {
      if (err) return
      data.map(v => {
        if (!v) return
        if (bool) return
        if (!v.payCondition || !v.payCondition.replace(' ', '')) {
          message.error('请输入付款条件')
          bool = true
          return
        }
        if (!v.payProportion || !v.payProportion.replace(' ', '')) {
          message.error('请输入付款比例')
          bool = true
          return
        }
      })
      if (description.length < 1) {
        message.error('请补全合同描述！')
        return
      }
      if (bool) return
      values.projectName = projectMap[values.projectNaId]
      values.systemName = systemMap[values.systemId]
      values.deptName = deptListMap[values.deptId]
      values.providerCompanyName = supplierMap[values.supplierMap]
      values.headerName = headerMap[values.headerId]
      values.headerGroupName = groupMap[values.headerGroupId]
      values.signingTime = moment(values.signingTime).format('YYYY-MM-DD')
      values.description = description
      values.payRecords = data
      if (recordValue.id) {
        values.id = recordValue.id
        sumbitEdit(values)
        return
      }
      submitAdd(values)
      console.log(values)
    })
  }

  const renderForm = () => (
    <Form>
      <Row>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="标题">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: name,
            })(<Input placeholder="请输入标题" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预算编号">
            {form.getFieldDecorator('budgetNumber', {
              rules: [{ required: true, message: '请输入预算编号' }],
              initialValue: budgetNumber,
            })(<Select
              placeholder="请输入预算编号"
            >
              <Option key={1} value={1}>自定义</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属项目">
            {form.getFieldDecorator('projectNumber', {
              rules: [{ required: true, message: '请输入所属项目' }],
              initialValue: projectNumber,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入所属项目"
            >
               {!_.isEmpty(projectList) && projectList.map(d => (
                <Option key={d.number} value={d.name}>{d.name}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属部门">
            {form.getFieldDecorator('deptId', {
              rules: [{ required: true, message: '请输入所属部门' }],
              initialValue: deptId,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入所属部门"
            >
              {!_.isEmpty(deptList) && deptList.map(d => (
                <Option key={d.deptId} value={d.deptId}>{d.deptName}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属系统">
            {form.getFieldDecorator('systemId', {
              rules: [{ required: true, message: '请输入所属系统' }],
              initialValue: systemId,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入所属系统"
            >
              {!_.isEmpty(systemList) && systemList.map(d => (
                <Option key={d.systemId} value={d.systemId}>{d.systemName}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同成交额">
            {form.getFieldDecorator('transactionAmount', {
              rules: [{
                required: true,
                message: '请输入合同成交额',
                pattern: /^[0-9]+$|,/g,
                whitespace: true
              }],
              normalize: formatMoney,
              initialValue: transactionAmount,
            })(<Input
              onChange={changeTotalMoney}
              addonAfter='元'
              placeholder="请输入合同成交额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="首次报价金额">
            {form.getFieldDecorator('firstOfferAmount', {
              rules: [{
                required: true,
                message: '请输入首次报价金额',
                pattern: /^[0-9]+$|,/g,
                whitespace: true
              }],
              normalize: formatMoney,
              initialValue: firstOfferAmount,
            })(<Input addonAfter='元' placeholder="请输入首次报价金额" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同签订时间">
            {form.getFieldDecorator('signingTime', {
              rules: [{ required: true, message: '请输入合同签订时间' }],
              initialValue: signingTime ? moment(signingTime) : null,
            })(<DatePicker placeholder="请输入合同签订时间" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="供应商">
            {form.getFieldDecorator('providerCompanyId', {
              rules: [{ required: true, message: '请输入供应商' }],
              initialValue: providerCompanyId,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入供应商"
            >
              {!_.isEmpty(supplierList) && supplierList.map(d => (
                <Option key={d.supplierId} value={d.supplierId}>{d.supplierName}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同负责人">
            {form.getFieldDecorator('headerId', {
              rules: [{ required: true, message: '请输入合同负责人' }],
              initialValue: headerId,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入合同负责人"
            >
              {!_.isEmpty(headerList) && headerList.map(d => (
                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="合同负责人团队">
            {form.getFieldDecorator('headerGroupId', {
              rules: [{ required: true, message: '请输入合同负责人团队' }],
              initialValue: headerGroupId,
            })(<Select
              allowClear
              // showSearch
              placeholder="请输入合同负责人团队"
            >
              {!_.isEmpty(headerList) && headerList.map(d => (
                <Option key={d.number} value={d.number}>{d.name}</Option>
              ))}
            </Select>)}
          </FormItem>
        </Col>
        {/* <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="免费维保期">
            {form.getFieldDecorator('headerGroupId', {
              rules: [{ required: true, message: '请输入免费维保期' }],
              // initialValue: values && values.name,
            })(<Input placeholder='请输入免费维保期' addonAfter='月' />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="维保支付日期">
            {form.getFieldDecorator('signingTime', {
              rules: [{ required: true, message: '请输入维保支付日期' }],
              // initialValue: values && values.name,
            })(<DatePicker placeholder="请输入维保支付日期" />)}
          </FormItem>
        </Col> */}
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="付款笔数">
            {form.getFieldDecorator('count', {
              rules: [{
                required: true,
                message: '请输入付款笔数',
                pattern: /^[0-9]+$/
              }],
              normalize: formatCount,
              initialValue: data.length,
            })(
              <Input
                onChange={e => handleChangeColumns(e)}
                addonAfter='笔'
                placeholder='请输入付款笔数' />
            )}
          </FormItem>
        </Col>
        {!_.isEmpty(data) && <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label=" " colon={false}>
            <div className={styles.customTable}>
              <Table
                rowKey={(record, index) => index}
                columns={payColumns}
                pagination={false}
                dataSource={data}
              />
            </div>
          </FormItem>
        </Col>}
        <Col span={24}>
          <FormItem
            {...formLayoutItemAddEdit}
            label='合同描述'
            required={true}
          >
            <Editor
              editorKey='myContractAdd'
              height={300}
              content={description}
              onContentChange={content => setDescription(content)}
            />
          </FormItem>
        </Col>
        {/* <Col span={24}>
          <FormItem
            {...formLayoutItemAddEdit}
            label='上传附件'
          >
            <UploadFile
              uploadType='2'
              urls={urls}
              handleSaveFileUrl={handleSaveFileUrl}
            >
              <Button>上传</Button>
            </UploadFile>
          </FormItem>
        </Col> */}
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
            loading={modalTitle === '编辑' ? loadingUpdate : loadingAdd}
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
    projectList: constract.projectList,
    projectMap: constract.projectMap,
    systemList: constract.systemList,
    systemMap: constract.systemMap,
    supplierList: constract.supplierList,
    supplierMap: constract.supplierMap,
    headerList: constract.headerList,
    headerMap: constract.headerMap,
    groupMap: constract.groupMap,
    deptList: constract.deptList,
    deptListMap: constract.deptListMap,
    loadingAdd: loading.effects['constract/addData'],
    loadingUpdate: loading.effects['constract/updateData'],
  })
)(Form.create()(CreateConstract))