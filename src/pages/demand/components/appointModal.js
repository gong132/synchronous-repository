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

  // 关注
  const handleFocusDemand = (params) => {
    props.dispatch({
      type: 'demand/assignUser',
      payload: {
        attentionType: 1,
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

  // 指派受理人
  const handleReceiverDemand = (values) => {
    props.dispatch({
      type: 'demand/receiverAppointDemand',
      payload: {
        ...values,
        acceptType: 3
      }
    }).then(res => {
      if (res) {
        handleViewModal(false)
        handleQueryBoard()
      }
    });
  }

  const handleQueryUser = userName => {
    props.dispatch({
      type: 'demand/fetchUserData',
      payload: {
        userName,
      },
    });
  };

  const handleSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return true
      if (title === '指派受理人') {
        values.receiverId = values.user
        values.receiverName = userDataMap[values.user]
        values.demandId = demandId
        delete values.user
        handleReceiverDemand(values)
        return true
      }
      values.receiverName = userDataMap[values.user]
      values.receiverId = values.user
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
              showSearch
              optionFilterProp="children"
              onSearch={_.debounce(handleQueryUser, 500)}
              filterOption={(input, option) =>
                JSON.stringify(option.props.children)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              placeholder="请输入姓名或工号"
            >
              {userData.map(d => {
                return <Option key={d.userId} value={d.userId}>
                  {d.userName}
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
