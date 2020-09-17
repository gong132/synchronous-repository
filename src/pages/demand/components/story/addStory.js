import React, {useState} from "react";
import { Modal, Form, Row, Col, Input, Select, DatePicker } from "antd";
import { isEmpty } from "@/utils/lang";
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import {STORY_PRIORITY, STORY_TYPE} from "@/pages/demand/util/constant";
import TinyEditor from "@/components/TinyEditor"

const FormItem = Form.Item;
const { Option } = Select;
const Index = props => {
  const { form, values, modalVisible, handleModalVisible } = props;

  const [description, setDescription] = useState("")
  return (
    <Modal
      width={800}
      title={isEmpty(values) ? "新建story" : "编辑story"}
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleModalVisible}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="story标题">
              {form.getFieldDecorator("title", {
                rules: [{ required: true, message: "请输入story标题" }],
              })(
                <Input.TextArea allowClear cols={1} rows={1} placeholder="请输入story标题" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="所属需求">
              {form.getFieldDecorator("demandName", {
                rules: [{ required: true, message: "请选择所属需求" }],
                initialValue: values && values.title
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="经办人">
              {form.getFieldDecorator("assignee", {
                rules: [{ required: true, message: "请选择经办人" }],
                initialValue: "1",
              })(
                <Select
                  allowClear
                >
                  <Option value="1">admin</Option>
                  <Option value="2">root</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="story类型">
              {form.getFieldDecorator("type", {
                rules: [{ required: true, message: "请选择story类型" }],
              })(
                <Select
                  allowClear
                  placeholder="请选择story类型"
                >
                  {
                    STORY_TYPE.map(v => (
                      <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="优先级">
              {form.getFieldDecorator("priority", {
                rules: [{ required: true, message: "请选择优先级" }],
              })(
                <Select
                  allowClear
                  placeholder="请选择story类型"
                >
                  {
                    STORY_PRIORITY.map(v => (
                      <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="计划上线日期">
              {form.getFieldDecorator("evaluateTime", {
                rules: [{ required: true, message: "请选择计划上线日期" }],
              })(
                <DatePicker
                  allowClear
                  format="YYYY-MM-DD"
                  placeholder="请选择计划上线日期"
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="开发工作量">
              {form.getFieldDecorator("id", {
                rules: [{ required: true, message: "请输入开发工作量" }],
              })(
                <Input allowClear placeholder="请输入开发工作量" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="测试工作量">
              {form.getFieldDecorator("id", {
                rules: [{ required: true, message: "请输入测试工作量" }],
              })(
                <Input allowClear placeholder="请输入测试工作量" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="项目描述">
              <TinyEditor
                height={250}
                content={description}
                onContentChange={val => setDescription(val)}
              />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="上传附件">
              {form.getFieldDecorator("id", {
                rules: [{ required: true, message: "请输入评估工作量" }],
              })(
                <Input cols={1} rows={1} placeholder="请输入评估工作量" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default Form.create()(Index)
