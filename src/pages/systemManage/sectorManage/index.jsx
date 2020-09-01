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
@connect(({ sector, global, loading }) => ({
  loadingQueryData: loading.effects['sector/queryData'],
  loadingCreateData: loading.effects['sector/addData'],
  loadingUpdateData: loading.effects['sector/updateData'],
  loadingQueryLogData: loading.effects['global/fetchLogList'],
  sectorList: sector.sectorList,
  deptList: sector.deptList,
  deptListMap: sector.deptListMap,
}))
class SectorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '新建',
      record: {},
      searchParams: {},
    }
  }

  componentDidMount() {
    this.handleQueryData()
    this.handleQueryDept()
  }

  handleQueryData = (params = {}) => {
    const { searchParams } = this.state
    this.props.dispatch({
      type: 'sector/queryData',
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
      type: 'sector/fetchNotBindDept',
    })
  }

  saveParams = (val, type) => {
    console.log(val, type)
    const { searchParams } = this.state
    let obj = searchParams
    if (type === 'deptInfo') {
      obj[type] = val
    }
    else if (type = 'name') {
      obj[type] = val.target.value
    }
    this.setState({
      searchParams: obj
    }, () => _.debounce(this.handleQueryData, 500)
    )
  }

  handleResetSearch = () => {
    this.setState({
      searchParams: {}
    }, () => this.handleQueryData())
  }

  handleEdit = (params) => {
    this.props.dispatch({
      type: 'sector/updateData',
      payload: { ...params }
    })
  }

  handleViewModal = (bool, title, record = {}) => {
    this.setState({
      modalVisible: bool,
      modalTitle: title,
      record
    })
    if (!bool) {
      this.props.form.resetFields()
    }
  }

  handleSubmit = () => {
    const { deptListMap } = this.props
    const { record } = this.state
    this.props.form.validateFields((err, values) => {
      if (err) return
      let arr = []
      values.dept.map(d => {
        const str = `${deptListMap[d]}-${d}`
        arr.push(str)
      })
      values.deptInfo = arr.join(',')
      console.log(values)
      delete values.dept
      if (record.id) {
        values.id = record.id
        this.handleEdit(values)
        return
      }
      this.handleCreate(values)
    })
  }

  // 新增
  handleCreate = (params) => {
    this.props.dispatch({
      type: 'sector/addData',
      payload: {
        ...params
      }
    }).then(bool => {
      if (bool) {
        this.handleQueryData()
        this.handleViewModal(false, '', {})
      }
    })
  }

  // 编辑
  handleEdit = (params) => {
    this.props.dispatch({
      type: 'sector/updateData',
      payload: {
        ...params
      }
    }).then(bool => {
      if (bool) {
        this.handleQueryData()
        this.handleViewModal(false, '', {})
      }
    })
  }

  handleViewDetail = () => {
    router.push('/systemManage/sectorManage/detail')
  }

  handleChangeChecked = (checkedValues) => {
    console.log('checked = ', checkedValues);
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

  renderSearchForm = () => {
    const { searchParams } = this.state
    console.log('searchParams:', searchParams)
    const { deptList } = this.props
    return (
      <div style={{ display: 'flex' }}>
        <SearchForm
          labelName="集群/板块名称"
        >
          <Input
            allowClear
            value={searchParams.name}
            // onChange={_.debounce(this.saveParams, 500)}
            onChange={e => this.saveParams(e, 'name')}
            placeholder='请输入集群/板块名称' />
        </SearchForm>
        <SearchForm
          labelName="所属部门"
        >
          <Select
            allowClear
            value={searchParams.deptInfo}
            placeholder='请输入所属部门'
            onChange={val => this.saveParams(val, 'deptInfo')}
            style={{
              width: '100%'
            }}
          >
            {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.number}>{d.name}</Option>
            ))}
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
      TableColumnHelper.genPlanColumn('createUserName', '创建人'),
      TableColumnHelper.genPlanColumn('createTime', '创建时间'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
      TableColumnHelper.genPlanColumn('updateUserName', '修改人'),
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
    const { modalVisible, modalTitle, record } = this.state
    const { sectorList, form, loadingQueryData, deptList, loadingCreateData } = this.props
    const { name, clusterLinkDepts } = record
    let arr = []
    clusterLinkDepts && clusterLinkDepts.map(v => {
      arr.push(v.deptId)
    })
    console.log(record)
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
        <Card>
          <Modal
            title={modalTitle}
            visible={modalVisible}
            maskClosable={false}
            onCancel={() => this.handleViewModal(false)}
            width='794px'
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CustomBtn
                  onClick={() => this.handleViewModal(false)}
                  type='cancel'
                  style={{ marginRight: '18px' }}
                />
                <CustomBtn
                  onClick={() => this.handleSubmit()}
                  loading={loadingCreateData}
                  type='save' />
              </div>}
          >
            <Row>
              <Col span={24}>
                <FormItem label='集群/板块名称' labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入集群/板块名称!' }],
                    initialValue: name
                  })(
                    <Input placeholder='请输入集群/板块名称' />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label='所属部门' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <div
                    style={{
                      border: '1px solid #EBEEF5',
                      borderRadius: '2px',
                      padding: '16px'
                    }}
                  >
                    {form.getFieldDecorator('dept', {
                      rules: [{ required: true, message: '请至少选择一个部门！' }],
                      initialValue: arr
                    })(

                      <Checkbox.Group style={{ width: '100%' }} onChange={this.handleChangeChecked}>
                        <Row>
                          {!_.isEmpty(deptList) && deptList.map(v => (
                            <Col key={v.number} span={4}>
                              <Checkbox key={v.number} value={v.number}>{v.name}</Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    )}
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Modal>
          {this.renderSearchForm()}
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={sectorList}
            loading={loadingQueryData}
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

export default SectorManage