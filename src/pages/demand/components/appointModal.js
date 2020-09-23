import React from 'react'
import { Modal, Form, Select } from 'antd'
import { connect } from 'dva'
import CustomBtn from '@/components/commonUseModule/customBtn';

const { Option } = Select

const Appoint = (props) => {
  const {
    visible,
    demandId,
    handleViewModal,
    handleQueryBoard,
    form,
  } = props

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

  const handleSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return true
      console.log(values)
      handleFocusDemand(values)
    })
  }

  

  return (
    <Modal
      title='指派关注人'
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
        <Form.Item label='关注人' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入姓名或工号' }],
            // initialValue: type,
          })(
            <Select
              allowClear
              // showSearch
              placeholder="请输入姓名或工号"
            >
              {/* {DEMAND_TYPE_ARR.map(d => (
                <Option key={d.key} value={d.key}>
                  {d.val}
                </Option>
              ))} */}
              <Option key='1' value='1'>暂无数据</Option>
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