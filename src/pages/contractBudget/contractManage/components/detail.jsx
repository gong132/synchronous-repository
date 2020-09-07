import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import numeral from 'numeral'
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import OptButton from "@/components/commonUseModule/optButton";
import editIcon from '@/assets/icon/Button_bj.svg'
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import payIcon from '@/assets/icon/modular_zfmx.svg'
import styles from '../index.less'
import {
  Descriptions,
  Spin,
  Form,
  Button,
  Table,
  Input,
  Select,
  DatePicker
} from 'antd'
import { getParam } from '@/utils/utils'

const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const { Option } = Select

@Form.create()
@connect(({ constract, loading }) => ({
  loadingQueryLogData: loading.effects['constract/fetchLogList'],
  loadingQueryInfo: loading.effects['constract/fetchContractInfo'],
  contractInfo: constract.contractInfo,
  logList: constract.logList,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editBool: false,
    }
  }

  componentDidMount() {
    const id = getParam('id')
    this.handleQuerySectorInfo({ id })
    this.handleQueryLogList({
      linkId: id,
      type: '3'
    })
  }

  // 查看板块详情
  handleQuerySectorInfo = (params) => {
    this.props.dispatch({
      type: 'constract/fetchContractInfo',
      payload: {
        ...params,
      }
    })
  }

  // 查日志
  handleQueryLogList = (params) => {
    this.props.dispatch({
      type: 'constract/fetchLogList',
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

  // 格式化输入金额
  formatMoney = value => {
    if (!Boolean(value)) return

    return numeral(value).format('0,0')
  }

  render() {
    const { editBool } = this.state
    const { logList, loadingQueryInfo, loadingQueryLogData, contractInfo, form } = this.props
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
      TableColumnHelper.genPlanColumn('operateUserName', '修改人'),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
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
                        <Input disabled placeholder='请输入合同编号' />
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
                        rules: [{ required: true, message: '请输入所属集群/板块	' }],
                        initialValue: budgetNumber,
                      })(<Select
                        placeholder="请输入所属集群/板块	"
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
                      })(<Input addonAfter='元' placeholder="请输入首次报价金额" />)}
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
                      })(<Input addonAfter='元' placeholder="请输入合同成交额" />)}
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
                      >
                        <Option key={1} value={1}>自定义</Option>
                      </Select>)}
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
      </Fragment>

    );
  }
}

export default Detail