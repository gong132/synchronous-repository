import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import moment from 'moment'
import StandardTable from "@/components/StandardTable";
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import { formLayoutItem, MENU_ACTIONS } from '@/utils/constant'
import Ellipse from '@/components/commonUseModule/ellipse'
import { exportExcel } from '@/utils/utils'
import CustomBtn from '@/components/commonUseModule/customBtn'
import editIcon from '@/assets/icon/cz_bj.svg'
import eyeIcon from '@/assets/icon/cz_ck.svg'
import downIcon from '@/assets/icon/drop_down.svg'
import upIcon from '@/assets/icon/Pull_up.svg'
import {
  Form,
  Input,
  Select,
  Card,
  Popover,
  Icon,
  Row,
  Col,
  Button,
  DatePicker
} from 'antd'
import _ from 'lodash'
import styles from './index.less'

import CreateContract from './components/createContract';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ contract, loading, global }) => ({
  global,
  contract,
  loadingQueryData: loading.effects['contract/queryData'],
  loadingCreateData: loading.effects['contract/addData'],
  loadingUpdateData: loading.effects['contract/updateData'],
}))
class ContractManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      searchMore: false,
      modalTitle: '新建',
      clientWidth: 0
    };
    // this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500);
    this.saveParams = _.debounce(this.saveParams, 500)
  }

  componentDidMount() {
    this.handleQueryDept()
    this.handleQueryData()
    this.handleQueryProject()
    this.handleQuerySystem()
    this.handleQuerySupplier()
    this.handleQueryGroup()
    this.handleQueryBudget()
    this.handleQueryCluster()
    this.handleQueryUser()

    const w = document.body.clientWidth
    this.setState({
      clientWidth: w
    })
  }

  // 导出
  handleExportExcel = () => {
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD')
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD')
    } else if (formValues.defendPayTime) {
      formValues.defendPayTime = moment(formValues.defendPayTime).format('YYYY-MM-DD')
    }
    exportExcel(formValues, 'contract/export', 'post', '合同表单数据.xls')
  }

  handleQueryData = (params = {}) => {
    this.props.dispatch({
      type: 'contract/queryData',
      payload: {
        ...DefaultPage,
        ...params,
      },
    });
  };

  // 查看板块详情
  handleQuerySectorInfo = params => {
    this.props.dispatch({
      type: 'contract/fetchContractInfo',
      payload: {
        ...params,
      },
    });
  };

  // 更多查询
  moreQuery = () => {
    const formValues = this.props.form.getFieldsValue();
    console.log(formValues)
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

  // 查部门
  handleQueryDept = (value) => {
    this.props.dispatch({
      type: 'contract/fetchNotBindDept',
      payload: {
        deptName: value
      }
    })
  }

  // 查项目
  handleQueryProject = () => {
    this.props.dispatch({
      type: 'contract/fetchAllProject',
    });
  };

  // 查预算编号
  handleQueryBudget = (number) => {
    this.props.dispatch({
      type: 'contract/fetchBudgetNumber',
      payload: {
        number
      }
    })
  }

  // 查询系统
  handleQuerySystem = (val) => {
    this.props.dispatch({
      type: 'contract/fetchSystem',
      payload: {
        name: val,
      }
    });
  };

  // 查询供应商
  handleQuerySupplier = (value) => {
    this.props.dispatch({
      type: 'contract/fetchSupplier',
      payload: {
        name: value
      }
    });
  };

  // 查询团队
  handleQueryGroup = (val, type) => {
    const params = {}
    if (type) {
      params[type] = val
    } else {
      params.teamName = val
    }
    this.props.dispatch({
      type: 'contract/fetchHeaderGroup',
      payload: {
        ...params
      }
    });
  };

  // 模糊查询人员
  handleQueryUserBy = (userName) => {
    this.handleQueryUser({ userName })
  }

  // 查人员
  handleQueryUser = (params) => {
    this.props.dispatch({
      type: 'contract/fetchUserData',
      payload: {
        ...params
      }
    });
  };

  // 通过团队查人员
  handleChangeGroup = (val) => {
    const { form } = this.props
    form.resetFields(['headerId'])
    this.handleQueryUser({ teamId: val })
    this.saveParams()
  }

  // 通过人员id查团队
  handleQueryGroupBy = async (type, val) => {
    this.saveParams()
    if (type === 'user') {
      const res = await this.handleQueryGroup(String(val), 'userId')
      const { contract: { groupList }, form } = this.props
      if (res && !_.isEmpty(groupList)) {
        form.setFieldsValue({ 'headerTeamId': groupList[0].id })
      }
    }
  }

  // 查询集群列表
  handleQueryCluster = (name) => {
    this.props.dispatch({
      type: 'contract/queryAllCluster',
      payload: { name }
    })
  }

  // 分页操作
  handleStandardTableChange = (pagination, filters, sorter) => {
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

  handleViewModal = (bool, title, record = {}) => {
    this.setState({
      visibleModal: bool,
      modalTitle: title,
    });
    if (record.id) {
      this.handleQuerySectorInfo({ id: record.id });
    } else {
      this.props.dispatch({
        type: 'contract/saveData',
        payload: {
          contractInfo: {},
        },
      });
    }
  };

  setSearchMore = bool => {
    this.setState({
      searchMore: bool,
    });
  };

  handleResetSearch = () => {
    this.props.form.resetFields();
    this.handleDebounceQueryData();
  };

  handleViewDetail = record => {
    router.push({
      pathname: '/contract-budget/contract/detail',
      query: {
        id: record.id,
      },
    });
  };

  renderSearchForm = () => {
    const { searchMore } = this.state
    const {
      contract: { deptList, userData, groupList, projectList, supplierList, clusterList, budgetList },
      loadingQueryData,
      form: { getFieldDecorator }
    } = this.props;
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem colon={false} label="预算编号">
              {getFieldDecorator('budgetNumber', {
              })(
                <Select
                  allowClear
                  showSearch
                  onSearch={_.debounce(this.handleQueryBudget, 500)}
                  onChange={this.saveParams}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder='请输入预算编号'
                  style={{
                    width: '100%'
                  }}
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
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同描述">
              {getFieldDecorator(
                'description',
                {},
              )(<Input allowClear onChange={this.saveParams} placeholder="请输入合同描述" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="所属部门">
              {getFieldDecorator(
                'deptId',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onSearch={_.debounce(this.handleQueryDept, 500)}
                  onChange={this.saveParams}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder='请输入所属部门'
                  style={{
                    width: '100%',
                  }}
                >
                  {!_.isEmpty(deptList) && deptList.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="供应商">
              {getFieldDecorator(
                'providerCompanyName',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onSearch={_.debounce(this.handleQuerySupplier, 500)}
                  onChange={this.saveParams}
                  onFocus={this.handleQuerySupplier}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商"
                >
                  {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.id} value={d.name}>
                        {d.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同负责人">
              {getFieldDecorator(
                'headerId',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onChange={(val) => this.handleQueryGroupBy('user', val)}
                  onSearch={_.debounce(this.handleQueryUserBy, 500)}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入合同负责人"
                >
                  {!_.isEmpty(userData) && userData.map(d => (
                    <Option key={d.userId} value={d.userId}>
                      {d.userName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同负责人团队">
              {getFieldDecorator(
                'headerTeamId',
                {},
              )(
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
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入合同负责人团队"
                >
                  {!_.isEmpty(groupList) && groupList.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="维保支付提醒日期">
              {getFieldDecorator('defendPayTime', {
              })(
                <DatePicker onChange={this.saveParams} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          {/* <Button onClick={() => this.moreQuery()} loading={loadingQueryData} type="primary" ghost>
            查询
          </Button> */}
          <Button
            type='primary'
            ghost
            onClick={() => this.setSearchMore(false)}
          >取消</Button>
          <Button
            type='primary'
            onClick={() => this.moreQuery(false)}
            loading={loadingQueryData}
          >确认</Button>
          {/* <CustomBtn
            onClick={() => this.setSearchMore(false)}
            type='cancel'
          />
          <CustomBtn
            onClick={() => this.moreQuery(false)}
            type='save'
            title='确认'
            loading={loadingQueryData}
          /> */}
          {/* <Button onClick={() => this.setSearchMore(false)}>取消</Button> */}
        </div>
      </div>
    );
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={5}>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} colon={false} label="合同名称">
            {getFieldDecorator('name', {
            })(<Input
              allowClear
              onChange={this.saveParams}
              placeholder='请输入合同名称'
            />)}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} colon={false} label="所属项目">
            {getFieldDecorator('projectNumber', {
            })(
              <Select
                allowClear
                // showSearch
                onChange={this.saveParams}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '100%'
                }}
                placeholder="请输入所属项目"
              >
                {!_.isEmpty(projectList) &&
                  projectList.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.pjName}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} colon={false} label="所属集群/板块">
            {getFieldDecorator('clusterId', {
            })(
              <Select
                allowClear
                showSearch
                onChange={this.saveParams}
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
                placeholder="请输入所属集群/板块"
              >
                {
                  clusterList && clusterList.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem colon={false} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="合同签订日期">
            {getFieldDecorator('signTime', {
            })(
              <RangePicker onChange={this.saveParams} />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              // loading={loadingQueryData}
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
                    <Icon component={searchMore ? upIcon : downIcon} />
                    <span>{searchMore ? '隐藏' : '更多'}</span>
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
    const {
      global: { authActions },
    } = this.props;
    const columns = [
      {
        title: '合同编号',
        dataIndex: 'number',
        key: 'number',
        width: 140,
        sorter: true,
        render: (text, record) => {
          return (
            <span onClick={() => this.handleViewDetail(record)} className="globalStyle">
              {text}
            </span>
          );
        },
      },
      {
        title: '合同名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
        key: 'projectName',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='所属集群/板块' style={{ width: 67 }} />,
        dataIndex: 'clusterName',
        key: 'clusterName',
        align: 'left',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      // TableColumnHelper.genPlanColumn('clusterName', '所属集群/板块', { sorter: true }),
      {
        title: <Ellipse text='合同成交金额（元）' style={{ width: 67 }} />,
        dataIndex: 'transactionAmount',
        key: 'transactionAmount',
        align: 'left',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='合同已支付金额（元）' style={{ width: 67 }} />,
        dataIndex: 'payAmount',
        key: 'payAmount',
        align: 'left',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='合同待支付金额（元）' style={{ width: 67 }}/>,
        dataIndex: 'notPayAmount',
        key: 'notPayAmount',
        align: 'left',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目验收日期' style={{ width: 67 }}/>,
        dataIndex: 'projectCheckTime',
        key: 'projectCheckTime',
        align: 'left',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      TableColumnHelper.genPlanColumn('budgetNumber', '预算编号', { sorter: true, align: 'left' }),
      {
        title: <Ellipse text='合同负责人' style={{ width: 67 }}/>,
        dataIndex: 'headerName',
        key: 'headerName',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='合同负责团队' style={{ width: 67 }}/>,
        dataIndex: 'headerTeamName',
        key: 'headerTeamName',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='合同签订日期' style={{ width: 67 }}/>,
        dataIndex: 'signingTime',
        key: 'signingTime',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='录入人' style={{ width: 67 }}/>,
        dataIndex: 'userName',
        key: 'userName',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='录入时间' style={{ width: 67 }}/>,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw',
                paddingRight: '16px'
              }}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'left',
        width: 90,
        render: (text, record) => {
          return (
            <div>
              {/* {authActions.includes(MENU_ACTIONS.EDIT) && (
                <ListOptBtn
                  title="编辑"
                  style={{
                    fontSize: '20px',
                    marginRight: '16px',
                    position: 'relative',
                    top: '1px'
                  }}
                  onClick={() => this.handleViewModal(true, '编辑', record)}
                  icon={editIcon}
                />
              )} */}

              {authActions.includes(MENU_ACTIONS.CHECK) && (
                <ListOptBtn
                  icon={eyeIcon}
                  style={{
                    fontSize: '24px',
                    position: 'relative',
                    top: '5px'
                  }}
                  onClick={() => this.handleViewDetail(record)}
                  title="查看"
                />
              )}
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { contract: { contractList, contractInfo }, loadingQueryData } = this.props;
    const { visibleModal, modalTitle, clientWidth } = this.state;
    const createProps = {
      visibleModal,
      modalTitle,
      handleViewModal: this.handleViewModal,
      recordValue: contractInfo,
      handleQueryData: this.handleQueryData,
      handleQueryBudget: this.handleQueryBudget,
      handleQueryGroup: this.handleQueryGroup,
      handleQuerySupplier: this.handleQuerySupplier,
      handleQuerySystem: this.handleQuerySystem,
      handleQueryDept: this.handleQueryDept,
    }
    return (
      <Fragment>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <CustomBtn onClick={() => this.handleViewModal(true, '新建')} icon='plus' type="create" /> */}
          <CustomBtn
            onClick={() => this.handleExportExcel()}
            type='export'
          />
        </div>
        {visibleModal && <CreateContract {...createProps} />}
        <Card>
          <div className={styles.customSearchForm}>{this.renderSearchForm()}</div>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={contractList}
            loading={loadingQueryData}
            onChange={this.handleStandardTableChange}
            scroll={{ x: clientWidth*0.44 + 1061 }}
          />
        </Card>
      </Fragment>
    );
  }
}

export default ContractManage;
