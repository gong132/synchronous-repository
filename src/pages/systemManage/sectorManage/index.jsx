import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import styles from './index.less'
import * as _ from 'lodash'
import CustomBtn from '@/components/commonUseModule/customBtn'
import OptButton from "@/components/commonUseModule/optButton";
import SearchForm from '@/components/commonUseModule/searchForm'
import editIcon from '@/assets/Button_bj.svg'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Checkbox,
  Icon
} from 'antd'
import { paginationProps } from '@/utils/utils'
const { Option } = Select

@Form.create()
@connect(({ sector, loading }) => ({
  loadingQueryData: loading.effects['sector/queryData'],
  loadingCreateData: loading.effects['sector/addData'],
  loadingUpdateData: loading.effects['sector/updateData'],
  data: sector.data,
}))
class SectorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '新建',
      total: 0,
      searchParams: {
        current: 1,
        pageSize: 10,
      },
    }
  }

  componentDidMount() {
    this.handleQueryData()
  }

  handleQueryData = (params = {}) => {
    const { searchParams } = this.state
    this.props.dispatch({
      type: 'sector/queryData',
      payload: {
        ...searchParams
      }
    })
  }

  handleSearch = () => { }

  handleResetSearch = () => { }

  changePage = (page, pageSize) => {
    this.setState({
      current: page,
      pageSize,
    }, () => console.log(this.state.current, this.state.pageSize))
  }

  handleShowSizeChanger = (current, size) => {
    this.setState({
      current,
      pageSize: size,
    }, () => console.log(this.state.current, this.state.pageSize))
  }

  handleEdit = () => { }

  handleViewModal = (bool, title) => {
    this.setState({
      modalVisible: bool,
      modalTitle: title
    })
  }

  handleSubmit = () => { }

  handleViewDetail = () => {
    router.push('/systemManage/sectorManage/detail')
  }

  renderSearchForm = () => {
    return (
      <div style={{display: 'flex'}}>
        <SearchForm
          labelName="集群/板块名称"
        >
          <Select
            allowClear
            placeholder='请输入集群/板块名称'
            style={{
              width: '100%'
            }}
          >
            <Option key={1} value={1}>1</Option>
          </Select>
        </SearchForm>
        <SearchForm
          labelName="所属部门"
        >
          <Select
            allowClear
            placeholder='请输入所属部门'
            style={{
              width: '100%'
            }}
          >
            <Option key={1} value={1}>1</Option>
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
        title: '集群/模块名称',
        dataIndex: 'name',
        key: 'name',
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
      {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => {
          if (!_.isArray(record.clusterLinkDepts) || _.isEmpty(record.clusterLinkDepts)) return
          let str = ''
          record.clusterLinkDepts.map((d, index) => {
            if (record.clusterLinkDepts.length > index + 1) {
              str += `${d.deptName}, `
              return
            }
            str += d.deptName
          })
          return <Fragment>
            {str}
          </Fragment>
        }
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
      },
      {
        title: '修改人',
        dataIndex: 'updateUserName',
        key: 'updateUserName'
      },
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div className={styles.customActBtn}>
              <OptButton
                style={{
                  marginRight: '12px'
                }}
                onClick={
                  () => this.handleEdit()
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
    const { modalVisible, modalTitle, current, pageSize, total } = this.state
    const { data } = this.props
    const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },
    ];
    return (
      <Fragment>
        <CustomBtn
          onClick={() => this.handleViewModal(true, '新建')}
          type='create' />
        <Card
          bodyStyle={{
            padding: '16px 15px'
          }}
        >
          <Modal
            title={modalTitle}
            visible={modalVisible}
            maskClosable={false}
            width='794px'
            onCancel={() => this.handleViewModal(false)}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <CustomBtn
                  onClick={() => this.handleViewModal(false)}
                  type='cancel'
                  style={{ marginRight: '18px' }}
                />
                <CustomBtn
                  onClick={() => this.handleSubmit()}
                  type='save' />
              </div>}
          >
            <div className={styles.customModalForm}>
              <span className={styles.customModalForm__label}>集群/板块名称：</span>
              <div className={styles.customModalForm__wrapper}>
                <Input placeholder='请输入集群/板块名称' />
              </div>
            </div>
            <div className={styles.customModalForm}>
              <span className={styles.customModalForm__label}>所属部门：</span>
              <div className={styles.customModalForm__wrapperUnique}>
                <Input placeholder='请输入集群/板块名称' />
              </div>
            </div>
          </Modal>
          {this.renderSearchForm()}
          <Table
            columns={this.genColumns()}
            // dataSource={data}
            // rowKey={(r,k) => r.id}
            // pagination={paginationProps({
            //   total,
            //   changePage: this.changePage,
            //   pageSize,
            //   handleShowSizeChanger: this.handleShowSizeChanger,
            //   current,
            // })}
            dataSource={[
              { name: 'gong' },
              { name: 'gong2' },
              { name: 'gong3' }
            ]}
          // loading={loadingQueryData}
          />
        </Card>
      </Fragment>
    )
  }
}

export default SectorManage