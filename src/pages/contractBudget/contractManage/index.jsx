import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import moment from 'moment'
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import { formLayoutItem1, MENU_ACTIONS } from '@/utils/constant'
import { exportExcel } from '@/utils/utils'
import CustomBtn from '@/components/commonUseModule/customBtn'
import OptButton from "@/components/commonUseModule/optButton";
import editIcon from '@/assets/icon/Button_bj.svg'
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

/* eslint-disable */
@Form.create()
@connect(({ contract, loading, global }) => ({
  global,
  loadingQueryData: loading.effects['contract/queryData'],
  loadingCreateData: loading.effects['contract/addData'],
  loadingUpdateData: loading.effects['contract/updateData'],
  contractList: contract.contractList,
  deptList: contract.deptList,
  deptListMap: contract.deptListMap,
  contractInfo: contract.contractInfo,
  budgetList: contract.budgetList,
  budgetMap: contract.budgetMap,
  projectList: contract.projectList,
  projectMap: contract.projectMap,
  systemList: contract.systemList,
  systemMap: contract.systemMap,
  supplierList: contract.supplierList,
  supplierMap: contract.supplierMap,
  headerList: contract.headerList,
  headerMap: contract.headerMap,
  groupMap: contract.groupMap,
  clusterList: contract.clusterList,
}))
class ContractManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      searchMore: false,
      modalTitle: '新建',
    };
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500);
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
  }

  // 导出
  handleExportExcel = () => {
    exportExcel({}, 'contract/export', 'get', '合同表单数据.xls')
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
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD')
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD')
    } else if(formValues.defendPayTime) {
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
      type: 'contract/fetchProject',
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
  handleQuerySystem = () => {
    this.props.dispatch({
      type: 'contract/fetchSystem',
    });
  };

  // 查询供应商
  handleQuerySupplier = () => {
    this.props.dispatch({
      type: 'contract/fetchSupplier',
    });
  };

  // 查询负责人和团队
  handleQueryGroup = () => {
    this.props.dispatch({
      type: 'contract/fetchHeaderGroup',
    });
  };

  // 查询集群列表
  handleQueryCluster = (name) => {
    this.props.dispatch({
      type: 'contract/queryAllCluster',
      payload: { name }
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

  // 添加菜单
  handleAddMenu = () => {
    this.props.dispatch({
      type: 'contract/addMenu',
      payload: {
        name: '我的需求',
        pid: '17',
        url: '/demand',
        type: 0,
      },
    });
  };

  renderSearchForm = () => {
    const { searchMore } = this.state
    const { deptList,
      projectList,
      supplierList,
      clusterList,
      budgetList,
      loadingQueryData,
      form: { getFieldDecorator }
    } = this.props;
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem colon={false} label="预算编号">
              {getFieldDecorator('budgetNumber', {
              })(<Select
                allowClear
                showSearch
                onSearch={_.debounce(this.handleQueryBudget, 500)}
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
              </Select>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同描述">
              {getFieldDecorator(
                'description',
                {},
              )(<Input allowClear placeholder="请输入合同描述" />)}
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
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商"
                >
                  {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.supplierId} value={d.supplierName}>
                        {d.supplierName}
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
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商"
                >
                  {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.supplierId} value={d.supplierName}>
                        {d.supplierName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同负责人团队">
              {getFieldDecorator(
                'headerGroupId',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商"
                >
                  {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.supplierId} value={d.supplierName}>
                        {d.supplierName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同签订日期">
              {getFieldDecorator('signTime', {
              })(
                <RangePicker
                  // onChange={_.debounce(this.saveParams, 500)}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="维保支付提醒日期">
              {getFieldDecorator('defendPayTime', {
              })(
                <DatePicker />
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={() => this.moreQuery()} loading={loadingQueryData} type="primary" ghost>
            查询
          </Button>
          <Button onClick={() => this.setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={6}>
          <FormItem {...formLayoutItem1} colon={false} label="合同名称">
            {getFieldDecorator('name', {
            })(<Input
              allowClear
              onChange={_.debounce(this.saveParams, 500)}
              placeholder='请输入合同名称'
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem1} colon={false} label="所属项目">
            {getFieldDecorator('projectNumber', {
            })(<Select
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
              placeholder="请输入所属项目"
            >
              {!_.isEmpty(projectList) &&
                projectList.map(d => (
                  <Option key={d.number} value={d.number}>
                    {d.name}
                  </Option>
                ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem1} colon={false} label="所属集群/板块">
            {getFieldDecorator('clusterId', {
            })(<Select
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
              placeholder="请输入所属集群/板块"
            >
              {
                clusterList.map(d => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
            </Select>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              style={{
                display: 'inline-block',
                marginRight: '4rem'
              }}
              loading={loadingQueryData}
              type='reset'
            />
            <Popover visible={searchMore} placement="bottomRight" content={content} trigger="click">
              {
                <div
                  className="activeColor"
                  onClick={() => this.setSearchMore(!searchMore)}
                  style={{
                    display: 'inline-block'
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
    const {
      global: { authActions },
    } = this.props;
    const columns = [
      {
        title: '合同编号',
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        render: (text, record) => {
          return (
            <span onClick={() => this.handleViewDetail(record)} className="globalStyle">
              {text}
            </span>
          );
        },
      },
      TableColumnHelper.genPlanColumn('name', '合同名称'),
      TableColumnHelper.genPlanColumn('projectName', '所属项目', { sorter: true }),
      TableColumnHelper.genPlanColumn('clusterName', '所属集群/板块', { sorter: true }),
      TableColumnHelper.genPlanColumn('transactionAmount', '合同成交金额（元）', { sorter: true, width: 180 }),
      TableColumnHelper.genPlanColumn('payAmount', '合同已支付金额（元）', { sorter: true, width: 200  }, ''),
      TableColumnHelper.genPlanColumn('notPayAmount', '合同待支付金额（元）', { sorter: true, width: 200  }, ''),
      TableColumnHelper.genPlanColumn('projectCheckTime', '项目验收日期', { sorter: true }, ''),
      TableColumnHelper.genPlanColumn('budgetNumber', '预算编号', { sorter: true }),
      TableColumnHelper.genPlanColumn('headerName', '合同负责人', { sorter: true }),
      TableColumnHelper.genPlanColumn('headerGroupName', '合同负责团队', { sorter: true }),
      TableColumnHelper.genPlanColumn('signingTime', '合同签订日期', { sorter: true }),
      TableColumnHelper.genPlanColumn('userName', '录入人', { sorter: true }),
      TableColumnHelper.genDateTimeColumn('createTime', '录入时间', 'YYYY-MM-DD', { sorter: true }),
      {
        title: '操作',
        align: 'left',
        // fixed: 'right',
        width: 190,
        render: (text, record) => {
          return (
            <div>
              {authActions.includes(MENU_ACTIONS.EDIT) && (
                <OptButton
                  style={{
                    marginRight: '12px',
                  }}
                  onClick={() => this.handleViewModal(true, '编辑', record)}
                  img={editIcon}
                  text="编辑"
                />
              )}

              {authActions.includes(MENU_ACTIONS.CHECK) && (
                <OptButton icon="eye" onClick={() => this.handleViewDetail(record)} text="查看" />
              )}
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { contractList, loadingQueryData, contractInfo } = this.props;
    const { visibleModal, modalTitle } = this.state;
    const createProps = {
      visibleModal,
      modalTitle,
      handleViewModal: this.handleViewModal,
      recordValue: contractInfo,
      handleQueryData: this.handleQueryData,
      handleQueryBudget: this.handleQueryBudget,
    }
    return (
      <Fragment>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CustomBtn onClick={() => this.handleViewModal(true, '新建')} type="create" />
          <CustomBtn
            onClick={() => this.handleExportExcel()}
            type='export'
          />
        </div>
        {/* <Button
          onClick={() => this.handleAddMenu()}
        >添加菜单</Button> */}
        {visibleModal && <CreateContract {...createProps} />}
        <Card>
          <div className={styles.customSearchForm}>{this.renderSearchForm()}</div>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={contractList}
            loading={loadingQueryData}
            // dataSource={[
            //   { number: 'gong', systemName: 'gg' },
            //   { number: 'gong2', systemName: 'gg' },
            //   { number: 'gong3', systemName: 'gg' }
            // ]}
            onChange={this.handleStandardTableChange}
            scroll={{ x: 2400 }}
          />
        </Card>
      </Fragment>
    );
  }
}

export default ContractManage;
