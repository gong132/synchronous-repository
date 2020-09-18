import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select } from 'antd';
import { isEmpty } from '@/utils/lang';
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from '@/utils/constant';
import { BUDGET_TYPE, PROJECT_TYPE } from '@/pages/contractBudget/util/constant';

import Editor from '@/components/TinyEditor';
import RadioGroup from 'antd/es/radio/group';
import { toInteger } from '@/utils/helper';

const FormItem = Form.Item;
const { Option } = Select;

const Index = props => {
  const {
    dispatch,
    modalVisible,
    handleModalVisible,
    values,
    addLoading,
    updateLoading,
    form,
    budgetManage: { clusterList, allDeptList, allTeamList, groupByDept },
    handleQueryBudgetData,
  } = props;

  // 描述
  const [description, setDescription] = useState(values.description || '');

  const handleSubmitForm = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (Number(fieldsValue.expectTotalAmount) <= 0) {
        message.error('总金额必须大于0');
        return;
      }
      dispatch({
        type: isEmpty(values) ? 'budgetManage/addBudget' : 'budgetManage/updateBudget',
        payload: {
          id: values.id,
          ...fieldsValue,
          description,
          expectSetTime: fieldsValue.expectSetTime
            ? fieldsValue.expectSetTime.format('YYYY-MM-DD')
            : null,
          clusterName: fieldsValue.clusterId
            ? clusterList.find(v => v.id === fieldsValue.clusterId).name
            : null,
          deptName: fieldsValue.deptId
            ? allDeptList.find(v => v.deptId === fieldsValue.deptId).deptName
            : null,
          receiveGroupName: fieldsValue.receiveGroupId
            ? allTeamList.find(v => v.number === fieldsValue.receiveGroupId).name
            : null,
          hardwareExpectAmount: Number(fieldsValue.hardwareExpectAmount),
          softwareExpectAmount: Number(fieldsValue.softwareExpectAmount),
          otherExpectAmount: Number(fieldsValue.otherExpectAmount),
          expectTotalAmount: Number(fieldsValue.expectTotalAmount),
        },
      }).then(sure => {
        if (!sure) return;
        message.success(isEmpty(values) ? '新增成功' : '修改成功');
        handleModalVisible();
        handleQueryBudgetData();
      });
    });
  };

  const handleQueryDeptList = id => {
    dispatch({
      type: 'budgetManage/queryAllDeptList',
      payload: {
        clusterId: id,
      },
    });
  };
  const handleQueryGroupByDept = id => {
    dispatch({
      type: 'budgetManage/queryGroupByDept',
      payload: {
        deptId: id,
      },
    }).then(data => {
      if (!data) return;
      form.setFieldsValue({ clusterId: data.id });
    });
  };
  useEffect(() => {
    handleQueryDeptList();
  }, []);

  const calculateAmount = (val, id) => {
    let totalAmount = 0;
    let hardwareAmount = form.getFieldValue('hardwareExpectAmount') || 0;
    let softwareAmount = form.getFieldValue('softwareExpectAmount') || 0;
    let otherwareAmount = form.getFieldValue('otherExpectAmount') || 0;

    if (id === 'hardwareExpectAmount') hardwareAmount = (!isEmpty(val, true) && val) || 0;
    if (id === 'softwareExpectAmount') softwareAmount = (!isEmpty(val, true) && val) || 0;
    if (id === 'otherExpectAmount') otherwareAmount = (!isEmpty(val, true) && val) || 0;
    totalAmount = hardwareAmount * 1 + softwareAmount * 1 + otherwareAmount * 1;
    const projectType = form.getFieldValue('type');
    if (id !== 'type' && String(projectType) === '2') {
      totalAmount *= 0.25;
    }
    if (id === 'type' && String(val) === '2') {
      totalAmount *= 0.25;
    }
    form.setFieldsValue({ expectTotalAmount: !totalAmount ? 0 : parseInt(totalAmount, 10) });
  };

  const renderForm = () => (
    <Form>
      <Row>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="预算名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入预算名称' }],
              initialValue: values && values.name,
            })(<Input.TextArea placeholder="请输入预算名称" rows={1} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="项目类型">
            {form.getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择项目类型' }],
              initialValue: values && values.type,
            })(
              <RadioGroup
                onChange={val => calculateAmount(val.target.value, 'type')}
                placeholder="请选择项目类型"
              >
                {PROJECT_TYPE.map(v => (
                  <Radio value={v.key} key={v.key}>
                    {v.value}
                  </Radio>
                ))}
              </RadioGroup>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预算类型">
            {form.getFieldDecorator('budgetType', {
              rules: [{ required: true, message: '请选择预算类型' }],
              initialValue: values && values.budgetType,
            })(
              <RadioGroup placeholder="请选择项目类型">
                {BUDGET_TYPE.map(v => (
                  <Radio value={v.key} key={v.key}>
                    {v.value}
                  </Radio>
                ))}
              </RadioGroup>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预计立项时间">
            {form.getFieldDecorator('expectSetTime', {
              rules: [{ required: true, message: '请选择预计立项时间' }],
              initialValue: values && values.expectSetTime && moment(values.expectSetTime),
            })(<DatePicker format="YYYY-MM-DD" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="需求部门">
            {form.getFieldDecorator('deptId', {
              rules: [{ required: true, message: '请选择需求部门' }],
              initialValue: values && values.deptId,
            })(
              <Select onChange={val => handleQueryGroupByDept(val)} placeholder="请选择需求部门">
                {allDeptList &&
                  allDeptList.map(v => (
                    <Option value={v.deptId} key={v.deptId}>
                      {v.deptName}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="硬件预算金额">
            {form.getFieldDecorator('hardwareExpectAmount', {
              rules: [
                {
                  // required: true,
                  message: '请输入硬件预算金额',
                  transform: value => toInteger(value, 'hardwareExpectAmount', form),
                },
              ],
              initialValue: values && values.hardwareExpectAmount,
            })(
              <Input
                placeholder="请输入硬件预算金额"
                onChange={e => calculateAmount(e.target.value, 'hardwareExpectAmount')}
                onBlur={e => calculateAmount(e.target.value, 'hardwareExpectAmount')}
                addonAfter="万"
              />,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="软件预算金额">
            {form.getFieldDecorator('softwareExpectAmount', {
              rules: [
                {
                  // required: true,
                  message: '请输入软件预算金额',
                  transform: value => toInteger(value, 'softwareExpectAmount', form),
                },
              ],
              initialValue: values && values.softwareExpectAmount,
            })(
              <Input
                onChange={e => calculateAmount(e.target.value, 'softwareExpectAmount')}
                onBlur={e => calculateAmount(e.target.value, 'softwareExpectAmount')}
                placeholder="请输入软件预算金额"
                addonAfter="万"
              />,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="其他预算金额">
            {form.getFieldDecorator('otherExpectAmount', {
              rules: [
                {
                  // required: true,
                  message: '请输入软件预算金额',
                  transform: value => toInteger(value, 'otherExpectAmount', form),
                },
              ],
              initialValue: values && values.otherExpectAmount,
            })(
              <Input
                onChange={e => calculateAmount(e.target.value, 'otherExpectAmount')}
                onBlur={e => calculateAmount(e.target.value, 'otherExpectAmount')}
                placeholder="请输入其他预算金额"
                addonAfter="万"
              />,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="承建团队">
            {form.getFieldDecorator('receiveGroupId', {
              rules: [{ required: true, message: '请选择承建团队' }],
              initialValue: values && values.receiveGroupId,
            })(
              <Select placeholder="请选择承建团队">
                {allTeamList &&
                  allTeamList.map(v => (
                    <Option value={v.number} key={v.number}>
                      {v.name}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="预算总金额">
            {form.getFieldDecorator('expectTotalAmount', {
              rules: [{ required: true, message: '请输入软件预算金额' }],
              initialValue: values.expectTotalAmount,
            })(<Input disabled addonAfter="万" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="所属集群或板块">
            {form.getFieldDecorator('clusterId', {
              // rules: [{required: true, message: '请选择所属集群或板块'}],
              initialValue:
                (!isEmpty(values) && values.clusterId) || (isEmpty(groupByDept) && groupByDept.id),
            })(
              <Select disabled>
                {clusterList &&
                  clusterList.map(v => (
                    <Option value={v.id} key={v.id}>
                      {v.name}
                    </Option>
                  ))}
              </Select>,
            )}
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
  );
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
  );
};

export default connect(({ budgetManage, loading }) => ({
  budgetManage,
  addLoading: loading.effects['budgetManage/addBudget'],
  updateLoading: loading.effects['budgetManage/update'],
}))(Form.create()(Index));
