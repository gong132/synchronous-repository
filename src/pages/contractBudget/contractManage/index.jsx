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
import CreateConstract from './components/createConstract'

import styles from './index.less'
import * as _ from 'lodash'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker
@Form.create()
@connect(({ constract, loading }) => ({
  loadingQueryData: loading.effects['constract/queryData'],
  loadingCreateData: loading.effects['constract/addData'],
  loadingUpdateData: loading.effects['constract/updateData'],
  constractList: constract.constractList,
  deptList: constract.deptList,
  deptListMap: constract.deptListMap,
  contractInfo: constract.contractInfo,
}))
class ContractManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: false,
      searchMore: false,
      modalTitle: '新建',
      recordValue: {},
    }
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500)
  }

  componentDidMount() {
    this.handleQueryDept()

    this.handleQueryData()
  }

  handleQueryData = (params = {}) => {
    console.log('params: ', params)
    this.props.dispatch({
      type: 'constract/queryData',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  }

  // 查看板块详情
  handleQuerySectorInfo = (params) => {
    this.props.dispatch({
      type: 'constract/fetchContractInfo',
      payload: {
        ...params,
      }
    })
  }

  // 更多查询
  moreQuery = () => {
    const formValues = this.props.form.getFieldsValue();
    if(formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYYMMDD') 
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYYMMDD') 
    }
    console.log(formValues)

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
      type: 'constract/fetchNotBindDept',
    })
  }


  // 分页操作
  handleStandardTableChange = pagination => {
    // const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryData(params)
  };

  handleViewModal = (bool, title, record={}) => {
    this.setState({
      visibleModal: bool,
      modalTitle: title,
      recordValue: record,
    })
    if(record.id) {
      this.handleQuerySectorInfo({id: record.id})
    } else {
      this.props.dispatch({
        type: 'constract/saveData',
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

  handleResetSearch = () => { }

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
      type: 'constract/addMenu',
      payload: {
        name: '详情',
        pid: '16',
        url: '/contract-budget/contract/detail',
        checked: false,
        type: 0
      }
    })
  }

  renderSearchForm = () => {
    const { searchMore } = this.state
    const { deptList, loadingQueryData, form: { getFieldDecorator } } = this.props
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="标题">
              {getFieldDecorator('name', {
              })(<Input
                allowClear
                placeholder="请输入标题" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算编号">
              {getFieldDecorator('budgetNumber', {
              })(<Input
                allowClear
                placeholder="请输入预算编号" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="项目编号">
              {getFieldDecorator('projectNumber', {
              })(<Input
                allowClear
                placeholder="请输入项目编号" />)}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={() => this.moreQuery()}>查询</Button>
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
            placeholder='请输入合同编号' />)}
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
              <Option key={d.number} value={d.name}>{d.name}</Option>
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
              placeholder='请输入供应商'
              onChange={_.debounce(this.saveParams, 500)}
              style={{
                width: '100%'
              }}
            >
              <Option key={1} value={1}>自定义</Option>
              {/* {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.name}>{d.name}</Option>
            ))} */}
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
          // loading={loadingQueryData}
          type='reset' />
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
              className='globalStyle'>
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
      TableColumnHelper.genDiscountMoneyColumn('payAmount', '合同已支付金额', {}, ''),
      TableColumnHelper.genDiscountMoneyColumn('notPayAmount', '合同待支付金额', {}, ''),
      {
        title: '操作',
        align: 'left',
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
    const { constractList, loadingQueryData, contractInfo } = this.props
    console.log(constractList)
    const { visibleModal, modalTitle, recordValue } = this.state
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
            type='create' />
          <CustomBtn
            // onClick={() => this.handleViewModal(true, '新建')}
            type='export' />
        </div>
        {/* <Button
          onClick={() => this.handleAddMenu()}
        >添加菜单</Button> */}
        {visibleModal && <CreateConstract {...createProps} />}
        <Card>
          {this.renderSearchForm()}
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={constractList}
            loading={loadingQueryData}
            // dataSource={[
            //   { number: 'gong', systemName: 'gg' },
            //   { number: 'gong2', systemName: 'gg' },
            //   { number: 'gong3', systemName: 'gg' }
            // ]}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    )
  }
}

export default ContractManage
