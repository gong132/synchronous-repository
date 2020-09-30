import React, { PureComponent } from 'react';
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
@Form.create()
@connect(({ demand, loading, global }) => ({
  global,
  demand,
  loadingAdd: loading.effects['demand/addDemand'],
  loadingTempAdd: loading.effects['demand/tempAddDemand']
}))
class CreateDemand extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      description: '',
      // urls: ''
    }
    this.handleSubmitForm = this.handleSubmitForm.bind(this)
  }

  componentDidMount() {
    const { recordValue = {}, modalTitle, startTimer } = this.props
    const { requirementDescription } = recordValue
    this.props.dispatch({
      type: 'demand/saveData',
      payload: { tempDemandId: '' }
    })
    if (requirementDescription) {
      this.setState({
        description: requirementDescription
      })
    } else {
      this.setState({
        description: DEFAULT_DESC
      })
    }
    if (modalTitle === '创建') {
      startTimer(this.handleSubmitForm);
    }
  }

  componentWillUnmount() {
    const { clearTimer, modalTitle } = this.props
    if (modalTitle === '创建') {
      clearTimer()
    }
    console.log('销毁组件执行****************88')
    this.props.dispatch({
      type: 'demand/saveData',
      payload: { tempDemandId: '' }
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   const {demand: {groupList}} = nextProps
  //   const {form} = this.props
  //   if(!_.isEmpty(groupList) && groupList.length === 1) {
  //     form.se
  //   }
  // }

  handleChangeDes = content => {
    this.setState({
      description: content
    })
  }

  // handleSaveFileUrl = (fileUrl) => {
  //   this.setState({
  //     urls: fileUrl
  //   })
  // }

  // 查预算编号
  handleQueryBudget = number => {
    this.props.dispatch({
      type: 'demand/fetchBudgetNumber',
      payload: {
        number,
      },
    });
  };

  // 查询团队
  handleQueryGroup = (val, type) => {
    const params = {}
    if(type) {
      params[type] = val
    } else {
      params.teamName = val
    }
    return this.props.dispatch({
      type: 'demand/fetchHeaderGroup',
      payload: {
        ...params
      }
    }).then(res => {
      return res
    });
  };

  // 查询人员
  handleQueryUser = (params) => {
    this.props.dispatch({
      type: 'demand/fetchUserData',
      payload: {
        ...params,
      },
    });
  };

  // 通过团队查人员
  handleChangeGroup = (val) => {
    const { form } = this.props
    console.log(val)
    form.resetFields(['receiver'])
    this.handleQueryUser({teamId: val})
  }

  // 通过人员id查团队
  handleQueryGroupBy = async (type, val) => {
    if (type === 'user') {
      const res = await this.handleQueryGroup( String(val),'userId')
      const { demand: { groupList }, form } = this.props
      if (res && !_.isEmpty(groupList)) {
        form.setFieldsValue({'acceptTeam': groupList[0].id })
      }
    }
  }

  createDemand = values => {
    const { demand: { formType }, handleViewModal, handleQueryList, handleQueryBoard } = this.props
    this.props
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
  tempCreateDemand = values => {
    const { handleViewModal, handleQueryList, handleQueryBoard, demand: { formType } } = this.props
    if (values.id) {
      this.editDemand(values)
      return true
    }
    this.props
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

  editDemand = params => {
    const { handleViewModal, handleQueryList, handleQueryBoard, demand: { formType } } = this.props
    this.props.dispatch({
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

  handleSubmitForm = (saveType) => {
    const { form, modalTitle, demand: { tempDemandId, userDataMap, groupMap }, recordValue } = this.props
    const { description } = this.state
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
      values.receiverId = values.receiver
      values.receiverName = values.receiver ? userDataMap[values.receiver] : ''
      values.acceptTeamId = values.acceptTeam
      values.acceptTeam = groupMap[values.acceptTeam]
      console.log(values)
      // return
      if (saveType === 'clickBtn') {
        // 如果是编辑页面走编辑接口
        if (modalTitle === '编辑') {
          values.id = recordValue.id
          this.editDemand(values)
          return true
        }
        // 点击保存时暂存id已经获取到了
        if (tempDemandId) {
          values.id = tempDemandId
          this.editDemand(values)
          return true
        }
        // 保存
        this.createDemand(values);
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

      console.log('tempDemandId:', tempDemandId)
      this.tempCreateDemand(values)
    });
  };

  renderForm = () => {
    const { form, recordValue = {}, demand: { groupList, budgetList, userData } } = this.props
    const { description } = this.state
    const {
      title,
      expectedCompletionDate,
      introducer,
      type,
      priority,
      acceptTeam,
      receiver,
      communicate,
      budgetNumbers,
      // id,
    } = recordValue;
    return (
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
            <FormItem {...formLayoutItemAddDouble} label="预算编号">
              {form.getFieldDecorator('budgetNumbers', {
                rules: [{ required: true, message: '请输入预算编号' }],
                initialValue: budgetNumbers,
              })(
                <Select
                  allowClear
                  showSearch
                  onSearch={_.debounce(this.handleQueryBudget, 500)}
                  onFocus={this.handleQueryBudget}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入预算编号"
                >
                  {!_.isEmpty(budgetList) &&
                    budgetList.map(d => (
                      <Option key={d.number} value={d.number}>
                        {d.number}
                      </Option>
                    ))}
                </Select>,
              )}
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
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入提出人"
                >
                  {!_.isEmpty(userData) && userData.map(d => (
                    <Option key={d.loginid} value={d.loginid}>
                      {d.lastname}
                    </Option>
                  ))}
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
                rules: [{ required: false, message: '请输入优先级' }],
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
                  onSearch={_.debounce(this.handleQueryGroup, 500)}
                  onFocus={this.handleQueryGroup}
                  onChange={this.handleChangeGroup}
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
                  showSearch
                  placeholder="请输入受理人"
                  onChange={(val) => this.handleQueryGroupBy('user', val)}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {!_.isEmpty(userData) && userData.map(d => (
                    <Option key={d.loginid} value={d.loginid}>
                      {d.lastname}
                    </Option>
                  ))}
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
                onContentChange={content => this.handleChangeDes(content)}
              />
            </FormItem>
          </Col>
          {/* <Col span={24}>
            <FormItem
              {...formLayoutItemAddEdit}
              label='上传附件'
            >
              <UploadFile
                uploadType='5'
                urls={urls}
                linkId={id}
                handleSaveFileUrl={this.handleSaveFileUrl}
              >
                <Button type='primary' ghost>上传</Button>
                <span style={{marginLeft: '16px'}}>限制文件大小为20M以内</span>
              </UploadFile>
            </FormItem>
          </Col> */}
        </Row>
      </Form>
    )
  };


  render() {
    const {
      visibleModal,
      modalTitle,
      handleViewModal,
      loadingAdd,
      loadingTempAdd,
    } = this.props;
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
              onClick={() => this.handleSubmitForm('tempSave')}
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
              onClick={() => this.handleSubmitForm('clickBtn')}
              type="save"
            />
          </div>
        }
      >
        {this.renderForm()}
      </Modal>
    )
  }
}
export default CreateDemand;
