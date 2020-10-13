import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from "moment";
import { Modal, Form, Row, Col, Input, Select, DatePicker, Button, message } from 'antd';
import { isEmpty } from '@/utils/lang';
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from '@/utils/constant';
import { STORY_PRIORITY, STORY_TYPE } from '@/pages/demand/util/constant';
import TinyEditor from '@/components/TinyEditor';
import FileUpload from '@/components/FileUpload';

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
    demand: { systemList, userList, storyDetails },
  } = props;

  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState('')

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

  const handleQueryStoryDetails = () => {
    dispatch({
      type: "demand/queryStoryDetails",
      payload: {
        storyId: values?.id,
      },
    }).then(data => {
      if (data) {
        setFileList(data?.attachments ? JSON.stringify(data.attachments) : '')
        setDescription(data?.description)
      }
    })
  }

  const handleOk = () => {
    form.validateFields((err, val) => {
      if (err) return;
      // if (isEmpty(description, true)) {
      //   message.error('描述不能为空');
      //   return;
      // }
      const params = {
        id: values?.id,
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
          : systemList.find(v => String(v.id) === val.systemId).sysName,
        attachments: isEmpty(fileList) ? null : JSON.parse(fileList).map(v => v.id),
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
    if (!isEmpty(values?.id)) {
      handleQueryStoryDetails();
    }
  }, []);

  return (
    <Modal
      width={800}
      title={isEmpty(values) || type === 'add' ? '新建story' : '编辑story'}
      visible={modalVisible}
      onCancel={handleModalVisible}
      footer={
        <>
          <Button onClick={handleModalVisible} ghost type="primary">取消</Button>
          <Button onClick={handleOk} type="primary">提交</Button>
        </>
      }
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="story标题">
              {form.getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入story标题' }],
                initialValue: storyDetails?.title,
              })(<Input.TextArea allowClear cols={1} rows={1} placeholder="请输入story标题" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="优先级">
              {form.getFieldDecorator('priority', {
                rules: [{ required: true, message: '请选择优先级' }],
                initialValue: storyDetails?.priority,
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
          {/* <Col span={12}> */}
          {/*  <FormItem {...formLayoutItemAddDouble} label="经办人"> */}
          {/*    {form.getFieldDecorator('assignee', {* /}
          {/*      rules: [{ required: true, message: '请选择经办人' }], */}
          {/*      initialValue: storyDetails?.assignee, */}
          {/*    })( */}
          {/*      <Select allowClear> */}
          {/*        {userList && */}
          {/*          userList.map(v => ( */}
          {/*            <Option value={v.loginid} key={v.loginid.toString()}> */}
          {/*              {v.lastname} */}
          {/*            </Option> */}
          {/*          ))} */}
          {/*      </Select>, */}
          {/*    )} */}
          {/*  </FormItem> */}
          {/* </Col> */}
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="评估人">
              {form.getFieldDecorator('assessor', {
                rules: [{ required: true, message: '请选择评估人' }],
                initialValue: storyDetails?.assessor,
              })(
                <Select
                  placeholder="请选择评估人"
                  allowClear
                >
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
                initialValue: storyDetails?.systemId,
              })(
                <Select
                  allowClear
                  placeholder="请选择所属系统"
                >
                  {systemList &&
                    systemList.map(v => (
                      <Option value={v.id.toString()} key={v.id}>
                        {v.sysName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          {/* <Col span={12}> */}
          {/*  <FormItem {...formLayoutItemAddDouble} label="所属需求"> */}
          {/*    {form.getFieldDecorator('demandName', {* /}
          {/*      // rules: [{ required: true, message: "请选择所属需求" }], */}
          {/*      initialValue: storyDetails?.demandName, */}
          {/*    })(<Input disabled />)} */}
          {/*  </FormItem> */}
          {/* </Col> */}
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="IT预计上线日期">
              {form.getFieldDecorator('evaluateTime', {
                // rules: [{ required: true, message: "请选择计划上线日期" }],
                initialValue: storyDetails?.evaluateTime && moment(storyDetails?.evaluateTime),
              })(<DatePicker allowClear format="YYYY-MM-DD" placeholder="请选择IT预计上线日期" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="story类型">
              {form.getFieldDecorator('type', {
                // rules: [{ required: true, message: "请选择story类型" }],
                initialValue: storyDetails?.type,
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
            <FormItem {...formLayoutItemAddDouble} label="开发预计工作量">
              {form.getFieldDecorator('developWorkload', {
                // rules: [{ required: true, message: "请输入开发工作量" }],
                initialValue: storyDetails?.developWorkload,
              })(<Input allowClear placeholder="请输入开发工作量" addonAfter="人天" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="测试预计工作量">
              {form.getFieldDecorator('testWorkload', {
                // rules: [{ required: true, message: "请输入测试工作量" }],
                initialValue: storyDetails?.testWorkload,
              })(<Input allowClear placeholder="请输入测试工作量" addonAfter="人天" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              {...formLayoutItemAddEdit}
              // label={<span className={styles.desc_require}>描述</span>}
              label="描述"
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
              <FileUpload
                uploadType='6'
                urls={fileList}
                handleSaveFileUrl={file => setFileList(file)}
              >
                <Button ghost type="primary">上传</Button>
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
