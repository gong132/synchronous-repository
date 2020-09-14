/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import moment from 'moment'
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import { formLayoutItem1 } from '@/utils/constant'
import CustomBtn from '@/components/commonUseModule/customBtn'
import OptButton from "@/components/commonUseModule/optButton";
import SearchForm from '@/components/commonUseModule/searchForm'
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

import CreateContract from './components/createContract'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker
@Form.create()
@connect(({ contract, loading }) => ({
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
}))
class ContractManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: false,
      searchMore: false,
      modalTitle: '新建',
    }
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500)
  }

  componentDidMount() {
    this.handleQueryDept()
    this.handleQueryData()
    this.handleQueryProject()
    this.handleQuerySystem()
    this.handleQuerySupplier()
    this.handleQueryGroup()
    this.handleQueryBudget()
  }

  handleQueryData = (params = {}) => {
    console.log('params: ', params)
    this.props.dispatch({
      type: 'contract/queryData',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  }

  // 查看板块详情
  handleQuerySectorInfo = (params) => {
    this.props.dispatch({
      type: 'contract/fetchContractInfo',
      payload: {
        ...params,
      }
    })
  }

  // 更多查询
  moreQuery = () => {
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD')
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD')
    }
    this.handleDebounceQueryData(formValues)
  }

  saveParams = () => {
    this.moreQuery()
  }

  // 搜索时防抖
  handleDebounceQueryData = (params) => {
    this.handleQueryData(params)
  }

  // 查部门
  handleQueryDept = () => {
    this.props.dispatch({
      type: 'contract/fetchNotBindDept',
    })
  }

  // 查项目
  handleQueryProject = () => {
    this.props.dispatch({
      type: 'contract/fetchProject',
    })
  }

  // 查预算编号
  handleQueryBudget = () => {
    this.props.dispatch({
      type: 'contract/fetchBudgetNumber',
    })
  }

  // 查询系统
  handleQuerySystem = () => {
    this.props.dispatch({
      type: 'contract/fetchSystem',
    })
  }

  // 查询供应商
  handleQuerySupplier = () => {
    this.props.dispatch({
      type: 'contract/fetchSupplier',
    })
  }

  // 查询负责人和团队
  handleQueryGroup = () => {
    this.props.dispatch({
      type: 'contract/fetchHeaderGroup',
    })
  }

  // 分页操作
  handleStandardTableChange = pagination => {
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD')
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD')
    }
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryData(params)
  };

  handleViewModal = (bool, title, record = {}) => {
    this.setState({
      visibleModal: bool,
      modalTitle: title,
    })
    if (record.id) {
      this.handleQuerySectorInfo({ id: record.id })
    } else {
      this.props.dispatch({
        type: 'contract/saveData',
        payload: {
          contractInfo: {}
        }
      })
    }
  }

  setSearchMore = (bool) => {
    this.setState({
      searchMore: bool
    })
  }

  handleResetSearch = () => {
    this.props.form.resetFields()
    this.handleDebounceQueryData()
  }

  handleViewDetail = (record) => {
    router.push({
      pathname: '/contract-budget/contract/detail',
      query: {
        id: record.id
      }
    })
  }

  // 添加菜单
  handleAddMenu = () => {
    this.props.dispatch({
      type: 'contract/addMenu',
      payload: {
        name: '我的需求',
        pid: '17',
        url: '/demand',
        type: 0
      }
    })
  }

  renderSearchForm = () => {
    const { searchMore } = this.state
    const { deptList, supplierList, loadingQueryData, form: { getFieldDecorator } } = this.props
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="名称">
              {getFieldDecorator('name', {
              })(<Input
                allowClear
                placeholder="请输入名称"
              />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算编号">
              {getFieldDecorator('budgetNumber', {
              })(<Input
                allowClear
                placeholder="请输入预算编号"
              />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="项目编号">
              {getFieldDecorator('projectNumber', {
              })(<Input
                allowClear
                placeholder="请输入项目编号"
              />)}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button
            onClick={() => this.moreQuery()}
            loading={loadingQueryData}
            type='primary'
            ghost
          >查询</Button>
          <Button onClick={() => this.setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SearchForm
          labelName="合同编号"
        >
          {getFieldDecorator('number', {
          })(<Input
            allowClear
            onChange={_.debounce(this.saveParams, 500)}
            placeholder='请输入合同编号'
          />)}
        </SearchForm>
        <SearchForm
          labelName="所属部门"
        >
          {getFieldDecorator('deptId', {
          })(<Select
            allowClear
            placeholder='请输入所属部门'
            onChange={_.debounce(this.saveParams, 500)}
            style={{
              width: '100%'
            }}
          >
            {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.deptId} value={d.deptId}>{d.deptName}</Option>
            ))}
          </Select>)}
        </SearchForm>
        <SearchForm
          labelName="供应商"
        >
          {getFieldDecorator('providerCompanyName', {
          })(
            <Select
              allowClear
              // showSearch
              style={{
                width: '100%'
              }}
              onChange={_.debounce(this.saveParams, 500)}
              placeholder="请输入供应商"
            >
              {!_.isEmpty(supplierList) && supplierList.map(d => (
                <Option key={d.supplierId} value={d.supplierName}>{d.supplierName}</Option>
              ))}
            </Select>
          )}
        </SearchForm>
        <SearchForm
          labelName="合同签订时间"
        >
          {getFieldDecorator('signTime', {
          })(
            <RangePicker
              onChange={_.debounce(this.saveParams, 500)}
            />
          )}
        </SearchForm>
        <CustomBtn
          onClick={() => this.handleResetSearch()}
          style={{
            display: 'inline-block'
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
                position: 'absolute',
                right: '16px',
                top: '30px'
              }}
            >
              <div className={styles.moreBtn}>
                <Icon component={searchMore ? downIcon : upIcon} />
                <span>更多</span>
              </div>
            </div>
          }
        </Popover>
      </div>
    )
  }

  genColumns = () => {
    const columns = [
      {
        title: '合同编号',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => {
          return (
            <span
              onClick={
                () => this.handleViewDetail(record)
              }
              className='globalStyle'
            >
              {text}
            </span>
          )
        }
      },
      TableColumnHelper.genPlanColumn('deptName', '所属部门'),
      TableColumnHelper.genLangColumn('systemName', '涉及系统', {}, 6),
      TableColumnHelper.genPlanColumn('userName', '录入人'),
      TableColumnHelper.genDateTimeColumn('createTime', '录入时间', "YYYY-MM-DD"),
      TableColumnHelper.genPlanColumn('headerName', '合同负责人'),
      TableColumnHelper.genPlanColumn('providerCompanyName', '供应商'),
      TableColumnHelper.genPlanColumn('signingTime', '合同签订时间'),
      TableColumnHelper.genPlanColumn('payAmount', '合同已支付金额', {}, ''),
      TableColumnHelper.genPlanColumn('notPayAmount', '合同待支付金额', {}, ''),
      {
        title: '操作',
        align: 'left',
        fixed: 'right',
        width: 190,
        render: (text, record) => {
          return (
            <div>
              <OptButton
                style={{
                  marginRight: '12px'
                }}
                onClick={
                  () => this.handleViewModal(true, '编辑', record)
                }
                img={editIcon}
                text="编辑"
              />
              <OptButton
                icon='eye'
                onClick={
                  () => this.handleViewDetail(record)
                }
                text="查看"
              />
            </div>
          );
        }
      },
    ]
    return columns
  }

  render() {
    const { contractList, loadingQueryData, contractInfo } = this.props
    console.log(contractList)
    const { visibleModal, modalTitle } = this.state
    const createProps = {
      visibleModal,
      modalTitle,
      handleViewModal: this.handleViewModal,
      recordValue: contractInfo,
      handleQueryData: this.handleQueryData,
    }
    return (
      <Fragment>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CustomBtn
            onClick={() => this.handleViewModal(true, '新建')}
            type='create'
          />
          <CustomBtn
            // onClick={() => this.handleViewModal(true, '新建')}
            type='export'
          />
        </div>
        <Button
          onClick={() => this.handleAddMenu()}
        >添加菜单</Button>
        {visibleModal && <CreateContract {...createProps} />}
        <Card>
          {this.renderSearchForm()}
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
            scroll={{ x: 1600 }}
          />
        </Card>
      </Fragment>
    )
  }
}

export default ContractManage
