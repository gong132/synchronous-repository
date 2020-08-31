import React, { Component, Fragment } from 'react'
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
  handleViewModal = () => { }
  handleSubmit = () => { }

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
          <CustomBtn type='reset' style={{marginBottom: '16px'}} />
        </div>
      </div>
    )
  }

  genColumns = () => {
    const columns = [
      TableColumnHelper.genPlanColumn('updateUser', '姓名'),
      TableColumnHelper.genPlanColumn('updateCOntent', '工号'),
      TableColumnHelper.genPlanColumn('updateTime', '用户角色'),
      TableColumnHelper.genPlanColumn('updateTime', '所属团队'),
      {
        title: '操作',
        render() {
          return (
            <div>
              <OptButton
                onClick={
                  () => this.handleEdit()
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

  render() {
    const { modalVisible } = this.state
    const { form } = this.props
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
        {this.renderSearchForm()}
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