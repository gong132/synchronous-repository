import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import CustomBtn from '@/components/commonUseModule/customBtn'
import OptButton from "@/components/commonUseModule/optButton";
import SearchForm from '@/components/commonUseModule/searchForm'
import editIcon from '@/assets/Button_bj.svg'
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Card,
} from 'antd'

const FormItem = Form.Item
const { Option } = Select

@Form.create()
@connect(({ userManage, loading }) => ({
  userList: userManage.userList,
  loadingQueryUserData: loading.effects['userManage/fetchUserData']
}))
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {}
    }
  }

  handleSearch = () => { }
  handleResetSearch = () => { }
  handleViewModal = (bool, record = {}) => {
    this.setState({
      modalVisible: bool,
      record,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      console.log(values)
    })
  }

  handleChangeChecked = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }

  renderSearchForm = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SearchForm
          labelName="搜索人员"
        >
          <Input placeholder='请输入姓名或工号' />
        </SearchForm>
        <SearchForm
          labelName="用户角色"
        >
          <Select
            allowClear
            placeholder='请输入用户角色'
            style={{
              width: '100%'
            }}
          >
            <Option key={1} value={1}>1</Option>
          </Select>
        </SearchForm>
        <SearchForm
          labelName="所属团队"
        >
          <Select
            allowClear
            placeholder='请输入所属团队'
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
          <CustomBtn type='reset' style={{ marginBottom: '16px' }} />
        </div>
      </div>
    )
  }

  genColumns = () => {
    const columns = [
      TableColumnHelper.genPlanColumn('name', '姓名'),
      TableColumnHelper.genPlanColumn('account', '工号'),
      TableColumnHelper.genPlanColumn('role', '用户角色'),
      TableColumnHelper.genPlanColumn('team', '所属团队'),
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <OptButton
                onClick={
                  () => this.handleViewModal(true, record)
                }
                img={editIcon}
                text="编辑"
              />
            </div>
          );
        }
      },
    ]
    return columns
  }

  renderEditModal = () => {
    const { modalVisible, record } = this.state
    const { form } = this.props
    const { name, account } = record
    const data = (count) => {
      const arr = []
      Array(count).fill('').map((v, i) => {
        const a = {
          id: i.toString(),
          roleName: `角色${i}`
        }
        arr.push(a)
      })
      return arr
    }
    return (
      <Modal
        title='编辑'
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
              type='save' />
          </div>}
      >
        <Row>
          <Col span={24}>
            <FormItem label='姓名' labelCol={{ span: 2 }} wrapperCol={{ span: 8 }}>
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名!' }],
                initialValue: name
              })(
                <Input placeholder='请输入姓名' />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label='工号' labelCol={{ span: 2 }} wrapperCol={{ span: 8 }}>
              {form.getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入工号!' }],
                initialValue: account
              })(
                <Input placeholder='请输入工号' />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label='角色' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <div
                style={{
                  border: '1px solid #EBEEF5',
                  borderRadius: '2px',
                  padding: '16px'
                }}
              >
                {form.getFieldDecorator('role', {
                  rules: [{ required: true, message: '请至少选择一个角色！' }],
                  initialValue: ["0", "6"]
                })(

                  <Checkbox.Group style={{ width: '100%' }} onChange={this.handleChangeChecked}>
                    <Row>
                      {data(18).map(v => (
                        <Col key={v.id} span={4}>
                          <Checkbox key={v.id} value={v.id}>{v.roleName}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>
      </Modal >
    )
  }

  render() {
    return (
      <Fragment>
        {this.renderEditModal()}
        {this.renderSearchForm()}
        <Card>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            // dataSource={data}
            dataSource={[
              { name: 'gong', account: '0001', role: '普通员工', team: '零售集群' }
            ]}
          // loading={loadingQueryData}
          />
        </Card>
      </Fragment>
    )
  }
}

export default UserManage