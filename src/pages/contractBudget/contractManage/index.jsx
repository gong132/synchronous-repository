import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import styles from './index.less'
import * as _ from 'lodash'
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import CustomBtn from '@/components/commonUseModule/customBtn'
import OptButton from "@/components/commonUseModule/optButton";
import SearchForm from '@/components/commonUseModule/searchForm'
import editIcon from '@/assets/Button_bj.svg'
import CreateConstract from './components/createConstract'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Checkbox,
  Icon,
  Row,
  Col
} from 'antd'
const { Option } = Select
const FormItem = Form.Item

@Form.create()
@connect(({ constract, loading }) => ({
  loadingQueryData: loading.effects['constract/queryData'],
  loadingCreateData: loading.effects['constract/addData'],
  loadingUpdateData: loading.effects['constract/updateData'],
  constractList: constract.constractList,
  deptList: constract.deptList,
  deptListMap: constract.deptListMap,
}))
class ContractManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchParams: {},
      visibleModal: false,
      modalTitle: '新建'
    }
  }

  componentDidMount() {
    this.handleQueryData()
    this.handleQueryDept()
  }

  handleQueryData = (params = {}) => {
    const { searchParams } = this.state
    this.props.dispatch({
      type: 'constract/queryData',
      payload: {
        ...DefaultPage,
        ...params,
        ...searchParams
      }
    })
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

  handleViewModal = (bool, title) => {
    this.setState({
      visibleModal: bool,
      modalTitle: title,
    })
  }

  handleResetSearch = () => { }

  handleViewDetail = () => { }

  renderSearchForm = () => {
    const { searchParams } = this.state
    const { deptList } = this.props
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SearchForm
          labelName="合同编号"
        >
          <Input
            allowClear
            value={searchParams.number}
            onChange={e => this.saveParams(e, 'number')}
            placeholder='请输入合同编号' />
        </SearchForm>
        <SearchForm
          labelName="所属部门"
        >
          <Select
            allowClear
            value={searchParams.deptId}
            placeholder='请输入所属部门'
            onChange={val => this.saveParams(val, 'deptId')}
            style={{
              width: '100%'
            }}
          >
            <Option key={1} value={1}>自定义</Option>
            {/* {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.name}>{d.name}</Option>
            ))} */}
          </Select>
        </SearchForm>
        <SearchForm
          labelName="供应商"
        >
          <Select
            allowClear
            value={searchParams.providerCompanyName}
            placeholder='请输入供应商'
            onChange={val => this.saveParams(val, 'providerCompanyName')}
            style={{
              width: '100%'
            }}
          >
            <Option key={1} value={1}>自定义</Option>
            {/* {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.name}>{d.name}</Option>
            ))} */}
          </Select>
        </SearchForm>
        <SearchForm
          labelName="合同签订时间"
        >
          <Select
            allowClear
            value={searchParams.deptInfo}
            placeholder='请输入合同签订时间'
            onChange={val => this.saveParams(val, 'deptInfo')}
            style={{
              width: '100%'
            }}
          >
            <Option key={1} value={1}>自定义</Option>
            {/* {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.name}>{d.name}</Option>
            ))} */}
          </Select>
        </SearchForm>
        <div
          onClick={() => this.handleResetSearch()}
          style={{
            display: 'inline-block'
          }}
        >
          <CustomBtn type='reset' />
        </div>
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
      TableColumnHelper.genPlanColumn('createTime', '录入时间'),
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
    const { constractList } = this.props
    const { visibleModal, modalTitle } = this.state
    const createProps = {
      visibleModal,
      modalTitle,
      handleViewModal: this.handleViewModal,
      recordValue:{},
    }
    return (
      <Fragment>
        <CustomBtn
          onClick={() => this.handleViewModal(true, '新建')}
          type='create' />
          {visibleModal && <CreateConstract {...createProps} />}
        <Card>
          {this.renderSearchForm()}
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={constractList}
            // loading={loadingQueryData}
            // dataSource={[
            //   { name: 'gong' },
            //   { name: 'gong2' },
            //   { name: 'gong3' }
            // ]}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    )
  }
}

export default ContractManage
