import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Editor from '@/components/TinyEditor';
import CustomBtn from '@/components/commonUseModule/customBtn';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import { TableColumnHelper, DefaultPage } from '@/utils/helper';
import OptButton from '@/components/commonUseModule/optButton';
import budget_log from '@/assets/icon/modular_czrz.svg';
import budget_xq from '@/assets/icon/modular_xq.svg';
import flowIcon from '@/assets/icon/modular_lcjd.svg'
import sdIcon from '@/assets/icon/modular_xtxq.svg'
import msgIcon from '@/assets/icon/modular_xx.svg'
import editIcon from '@/assets/icon/Button_bj.svg';
import psIcon from '@/assets/icon/nav_xqgl.svg'
import apsIcon from '@/assets/icon/nav_xqgl_hover.svg'
import xqIcon from '@/assets/icon/xq.svg'
// import xmIcon from '@/assets/icon/xm.svg'

import { Steps, Descriptions, Form, Input, Select, Radio, DatePicker, Spin, message, Icon } from 'antd'
import {
  BOARD_TITLE,
  DEMAND_TYPE_ARR,
  DEMAND_PRIORITY_ARR,
  DEMAND_TYPE_OBJ,
  DEMAND_PRIORITY_OBJ,
  IS_OR_NOT,
  BOARD_TITLE_OBJ,
  FLOW_STATUS
} from '../util/constant'
import { getParam } from '@/utils/utils'
import styles from '../index.less'

const { Step } = Steps
const RadioGroup = Radio.Group
const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const { Option } = Select

@Form.create()
@connect(({ demand, loading }) => ({
  demand,
  loadingQueryInfo: loading.effects['demand/queryDemandInfo'],
  loadingQueryLogData: loading.effects['demand/fetchLogList']
}))
class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editBool: false,
      descriptionState: '',
    }
  }

  componentDidMount() {
    this.handleQueryBudget()
    this.handleQueryDetail()
    this.handleQueryLogList()
  }

  // 更改描述
  handleChangeDesc = content => {
    this.setState({
      descriptionState: content
    })
  }

  // 查日志
  handleQueryLogList = (obj = {}) => {
    const id = getParam('id');
    const params = {
      linkId: id,
      type: '4',
    };
    this.props.dispatch({
      type: 'demand/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
        ...obj
      },
    });
  };

  // 分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params);
  };

  // 查询详情
  handleQueryDetail = () => {
    const id = getParam('id')
    this.props.dispatch({
      type: 'demand/queryDemandInfo',
      payload: {
        id
      }
    }).then((res) => {
      const { requirementDescription } = res || {}
      this.setState({
        descriptionState: requirementDescription
      })
    })
  }

  // 查预算编号
  handleQueryBudget = (number) => {
    this.props.dispatch({
      type: 'demand/fetchBudgetNumber',
      payload: {
        number
      }
    })
  }

  handleQueryGroup = (params) => {
    this.props.dispatch({
      type: 'demand/fetchHeaderGroup',
      payload: {
        ...params
      }
    });
  };

  handleSubmit = () => {
    const { descriptionState } = this.state;
    const id = getParam('id')
    // const { projectMap, systemMap, deptListMap, supplierMap, headerMap, groupMap } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (descriptionState.length < 1) {
        message.error('请补全需求描述！');
        return;
      }
      values.expectedCompletionDate = moment(values.expectedCompletionDate).format('YYYY-MM-DD');
      values.plannedLaunchDate = moment(values.plannedLaunchDate).format('YYYY-MM-DD');
      values.actualLineDate = moment(values.actualLineDate).format('YYYY-MM-DD');
      values.requirementDescription = descriptionState;
      values.id = id
      this.editDemand(values)
    });
  };

  editDemand = (params) => {
    this.props.dispatch({
      type: 'demand/updateDemand',
      payload: {
        ...params
      }
    }).then(res => {
      if (res) {
        this.setState({
          editBool: false,
        }, () => {
          this.handleQueryDetail()
          this.handleQueryLogList()
        })
      }
    })
  }

  handleRenderStepIcon = (status, index) => {
    if (status === 'finish') return <Icon component={xqIcon} />
    // if (status === 'process') return <CustomIcon type={progressIcon} size="middle" />
    console.log(status, index)
    if (status === 'wait') return <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#606265',
        fontSize: 12,
        backgroundColor: '#e5e9f2'
      }}
    >
      {index + 1}
    </div>
  }

  render() {
    const { editBool, descriptionState } = this.state
    const { form, demand, loadingQueryInfo, loadingQueryLogData } = this.props
    const { budgetList, demandInfo, groupList, logList } = demand
    const w = '100%'
    const {
      title,
      demandNumber,
      status,
      budgetNumbers,
      type = 'u',
      priority,
      introducer,
      acceptTeam,
      receiver,
      communicate,
      expectedCompletionDate,
      plannedLaunchDate,
      actualLineDate,
      projectNo,
      demandUrgency,
      businessCompliance,
      riskControlFunction,
      creator,
      createTime,
      requirementDescription,
    } = demandInfo || {}
    const btnStyle = {
      border: '1px solid #D63649',
      borderRadius: '2px',
      color: '#D63649'
    }

    // const judgeCurrentDot = (allStoryStatus, obj) => {
    //   if (taskStatus.length === 0) return 0
    //   const i = _.findIndex(allStoryStatus, o => String(o.statusId) === String(obj.statusId))
    //   return i
    // }

    const detailList = [
      { span: 3, required: false, name: '标题', value: title, style: { whiteSpace: 'pre' }, type: 'p' },
      { span: 1, required: false, name: '需求编号', value: demandNumber, type: 'p' },
      { span: 1, required: false, name: '状态', value: status, type: 'p', arrDict: BOARD_TITLE_OBJ },
      { span: 1, required: false, name: '预算编号', value: budgetNumbers, type: 'p' },
      { span: 1, required: false, name: '需求类型', value: type, type: 'p', arrDict: DEMAND_TYPE_OBJ },
      { span: 1, required: false, name: '优先级', value: priority, type: 'p', arrDict: DEMAND_PRIORITY_OBJ },
      { span: 1, required: false, name: '提出人', value: introducer, type: 'p' },
      { span: 1, required: false, name: '受理团队', value: acceptTeam, type: 'p' },
      { span: 1, required: false, name: '受理人', value: receiver, type: 'p' },
      { span: 1, required: false, name: '是否沟通', value: communicate, type: 'p', arrDict: IS_OR_NOT },
      { span: 1, required: false, name: '期望完成日期', value: expectedCompletionDate, type: 'p' },
      { span: 1, required: false, name: '计划上线日期', value: plannedLaunchDate, type: 'p' },
      { span: 1, required: false, name: '实际上线日期', value: actualLineDate, type: 'p' },
      { span: 1, required: false, name: '项目编号', value: projectNo, type: 'p' },
      { span: 1, required: false, name: '需求紧迫性', value: demandUrgency, type: 'u' },
      { span: 1, required: false, name: '是否涉及业务合规性', value: businessCompliance, type: 'u', arrDict: IS_OR_NOT },
      { span: 1, required: false, name: '是否涉及业务风控功能', value: riskControlFunction, type: 'u', arrDict: IS_OR_NOT },
      { span: 3, required: false, name: '创建人', value: creator, type: 'p' },
      { span: 3, required: false, name: '创建时间', value: createTime, type: 'p' },
      { span: 3, required: false, name: '需求描述', value: requirementDescription, dataIndex: 'description', type: 'p' },
      { span: 3, required: false, name: '附件', value: '', type: 'p' },
    ];

    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '操作人', { width: '100px' }),
      TableColumnHelper.genPlanColumn('content', '操作内容'),
      TableColumnHelper.genPlanColumn('updateTime', '操作时间', { width: '100px' }),
    ];

    return (
      <Fragment>
        <div className='yCenter-between'>
          <CustomBtn type='create' title='下一节点' />
          <div className='yCenter'>
            <CustomBtn type='others' title='关闭' style={{ ...btnStyle, marginRight: '16px' }} />
            <CustomBtn type='others' title='打回' style={btnStyle} />
          </div>
        </div>
        <GlobalSandBox
          title='流程进度'
          img={flowIcon}
        >
          <Steps
            size='small'
            style={{ width: '100%' }}
            className={styles.stepSet}
            progressDot={(dot, { status, index }) => (
              this.handleRenderStepIcon(status, index)
            )}
            // current={
            //   judgeCurrentDot(allStoryStatus, curStatus)
            // }
            current={4}
          >
            {FLOW_STATUS && FLOW_STATUS.length > 0 && FLOW_STATUS.map((v, index) => (
              <Step
                key={v.value}
                title={
                  <div className={styles.step}>
                    {v.label}
                  </div>
                }
                description={
                  <div className={styles.stepContent}>
                    <div className={styles.stepContent_userName} title={v.userName}>
                      {v.userName && v.userName.length > 4
                        ? <div title={v.userName}>
                          {`${v.userName.substr(0,4)}...`}
                        </div>
                        : v.userName
                      }
                    </div>
                    <div title={v.time}>{v.time}</div>
                  </div>
                }
              />
            ))}
          </Steps>
        </GlobalSandBox>
        <Spin spinning={loadingQueryInfo}>
          <GlobalSandBox
            title='需求详情'
            img={budget_xq}
            optNode={
              <Fragment>
                {
                  type === 'p'
                    ? <Fragment>
                      <OptButton
                        style={{
                          backgroundColor: 'white',
                          color: '#B0BAC9',
                          borderColor: '#B0BAC9'
                        }}
                        disabled
                        img={psIcon}
                        text="已提交OA技术评审"
                      />
                      <OptButton
                        style={{
                          backgroundColor: 'white',
                        }}
                        img={apsIcon}
                        text="提交OA技术评审"
                      />
                    </Fragment>
                    : <Fragment>
                      <OptButton
                        style={{
                          backgroundColor: 'white',
                          color: '#B0BAC9',
                          borderColor: '#B0BAC9'
                        }}
                        disabled
                        img={psIcon}
                        text="已提交OA审批"
                      />
                      <OptButton
                        style={{
                          backgroundColor: 'white',
                        }}
                        img={apsIcon}
                        text="提交OA审批"
                      />
                    </Fragment>
                }
                {editBool
                  ? <Fragment>
                    <OptButton
                      style={{
                        ...btnStyle,
                        backgroundColor: 'white'
                      }}
                      icon="close"
                      onClick={() =>
                        this.setState({
                          editBool: false,
                        })
                      }
                      text='取消'
                    />
                    <OptButton
                      style={{
                        backgroundColor: 'white',
                      }}
                      onClick={this.handleSubmit}
                      text="保存"
                    />
                  </Fragment>
                  : <OptButton
                    onClick={() =>
                      this.setState({
                        editBool: true,
                      })
                    }
                    style={{
                      backgroundColor: 'white',
                    }}
                    img={editIcon}
                    text="编辑"
                  />
                }

              </Fragment>
            }
          >
            {editBool
              ? <Descriptions column={3} bordered className={styles.clearFormMargin}>
                <DescriptionItem
                  span={3}
                  label={<>{<span style={{ color: 'red' }}>*</span>}标题</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('title', {
                      rules: [{ required: true, message: '标题!' }],
                      initialValue: title,
                    })(
                      <Input.TextArea placeholder="标题" cols={1} rows={1} allowClear />,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>需求编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('demandNumber', {
                      rules: [{ required: false, message: '请输入需求编号!' }],
                      initialValue: demandNumber,
                    })(<Input disabled style={{ width: w }} placeholder="请输入需求编号" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}状态</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('status', {
                      rules: [{ required: true, message: '请输入状态' }],
                      initialValue: status,
                    })(
                      <Select placeholder="请输入状态" style={{ width: w }}>
                        {
                          BOARD_TITLE.map(d => (
                            <Option key={d.boardId} value={d.boardId}>
                              {d.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}预算编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('budgetNumbers', {
                      rules: [{ required: true, message: '请输入预算编号' }],
                      initialValue: String(budgetNumbers),
                    })(
                      <Select
                        showSearch
                        style={{ width: w }}
                        onSearch={_.debounce(this.handleQueryBudget, 500)}
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
                      </Select>
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}需求类型</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('type', {
                      rules: [{ required: true, message: '请输入需求类型' }],
                      initialValue: type,
                    })(
                      <Select
                        allowClear
                        style={{ width: w }}
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
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}优先级</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('priority', {
                      rules: [{ required: true, message: '请输入优先级' }],
                      initialValue: priority,
                    })(
                      <Select
                        allowClear
                        style={{ width: w }}
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
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}提出人</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('introducer', {
                      rules: [{ required: true, message: '请输入提出人' }],
                      initialValue: introducer,
                    })(
                      <Input style={{ width: w }} />
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}受理团队</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('acceptTeam', {
                      rules: [{ required: false, message: '请输入受理团队' }],
                      initialValue: acceptTeam,
                    })(
                      <Select
                        allowClear
                        style={{ width: w }}
                        showSearch
                        onSearch={_.debounce(this.handleQueryGroup, 500)}
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
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}受理人</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('receiver', {
                      rules: [{ required: false, message: '请输入受理人' }],
                      initialValue: receiver,
                    })(
                      <Select
                        allowClear
                        style={{ width: w }}
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
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}是否沟通</>}
                >
                  <FormItem>
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
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}期望完成日期</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('expectedCompletionDate', {
                      rules: [{ required: true, message: '请输入期望完成日期' }],
                      initialValue: expectedCompletionDate ? moment(expectedCompletionDate) : null,
                    })(<DatePicker style={{ width: w }} placeholder="请输入期望完成日期" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}计划上线日期</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('plannedLaunchDate', {
                      rules: [{ required: true, message: '请输入计划上线日期' }],
                      initialValue: plannedLaunchDate ? moment(plannedLaunchDate) : null,
                    })(<DatePicker style={{ width: w }} placeholder="请输入计划上线日期" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>实际上线日期</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('actualLineDate', {
                      rules: [{ required: false, message: '请输入实际上线日期' }],
                      initialValue: actualLineDate ? moment(actualLineDate) : null,
                    })(<DatePicker style={{ width: w }} disabled placeholder="请输入实际上线日期" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}项目编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('projectNo', {
                      rules: [{ required: false, message: '请输入项目编号' }],
                      initialValue: projectNo,
                    })(
                      <Select
                        allowClear
                        style={{ width: w }}
                        // showSearch
                        placeholder="请输入项目编号"
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
                </DescriptionItem>
                {type === 'u'
                  && <Fragment>
                    <DescriptionItem
                      span={1}
                      label={<>{<span style={{ color: 'red' }}>*</span>}需求紧迫性</>}
                    >
                      <FormItem>
                        {form.getFieldDecorator('demandUrgency', {
                          rules: [{ required: false, message: '请输入需求紧迫性' }],
                          initialValue: demandUrgency,
                        })(
                          <Select
                            allowClear
                            style={{ width: w }}
                            // showSearch
                            placeholder="请输入需求紧迫性"
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
                    </DescriptionItem>
                    <DescriptionItem
                      span={1}
                      label={<>{<span style={{ color: 'red' }}>*</span>}是否涉及业务合规性</>}
                    >
                      <FormItem>
                        {form.getFieldDecorator('businessCompliance', {
                          rules: [{ required: false, message: '请输入是否涉及业务合规性' }],
                          initialValue: businessCompliance,
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
                    </DescriptionItem>
                    <DescriptionItem
                      span={1}
                      label={<>{<span style={{ color: 'red' }}>*</span>}是否涉及业务风控功能</>}
                    >
                      <FormItem>
                        {form.getFieldDecorator('riskControlFunction', {
                          rules: [{ required: false, message: '请输入是否涉及业务风控功能' }],
                          initialValue: riskControlFunction,
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
                    </DescriptionItem>
                  </Fragment>}
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}创建人</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('creator', {
                      rules: [{ required: false, message: '请输入创建人' }],
                      initialValue: creator,
                    })(
                      <Input disabled style={{ width: w }} />
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}创建时间</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('createTime', {
                      rules: [{ required: false, message: '请输入创建时间' }],
                      initialValue: createTime,
                    })(
                      <Input disabled style={{ width: w }} />
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={3} label={<>需求描述</>}>
                  <FormItem>
                    <Editor
                      editorKey="myContractAdd"
                      height={300}
                      content={descriptionState}
                      onContentChange={content => this.handleChangeDesc(content)}
                    />
                  </FormItem>
                </DescriptionItem>
              </Descriptions>
              : <Descriptions column={3} bordered className={styles.formatDetailDesc}>
                {detailList.map((v, i) => (
                  (v.type === type || v.type === 'p') && <DescriptionItem
                    key={i.toString()}
                    span={v.span}
                    label={
                      <>
                        {v.required && <span style={{ color: 'red' }}>*</span>}
                        {v.name}
                      </>
                    }
                  >
                    {v.dataIndex === 'description'
                      ?
                      /* eslint-disable */
                      <div
                        className="infoDescription"
                        style={{ border: 0 }}
                        dangerouslySetInnerHTML={{ __html: v.value ? v.value : '--' }}
                      /> /* eslint-disable */
                      : v.arrDict
                        ? <div style={v.style}>{v.arrDict[v.value]}</div>
                        : <div style={v.style}>{v.value}</div>
                    }
                  </DescriptionItem>
                ))}
              </Descriptions>
            }
          </GlobalSandBox>
        </Spin>

        <GlobalSandBox
          title='系统需求'
          img={sdIcon}
        >

        </GlobalSandBox>
        <GlobalSandBox
          title='评论'
          img={msgIcon}
        >

        </GlobalSandBox>
        <GlobalSandBox img={budget_log} title="操作日志">
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            data={logList}
            loading={loadingQueryLogData}
          // onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}

export default Detail