import React, { Component, Fragment } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col
} from 'antd'
import {
  formLayout,
  searchItemLayout
} from '@/utils/utils'
const FormItem = Form.Item
const { Option } = Select

@Form.create()
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  handleSearch = () => { }
  handleResetSearch = () => { }
  handleEdit = () => { }
  handleViewModal = () => {}
  handleSubmit = () => {}

  renderSearchForm = () => {
    const { form } = this.props
    const searchCol = { span: 8 }
    return (
      <Row>
        <Col {...searchCol} >
          <FormItem
            label='姓名'
            {...searchItemLayout}
          >
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请补全姓名' }],
            })(
              <Input />
            )}
          </FormItem>
        </Col>
        <Col {...searchCol}>
          <FormItem
            label='性别'
            {...searchItemLayout}
          >
            {form.getFieldDecorator('sex', {
              rules: [{ required: true, message: '请补全性别' }],
            })(
              <Select
                style={{
                  width: '100%'
                }}
              >
                {sexArr.map(s => (
                  <Option key={s.key} val={s.key}>{s.val}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6} offset={2}>
          <FormItem>
            <Button
              icon='search'
              type='primary'
              onClick={() => this.handleSearch()}
            >搜索</Button>
            <Button
              style={{
                marginLeft: 18
              }}
              type='primary'
              onClick={() => this.handleResetSearch()}
            >重置</Button>
          </FormItem>
        </Col>
      </Row >
    )
  }

  render() {
    const {modalVisible} = this.state
    const {form} = this.props
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div>
              <Button
                icon='edit'
                onClick={
                  () => this.handleEdit()
                }
              >编辑</Button>
            </div>
          );
        }
      },
    ]
    return (
      <Fragment>
        <Modal
          title={`编辑人员`}
          visible={modalVisible}
          onCancel={() => this.handleViewModal(false)}
          onOk={() => this.handleSubmit()}
        >
          <Form {...formLayout}>
            <FormItem
              label='姓名'
            >
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请补全姓名' }],
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Table
          columns={columns}
        // dataSource={data}
        // loading={loadingQueryData}
        />
      </Fragment>
    )
  }
}

export default UserManage