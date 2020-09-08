import React, {useState} from "react";
import {Col, Form, Input, message, Modal, Row} from "antd";
import {formLayoutItem, formLayoutItemAddEdit} from "@/utils/constant";
import Editor from "@/components/TinyEditor";
import {isEmpty} from "@/utils/lang";

const FormItem = Form.Item;
const Index = props => {
  const { form, modalVisible, handleModalVisible, onOk } = props;

  // 描述
  const [description, setDescription] = useState( '');

  const handleSubmit = () => {
    form.validateFields((err, val) => {
      if (err) return;
      if (isEmpty(description, true)) {
        message.error("请输入描述");
        return;
      }
      onOk({...val, description, resourceIds: ""}, handleModalVisible(false))
    })
  };

  return (
    <Modal
      width={800}
      title="新增角色"
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleSubmit}
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
              <Editor
                height={300}
                content={description}
                onContentChange={content => setDescription(content)}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
};
export default Form.create()(Index)
