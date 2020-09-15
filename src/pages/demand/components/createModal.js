import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from '@/utils/constant';
import CustomBtn from '@/components/commonUseModule/customBtn';
import Editor from '@/components/TinyEditor';
import moment from 'moment';
// import UploadFile from '@/components/FileUpload'
// import styles from '../index.js.less'
import { Modal, Form, Select, Input, DatePicker, Col, Row, message, Radio } from 'antd';
import { demandTypeArr, demandPriorityArr, defaultDescription } from '../util/constant';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CreateDemand = props => {
  const {
    visibleModal,
    modalTitle,
    handleViewModal,
    handleQueryList,
    handleQueryBoard,
    form,
    startTimer,
    clearTimer,
    demand,
    recordValue = {},
  } = props;

  const { formType } = demand;

  const {
    title,
    expectedCompletionDate,
    introducer,
    type,
    priority,
    acceptTeam,
    receiver,
    communicate,
  } = recordValue;

  const [description, setDescription] = useState(defaultDescription);

  useEffect(() => {
    setDescription(recordValue.description);
  }, [recordValue.description]);

  const createDemand = values => {
    props
      .dispatch({
        type: 'demand/addDemand',
        payload: {
          ...values,
        },
      })
      .then(res => {
        if (res) {
          handleViewModal(false);
          console.log(formType);
          if (formType === 'list') {
            handleQueryList();
          } else if (formType === 'board') {
            handleQueryBoard();
          }
        }
      });
  };

  const handleSubmitForm = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (description.length < 1) {
        message.error('请补全需求描述！');
        return;
      }
      values.expectedCompletionDate = moment(values.expectedCompletionDate).format('YYYY-MM-DD');
      values.requirementDescription = description;
      console.log('values: ', values);
      createDemand(values);
    });
  };

  useEffect(() => {
    startTimer(handleSubmitForm);
    return () => {
      // 销毁组件执行
      clearTimer();
    };
  }, []);

  const renderForm = () => (
    <Form>
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="标题">
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: title,
            })(<Input.TextArea autoSize={{ minRows: 1, maxRows: 2 }} placeholder="请输入标题" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="期望完成日期">
            {form.getFieldDecorator('expectedCompletionDate', {
              rules: [{ required: true, message: '请输入期望完成日期' }],
              initialValue: expectedCompletionDate ? moment(expectedCompletionDate) : null,
            })(<DatePicker placeholder="请输入期望完成日期" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="提出人">
            {form.getFieldDecorator('introducer', {
              rules: [{ required: true, message: '请输入提出人' }],
              initialValue: introducer,
            })(
              <Select
                allowClear
                // showSearch
                placeholder="请输入提出人"
              >
                {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                <Option key="1" value="1">
                  {1}
                </Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="需求类型">
            {form.getFieldDecorator('type', {
              rules: [{ required: true, message: '请输入需求类型' }],
              initialValue: type,
            })(
              <Select
                allowClear
                // showSearch
                placeholder="请输入需求类型"
              >
                {demandTypeArr.map(d => (
                  <Option key={d.key} value={d.key}>
                    {d.val}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="优先级">
            {form.getFieldDecorator('priority', {
              rules: [{ required: true, message: '请输入优先级' }],
              initialValue: priority,
            })(
              <Select
                allowClear
                // showSearch
                placeholder="请输入优先级"
              >
                {demandPriorityArr.map(d => (
                  <Option key={d.key} value={d.key}>
                    {d.val}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="受理团队">
            {form.getFieldDecorator('acceptTeam', {
              rules: [{ required: false, message: '请输入受理团队' }],
              initialValue: acceptTeam,
            })(
              <Select
                allowClear
                // showSearch
                placeholder="请输入受理团队"
              >
                {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                <Option key="1" value="1">
                  1
                </Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="受理人">
            {form.getFieldDecorator('receiver', {
              rules: [{ required: false, message: '请输入受理人' }],
              initialValue: receiver,
            })(
              <Select
                allowClear
                // showSearch
                placeholder="请输入受理人"
              >
                {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                <Option key="1" value="1">
                  {1}
                </Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...formLayoutItemAddDouble} label="是否沟通">
            {form.getFieldDecorator('communicate', {
              rules: [{ required: false, message: '请选择项目类型' }],
              initialValue: communicate,
            })(
              <RadioGroup>
                <Radio value="1" key="1">
                  是
                </Radio>
                <Radio value="0" key="0">
                  否
                </Radio>
              </RadioGroup>,
            )}
          </FormItem>
        </Col>

        <Col span={24}>
          <FormItem {...formLayoutItemAddEdit} label="需求描述" required>
            <Editor
              editorKey="myContractAdd"
              height={300}
              content={description}
              onContentChange={content => setDescription(content)}
            />
          </FormItem>
        </Col>
        {/* <Col span={24}>
              <FormItem
                {...formLayoutItemAddEdit}
                label='上传附件'
              >
                <UploadFile
                  uploadType='2'
                  urls={urls}
                  handleSaveFileUrl={handleSaveFileUrl}
                >
                  <Button>上传</Button>
                </UploadFile>
              </FormItem>
            </Col> */}
      </Row>
    </Form>
  );

  return (
    <Modal
      width={794}
      style={{ top: 0 }}
      title={`${modalTitle}需求`}
      visible={visibleModal}
      onCancel={() => handleViewModal(false)}
      // confirmLoading={loadingAdd || loadingUpdate}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomBtn
            onClick={() => handleViewModal(false)}
            type="cancel"
            style={{ marginRight: '18px' }}
          />
          <CustomBtn
            // loading={modalTitle === '编辑' ? loadingUpdate : loadingAdd}
            onClick={handleSubmitForm}
            type="save"
          />
        </div>
      }
    >
      {renderForm()}
    </Modal>
  );
};

export default connect(demand => ({
  demand,
}))(Form.create()(CreateDemand));
