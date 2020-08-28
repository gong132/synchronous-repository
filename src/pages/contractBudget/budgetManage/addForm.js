import React, {memo, useEffect, useState} from "react";
import { connect } from "dva";
import moment from "moment";
import {Col, DatePicker, Form, Input, message, Modal, Row, Select} from "antd";
import {isEmpty} from "@/utils/lang";
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import {BUDGET_TYPE, PROJECT_TYPE} from "@/pages/contractBudget/util/constant";

import Editor from "@/components/TinyEditor"

const FormItem = Form.Item;
const { Option } = Select;

const Index = props => {
  const { dispatch, modalVisible, handleModalVisible,
    values, addLoading, updateLoading, form,
    budgetManage: { clusterList, deptList, groupList },
    handleQueryBudgetData,
  } = props;

  // 描述
  const [description, setDescription] = useState(values.description || '');

  const handleSubmitForm = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.expectSetTime = fieldsValue.expectSetTime ? fieldsValue.expectSetTime.format('YYYY-MM-DD') : null;
      fieldsValue.clusterName = fieldsValue.clusterId ? clusterList.find(v => v.id === fieldsValue.clusterId).name : null;
      fieldsValue.deptName = fieldsValue.deptId ? deptList.find(v => v.deptId === fieldsValue.deptId).deptName : null;
      fieldsValue.receiveGroupName = fieldsValue.receiveGroupId ? groupList.find(v => v.number === fieldsValue.receiveGroupId).name : null;
      dispatch({
        type: isEmpty(values) ? 'budgetManage/addBudget' : 'budgetManage/updateBudget',
        payload: {
          id: values.id,
          ...fieldsValue,
          description: description,
        },
      }).then(sure => {
        if (!sure) return;
        message.success(isEmpty(values) ? '新增成功' : '修改成功')
        handleModalVisible();
        handleQueryBudgetData()
      })
    })
  };

  const handleQueryDeptList = id => {
    dispatch({
      type: 'budgetManage/queryDeptList',
      payload: {
        clusterId: id,
      }
    })
  };
  useEffect(() => {
    if (values.clusterId) {
      handleQueryDeptList(values.clusterId)
    }
  }, []);

  const renderForm = () => (
    <Form>
      <Row>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="项目名称">
            {form.getFieldDecorator('name', {
              rules: [{required: true, message: '请输入项目名称'}],
              initialValue: values && values.name,
            })(<Input placeholder="请输入项目名称"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="项目类型">
            {form.getFieldDecorator('type', {
              rules: [{required: true, message: '请选择项目类型'}],
              initialValue: values && values.type,
            })(
              <Select
                placeholder="请选择项目类型"
              >
                {
                  PROJECT_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属集群或板块">
            {form.getFieldDecorator('clusterId', {
              rules: [{required: true, message: '请选择所属集群或板块'}],
              initialValue: values && values.clusterId,
            })(<Select
              placeholder="请选择所属集群或板块"
              onChange={clusterId => handleQueryDeptList(clusterId)}
            >
              {
                clusterList&& clusterList.map(v => (
                  <Option value={v.id} key={v.id}>{v.name}</Option>
                ))
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="需求部门">
            {form.getFieldDecorator('deptId', {
              rules: [{required: true, message: '请选择需求部门'}],
              initialValue: values && values.deptId,
            })(<Select
              placeholder="请选择需求部门"
            >
              {
                deptList&& deptList.map(v => (
                  <Option value={v.deptId} key={v.deptId}>{v.deptName}</Option>
                ))
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预计立项时间">
            {form.getFieldDecorator('expectSetTime', {
              rules: [{required: true, message: '请选择预计立项时间'}],
              initialValue: values && values.expectSetTime && moment(values.expectSetTime),
            })(<DatePicker
              format="YYYY-MM-DD"
            />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="硬件预算金额">
            {form.getFieldDecorator('hardwareExpectAmount', {
              rules: [{required: true, message: '请输入硬件预算金额'}],
              initialValue: values && values.hardwareExpectAmount,
            })(<Input placeholder="请输入硬件预算金额"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="软件预算金额">
            {form.getFieldDecorator('softwareExpectAmount', {
              rules: [{required: true, message: '请输入软件预算金额'}],
              initialValue: values && values.softwareExpectAmount,
            })(<Input placeholder="请输入软件预算金额"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="承建团队">
            {form.getFieldDecorator('receiveGroupId', {
              rules: [{required: true, message: '请选择承建团队'}],
              initialValue: values && values.receiveGroupId,
            })(<Select
              placeholder="请选择承建团队"
            >
              {
                groupList && groupList.map(v => (
                  <Option value={v.number} key={v.number}>{v.name}</Option>
                ))
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预算类型">
            {form.getFieldDecorator('budgetType', {
              rules: [{required: true, message: '请选择预算类型'}],
              initialValue: values && values.budgetType,
            })(<Select
              placeholder="请选择项目类型"
            >
              {
                BUDGET_TYPE.map(v => (
                  <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                ))
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="描述">
            <Editor
              height={300}
              content={description}
              onContentChange={content => setDescription(content)}
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
  return (
    <Modal
      width={794}
      title={isEmpty(values) ? '新增预算' : '编辑预算'}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      onOk={handleSubmitForm}
      confirmLoading={addLoading || updateLoading}
    >
      {renderForm()}
    </Modal>
  )
};

export default connect(
  ({ budgetManage, loading }) => ({
    budgetManage,
    addLoading: loading.effects['budgetManage/addBudget'],
    updateLoading: loading.effects['budgetManage/update'],
  })
)(Form.create()(Index))
