import React from "react"
import { Modal } from "antd"


const Index = props => {
    const { modalVisible, handleModalVisible, localMenu, values } = props;
    console.log(localMenu, values, "11111");
    return (
      <Modal
        title="新增菜单"
        visible={modalVisible}
        onCancel={handleModalVisible}
        onOk={handleModalVisible}
      >
        {
          console.log(props, "props")}
      </Modal>
    )
};

export default Index
