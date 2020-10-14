import React, { PureComponent, Fragment } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import Editor from '@/components/TinyEditor';
import OptButton from '@/components/commonUseModule/optButton';
import { TableColumnHelper, DefaultPage } from '@/utils/helper';
import { getParam } from '@/utils/utils'
import flowIcon from '@/assets/icon/modular_lcjd.svg';
import budgetXqIcon from '@/assets/icon/modular_xq.svg';
import budgetLogIcon from '@/assets/icon/modular_czrz.svg';
import editIcon from '@/assets/icon/Button_bj.svg';
import arrowBlueIcon from '@/assets/icon/arrow_blue.png';
import arrowGreyIcon from '@/assets/icon/arrow_grey.png';
import waitIcon from '@/assets/icon/xm_jxz.svg';
import xqIcon from '@/assets/icon/xm.svg';
import {
  Form,
  Descriptions,
  Input,
  Select,
  Icon
} from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import { DEMAND_PRIORITY_ARR, PROJECT_STATUS_ARR, PROJECT_STATUS_OBJ } from '../utils/constant'
import styles from '../index.less'

const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const { Option } = Select

@Form.create()
@connect(({ project }) => ({
  project
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editBool: false,
      descriptionState: ''
    }
  }

  componentDidMount() {
    this.handleQueryInfo()
    this.handleQueryLogList()
  }

  handleChangeDesc = content => {
    this.setState({
      descriptionState: content,
    });
  };

  // 查询详情
  handleQueryInfo = () => {
    const id = getParam('id');
    this.props.dispatch({
      type: 'project/queryProjectInfo',
      payload: {
        id,
      }
    })
  }

  // 查日志
  handleQueryLogList = (obj = {}) => {
    const id = getParam('id');
    const params = {
      linkId: id,
      type: '7',
    };
    this.props.dispatch({
      type: 'project/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
        ...obj,
      },
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

  // 日志分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params);
  };

  handleSubmit = () => {
    const { form } = this.props
    const { descriptionState } = this.state
    const id = getParam('id')
    form.validateFields(['pjStage', 'pjMgType', 'buildType', 'systemLevel'], (err, values) => {
      if (err) {
        return false
      }
      console.log(values)
      values.id = id
      values.pjDesc = descriptionState
      this.props.dispatch({
        type: 'project/updateProject',
        payload: {
          ...values
        }
      }).then(res => {
        if (res) {
          this.handleQueryInfo()
          this.handleQueryLogList()
          this.setState({
            editBool: false,
          })
        }
      })
    })
  }

  render() {
    const { editBool, descriptionState } = this.state
    const { form, project } = this.props
    const { projectInfo, stageStatus } = project
    const {
      pjName,
      pjSn,
      pjStage,
      pjProgress,
      pjProgressDeviation,
      pjHealthStatus,
      demandLevel,
      budgetNo,
      demandNo,
      estTeam,
      estAmount,
      techStage,
      estStage,
      pjMgType,
      bnStatus,
      buildType,
      systemLevel,
      pjDesc,
      pjType,
      pjId,
      createTime,
      updateTime,
      pjUpdateUserId,
      pjUpdateUserName,
      pmId,
      pm,
      contractAmount,
      pretermId
    } = projectInfo
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '操作人', { width: '100px' }),
      TableColumnHelper.genPlanColumn('content', '操作内容'),
      TableColumnHelper.genPlanColumn('updateTime', '操作时间', { width: '100px' }),
    ];

    const proColumns = [
      TableColumnHelper.genPlanColumn('operateUserName', '里程碑阶段'),
      TableColumnHelper.genPlanColumn('content1', '负责人'),
      TableColumnHelper.genPlanColumn('updateTime', '计划完成日期'),
      TableColumnHelper.genPlanColumn('content2', '创建人'),
      TableColumnHelper.genPlanColumn('content3', '创建时间'),
      TableColumnHelper.genPlanColumn('content4', '修改人'),
      TableColumnHelper.genPlanColumn('content5', '修改时间'),
    ];

    const detailList = [
      {
        span: 2,
        required: false,
        name: '项目名称',
        value: pjName,
        style: { whiteSpace: 'pre' },
      },
      { span: 1, required: false, name: '项目编号', value: pjSn },
      {
        span: 1,
        required: false,
        name: '项目优先级',
        value: '文档中无对应字段',
        type: 'p',
        // arrDict: BOARD_TITLE_OBJ,
      },
      { span: 1, required: false, name: '项目状态', value: pjStage, arrDict: PROJECT_STATUS_OBJ },
      {
        span: 1,
        required: false,
        name: '项目进度',
        value: pjProgress,
      },
      {
        span: 1,
        required: false,
        name: '项目进度偏差',
        value: pjProgressDeviation,
      },
      { span: 1, required: false, name: '项目健康状态', value: pjHealthStatus },
      { span: 1, required: false, name: '需求优先级', value: demandLevel },
      { span: 1, required: false, name: '预算编号', value: budgetNo },
      { span: 1, required: false, name: '所属需求编号', value: demandNo },
      { span: 1, required: false, name: '需求提出部门', value: '文档中无对应字段' },
      { span: 1, required: false, name: '立项申请团队', value: estTeam },
      { span: 1, required: false, name: '技术评审立项金额（万）', value: estAmount },
      { span: 1, required: false, name: '立项评审金额（万）', value: '文档中无对应字段' },
      { span: 1, required: false, name: '合同成交金额（万）', value: contractAmount },
      { span: 1, required: false, name: '业务集群/板块', value: '文档中无对应字段' },
      { span: 1, required: false, name: '供应商', value: '文档中无对应字段' },
      { span: 1, required: false, name: '技术评审状态', value: techStage },
      { span: 1, required: false, name: '立项评审状态', value: estStage },
      { span: 1, required: false, name: '商务状态', value: bnStatus },
      { span: 1, required: false, name: '项目管理类型', value: pjMgType },
      { span: 1, required: false, name: '建设方式', value: buildType },
      { span: 1, required: false, name: '系统级别', value: systemLevel },
      { span: 1, required: false, name: '项目负责人', value: pm },
      { span: 2, required: false, name: '项目创建时间', value: createTime },
      { span: 1, required: false, name: '项目描述', value: pjDesc, dataIndex: 'description' },
    ];

    const btnStyle = {
      border: '1px solid #D63649',
      borderRadius: '2px',
      color: '#D63649',
    };

    const w = { width: '100%' }

    const renderArrow = (count, index) => {
      if (index === 6) return ''
      if (count - index > 1) return <img alt='' src={arrowBlueIcon} />
      return <img alt='' src={arrowGreyIcon} />
    }

    const renderFlowIcon = (count, index) => {
      if (count - index > 1) return <Icon style={{ fontSize: '32px' }} component={xqIcon} />
      if (count - 1 === index) return <Icon style={{ fontSize: '32px' }} component={waitIcon} />
      return (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#606265',
            fontSize: 14,
            backgroundColor: '#e5e9f2',
          }}
        >
          {index + 1}
        </div>
      );
    }

    return (
      <Fragment>
        <GlobalSandBox title="项目进度" img={flowIcon}>
          <div className={styles.arrowBox}>
            {PROJECT_STATUS_ARR.map((v, index) => {
              const count = 3
              return (
                <div className={styles.arrowBox_arr} style={{ width: index === 6 ? '4vw' : '15vw' }}>
                  <div className={styles.arrowBox_arr_left}>
                    {renderFlowIcon(count, index)}
                    {index === 6
                      ? <span
                        className={styles.arrowBox_arr_left_title}
                        style={{ color: '#2E384D', left: '-15px' }}
                      >{v.val}
                      </span>
                      : <span
                        className={styles.arrowBox_arr_left_title}
                        style={{ color: index < count ? '#2E5BFF' : '#2E384D' }}
                      >{v.val}
                      </span>}
                  </div>
                  <div className={styles.arrowBox_arr_arrow}>
                    {renderArrow(count, index)}
                  </div>
                </div>
              )
            })}
          </div>
        </GlobalSandBox>
        <GlobalSandBox
          title="项目详情"
          img={budgetXqIcon}
          optNode={
            !editBool ? (
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                onClick={() => {
                  this.setState({
                    editBool: true,
                  });
                  this.handleChangeDesc(pjDesc)
                }}
                img={editIcon}
                text="编辑"
              />
            ) : (
                <div>
                  <OptButton
                    style={{
                      ...btnStyle,
                      backgroundColor: 'white',
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
                      marginLeft: '16px',
                    }}
                    onClick={() => this.handleSubmit()}
                    text="保存"
                  />
                </div>
              )
          }
        >
          {editBool
            ? <Descriptions column={3} bordered className={styles.clearFormMargin}>
              <Fragment>
                <DescriptionItem
                  span={2}
                  label={<>项目名称</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjName', {
                      initialValue: pjName,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjSn', {
                      initialValue: pjSn,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目优先级</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('priority', {
                      // initialValue: priority,
                    })(
                      <Select allowClear disabled style={w}>
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
                  label={<>项目状态</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjStage', {
                      rules: [{ required: false, message: '请输入项目状态' }],
                      initialValue: pjStage ? Number(pjStage) : '',
                    })(
                      <Select allowClear style={w} placeholder="请输入项目状态">
                        {!_.isEmpty(stageStatus) &&
                          stageStatus.map(d => (
                            <Option key={d.id} value={d.id}>
                              {d.pjStageName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目进度</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjProgress', {
                      initialValue: pjProgress,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目进度偏差</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjProgressDeviation', {
                      initialValue: pjProgressDeviation,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目健康状态</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjHealthStatus', {
                      initialValue: pjHealthStatus,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>需求优先级</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('demandLevel', {
                      initialValue: demandLevel,
                    })(
                      <Select disabled style={w}>
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
                  label={<>预算编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('budgetNo', {
                      initialValue: budgetNo,
                    })(
                      <Input disabled />
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>所属需求编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('demandNo', {
                      initialValue: demandNo,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>需求提出部门</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      // initialValue: name,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>立项申请团队</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('estTeam', {
                      initialValue: estTeam,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>技术评审立项金额（万）</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('estAmount', {
                      initialValue: estAmount,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>立项评审金额（万）</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      // initialValue: name,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>合同成交金额（万）</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      // initialValue: name,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>业务集群/板块</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      // initialValue: name,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>供应商</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      // initialValue: name,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>技术评审状态</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('techStage', {
                      initialValue: techStage,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>立项评审状态</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('estStage', {
                      initialValue: estStage,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>商务状态</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('bnStatus', {
                      initialValue: bnStatus,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目管理类型</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('pjMgType', {
                      initialValue: pjMgType,
                    })(
                      <Select
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          JSON.stringify(option.props.children)
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={w}
                        placeholder="请输入项目管理类型"
                      >
                        {/* {!_.isEmpty(stageStatus) &&
                        stageStatus.map(d => (
                          <Option key={d.id} value={d.id}>
                            {d.pjStageName}
                          </Option>
                        ))} */}
                        <Option key='1' value='1'>研发管理类</Option>
                        <Option key='2' value='2'>需求起草类</Option>
                      </Select>
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>建设方式</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('buildType', {
                      initialValue: buildType,
                    })(
                      <Select
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          JSON.stringify(option.props.children)
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={w}
                        placeholder="请输入项目建设方式"
                      >
                        {/* {!_.isEmpty(stageStatus) &&
                    stageStatus.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.pjStageName}
                      </Option>
                    ))} */}
                        <Option key='1' value='1'>外包采购</Option>
                        <Option key='2' value='2'>部门研发</Option>
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>系统级别</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('systemLevel', {
                      initialValue: systemLevel,
                    })(
                      <Select
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          JSON.stringify(option.props.children)
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        style={w}
                        placeholder="请输入系统级别"
                      >
                        {/* {!_.isEmpty(stageStatus) &&
                    stageStatus.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.pjStageName}
                      </Option>
                    ))} */}
                        <Option key='1' value='1'>未定义</Option>
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>项目负责人</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('createTime', {
                      initialValue: createTime,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={3}
                  label={<>项目创建时间</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      // initialValue: name,
                    })(<Input style={w} disabled />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={3} label={<>描述</>}>
                  <FormItem>
                    <Editor
                      editorKey="myContractAdd"
                      height={300}
                      content={descriptionState}
                      onContentChange={content => this.handleChangeDesc(content)}
                    />
                  </FormItem>
                </DescriptionItem>
              </Fragment>
              </Descriptions>
            : <Descriptions column={3} bordered className={styles.formatDetailDesc}>
              {
                detailList.map(
                  (v, i) =>
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
                      {(v.dataIndex === 'description' && (
                        /* eslint-disable */
                        <div
                          className="infoDescription"
                          style={{ border: 0 }}
                          dangerouslySetInnerHTML={{ __html: v.value ? v.value : '--' }}
                        /> /* eslint-disable */
                      )) ||
                        (v.arrDict && <div style={v.style}>{v.arrDict[v.value]}</div>) || (
                          <div style={v.style}>{v.value}</div>
                        )}
                    </DescriptionItem>
                )}
            </Descriptions>
          }
        </GlobalSandBox>
        <GlobalSandBox title="项目里程碑计划" img={budgetXqIcon}>
          <StandardTable
            rowKey={(record, index) => index}
            columns={proColumns}
          // data={logList}
          // loading={loadingQueryLogData}
          // onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
        <GlobalSandBox title="项目日志" img={budgetLogIcon}>
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            // data={logList}
            // loading={loadingQueryLogData}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}
export default Detail