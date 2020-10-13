import React from "react";
import {Modal} from "antd";
import {isEmpty} from "@/utils/lang";

const Index = props => {
  const { handleModalVisible, values, modalVisible } = props;

  return (
    <Modal
      width={640}
      title={`${isEmpty(values) ? "新增订单" : `编辑${values.id}订单`}`}
      visible={modalVisible}
      onOk={handleModalVisible}
      onCancel={handleModalVisible}
    >
      {`现在是${isEmpty(values) ? "新增页面" : "编辑页面"}`}
    </Modal>
  )
}

export default Index
