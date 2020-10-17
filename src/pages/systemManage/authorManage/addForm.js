import React, {useState} from "react";
import {Col, Form, Input, Modal, Row} from "antd";
import { formLayoutItemAddEdit } from "@/utils/constant";
import Editor from "@/components/TinyEditor";
// import {isEmpty} from "@/utils/lang";

const FormItem = Form.Item;
const Index = props => {
  const { form, modalVisible, handleModalVisible, onOk } = props;

  const handleSubmit = () => {
    form.validateFields((err, val) => {
      if (err) return;
      // if (isEmpty(description, true)) {
      //   message.error("请输入描述");
      //   return;
      // }
      onOk({...val, resourceIds: ""}, handleModalVisible(false))
    })
  };

  return (
    <Modal
      width={800}
      title="新增角色"
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleSubmit}
      okText="保存"
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="角色名称">
              {
                form.getFieldDecorator('roleName', {
                  rules: [{ required: true, message: "请输入角色名称"}],
                })(<Input placeholder="请输入角色名称"/>)
              }
            </FormItem>
            <FormItem {...formLayoutItemAddEdit} label="角色描述">
              {
                form.getFieldDecorator('description', {
                })(<Input.TextArea placeholder="请输入角色描述" rows={5} cols={6}/>)
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
};
export default Form.create()(Index)
