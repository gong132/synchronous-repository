import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from '@/utils/constant';
import CustomBtn from '@/components/commonUseModule/customBtn';
import Editor from '@/components/TinyEditor';
import moment from 'moment';
import _ from 'lodash'
// import UploadFile from '@/components/FileUpload'
// import styles from '../index.js.less'
import { Modal, Form, Select, Input, DatePicker, Col, Row, message, Radio } from 'antd';
import { DEMAND_TYPE_ARR, DEMAND_PRIORITY_ARR, DEFAULT_DESC } from '../util/constant';

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
    loadingAdd,
    loadingTempAdd,
    recordValue = {},
  } = props;

  const {
    formType,
    groupList,
    tempDemandId,
  } = demand;

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

  const [description, setDescription] = useState(DEFAULT_DESC);
  useEffect(() => {
    console.log('页面挂载****************88')
    // 清除可能存在的自动保存的id
    props.dispatch({
      type: 'demand/saveData',
      payload: { tempDemandId: '' }
    })
  }, [])
  console.log('tempDemandId:', tempDemandId)

  useEffect(() => {
    if (recordValue.requirementDescription) {
      setDescription(recordValue.requirementDescription);
    }
  }, [recordValue.requirementDescription]);
  console.log('tempDemandId:', tempDemandId)

  // 查询团队
  const handleQueryGroup = (params) => {
    props.dispatch({
      type: 'contract/fetchHeaderGroup',
      payload: {
        ...params
      }
    });
  };

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
          if (formType === 'list') {
            handleQueryList();
          } else if (formType === 'board') {
            handleQueryBoard();
          }
        }
      });
  };

  // 暂存需求（自动保存）
  const tempCreateDemand = values => {
    props
      .dispatch({
        type: 'demand/tempAddDemand',
        payload: {
          ...values,
        },
      }).then((res) => {
        if (res && !values.autoSave) {
          handleViewModal(false);
          if (formType === 'list') {
            handleQueryList();
          } else if (formType === 'board') {
            handleQueryBoard();
          }
        }
      })
  };

  const editDemand = params => {
    props.dispatch({
      type: 'demand/updateDemand',
      payload: {
        ...params,
      },
    })
      .then(res => {
        if (res) {
          handleViewModal(false);
          if (formType === 'list') {
            handleQueryList();
          } else if (formType === 'board') {
            handleQueryBoard();
          }
        }
      });
  };

  const handleSubmitForm = (saveType) => {
    form.validateFieldsAndScroll((err, values) => {
      if (saveType === 'clickBtn') {
        if (err) return;
        if (description.length < 1) {
          message.error('请补全需求描述！');
          return;
        }
      }
      values.expectedCompletionDate = values.expectedCompletionDate ? moment(values.expectedCompletionDate).format('YYYY-MM-DD') : '';
      values.requirementDescription = description;
      if (saveType === 'clickBtn') {
        // 如果是编辑页面走编辑接口
        if (modalTitle === '编辑') {
          values.id = recordValue.id
          editDemand(values)
          return true
        }
        // 点击保存时暂存id已经获取到了
        if (tempDemandId) {
          values.id = tempDemandId
          editDemand(values)
          return true
        }
        // 保存
        createDemand(values);
        return true
      }
      // 如果需求标题没输入就不能往下走
      if (!values.title) {
        message.warning('请填写需求标题')
        return true
      }

      if (saveType !== 'tempSave') {
        // 自动保存
        values.id = tempDemandId
        values.autoSave = true
      }
      console.log(saveType, tempDemandId)
      tempCreateDemand(values)
    });
  };

  useEffect(() => {
    if (modalTitle === '创建') {
      startTimer(handleSubmitForm);
      return () => {
        // 销毁组件执行
        clearTimer();
      };
    }
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
                {DEMAND_TYPE_ARR.map(d => (
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
                {DEMAND_PRIORITY_ARR.map(d => (
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
                showSearch
                onSearch={_.debounce(handleQueryGroup, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder="请输入受理团队"
              >
                {!_.isEmpty(groupList) && groupList.map(d => (
                  <Option key={d.id} value={d.id}>{d.name}</Option>
                ))}
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
              rules: [{ required: false, message: '请选择是否沟通' }],
              initialValue: communicate,
            })(
              <RadioGroup>
                <Radio value="y" key="y">
                  是
                </Radio>
                <Radio value="n" key="n">
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
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomBtn
            onClick={() => handleViewModal(false)}
            type="cancel"
            style={{ marginRight: '18px' }}
          />
          <CustomBtn
            // loading={modalTitle === '编辑' ? loadingUpdate : loadingAdd}
            loading={loadingTempAdd}
            onClick={() => handleSubmitForm('tempSave')}
            style={{
              background: 'rgba(46, 91, 255, 0.1)',
              color: '#2E5BFF'
            }}
            type="save"
            title='暂存'
          />
          <CustomBtn
            // loading={modalTitle === '编辑' ? loadingUpdate : loadingAdd}
            loading={loadingAdd}
            onClick={() => handleSubmitForm('clickBtn')}
            type="save"
          />
        </div>
      }
    >
      {renderForm()}
    </Modal>
  );
};

export default connect(({ demand, loading }) => ({
  demand,
  loadingAdd: loading.effects['demand/addDemand'],
  loadingTempAdd: loading.effects['demand/tempAddDemand']
}))(Form.create()(CreateDemand));
