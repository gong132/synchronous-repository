import React, { Component } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import moment from 'moment'
import StandardTable from "@/components/StandardTable";
import { DefaultPage } from "@/utils/helper";
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import Ellipse from '@/components/commonUseModule/ellipse'
import editIcon from '@/assets/icon/cz_bj.svg';
import eyeIcon from '@/assets/icon/cz_ck.svg'
import lcbIcon from '@/assets/icon/cz_lcbjh.svg'
import { formLayoutItem } from '@/utils/constant'
import downIcon from '@/assets/icon/drop_down.svg'
import upIcon from '@/assets/icon/Pull_up.svg'
import CustomBtn from '@/components/commonUseModule/customBtn'
import EditModal from './components/editModal'
import {
  Form,
  Input,
  Select,
  Card,
  Popover,
  Icon,
  Row,
  Col,
  DatePicker
} from 'antd'
import * as _ from 'lodash'
import { PROJECT_STATUS_OBJ } from './utils/constant'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker
@Form.create()
@connect(({ project, loading }) => ({
  project,
  loadingQueryData: loading.effects['project/queryProjectList']
}))
class ProjectManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchMore: false,
      viewModal: false,
    }
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500);
  }

  componentDidMount() {
    this.handleQueryCluster()
    this.handleQueryStage()
    this.handleQueryData()
    this.handleQueryBudget()
    this.handleQuerySupplier()
    this.handleQueryUser()
    this.handleQueryGroup()
  }

  // 查人员
  handleQueryUser = (params) => {
    this.props.dispatch({
      type: 'project/queryUser',
      payload: {
        ...params
      }
    })
  }

  // 查团队
  handleQueryGroup = (params) => {
    this.props.dispatch({
      type: 'project/queryTeam',
      payload: {
        ...params
      }
    })
  }

  // 查预算编号
  handleQueryBudget = (number) => {
    this.props.dispatch({
      type: 'project/fetchBudgetNumber',
      payload: {
        number
      }
    })
  }

  // 查供应商
  handleQuerySupplier = (name) => {
    this.props.dispatch({
      type: 'project/querySupplier',
      payload: {
        name
      }
    })
  }

  // 查询集群列表
  handleQueryCluster = (name) => {
    this.props.dispatch({
      type: 'project/queryAllCluster',
      payload: { name }
    })
  }

  // 查询阶段
  handleQueryStage = () => {
    this.props.dispatch({
      type: 'project/queryAllStageStatus',
    })
  }

  handleQueryData = (params = {}) => {
    this.props.dispatch({
      type: 'project/queryProjectList',
      payload: {
        teamId: '申请团队1',
        sort: 'id',
        order: 'desc',
        ...DefaultPage,
        ...params,
      },
    });
  };

  // 更多查询
  moreQuery = () => {
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD')
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD')
    } else if (formValues.defendPayTime) {
      formValues.defendPayTime = moment(formValues.defendPayTime).format('YYYY-MM-DD')
    }
    this.handleDebounceQueryData(formValues);
  };

  saveParams = () => {
    this.moreQuery();
  };

  // 搜索时防抖
  handleDebounceQueryData = params => {
    this.handleQueryData(params);
  };

  setSearchMore = bool => {
    this.setState({
      searchMore: bool,
    });
  };

  handlePlan = () => {

  }

  handleViewModal = (bool, record) => {
    this.setState({
      viewModal: bool,
    })
    if (bool) {
      this.props.dispatch({
        type: 'project/queryProjectInfo',
        payload: {
          id: record.id,
        }
      })
    }
  }

  handleViewDetail = (record = {}) => {
    router.push({
      pathname: '/projectDetail',
      query: {
        id: record.id
      }
    })
  }

  // 分页操作
  handleStandardTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD');
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD');
    }
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };

    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    this.handleQueryData({ ...params, ...sortParams });
  };

  renderSearchForm = () => {
    const { searchMore } = this.state
    const { project, form } = this.props
    const {
      loadingQueryData,
      clusterList,
      stageStatus,
      budgetList,
      supplierList,
      userList,
      groupList,
    } = project;
    const { getFieldDecorator } = form
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem colon={false} label="所属需求编号">
              {getFieldDecorator('demandKey', {
              })(<Input allowClear placeholder="请输入需求编号/名称关键字" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目编号">
              {getFieldDecorator(
                'pjCodeKey',
                {},
              )(<Input allowClear placeholder="请输入项目编号" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目进度百分比">
              <div className="yCenter" style={{ height: 41 }}>
                {getFieldDecorator(
                  'pjProgressStart',
                  {},
                )(<Input allowClear addonAfter="%" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'pjProgressEnd',
                  {},
                )(<Input allowClear addonAfter="%" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目进度偏差">
              <div className="yCenter" style={{ height: 41 }}>
                {getFieldDecorator(
                  'expectTotalAmountLow',
                  {},
                )(<Input allowClear addonAfter="%" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'expectTotalAmountMax',
                  {},
                )(<Input allowClear addonAfter="%" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目健康状态">
              {getFieldDecorator(
                'pjProgressDeviation',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择项目健康状态"
                >
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目优先级">
              {getFieldDecorator(
                'headerId',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择项目优先级"
                >
                  {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label='预算编号'>
              {getFieldDecorator('budgetNoKey', {
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
                  placeholder="请输入预算编号关键字"
                  style={{
                    width: '100%',
                  }}
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
          <Col span={24}>
            <FormItem colon={false} label="合同成交金额">
              <div className="yCenter" style={{ height: 41 }}>
                {getFieldDecorator(
                  'expectTotalAmountLow',
                  {},
                )(<Input allowClear addonAfter="万" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'expectTotalAmountMax',
                  {},
                )(<Input allowClear addonAfter="万" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="供应商">
              {getFieldDecorator(
                'headerTeamId ',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商名称关键字"
                >
                  {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  {/* <Option key='p' value='p'>未定义</Option> */}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="建设方式">
              {getFieldDecorator(
                'headerTeamId ',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder='请选择建设方式'
                >
                  {/* {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))} */}
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目负责人">
              {getFieldDecorator('signTime', {
              })(
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  onSearch={val => this.handleQueryUser({lastname: val})}
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入负责人工号/名称关键字"
                  style={{
                    width: '100%',
                  }}
                >
                  {!_.isEmpty(userList) &&
                    userList.map(d => (
                      <Option key={d.loginid} value={d.loginid}>
                        {d.lastname}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="立项申请团队">
              {getFieldDecorator('estTeam', {
              })(
                <Select
                  allowClear
                  showSearch
                  onSearch={_.debounce(this.handleQueryGroup, 500)}
                  onFocus={this.handleQueryGroup}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{
                    width: '100%',
                  }}
                  placeholder='请输入团队名称关键字'
                >
                  {!_.isEmpty(groupList) && groupList.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="技术评审申请时间">
              {getFieldDecorator('defendPayTime', {
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="立项评审申请时间">
              {getFieldDecorator('defendPayTime', {
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <CustomBtn
            onClick={() => this.setSearchMore(false)}
            type='cancel'
          />
          <CustomBtn
            onClick={() => this.moreQuery(false)}
            type='save'
            title='确认'
            loading={loadingQueryData}
          />
        </div>
      </div>
    );
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={5}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false} label="项目名称和描述">
            {getFieldDecorator('searchKey', {
            })(<Input
              allowClear
              onChange={_.debounce(this.saveParams, 500)}
              placeholder='请输入项目名称和描述'
            />)}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formLayoutItem} colon={false} label="项目状态">
            {getFieldDecorator('pjStage', {
            })(
              <Select
                allowClear
                // showSearch
                onChange={_.debounce(this.saveParams, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '100%'
                }}
                placeholder="请输入项目状态"
              >
                {!_.isEmpty(stageStatus) &&
                  stageStatus.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.pjStageName}
                    </Option>
                  ))}
                {/* <Option key='p' value='p'>未定义</Option> */}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} colon={false} label="业务集群/板块">
            {getFieldDecorator('clusterName', {
            })(
              <Select
                allowClear
                showSearch
                onChange={_.debounce(this.saveParams, 500)}
                onSearch={_.debounce(this.handleQueryCluster, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '100%'
                }}
                placeholder="请输入业务集群/板块"
              >
                {
                  clusterList.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="商务状态">
            {getFieldDecorator(
              'bnStatus',
              {},
            )(
              <Select
                allowClear
                // showSearch
                style={{
                  width: '100%',
                }}
                placeholder="请输入商务状态"
              >
                <Option key='p' value='p'>未定义</Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              loading={loadingQueryData}
              type='reset'
            />
            <Popover visible={searchMore} placement="bottomRight" content={content} trigger="click">
              {
                <div
                  className="activeColor"
                  onClick={() => this.setSearchMore(!searchMore)}
                  style={{
                    float: 'right',
                    position: 'relative',
                    top: '5px'
                  }}
                >
                  <div className={styles.moreBtn}>
                    <Icon component={searchMore ? downIcon : upIcon} />
                    <span>更多</span>
                  </div>
                </div>
              }
            </Popover>
          </FormItem>
        </Col>
      </Row>
    );
  };

  genColumns = () => {
    const columns = [
      {
        title: <Ellipse text='项目编号' style={{ width: 57 }} />,
        dataIndex: 'pjCode',
        key: 'pjCode',
        sorter: true,
        align: 'center',
        render: (text, record) => {
          return (
            <Ellipse
              text={text}
              onClick={() => this.handleViewDetail(record)}
              className="globalStyle"
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目名称' style={{ width: 57 }} />,
        dataIndex: 'pjName',
        key: 'pjName',
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目状态' style={{ width: 57 }} />,
        dataIndex: 'pjStage',
        key: 'pjStage',
        sorter: true,
        align: 'center',
        render: (text) => {
          text = PROJECT_STATUS_OBJ[text]
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目进度' style={{ width: 57 }} />,
        dataIndex: 'pjProgress',
        key: 'pjProgress',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目优先级' style={{ width: '3vw' }} />,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '3vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='立项金额' style={{ width: 57 }} />,
        dataIndex: 'estAmount',
        key: 'estAmount',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='业务集群/板块' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='商务状态' style={{ width: 57 }} />,
        dataIndex: 'bnStatus',
        key: 'bnStatus',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='立项申请团队' style={{ width: 57 }} />,
        dataIndex: 'estTeam',
        key: 'estTeam',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              {<ListOptBtn
                title="编辑"
                onClick={() => this.handleViewModal(true, record)}
                style={{
                  fontSize: '20px',
                  marginRight: '12px',
                  position: 'relative',
                  top: '1px'
                }}
                icon={editIcon}
              />}
              {<ListOptBtn
                title="查看"
                onClick={() => this.handleViewDetail(record)}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  marginRight: '12px',
                  top: '5px'
                }}
                icon={eyeIcon}
              />}
              {
                <ListOptBtn
                  title='里程碑计划'
                  onClick={() => this.handlePlan()}
                  style={{
                    fontSize: '20px',
                    position: 'relative',
                    top: '1px'
                  }}
                  icon={lcbIcon}
                />
              }
            </div>
          );
        }
      },
    ]
    return columns
  }

  render() {
    const { viewModal } = this.state
    const editModalProps = {
      visible: viewModal,
      handleViewModal: this.handleViewModal,
      moreQuery: this.moreQuery
    }
    const { project: { projectList }, loadingQueryData } = this.props
    return (
      <Card>
        {viewModal && <EditModal {...editModalProps} />}
        <div className={styles.customSearchForm}>{this.renderSearchForm()}</div>
        <div className='cusOverflow'>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={projectList}
            loading={loadingQueryData}
            // dataSource={[
            //   { number: 'gong', systemName: 'gg', name: '国庆放假不调休，哈哈哈' },
            //   { number: 'gong2', systemName: 'gg' },
            //   { number: 'gong3', systemName: 'gg' }
            // ]}
            onChange={this.handleStandardTableChange}
          // scroll={{ x: 1800 }}
          />
        </div>
      </Card>
    );
  }
}

export default ProjectManage