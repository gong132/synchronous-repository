import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import CustomBtn from '@/components/commonUseModule/customBtn'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Card
} from 'antd'
import {
  formLayout,
  searchItemLayout
} from '@/utils/utils'
const FormItem = Form.Item
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

  handleEdit = () => { }

  handleViewModal = (bool, title) => {
    this.setState({
      modalVisible: bool,
      modalTitle: title
    })
  }

  handleSubmit = () => { }

  handleViewDetail = () => { }

  renderSearchForm = () => {
    const { form } = this.props
    const searchCol = { span: 8 }
    return (
      <div className={styles.customSearchRow}>
        <div className={styles.customSearchFormPer}>
          <span className={styles.customSearchFormPer__lablePer}>集群/板块名称</span>
          <div className={styles.customSearchFormPer__wrapperPer}>
            <Select
              allowClear
              placeholder='请输入集群/板块名称'
              style={{
                width: '100%'
              }}
            >
              <Option key={1} value={1}>1</Option>
            </Select>
          </div>
        </div>
        <div className={styles.customSearchFormPer}>
          <span className={styles.customSearchFormPer__lablePer}>所属部门</span>
          <div className={styles.customSearchFormPer__wrapperPer}>
            <Select
              allowClear
              placeholder='请输入所属部门'
              style={{
                width: '100%'
              }}
            >
              <Option key={1} value={1}>1</Option>
            </Select>
          </div>
        </div>
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
        key: 'name'
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName'
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
            <div>
              <Button
                icon='edit'
                onClick={
                  () => this.handleEdit()
                }
              >编辑</Button>
              <Button
                icon='edit'
                onClick={
                  () => this.handleViewDetail(record)
                }
              >查看</Button>
            </div>
          );
        }
      },
    ]
    return columns
  }

  render() {
    const { modalVisible, modalTitle } = this.state
    const { form, data } = this.props

    return (
      <Fragment>
        <div
          onClick={() => this.handleViewModal(true, '新建')}
        >
          <CustomBtn type='create' />
        </div>
        <Card
          bodyStyle={{
            padding: '16px 15px'
          }}
        >
          <Modal
            title={modalTitle}
            visible={modalVisible}
            onCancel={() => this.handleViewModal(false)}
            onOk={() => this.handleSubmit()}
            footer={<div style={{display: 'flex', justifyContent: 'flex-end'}}>
               <CustomBtn type='cancel' style={{marginRight: '18px'}} />
               <CustomBtn type='save'/>
            </div>}
          >
            <Form {...formLayout}>
              <FormItem
                label='集群/板块名称'
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
            columns={this.genColumns()}
            dataSource={data}
          // loading={loadingQueryData}
          />
        </Card>
      </Fragment>
    )
  }
}

export default SectorManage