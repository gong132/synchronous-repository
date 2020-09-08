import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import OptButton from "@/components/commonUseModule/optButton";
import editIcon from '@/assets/icon/Button_bj.svg'
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import { Descriptions, Spin, Input, Row, Col, Checkbox, DatePicker, Select, Button, Form } from 'antd'
import { getParam } from '@/utils/utils'
import styles from '../index.less'

const { Option } = Select
@Form.create()
@connect(({ sector, loading }) => ({
  loadingQueryLogData: loading.effects['sector/fetchLogList'],
  loadingQueryInfo: loading.effects['sector/fetchSectorInfo'],
  sectorInfo: sector.sectorInfo,
  logList: sector.logList,
  deptList: sector.deptList,
  deptListMap: sector.deptListMap,
}))
class SectorDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editBool: false,
    }
  }

  componentDidMount() {
    const id = getParam('id')
    this.handleQuerySectorInfo({ clusterId: id })
    this.handleQueryLogList({
      linkId: id,
      type: '3'
    })
    this.handleQueryDept()
  }


  // 查部门
  handleQueryDept = () => {
    this.props.dispatch({
      type: 'sector/fetchNotBindDept',
    })
  }

  // 查看板块详情
  handleQuerySectorInfo = (params) => {
    this.props.dispatch({
      type: 'sector/fetchSectorInfo',
      payload: {
        ...params,
      }
    })
  }

  // 查日志
  handleQueryLogList = (params) => {
    this.props.dispatch({
      type: 'sector/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  }

  // 分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params)
  };

  handleSubmit = () => {
    const { deptListMap } = this.props
    const id = getParam('id')

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
      values.id = id
      this.handleEdit(values)
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
        const id = getParam('id')
        this.handleQuerySectorInfo({ clusterId: id })
        this.handleQueryLogList({
          linkId: id,
          type: '3'
        })
        this.setState({
          editBool: false,
        })
      }
    })
  }

  render() {
    const { editBool } = this.state
    const { sectorInfo,
      loadingQueryInfo,
      logList,
      loadingQueryLogData,
      form,
      deptList } = this.props
    const { name,
      createUserId,
      createUserName,
      createTime,
      updateUserId,
      updateUserName,
      updateTime,
      clusterLinkDepts
    } = sectorInfo
    let str = ''
    let arr = []
    if (_.isArray(clusterLinkDepts) && !_.isEmpty(clusterLinkDepts)) {
      clusterLinkDepts.map((d, index) => {
        if (clusterLinkDepts.length > index + 1) {
          str += `${d.deptName}, `
          return
        }
        str += d.deptName
      })
    }

    clusterLinkDepts && clusterLinkDepts.map(function (v) {
      arr.push(v.deptId)
    })


    const detailList = [
      { span: 1, required: true, name: '集群/板块名称', value: name, dataIndex: 'name' },
      { span: 1, required: false, name: '所属部门', value: str, dataIndex: 'deptName' },
      { span: 1, required: false, name: '创建人', value: createUserName, dataIndex: 'createUserName' },
      { span: 1, required: false, name: '创建时间', value: createTime, dataIndex: 'createTime' },
      { span: 1, required: false, name: '修改人', value: updateUserName, dataIndex: 'updateUserName' },
      { span: 1, required: false, name: '修改时间', value: updateTime, dataIndex: 'updateTime' },
    ]
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人'),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
    ]
    return (
      <Fragment>
        <GlobalSandBox
          img={budget_xq}
          title='板块详情'
        >
          <Spin spinning={loadingQueryInfo}>
            {!editBool
              ? <OptButton
                style={{
                  position: 'absolute',
                  top: '17px',
                  right: '17px',
                  backgroundColor: 'white'
                }}
                onClick={
                  () => this.setState({
                    editBool: true,
                  })
                }
                img={editIcon}
                text="编辑"
              />
              : <div>
                <Button
                  icon='close'
                  onClick={
                    () => this.setState({
                      editBool: false,
                    })
                  }
                >取消</Button>
                <Button
                  style={{
                    marginLeft: '16px'
                  }}
                  type='primary'
                  onClick={() => this.handleSubmit()}
                >保存</Button>
              </div>}
            <Descriptions column={3} bordered className={styles.clearFormMargin}>
              {editBool ?
                <Fragment>
                  <Descriptions.Item
                    span={3}
                    label={<>{<span style={{ color: 'red' }}>*</span>}集群/板块名称</>}
                  >
                    <Form.Item>
                      {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入集群/板块名称!' }],
                        initialValue: name
                      })(
                        <Input placeholder='请输入集群/板块名称' />
                      )}
                    </Form.Item>
                  </Descriptions.Item>
                  <Descriptions.Item
                    span={3}
                    label={<>{<span style={{ color: 'red' }}>*</span>}所属部门</>}
                  >
                    <Form.Item>
                      {form.getFieldDecorator('dept', {
                        rules: [{ required: true, message: '请至少选择一个部门！' }],
                        initialValue: arr
                      })(
                        <Checkbox.Group style={{ width: '100%' }}>
                          <Row>
                            {!_.isEmpty(deptList) && deptList.map(v => (
                              <Col key={v.number} span={4}>
                                <Checkbox key={v.number} value={v.number}>{v.name}</Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      )}
                    </Form.Item>

                  </Descriptions.Item>
                  {/* <Descriptions.Item
                    span={1}
                    label='创建人'
                  >
                    {form.getFieldDecorator('createUserId', {
                      rules: [{ required: true, message: '请输入创建人!' }],
                      initialValue: createUserId
                    })(
                      <Select
                        allowClear
                        // showSearch
                        disabled
                        style={{
                          width: '150px'
                        }}
                        placeholder="请输入创建人"
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    span={1}
                    label='创建时间'
                  >
                    {form.getFieldDecorator('createTime', {
                      rules: [{ required: true, message: '请输入创建时间!' }],
                      initialValue: createTime ? moment(createTime) : null
                    })(
                      <DatePicker disabled placeholder="请输入创建时间" />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    span={1}
                    label='修改人'
                  >
                    {form.getFieldDecorator('updateUserId', {
                      rules: [{ required: true, message: '请输入修改人!' }],
                      initialValue: updateUserId
                    })(
                      <Select
                        allowClear
                        // showSearch
                        style={{
                          width: '150px'
                        }}
                        placeholder="请输入修改人"
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    span={1}
                    label='修改时间'
                  >
                    {form.getFieldDecorator('updateTime', {
                      rules: [{ required: true, message: '请输入修改时间!' }],
                      initialValue: updateTime ? moment(updateTime) : null
                    })(
                      <DatePicker placeholder="请输入修改时间" />
                    )}
                  </Descriptions.Item> */}
                </Fragment>
                : detailList.map((v, i) => (
                  <Descriptions.Item
                    key={i.toString()}
                    span={v.span}
                    label={<>{v.required && <span style={{ color: 'red' }}>*</span>}{v.name}</>}
                  >
                    {v.value}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Spin>
        </GlobalSandBox>
        <div style={{ height: '16px' }}></div>
        <GlobalSandBox
          img={budget_log}
          title='操作日志'
        >
          <StandardTable
            loading={loadingQueryLogData}
            rowKey={(record, index) => index}
            columns={columns}
            data={logList}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment >

    )
  }
}

export default SectorDetail