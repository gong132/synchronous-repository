import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import OptButton from "@/components/commonUseModule/optButton";
import editIcon from '@/assets/icon/Button_bj.svg'
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import payIcon from '@/assets/icon/modular_zfmx.svg'
import {
  Descriptions,
  Spin,
  Form,
  Button,
  Table,
  Input,
  Select,
  DatePicker,
  Modal

} from 'antd'
import { getParam } from '@/utils/utils'
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import styles from '../index.less'


const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const { Option } = Select

@Form.create()
@connect(({ constract, loading }) => ({
  loadingQueryLogData: loading.effects['constract/fetchLogList'],
  loadingQueryInfo: loading.effects['constract/fetchContractInfo'],
  loadingUpdate: loading.effects['constract/updateData'],
  contractInfo: constract.contractInfo,
  logList: constract.logList,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editBool: false,
      modalVisible: false,
      freePayDay: '',
    }
  }

  componentDidMount() {
    this.handleQuerySectorInfo()
    this.handleQueryLogList()
  }

  // 查看板块详情
  handleQuerySectorInfo = (params) => {
    const id = getParam('id')
    this.props.dispatch({
      type: 'constract/fetchContractInfo',
      payload: {
        id,
      }
    })
  }

  // 查日志
  handleQueryLogList = () => {
    const id = getParam('id')
    const params = {
      linkId: id,
      type: '1'
    }
    this.props.dispatch({
      type: 'constract/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  }

  // 编辑
  sumbitEdit = (params) => {
    const id = getParam('id')
    params.id = id
    this.props.dispatch({
      type: 'constract/updateData',
      payload: {
        ...params
      }
    }).then(res => {
      if (res) {
        this.handleQuerySectorInfo()
        this.handleQueryLogList()
        this.handleModalVisible(false)
      }
    })
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err,values) => {
      if(err) return
      console.log(values)
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

  // 格式化输入金额
  formatMoney = value => {
    if (!Boolean(value)) return

    return numeral(value).format('0,0')
  }

  // 格式化整数
  formatCount = (value) => {
    return numeral(value).format()
  }

  // 自动计算维保支付日期
  autoCalc = () => {
    const values = this.props.form.getFieldsValue(['freeDefendDate', 'projectCheckTime'])
    values.projectCheckTime = values.projectCheckTime ? moment(values.projectCheckTime).format('YYYY-MM-DD') : null
    if (values.freeDefendDate && values.projectCheckTime) {
      const str = moment(values.projectCheckTime).add(Number(values.freeDefendDate) - 1, 'months').format('YYYY-MM-DD');
      this.setState({
        freePayDay: str
      })
    }
  }

  // 项目完结确认
  handleModalVisible = (bool) => {
    this.setState({
      modalVisible: bool
    })
  }

  handleSurePro = () => {
    const { freePayDay } = this.state
    this.props.form.validateFields(['freeDefendDate', 'projectCheckTime'], (err, values) => {
      if (err) return
      values.defendPayTime = freePayDay
      values.projectCheckTime = moment(values.projectCheckTime).format('YYYY-MM-DD')
      this.sumbitEdit(values)
    })
  }

  render() {
    const w = 150
    const { editBool, modalVisible, freePayDay } = this.state
    const { logList,
      loadingQueryInfo,
      loadingQueryLogData,
      contractInfo,
      form,
      loadingUpdate } = this.props
    const {
      name,
      budgetNumber,
      number,
      projectNumber,
      projectName,
      providerCompanyId,
      providerCompanyName,
      userId,
      userName,
      createTime,
      description,
      systemId,
      systemName,
      deptId,
      deptName,
      firstOfferAmount,
      transactionAmount,
      signingTime,
      payAmount,
      notPayAmount,
      headerId,
      headerName,
      headerGroupId,
      headerGroupName,
      projectCheckTime,
      freeDefendDate,
      defendPayTime,
      payRecords
    } = contractInfo
    const payColumns = [
      {
        title: '付款顺序',
        dataIndex: 'paySequence',
        key: 'paySequence',
      },
      {
        title: '付款条件',
        dataIndex: 'payCondition',
        key: 'payCondition',
      },
      {
        title: '付款金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
      },
      {
        title: '付款金额比例',
        dataIndex: 'payProportion',
        key: 'payProportion',
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
      }
    ]
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人', {width: '100px'}),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间', {width: '100px'}),
    ]
    const detailList = [
      { span: 2, required: false, name: '合同名称', value: name },
      { span: 1, required: false, name: '合同编号', value: number },
      { span: 1, required: false, name: '预算编号', value: budgetNumber },
      { span: 1, required: false, name: '所属集群/板块', value: name },
      { span: 1, required: false, name: '所属项目', value: projectName },
      { span: 1, required: false, name: '供应商', value: providerCompanyName },
      { span: 1, required: false, name: '所属部门', value: deptName },
      { span: 1, required: false, name: '首次报价金额', value: name },
      { span: 1, required: false, name: '合同成交金额', value: transactionAmount },
      { span: 1, required: false, name: '合同负责人', value: headerName },
      { span: 1, required: false, name: '合同负责人团队', value: headerGroupName },
      { span: 1, required: false, name: '合同签订时间', value: signingTime },
      { span: 1, required: false, name: '录入人', value: userName },
      { span: 1, required: false, name: '录入时间', value: createTime },
      { span: 1, required: false, name: '项目验收日期', value: name },
      { span: 1, required: false, name: '免费维保期', value: freeDefendDate },
      { span: 1, required: false, name: '维保支付期', value: name },
      { span: 3, required: false, name: '项目报告', value: name },
      { span: 3, required: false, name: '涉及系统', value: systemName },
      { span: 3, required: false, name: '合同描述', value: description },
      { span: 3, required: false, name: '附件', value: name },
    ]
    return (
      <Fragment>
        <GlobalSandBox
          img={budget_xq}
          title='合同详情'
          optNode={
            !editBool
              ? <OptButton
                style={{
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
              </div>
          }
        >
          <Spin spinning={loadingQueryInfo}>
            <Descriptions column={3} bordered className={styles.clearFormMargin}>
              {editBool
                ? <Fragment>
                  <DescriptionItem
                    span={2}
                    label={<>{<span style={{ color: 'red' }}>*</span>}合同名称</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入合同名称!' }],
                        initialValue: name
                      })(
                        <Input placeholder='请输入合同名称' />
                      )}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}合同编号</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('number', {
                        rules: [{ required: true, message: '请输入合同编号!' }],
                        initialValue: number
                      })(
                        <Input style={{width: w}} disabled placeholder='请输入合同编号' />
                      )}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}预算编号</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('budgetNumber', {
                        rules: [{ required: true, message: '请输入预算编号' }],
                        initialValue: budgetNumber,
                      })(<Select
                        placeholder="请输入预算编号"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}所属集群/板块	</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('budgetNumber', {
                        rules: [{ required: true, message: '请输入所属集群/板块' }],
                        initialValue: budgetNumber,
                      })(<Select
                        placeholder="请输入所属集群/板块"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}所属项目</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('projectNumber', {
                        rules: [{ required: true, message: '请输入所属项目' }],
                        initialValue: projectNumber,
                      })(<Select
                        placeholder="请输入所属项目"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}供应商</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('providerCompanyId', {
                        rules: [{ required: true, message: '请输入供应商' }],
                        initialValue: providerCompanyId,
                      })(<Select
                        placeholder="请输入供应商"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}所属部门</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('deptId', {
                        rules: [{ required: true, message: '请输入所属部门' }],
                        initialValue: deptId,
                      })(<Select
                        placeholder="请输入所属部门"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}首次报价金额</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('firstOfferAmount', {
                        rules: [{
                          required: true,
                          message: '请输入首次报价金额',
                          pattern: /^[0-9]+$|,/g,
                          whitespace: true
                        }],
                        normalize: this.formatMoney,
                        initialValue: firstOfferAmount,
                      })(<Input style={{width: w}} addonAfter='元' placeholder="请输入首次报价金额" />)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}合同成交额</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('transactionAmount', {
                        rules: [{
                          required: true,
                          message: '请输入合同成交额',
                          pattern: /^[0-9]+$|,/g,
                          whitespace: true
                        }],
                        normalize: this.formatMoney,
                        initialValue: transactionAmount,
                      })(<Input style={{width: w}} addonAfter='元' placeholder="请输入合同成交额" />)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}合同负责人</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('headerId', {
                        rules: [{ required: true, message: '请输入合同负责人' }],
                        initialValue: headerId,
                      })(<Select
                        allowClear
                        // showSearch
                        placeholder="请输入合同负责人"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}合同负责人团队</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('headerGroupId', {
                        rules: [{ required: true, message: '请输入合同负责人团队' }],
                        initialValue: headerGroupId,
                      })(<Select
                        allowClear
                        // showSearch
                        placeholder="请输入合同负责人团队"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}合同签订时间</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('signingTime', {
                        rules: [{ required: true, message: '请输入合同签订时间' }],
                        initialValue: signingTime ? moment(signingTime) : null,
                      })(<DatePicker style={{width: w}} placeholder="请输入合同签订时间" />)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}录入人</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('userId', {
                        rules: [{ required: true, message: '请输入录入人' }],
                        initialValue: userId,
                      })(<Select
                        allowClear
                        // showSearch
                        placeholder="请输入录入人"
                        style={{width: w}}
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}录入时间</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('createTime', {
                        rules: [{ required: true, message: '请输入录入时间' }],
                        initialValue: createTime ? moment(createTime) : null,
                      })(<DatePicker style={{width: w}} placeholder="请输入录入时间" />)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}项目验收日期</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('projectCheckTime', {
                        rules: [{ required: true, message: '请输入项目验收日期' }],
                        initialValue: projectCheckTime ? moment(projectCheckTime) : null,
                      })(<DatePicker
                        style={{width: w}}
                        onChange={_.debounce(this.autoCalc, 500)}
                        placeholder="请输入项目验收日期"
                      />)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}免费维保期</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('freeDefendDate', {
                        rules: [{
                          required: true,
                          message: '请输入免费维保期',
                          pattern: /^[0-9]+$/
                        }],
                        normalize: this.formatCount,
                        initialValue: freeDefendDate
                      })(<Input
                        style={{width: w}}
                        onChange={_.debounce(this.autoCalc, 500)}
                        placeholder='请输入免费维保期'
                        addonAfter='月' />)}
                    </FormItem>
                  </DescriptionItem>
                  <DescriptionItem
                    span={1}
                    label={<>{<span style={{ color: 'red' }}>*</span>}维保支付期</>}
                  >
                    <FormItem>
                      {form.getFieldDecorator('defendPayTime', {
                        rules: [{
                          required: true,
                          message: '请输入免费维保期',
                          pattern: /^[0-9]+$/
                        }],
                        normalize: this.formatCount,
                        initialValue: defendPayTime,
                      })(<Input style={{width: w}} disabled placeholder="请输入维保支付日期" />)}
                    </FormItem>
                  </DescriptionItem>
                </Fragment>
                : detailList.map((v, i) => (
                  <Descriptions.Item
                    key={i.toString()}
                    span={v.span}
                    label={<>{v.required && <span style={{ color: 'red' }}>*</span>}{v.name}</>}
                  >
                    {v.value}
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
          </Spin>
        </GlobalSandBox>
        <div style={{ height: '16px' }}></div>
        <GlobalSandBox
          img={payIcon}
          title='付款笔数'
          optNode={<Button
            onClick={() => this.handleModalVisible(true)}
            type='primary' ghost>项目完结确认</Button>}
        >
          <Table
            columns={payColumns}
            dataSource={payRecords}
            pagination={false}
          />
        </GlobalSandBox>

        <div style={{ height: '16px' }}></div>
        <GlobalSandBox
          img={budget_log}
          title='操作日志'
        >
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            data={logList}
            loading={loadingQueryLogData}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
        <Modal
          title='项目完结确认'
          visible={modalVisible}
          onCancel={() => this.handleModalVisible(false)}
          onOk={this.handleSurePro}
          width={794}
          confirmLoading={loadingUpdate}
        >
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="项目验收日期">
            {form.getFieldDecorator('projectCheckTime', {
              rules: [{ required: true, message: '请输入项目验收日期' }],
              initialValue: projectCheckTime ? moment(projectCheckTime) : null,
            })(<DatePicker
              onChange={_.debounce(this.autoCalc, 500)}
              placeholder="请输入项目验收日期"
            />)}
          </FormItem>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="免费维保期">
            {form.getFieldDecorator('freeDefendDate', {
              rules: [{
                required: true,
                message: '请输入免费维保期',
                pattern: /^[0-9]+$/
              }],
              normalize: this.formatCount,
              // initialValue: values && values.name,
            })(<Input
              onChange={_.debounce(this.autoCalc, 500)}
              placeholder='请输入免费维保期'
              addonAfter='月' />)}
          </FormItem>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="维保支付日期">
            <Input value={freePayDay} disabled placeholder="请输入维保支付日期" />
          </FormItem>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="项目验收报告">
            <Button type='primary' ghost>上传</Button>
          </FormItem>
        </Modal>
      </Fragment>
    );
  }
}

export default Detail