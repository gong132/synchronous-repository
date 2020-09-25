import React from 'react'
import { Modal, Form, Select } from 'antd'
import { connect } from 'dva'
import CustomBtn from '@/components/commonUseModule/customBtn';

const { Option } = Select

const Appoint = (props) => {
  const {
    visible,
    demandId,
    title,
    demand,
    handleViewModal,
    handleQueryBoard,
    form,
  } = props

  const { userData, userDataMap, userDataMapId } = demand
  console.log(userData)

  // 关注
  const handleFocusDemand = (params) => {
    props.dispatch({
      type: 'demand/focusDemand',
      payload: {
        type: 1,
        demandId: Number(demandId),
        ...params
      }
    }).then(res => {
      if (res) {
        handleViewModal(false)
        handleQueryBoard()
      }
    });
  }

  // 受理
  const handleReceiverDemand = (values) => {
    props.dispatch({
      type: 'demand/receiverDemand',
      payload: {
        ...values
      }
    }).then(res => {
      if (res) {
        handleViewModal(false)
        handleQueryBoard()
      }
    });
  }

  const handleSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return true
      console.log(values)
      if (title === '指派受理人') {
        values.receiverId = values.user
        values.receiverName = userDataMap[values.user]
        values.demandId = demandId
        delete values.user
        handleReceiverDemand(values)
        return true
      }
      console.log(userDataMapId)
      values.userName = userDataMapId[values.user]
      values.userId = values.user
      delete values.user
      handleFocusDemand(values)
    })
  }



  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={() => handleViewModal(false)}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomBtn
            onClick={() => handleViewModal(false)}
            type="cancel"
            style={{ marginRight: '18px' }}
          />
          <CustomBtn
            onClick={handleSubmit}
            type="save"
          />
        </div>
      }
    >
      <Form>
        <Form.Item label={title === '指派受理人' ? '受理人' : '关注人'} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          {form.getFieldDecorator('user', {
            rules: [{ required: true, message: '请输入姓名或工号' }],
            // initialValue: type,
          })(
            <Select
              allowClear
              // showSearch
              placeholder="请输入姓名或工号"
            >
              {userData.map(d => {
                return title === '指派受理人'
                  ? <Option key={d.loginid} value={d.loginid}>
                    {d.lastname}
                  </Option>
                  : <Option key={d.id} value={d.id}>
                    {d.lastname}
                  </Option>
              })}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default connect(({ demand }) => ({
  demand
}))(Form.create()(Appoint)) 