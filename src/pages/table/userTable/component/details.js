import React from "react";
import {Modal} from "antd";

const Index = props => {
  const { handleModalVisible, values, modalVisible } = props;
  console.log(values, 'details')
  return (
    <Modal
      width={640}
      title={`${values.id}订单详情`}
      visible={modalVisible}
      onOk={handleModalVisible}
      onCancel={handleModalVisible}
    >
      详情
    </Modal>
  )
}

export default Index
