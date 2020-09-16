import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import CustomBtn from '@/components/commonUseModule/customBtn'
import OptButton from "@/components/commonUseModule/optButton";
import { formLayoutItem1 } from '@/utils/constant'
import editIcon from '@/assets/icon/Button_bj.svg'
import StandardTable from "@/components/StandardTable";
import { TableColumnHelper } from "@/utils/helper";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Card,
} from 'antd'
import styles from './index.less'

const FormItem = Form.Item

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
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

  renderSearchForm = () => {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={6}>
          <FormItem {...formLayoutItem1} colon={false} label="团队ID">
            {getFieldDecorator('name', {
            })(<Input
              allowClear
              placeholder='请输入团队ID'
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem1} colon={false} label="团队名称">
            {getFieldDecorator('projectNumber', {
            })(<Select
              allowClear
              // showSearch
              style={{
                width: '100%'
              }}
              placeholder="请输入团队名称"
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem1} colon={false} label="团队经理">
            {getFieldDecorator('projectNumber', {
            })(<Select
              allowClear
              // showSearch
              style={{
                width: '100%'
              }}
              placeholder="请输入团队经理"
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <CustomBtn
              // onClick={() => this.handleResetSearch()}
              style={{
                display: 'inline-block',
                marginRight: '5rem'
              }}
              type='reset'
            />
          </FormItem>
        </Col>
      </Row>
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
        return true
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
              type='save'
            />
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

                  <Checkbox.Group style={{ width: '100%' }}>
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
      </Modal>
    )
  }

  render() {
    return (
      <Fragment>
        {this.renderEditModal()}
        <div className={styles.customSearchForm}>
          {this.renderSearchForm()}
        </div>
        {/* <Button onClick={() => this.handleViewModal(true)}>新建</Button> */}
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