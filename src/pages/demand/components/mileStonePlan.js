import React, { PureComponent, Fragment } from 'react';
import _ from 'lodash'
import moment from 'moment'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import ListOptBtn from '@/components/commonUseModule/listOptBtn';
import editIconList from '@/assets/icon/cz_bj.svg';
import delIcon from '@/assets/icon/cz_del.svg';
import OptButton from '@/components/commonUseModule/optButton';
import sdIcon from '@/assets/icon/modular_xtxq.svg';
import CustomBtn from '@/components/commonUseModule/customBtn';
import { TableColumnHelper, DefaultPage, PagerHelper } from '@/utils/helper';
import { connect } from 'dva'
import {
  Modal,
  Form,
  Col,
  Row,
  Select,
  Input,
  DatePicker,
  Popconfirm
} from 'antd'
import { getParam, getUserInfo } from '@/utils/utils';

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

@Form.create()
@connect(({ demand }) => ({
  demand,
}))
class MilePlan extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: false,
      modalTitle: '新建里程碑计划',
      recordValue: {}
    }
    this.handleVisibleModal = this.handleVisibleModal.bind(this)
  }

  componentDidMount() {
    this.handleQueryList()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showCreateMilePlan) {
      this.handleVisibleModal(true, '新建里程碑计划')
      nextProps.handleViewCreatePlan(false)
    }
  }

  // 查询
  handleQueryList = (params) => {
    const no = getParam('no')
    this.props.dispatch({
      type: 'demand/queryMilePlan',
      payload: {
        demandNo: no,
        ...DefaultPage,
        ...params
      },
    });
  }

  // 新增
  handleAddPlan = (params) => {
    this.props.dispatch({
      type: 'demand/addMilePlan',
      payload: {
        ...params
      },
    }).then(res => {
      if (res) {
        this.handleVisibleModal(false)
        this.handleQueryList()
        this.props.handleQueryLogList()
      }
    })
  }

  // 编辑
  handleEditPlan = (params) => {
    this.props.dispatch({
      type: 'demand/updateMilePlan',
      payload: {
        ...params
      },
    }).then(res => {
      if (res) {
        this.handleVisibleModal(false)
        this.handleQueryList()
        this.props.handleQueryLogList()
      }
    })
  }

  // 删除
  handleDeletePlan = (id) => {
    this.props.dispatch({
      type: 'demand/deleteMilePlan',
      payload: {
        id
      },
    }).then(res => {
      if (res) {
        this.handleQueryList()
        this.props.handleQueryLogList()
      }
    })
  }

  handleSubmit = () => {
    const { modalTitle, recordValue } = this.state
    const { demandNumber, demand } = this.props
    const { planStageListMap } = demand
    this.props.form.validateFields((err, values) => {
      if (err) return true;
      if (values.planTime && !_.isEmpty(values.planTime)) {
        values.stageStart = moment(values.planTime[0]).format('YYYY-MM-DD')
        values.stageEnd = moment(values.planTime[1]).format('YYYY-MM-DD')
      }
      values.headName = planStageListMap[values.headId]
      values.demandNo = demandNumber
      if (modalTitle === '编辑') {
        values.id = recordValue.id
        this.handleEditPlan(values)
        return true
      }
      this.handleAddPlan(values)
    });
  }

  handleVisibleModal(bool, modalTitle, record = {}){
    this.setState({
      visibleModal: bool,
      modalTitle: bool ? modalTitle : '',
      recordValue: record,
    })
  }

  // 项目里程碑分页
  handleStandardTableChangePro = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryList(params);
  };

  genModal = () => {
    const { demand, form } = this.props
    const { planStageList } = demand
    const { visibleModal, modalTitle, recordValue } = this.state
    const {
      target,
      stageStart,
      stageEnd,
      stage,
      headId,
    } = recordValue
    return (
      <Modal
        visible={visibleModal}
        title={modalTitle}
        width='794px'
        onCancel={() => this.handleVisibleModal(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CustomBtn
              onClick={() => this.handleVisibleModal(false)}
              type="cancel"
              style={{ marginRight: '18px' }}
            />
            <CustomBtn
              onClick={this.handleSubmit}
              type="save"
            />
          </div>
        }
      >
        <Row>
          <Col span={24}>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="里程碑计划">
              {form.getFieldDecorator('stage', {
                rules: [{ required: true, message: '请输入里程碑计划' }],
                initialValue: stage,
              })(
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入里程碑计划"
                  style={{
                    width: '100%'
                  }}
                >
                  {!_.isEmpty(planStageList) &&
                    planStageList.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.stageName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="里程碑时间段">
              {form.getFieldDecorator('planTime', {
                rules: [{ required: true, message: '请输入里程碑时间段' }],
                initialValue: stageStart ? [moment(stageStart), moment(stageEnd)] : [],
              })(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="负责人">
              {form.getFieldDecorator('headId', {
                rules: [{ required: false, message: '请输入负责人' }],
                initialValue: headId ? Number(headId) : '',
              })(
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入负责人"
                  style={{
                    width: '100%'
                  }}
                >
                  {!_.isEmpty(planStageList) &&
                    planStageList.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.stageName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="目标">
              {form.getFieldDecorator('target', {
                rules: [{ required: false, message: '请输入目标' }],
                initialValue: target,
              })(
                <Input.TextArea placeholder='请输入目标' />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    )
  }

  render() {
    const { demand } = this.props
    const { milePlanList, planStageListMap, demandInfo={} } = demand
    const { receiver_name, status } = demandInfo
    const { visibleModal } = this.state
    const { userInfo:{userName} } = getUserInfo()
    const proColumns = [
      {
        title: '里程碑阶段',
        dataIndex: 'stage',
        key: 'stage',
        render: (text, record) => {
          return planStageListMap[record.stage]
        }
      },
      {
        title: '里程碑时间段',
        dataIndex: 'planTime',
        key: 'planTime',
        render: (text, record) => {
          return (
            <span>{record.stageStart} — {record.stageEnd}</span>
          )
        }
      },
      TableColumnHelper.genPlanColumn('target', '目标'),
      TableColumnHelper.genPlanColumn('headName', '负责人'),
      TableColumnHelper.genPlanColumn('createUserName', '创建人'),
      TableColumnHelper.genPlanColumn('createTime', '创建时间'),
      {
        title: '操作',
        align: 'left',
        width: 190,
        render: (text, record) => {
          return (
            <div>
              <ListOptBtn
                title="编辑"
                style={{
                  fontSize: '20px',
                  marginRight: '16px',
                  position: 'relative',
                  top: '1px',
                }}
                onClick={() => this.handleVisibleModal(true, '编辑', record)}
                icon={editIconList}
              />
              <Popconfirm
                content='确认删除当前数据吗？'
                onConfirm={() => this.handleDeletePlan(record.id)}
              >
                <ListOptBtn
                  icon={delIcon}
                  style={{
                    fontSize: '20px',
                    marginRight: '16px',
                    position: 'relative',
                    top: '1px',
                  }}
                  title="删除"
                />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return (
      <Fragment>
        {visibleModal && this.genModal()}
        <GlobalSandBox
          title="项目里程碑"
          img={sdIcon}
          optNode={
            <OptButton
              onClick={() => this.handleVisibleModal(true, '新建里程碑计划')}
              style={{
                backgroundColor: 'white',
              }}
              disabled={ (status !== '4' || status !== '5') && receiver_name !== userName}
              icon="plus"
              text="新建"
            />
          }
        >
          <StandardTable
            rowKey={(record, index) => index}
            columns={proColumns}
            data={milePlanList}
            // loading={loadingQueryLogData}
            onChange={this.handleStandardTableChangePro}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}

export default MilePlan