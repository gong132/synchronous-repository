import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import Editor from '@/components/TinyEditor';
import UploadFile from '@/components/FileUpload'
import CustomBtn from '@/components/commonUseModule/customBtn';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import ChartCard from './chartCard';
import MilePlan from './mileStonePlan';
import { TableColumnHelper, DefaultPage, PagerHelper } from '@/utils/helper';
import OptButton from '@/components/commonUseModule/optButton';
import flowIcon from '@/assets/icon/modular_lcjd.svg';
import sdIcon from '@/assets/icon/modular_xtxq.svg';
import editIcon from '@/assets/icon/Button_bj.svg';
import waitIcon from '@/assets/icon/xq_jxz.svg';
import psIcon from '@/assets/icon/nav_xqgl.svg';
import apsIcon from '@/assets/icon/nav_xqgl_hover.svg';
import xqIcon from '@/assets/icon/xq.svg';
import budgetLogIcon from '@/assets/icon/modular_czrz.svg';
import budgetXqIcon from '@/assets/icon/modular_xq.svg';
import addIcon from '@/assets/icon/Button_xz.svg';
import copyIcon from '@/assets/icon/Button_fz.svg';
// import xmIcon from '@/assets/icon/xm.svg'
// import xmwaitIcon from '@/assets/icon/xm_jxz.svg'

import {
  Steps,
  Descriptions,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Spin,
  message,
  Icon,
  Modal,
  Button
} from 'antd';
import {
  BOARD_TITLE,
  DEMAND_TYPE_ARR,
  DEMAND_PRIORITY_ARR,
  DEMAND_TYPE_OBJ,
  DEMAND_PRIORITY_OBJ,
  IS_OR_NOT,
  BOARD_TITLE_OBJ,
  FLOW_STATUS,
} from '../util/constant';
import { getParam, getUserInfo } from '@/utils/utils';
import styles from '../index.less';

import StoryList from './story/storyList';

const { Step } = Steps;
const RadioGroup = Radio.Group;
const DescriptionItem = Descriptions.Item;
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ demand, loading }) => ({
  demand,
  loadingQueryInfo: loading.effects['demand/queryDemandInfo'],
  loadingQueryLogData: loading.effects['demand/fetchLogList'],
  loadingQueryStoryData: loading.effects['demand/queryStoryList'],
  loadingEditDemand: loading.effects['demand/updateDemand'],
}))
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editBool: false,
      descriptionState: '',
      addStoryModalVisible: false,
      itAssessModalVisible: false,
      turnAssessModalVisible: false,
      selectedStoryRows: [],
      selectedStoryDetailRows: {},
      showCreateMilePlan: false,
      urls: ''
    };
  }

  componentDidMount() {
    this.handlePlanStage();
    this.handleQueryPlanList();
    this.handleQueryBudget();
    this.handleQueryDetail();
    this.handleQueryLogList();
    this.handleQueryFlowList();
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    // let bool = false
    // const { demand: { demandInfo } } = nextProps
    // const { attachmentFiles } = demandInfo || {}
    // let { urls = '' } = this.state
    // if (urls.length > 0) {
    //   urls = JSON.parse(urls)
    // }
    // if (!_.isEqual(attachmentFiles, urls)) {
    //   this.setState({
    //     urls: JSON.stringify(attachmentFiles)
    //   })
    //   bool = true
    // }
    // return bool
  }

  // 更改描述
  handleChangeDesc = content => {
    this.setState({
      descriptionState: content,
    });
  };

  handleSaveFileUrl = (fileUrl) => {
    console.log('fileUrl:', fileUrl)
    this.setState({
      urls: fileUrl
    })
  }

  // 查询
  handleQueryPlanList = params => {
    const no = getParam('no');
    this.props.dispatch({
      type: 'demand/queryMilePlan',
      payload: {
        demandNo: no,
        ...DefaultPage,
        ...params,
      },
    });
  };

  // 查询里程碑计划所有阶段
  handlePlanStage = () => {
    this.props.dispatch({
      type: 'demand/queryMilePlanStage',
    });
  };

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
        ...obj,
      },
    });
  };

  // 查流程进度
  handleQueryFlowList = () => {
    const no = getParam('no');
    this.props.dispatch({
      type: 'demand/queryFlow',
      payload: {
        demandNumber: no,
      },
    });
  };

  // 查询人员
  handleQueryUser = (params) => {
    if(typeof params === 'string') {
      params = {userName: params}
    }
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
    form.setFieldsValue({['receiverId']: ''})
    this.handleQueryUser({ teamId: val })
  }

  // 日志分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params);
  };

  // 查询详情
  handleQueryDetail = () => {
    const id = getParam('id');
    this.props
      .dispatch({
        type: 'demand/queryDemandInfo',
        payload: {
          id,
        },
      })
      .then(res => {
        if (!res) return;
        const { requirementDescription, attachmentList } = res || {};
        this.setState({
          descriptionState: requirementDescription,
          urls: attachmentList && attachmentList.length > 0 ? JSON.stringify(attachmentList) : ''
        });
        this.handleQueryStoryList();
        this.handSearchITAssignAuth();
        this.handSearchAssignorAuth();
      });
  };

  // 查预算编号
  handleQueryBudget = number => {
    this.props.dispatch({
      type: 'demand/fetchBudgetNumber',
      payload: {
        number,
      },
    });
  };

  handleQueryGroup = params => {
    return this.props.dispatch({
      type: 'demand/fetchHeaderGroup',
      payload: {
        ...params,
      },
    }).then(res => {
      if (res) {
        return res
      }
    });
  };


  // 通过人员id查团队
  handleQueryGroupBy = async (type, val) => {
    if (type === 'user') {
      const res = await this.handleQueryGroup({ userId: String(val) })
      const { demand: { groupList }, form } = this.props
      if (res && !_.isEmpty(groupList)) {
        form.setFieldsValue({ 'acceptTeamId': groupList[0].id })
      }
    }
  }

  handleSubmit = () => {
    const { demand } = this.props
    const { groupMap, demandInfo={} } = demand
    const { status } = demandInfo
    const { descriptionState, urls } = this.state;
    // const id = getParam('id');
    let arr = [] // 保存附件
    if (urls.length > 0) {
      arr = JSON.parse(urls)
    }
    // const { projectMap, systemMap, deptListMap, supplierMap, headerMap, groupMap } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (descriptionState.length < 1) {
        message.error('请补全需求描述！');
        return;
      }
      values.expectedCompletionDate = values.expectedCompletionDate
        ? moment(values.expectedCompletionDate).format('YYYY-MM-DD')
        : null;
      values.plannedLaunchDate = values.plannedLaunchDate
        ? moment(values.plannedLaunchDate).format('YYYY-MM-DD')
        : null;
      values.actualLineDate = values.actualLineDate
        ? moment(values.actualLineDate).format('YYYY-MM-DD')
        : null;
      values.requirementDescription = descriptionState;
      const receiverArr = values.receiverId ? values.receiverId.split('-') : ['', '']
      values.receiverId = receiverArr[0]
      values.receiverName = receiverArr[1]
      values.acceptTeam = groupMap[values.acceptTeamId]
      // values.id = id;
      values.attachmentFiles = arr
      values.createType = 2
      if(status === 1) {
        values.createType = 1
      }

      Object.assign(demandInfo, values)
      this.editDemand(demandInfo);
    });
  };

  editDemand = params => {
    this.props
      .dispatch({
        type: 'demand/addUpdateDemand',
        payload: {
          ...params,
        },
      })
      .then(res => {
        if (res) {
          this.setState(
            {
              editBool: false,
            },
            () => {
              this.handleQueryDetail();
              this.handleQueryLogList();
              this.handleQueryFlowList();
            },
          );
        }
      });
  };

  handleRenderStepIcon = arg => {
    if (arg.status === 'finish') return <Icon component={xqIcon} />;
    if (arg.status === 'process') return <Icon component={waitIcon} />;
    if (arg.status === 'wait')
      return (
        <div
          style={{
            display: 'flex',
            width: 24,
            height: 24,
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#606265',
            fontSize: 12,
            backgroundColor: '#e5e9f2',
          }}
        >
          {arg.index + 1}
        </div>
      );
  };

  handleQueryStoryList = params => {
    const {
      dispatch,
      demand: {
        demandInfo: { demandNumber },
      },
    } = this.props;
    dispatch({
      type: 'demand/queryStoryList',
      payload: {
        demandNumber,
        ...PagerHelper.DefaultPage,
        ...params,
      },
    });
  };

  handleCopyStory = () => {
    const { dispatch } = this.props;
    const { selectedStoryRows } = this.state;

    if (selectedStoryRows && selectedStoryRows.length === 0) {
      message.warning('请选择story');
      return;
    }
    dispatch({
      type: 'demand/copyStory',
      payload: {
        storyIds: selectedStoryRows.map(v => v.id),
      },
    }).then(res => {
      if (!res) return;
      message.success(`成功复制${selectedStoryRows.length}条story`);
      this.setState({
        selectedStoryRows: [],
      });
      this.handleQueryStoryList();
    });
  };

  handleModalVisible = (flag, tag) => {
    this.setState({
      [tag]: !!flag,
    });
  };

  handleResolveCancelOrBack = type => {
    const id = getParam('id');
    const params = {
      id,
    };
    if (type === 'cancel') {
      params.status = 10;
    } else if (type === 'back') {
      params.status = 1;
    }
    this.props
      .dispatch({
        type: 'demand/updateDemand',
        payload: {
          ...params,
        },
      })
      .then(res => {
        if (res) {
          window.history.back();
        }
      });
  };

  handSearchITAssignAuth = () => {
    const {
      dispatch,
      demand: { demandInfo },
    } = this.props;
    dispatch({
      type: 'demand/ITAssignAuth',
      payload: {
        demandNumber: demandInfo?.demandNumber,
        type: 1,
      },
    });
  };

  handSearchAssignorAuth = () => {
    const {
      dispatch,
      demand: { demandInfo },
    } = this.props;
    dispatch({
      type: 'demand/assignorAuth',
      payload: {
        demandNumber: demandInfo?.demandNumber,
        type: 2,
      },
    });
  };

  // 团队经理受理需求
  handleChangeStatusByManage = (status, demandId) => {
    const params = {
      demandId,
    };
    // 待指派 2 团队经理将需求受理到自己团队
    if(status === 2) {
      params.acceptType = 1
    }

    // 待受理 3 受理人将需求受理人指派为自己
    if(status === 3) {
      params.acceptType = 2
    }

    this.props
      .dispatch({
        type: 'demand/receiverAppointDemand',
        payload: {
          ...params,
        },
      })
      .then(res => {
        if (res) {
          this.handleQueryDetail();
          this.handleQueryLogList();
          this.handleQueryFlowList();
        }
      });
  };

  // 手动到带拆分
  handleToDivider = (id) => {
    this.props.dispatch({
      type: 'demand/toDivider',
      payload: {
        demandId: id
      }
    }).then(res => {
      if (res) {
        this.handleQueryDetail();
        this.handleQueryLogList();
        this.handleQueryFlowList();
      }
    })
  }

  // 控制打开填写里程碑计划框
  handleViewCreatePlan = bool => {
    this.setState({
      showCreateMilePlan: bool,
    });
  };

  // 提交oa
  handleOAaction = type => {
    if (type === 'p') {
      // 项目需求
      Modal.confirm({
        title: '您的项目需求还没有里程碑计划，不能进入下一节点。现在是否去增加里程碑计划？',
        okText: '是',
        cancelText: '否',
        onOk: () => this.handleViewCreatePlan(true),
      });
    }
    if (type === 'u') {
      // 一般需求
    }
  };

  renderFile = (v) => {
    const { name } = v
    return (
      <div
        className={styles.fileStyle}
      >
        <a href={v.path} target='__blank'>{name}</a>
      </div>
    )
  }

  render() {
    const { editBool, descriptionState, showCreateMilePlan, urls } = this.state;
    const {
      userInfo={}
    } = getUserInfo();
    const { isTeamHead, userName } = userInfo
    const {
      form,
      loadingQueryInfo,
      loadingQueryLogData,
      loadingEditDemand,
      demand: { budgetList, userDataMap, demandInfo, groupList, logList, flowList, ITAssignVisible, assignorVisible, userData },
    } = this.props;
    const w = '100%';
    const {
      title, demandNumber, status, budgetNumbers, type = 'u', priority, introducer, acceptTeam,
      communicate, expectedCompletionDate, plannedLaunchDate, actualLineDate, projectNo, demandUrgency,
      businessCompliance, riskControlFunction, creator, createTime, requirementDescription, id, receiverName, receiverId, acceptTeamId
    } = demandInfo || {};
    const btnStyle = {
      border: '1px solid #D63649',
      borderRadius: '2px',
      color: '#D63649',
    };

    // const judgeCurrentDot = (allStoryStatus, obj) => {
    //   if (taskStatus.length === 0) return 0
    //   const i = _.findIndex(allStoryStatus, o => String(o.statusId) === String(obj.statusId))
    //   return i
    // }

    const detailList = [
      {
        span: 3,
        required: false,
        name: '标题',
        value: title,
        style: { whiteSpace: 'pre' },
        type: 'p',
      },
      { span: 1, required: false, name: '需求编号', value: demandNumber, type: 'p' },
      {
        span: 1,
        required: false,
        name: '状态',
        value: status,
        type: 'p',
        arrDict: BOARD_TITLE_OBJ,
      },
      { span: 1, required: false, name: '预算编号', value: budgetNumbers, type: 'p' },
      {
        span: 1,
        required: false,
        name: '需求类型',
        value: type,
        type: 'p',
        arrDict: DEMAND_TYPE_OBJ,
      },
      {
        span: 1,
        required: false,
        name: '优先级',
        value: priority,
        type: 'p',
        arrDict: DEMAND_PRIORITY_OBJ,
      },
      { span: 1, required: false, name: '提出人', value: introducer, type: 'p', },
      { span: 1, required: false, name: '受理团队', value: acceptTeam, type: 'p' },
      { span: 1, required: false, name: '受理人', value: receiverName, type: 'p' },
      {
        span: 1,
        required: false,
        name: '是否沟通',
        value: communicate,
        type: 'p',
        arrDict: IS_OR_NOT,
      },
      { span: 1, required: false, name: '期望完成日期', value: expectedCompletionDate, type: 'p' },
      { span: 1, required: false, name: '计划上线日期', value: plannedLaunchDate, type: 'p' },
      { span: 1, required: false, name: '实际上线日期', value: actualLineDate, type: 'p' },
      { span: 1, required: false, name: '项目编号', value: projectNo, type: 'p' },
      { span: 1, required: false, name: '需求紧迫性', value: demandUrgency, type: 'u' },
      {
        span: 1,
        required: false,
        name: '是否涉及业务合规性',
        value: businessCompliance,
        type: 'u',
        arrDict: IS_OR_NOT,
      },
      {
        span: 1,
        required: false,
        name: '是否涉及业务风控功能',
        value: riskControlFunction,
        type: 'u',
        arrDict: IS_OR_NOT,
      },
      { span: 3, required: false, name: '创建人', value: creator, type: 'p' },
      { span: 3, required: false, name: '创建时间', value: createTime, type: 'p' },
      {
        span: 3,
        required: false,
        name: '需求描述',
        value: requirementDescription,
        dataIndex: 'description',
        type: 'p',
      },
      { span: 3, required: false, name: '附件', value: '', type: 'p', dataIndex: 'file' },
    ];

    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '操作人', { width: '100px' }),
      {
        title: '操作内容',
        dataIndex: 'content',
        key: 'content',
        align: 'center',
        render: (text) => {
          return (
            <div style={{ textAlign: 'left' }}>{text}</div>
          )
        }
      },
      TableColumnHelper.genPlanColumn('createTime', '操作时间', { width: '200px' }),
    ];

    const resolveFlowData = (arr, index, typeFlow) => {
      let str = '';
      if (arr[index] && typeFlow === 'name') {
        if (arr[index].processUsers) {
          if (arr[index].processUsers[0]) {
            str = arr[index].processUsers[0].userName;
          }
        }
      }
      if (arr[index] && typeFlow === 'time') {
        str = arr[index].handleTime;
      }
      return str;
    };
    return (
      <Fragment>
        <div>
          {((isTeamHead === 1 && status === 2) || (status === 3 && receiverName === userName)) ? (
            <CustomBtn
              style={{ float: 'left' }}
              onClick={() => this.handleChangeStatusByManage(status, id)}
              type="create"
              title="下一节点"
            />
          ) : null}
          <CustomBtn
              style={{ float: 'left' }}
              onClick={() => this.handleToDivider(id)}
              type="create"
              title="待拆分"
            />
          <div className="yCenter" style={{ float: 'right' }}>
            {(((status === 4 || status === 5 || status === 7 || status === 10)
              && receiverName === userName)
              || (isTeamHead === 1 && status === 3))
              && <CustomBtn
                onClick={() => {
                  Modal.confirm({
                    content: '需求被取消后可到取消看板查看, 是否确定取消？',
                    onOk: () => this.handleResolveCancelOrBack('cancel')
                  })
                }}
                type="others"
                title="取消"
                style={{ ...btnStyle, marginRight: '16px' }}
              />
            }
            {(status === 4 || status === 5)
              && receiverName === userName
              && <CustomBtn
                onClick={() => {
                  Modal.confirm({
                    content: '需求被打回后可到暂存看板中查看，是否确定打回？',
                    onOk: () => this.handleResolveCancelOrBack('back'),
                  });
                }}
                type="others"
                title="打回"
                style={btnStyle}
              />
            }
          </div>
        </div>
        <GlobalSandBox title="流程进度" img={flowIcon}>
          <Steps
            size="small"
            style={{ width: '100%' }}
            className={styles.stepSet}
            progressDot={(dot, arg) => this.handleRenderStepIcon(arg)}
            // current={
            //   judgeCurrentDot(allStoryStatus, curStatus)
            // }
            current={!_.isEmpty(flowList) ? flowList.length - 1 : 0}
          >
            {FLOW_STATUS &&
              FLOW_STATUS.length > 0 &&
              FLOW_STATUS.map((v, index) => (
                <Step
                  key={v.value}
                  title={<div className={styles.step}>{v.label}</div>}
                  description={
                    <div className={styles.stepContent}>
                      <div
                        className={styles.stepContent_userName}
                        title={resolveFlowData(flowList, index, 'name')}
                      >
                        {resolveFlowData(flowList, index, 'name')}
                      </div>
                      <div title={resolveFlowData(flowList, index, 'time')}>
                        {resolveFlowData(flowList, index, 'time')}
                      </div>
                    </div>
                  }
                />
              ))}
          </Steps>
        </GlobalSandBox>
        <Spin spinning={loadingQueryInfo}>
          <GlobalSandBox
            title="需求详情"
            img={budgetXqIcon}
            optNode={
              <Fragment>
                {type === 1 ? (
                  <Fragment>
                    <OptButton
                      style={{
                        backgroundColor: 'white',
                        color: '#B0BAC9',
                        borderColor: '#B0BAC9',
                      }}
                      disabled
                      img={psIcon}
                      text="已提交OA技术评审"
                    />
                    {receiverName === userName && <OptButton
                      style={{
                        backgroundColor: 'white',
                      }}
                      img={apsIcon}
                      text="提交OA技术评审"
                      onClick={() => this.handleOAaction('p')}
                    />}
                  </Fragment>
                ) : (
                    <Fragment>
                      <OptButton
                        style={{
                          backgroundColor: 'white',
                          color: '#B0BAC9',
                          borderColor: '#B0BAC9',
                        }}
                        disabled
                        img={psIcon}
                        text="已提交OA审批"
                      />
                      { receiverName === userName && <OptButton
                        style={{
                          backgroundColor: 'white',
                        }}
                        img={apsIcon}
                        text="提交OA审批"
                        onClick={() => this.handleOAaction('u')}
                      />}
                    </Fragment>
                  )}
                {editBool ? (
                  <Fragment>
                    <OptButton
                      style={{
                        ...btnStyle,
                        backgroundColor: 'white',
                        // color: 'red'
                      }}
                      // icon="close"
                      onClick={() =>
                        this.setState({
                          editBool: false,
                        })
                      }
                      text="取消"
                    />
                    <OptButton
                      style={{
                        backgroundColor: 'white',
                      }}
                      loading={loadingEditDemand}
                      onClick={this.handleSubmit}
                      text="保存"
                    />
                  </Fragment>
                ) : (
                    <OptButton
                      onClick={() => {
                        this.setState({
                          editBool: true,
                        })
                        this.handleQueryUser({})
                      }
                      }
                      style={{
                        backgroundColor: 'white',
                      }}
                      img={editIcon}
                      text="编辑"
                    />
                  )}
              </Fragment>
            }
          >
            {editBool ? (
              <Descriptions column={3} bordered className={styles.clearFormMargin}>
                <DescriptionItem
                  span={3}
                  label={<>{<span style={{ color: 'red' }}>*</span>}标题</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('title', {
                      rules: [{ required: true, message: '标题!' }],
                      initialValue: title,
                    })(<Input.TextArea placeholder="标题" cols={1} rows={1} allowClear />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>需求编号</>}>
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
                      initialValue: Number(status),
                    })(
                      <Select disabled placeholder="请输入状态" style={{ width: w }}>
                        {BOARD_TITLE.map(d => (
                          <Option key={d.boardId} value={d.boardId}>
                            {d.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>预算编号</>}>
                  <FormItem>
                    {form.getFieldDecorator('budgetNumbers', {
                      rules: [{ required: false, message: '请输入预算编号' }],
                      initialValue: budgetNumbers ? String(budgetNumbers) : '',
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
                      </Select>,
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
                      <Select allowClear style={{ width: w }} placeholder="请输入需求类型">
                        {DEMAND_TYPE_ARR.map(d => (
                          <Option key={d.key} value={d.key}>
                            {d.val}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>优先级</>}>
                  <FormItem>
                    {form.getFieldDecorator('priority', {
                      rules: [{ required: false, message: '请输入优先级' }],
                      initialValue: priority,
                    })(
                      <Select allowClear style={{ width: w }} placeholder="请输入优先级">
                        {DEMAND_PRIORITY_ARR.map(d => (
                          <Option key={d.key} value={d.key}>
                            {d.val}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>提出人</>}>
                  <FormItem>
                    {form.getFieldDecorator('introducer', {
                      rules: [{ required: true, message: '请输入提出人' }],
                      initialValue: introducer,
                    })(<Input disabled style={{ width: w }} />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>受理团队</>}>
                  <FormItem>
                    {form.getFieldDecorator('acceptTeamId', {
                      rules: [{ required: false, message: '请输入受理团队' }],
                      initialValue: acceptTeamId,
                    })(
                      <Select
                        allowClear
                        style={{ width: w }}
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
                        {!_.isEmpty(groupList) &&
                          groupList.map(d => (
                            <Option key={d.id} value={d.id}>
                              {d.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>受理人</>}>
                  <FormItem>
                    {form.getFieldDecorator('receiverId', {
                      rules: [{ required: false, message: '请输入受理人' }],
                      initialValue: receiverId ? `${receiverId}-${receiverName}` : '',
                    })(
                      <Select
                        allowClear
                        showSearch
                        style={{ width: w }}
                        placeholder="请输入受理人"
                        onChange={(val) => this.handleQueryGroupBy('user', val)}
                        onSearch={_.debounce(this.handleQueryUser, 500)}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          JSON.stringify(option.props.children)
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {!_.isEmpty(userData) && userData.map(d => (
                          <Option key={d.userId} value={`${d.userId}-${d.userName}`}>
                            {d.userName}
                          </Option>
                        ))}
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
                <DescriptionItem span={1} label={<>计划上线日期</>}>
                  <FormItem>
                    {form.getFieldDecorator('plannedLaunchDate', {
                      rules: [{ required: false, message: '请输入计划上线日期' }],
                      initialValue: plannedLaunchDate ? moment(plannedLaunchDate) : null,
                    })(<DatePicker disabled style={{ width: w }} placeholder="请输入计划上线日期" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>实际上线日期</>}>
                  <FormItem>
                    {form.getFieldDecorator('actualLineDate', {
                      rules: [{ required: false, message: '请输入实际上线日期' }],
                      initialValue: actualLineDate ? moment(actualLineDate) : null,
                    })(
                      <DatePicker style={{ width: w }} disabled placeholder="请输入实际上线日期" />,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>项目编号</>}>
                  <FormItem>
                    {form.getFieldDecorator('projectNo', {
                      rules: [{ required: false, message: '请输入项目编号' }],
                      initialValue: projectNo,
                    })(
                      <Input disabled />,
                    )}
                  </FormItem>
                </DescriptionItem>
                {type === 'u' && (
                  <Fragment>
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
                  </Fragment>
                )}
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}创建人</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('creator', {
                      rules: [{ required: false, message: '请输入创建人' }],
                      initialValue: creator,
                    })(<Input disabled style={{ width: w }} />)}
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
                    })(<Input disabled style={{ width: w }} />)}
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
                <DescriptionItem span={3} label={<>上传附件</>}>
                  <FormItem>
                    <UploadFile
                      uploadType='5'
                      urls={urls}
                      linkId={id}
                      handleSaveFileUrl={this.handleSaveFileUrl}
                    >
                      <Button type='primary' ghost>上传</Button>
                      <span style={{ marginLeft: '16px' }}>限制文件大小为20M以内</span>
                    </UploadFile>
                  </FormItem>
                </DescriptionItem>
              </Descriptions>
            ) : (
                <Descriptions column={3} bordered className={styles.formatDetailDesc}>
                  {detailList.map(
                    (v, i) =>
                      (v.type === type || v.type === 'p') && (
                        <DescriptionItem
                          key={i.toString()}
                          span={v.span}
                          label={
                            <>
                              {v.required && <span style={{ color: 'red' }}>*</span>}
                              {v.name}
                            </>
                          }
                        >
                          {/* eslint-disable-next-line no-nested-ternary */}
                          {(v.dataIndex === 'description'
                            ? (
                              /* eslint-disable */
                              <div
                                className="infoDescription"
                                style={{ border: 0 }}
                                dangerouslySetInnerHTML={{ __html: v.value ? v.value : '--' }}
                              /> /* eslint-disable */
                            )
                            : v.dataIndex === 'file'
                              ? <div className={styles.customFileArea}>
                                {urls && urls.length > 0
                                  ? JSON.parse(urls).map((v, index) => this.renderFile(v, index))
                                  : null}
                              </div>
                              : null) ||
                            (v.arrDict &&
                              <div style={v.style}>{v.arrDict[v.value]}</div>) || (
                              <div style={v.style}>{v.value}</div>
                            )}
                        </DescriptionItem>
                      ),
                  )}
                </Descriptions>
              )}
          </GlobalSandBox>
        </Spin>
        {type === 1 && (
          <MilePlan
            handleQueryLogList={this.handleQueryLogList}
            handleViewCreatePlan={this.handleViewCreatePlan}
            demandNumber={demandNumber}
            showCreateMilePlan={showCreateMilePlan}
          />
        )}
        <GlobalSandBox
          title="新建story"
          img={sdIcon}
          optNode={
            <div>
              <OptButton
                style={{ backgroundColor: 'unset' }}
                img={addIcon}
                onClick={() => {
                  this.setState({
                    addStoryModalVisible: true,
                    selectedStoryDetailRows: {}
                  });
                }}
                text="新建Story"
              />
              <OptButton
                style={{ backgroundColor: 'unset' }}
                img={copyIcon}
                text="复制Story"
                onClick={this.handleCopyStory}
              />
            </div>
          }
        >
          <StoryList
            handleQueryStoryList={this.handleQueryStoryList}
            demandInfo={demandInfo}
            selectedStoryRows={this.state.selectedStoryRows}
            selectedStoryDetailRows={this.state.selectedStoryDetailRows}
            setSelectedStoryRows={rows =>
              this.setState({
                selectedStoryRows: rows,
              })
            }
            setSelectedStoryDetailRows={rows =>
              this.setState({
                selectedStoryDetailRows: rows,
              })
            }
            handleModalVisible={this.handleModalVisible}
            itAssessModalVisible={this.state.itAssessModalVisible}
            addStoryModalVisible={this.state.addStoryModalVisible}
            turnAssessModalVisible={this.state.turnAssessModalVisible}
          />
        </GlobalSandBox>
        {title && (
          <ChartCard
            ITAssignVisible={ITAssignVisible}
            assignorVisible={assignorVisible}
            handleModalVisible={this.handleModalVisible}
            title={title}
          />
        )}
        {/* <GlobalSandBox title="系统需求" img={sdIcon}></GlobalSandBox> */}
        <GlobalSandBox img={budgetLogIcon} title="操作日志">
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            data={logList}
            loading={loadingQueryLogData}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>
    );
  }
}

export default Detail;
