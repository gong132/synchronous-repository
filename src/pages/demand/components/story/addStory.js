import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from "moment";
import { Modal, Form, Row, Col, Input, Select, DatePicker, Button, message } from 'antd';
import { isEmpty } from '@/utils/lang';
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from '@/utils/constant';
import { STORY_PRIORITY, STORY_TYPE } from '@/pages/demand/util/constant';
import TinyEditor from '@/components/TinyEditor';
import FileUpload from '@/components/FileUpload';

import styles from '../../index.less';
import { PagerHelper } from '@/utils/helper';

const FormItem = Form.Item;
const { Option } = Select;
const Index = props => {
  const {
    dispatch,
    form,
    values,
    type,
    modalVisible,
    handleModalVisible,
    handleQueryStoryList,
    demand: { systemList, userList },
  } = props;

  const [description, setDescription] = useState(values?.description || "");

  const handleQuerySystemList = () => {
    dispatch({
      type: 'demand/querySystemList',
      payload: {},
    });
  };

  const handleQueryUserList = () => {
    dispatch({
      type: 'demand/queryUserList',
      payload: {
        ...PagerHelper.MaxPage,
      },
    });
  };

  const handleOk = () => {
    form.validateFields((err, val) => {
      if (err) return;
      if (isEmpty(description, true)) {
        message.error('描述不能为空');
        return;
      }
      const params = {
        id: values.id,
        ...val,
        demandNumber: values.demandNumber,
        assigneeName: isEmpty(val.assignee)
          ? null
          : userList.find(v => v.loginid === val.assignee).lastname,
        assessorName: isEmpty(val.assessor)
          ? null
          : userList.find(v => v.loginid === val.assessor).lastname,
        description,
        evaluateTime: isEmpty(val.evaluateTime) ? null : val.evaluateTime.format('YYYY-MM-DD'),
        systemName: isEmpty(val.systemId)
          ? null
          : systemList.find(v => v.systemId === val.systemId).systemName,
      };

      type === 'add' && delete params.id;
      dispatch({
        type: params.id ? 'demand/updateStory' : 'demand/addStory',
        payload: {
          ...params,
        },
      }).then(sure => {
        if (!sure) return;
        message.success(values.id && type !== 'add' ? '修改成功' : '新增成功');
        handleModalVisible();
        handleQueryStoryList && handleQueryStoryList();
      });
    });
  };

  useEffect(() => {
    handleQuerySystemList();
    handleQueryUserList();
  }, []);

  return (
    <Modal
      width={800}
      title={isEmpty(values) || type === 'add' ? '新建story' : '编辑story'}
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleOk}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="story标题">
              {form.getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入story标题' }],
                initialValue: values?.title,
              })(<Input.TextArea allowClear cols={1} rows={1} placeholder="请输入story标题" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="优先级">
              {form.getFieldDecorator('priority', {
                rules: [{ required: true, message: '请选择优先级' }],
                initialValue: values?.priority,
              })(
                <Select allowClear placeholder="请选择优先级">
                  {STORY_PRIORITY.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="经办人">
              {form.getFieldDecorator('assignee', {
                rules: [{ required: true, message: '请选择经办人' }],
                initialValue: values?.assignee,
              })(
                <Select allowClear>
                  {userList &&
                    userList.map(v => (
                      <Option value={v.loginid} key={v.loginid.toString()}>
                        {v.lastname}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="评估人">
              {form.getFieldDecorator('assessor', {
                rules: [{ required: true, message: '请选择评估人' }],
                initialValue: values?.assessor,
              })(
                <Select allowClear>
                  {userList &&
                    userList.map(v => (
                      <Option value={v.loginid} key={v.loginid.toString()}>
                        {v.lastname}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="所属系统">
              {form.getFieldDecorator('systemId', {
                rules: [{ required: true, message: '请选择所属系统' }],
                initialValue: values?.systemId,
              })(
                <Select allowClear>
                  {systemList &&
                    systemList.map(v => (
                      <Option value={v.systemId} key={v.systemId}>
                        {v.systemName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="所属需求">
              {form.getFieldDecorator('demandName', {
                // rules: [{ required: true, message: "请选择所属需求" }],
                initialValue: values?.demandName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="story类型">
              {form.getFieldDecorator('type', {
                // rules: [{ required: true, message: "请选择story类型" }],
                initialValue: values?.type,
              })(
                <Select allowClear placeholder="请选择story类型">
                  {STORY_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="计划上线日期">
              {form.getFieldDecorator('evaluateTime', {
                // rules: [{ required: true, message: "请选择计划上线日期" }],
                initialValue: values?.evaluateTime && moment(values?.evaluateTime),
              })(<DatePicker allowClear format="YYYY-MM-DD" placeholder="请选择计划上线日期" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="开发预计工作量">
              {form.getFieldDecorator('developWorkload', {
                // rules: [{ required: true, message: "请输入开发工作量" }],
                initialValue: values?.developWorkload,
              })(<Input allowClear placeholder="请输入开发工作量" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="测试预计工作量">
              {form.getFieldDecorator('testWorkload', {
                // rules: [{ required: true, message: "请输入测试工作量" }],
                initialValue: values?.testWorkload,
              })(<Input allowClear placeholder="请输入测试工作量" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              {...formLayoutItemAddEdit}
              label={<span className={styles.desc_require}>项目描述</span>}
            >
              <TinyEditor
                height={250}
                content={description}
                onContentChange={val => setDescription(val)}
              />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="上传附件">
              <FileUpload>
                <Button type="primary">上传</Button>
                <span style={{ fontSize: 12, color: '#69707F', marginLeft: 6 }}>
                  文件大小限制在20M之内
                </span>
              </FileUpload>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default connect(({ demand }) => ({
  demand,
}))(Form.create()(Index));
