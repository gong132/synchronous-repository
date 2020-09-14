import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import { DefaultPage, TableColumnHelper } from '@/utils/helper';
import Editor from '@/components/TinyEditor';
import OptButton from '@/components/commonUseModule/optButton';
import CustomBtn from '@/components/commonUseModule/customBtn';
import Websocket from '@/components/Websocket';
import editIcon from '@/assets/icon/Button_bj.svg';
import budget_xq from '@/assets/icon/modular_xq.svg';
import budget_log from '@/assets/icon/modular_czrz.svg';
import payIcon from '@/assets/icon/modular_zfmx.svg';
import { Descriptions, Spin, Form, Button, Table, Input, Select, DatePicker, Modal } from 'antd';
import { getParam, getUserInfo } from '@/utils/utils';
import { isEmpty } from '@/utils/lang';
import styles from '../index.less';

const DescriptionItem = Descriptions.Item;
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ constract, loading }) => ({
  loadingQueryLogData: loading.effects['constract/fetchLogList'],
  loadingQueryInfo: loading.effects['constract/fetchContractInfo'],
  loadingUpdate: loading.effects['constract/updateData'],
  loadingSureProject: loading.effects['constract/checkProject'],
  contractInfo: constract.contractInfo,
  logList: constract.logList,
  deptList: constract.deptList,
  deptListMap: constract.deptListMap,
  projectList: constract.projectList,
  projectMap: constract.projectMap,
  systemList: constract.systemList,
  systemMap: constract.systemMap,
  supplierList: constract.supplierList,
  supplierMap: constract.supplierMap,
  headerList: constract.headerList,
  headerMap: constract.headerMap,
  groupMap: constract.groupMap,
  budgetList: constract.budgetList,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editBool: false,
      modalVisible: false,
      freePayDay: '',
      freePayDayEdit: '',
      payChange: false,
      descriptionState: '',
    };
  }

  componentDidMount() {
    this.handleQuerySectorInfo();
    this.handleQueryLogList();
    this.handleQueryDept();
  }

  // 查看板块详情
  handleQuerySectorInfo = () => {
    const id = getParam('id');
    this.props.dispatch({
      type: 'constract/fetchContractInfo',
      payload: {
        id,
      },
    });
  };

  // 查部门
  handleQueryDept = () => {
    this.props.dispatch({
      type: 'constract/fetchNotBindDept',
    });
  };

  // 查日志
  handleQueryLogList = () => {
    const id = getParam('id');
    const params = {
      linkId: id,
      type: '1',
    };
    this.props.dispatch({
      type: 'constract/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
      },
    });
  };

  handleChangeDesc = content => {
    this.setState({
      descriptionState: content,
    });
  };

  // 确认
  chekeProject = params => {
    const id = getParam('id');
    this.props
      .dispatch({
        type: 'constract/checkProject',
        payload: {
          ...params,
          id,
        },
      })
      .then(res => {
        if (res) {
          this.handleQuerySectorInfo();
          this.handleQueryLogList();
          this.handleModalVisible(false);
        }
      });
  };

  handleSubmit = () => {
    const { descriptionState } = this.state;
    const { projectMap, systemMap, deptListMap, supplierMap, headerMap, groupMap } = this.props;
    this.props.form.validateFieldsAndScroll((err, val) => {
      if (err) return;
      const values = val;
      values.projectName = projectMap[values.projectNumber];
      values.systemName = systemMap[values.systemId];
      values.deptName = deptListMap[values.deptId];
      values.providerCompanyName = supplierMap[values.providerCompanyId];
      values.headerName = headerMap[values.headerId];
      values.headerGroupName = groupMap[values.headerGroupId];
      values.projectCheckTime = values.projectCheckTimeEdit
        ? moment(values.projectCheckTimeEdit).format('YYYY-MM-DD')
        : '';
      values.freeDefendDate = values.freeDefendDateEdit;
      values.defendPayTime = values.defendPayTimeEdit;
      values.signingTime = moment(values.signingTime).format('YYYY-MM-DD');
      values.createTime = moment(values.createTime).format('YYYY-MM-DD');
      values.description = descriptionState;
      this.sumbitEdit(values);
    });
  };

  // 编辑
  sumbitEdit = params => {
    const id = getParam('id');
    this.props
      .dispatch({
        type: 'constract/updateData',
        payload: {
          id,
          ...params,
        },
      })
      .then(res => {
        if (res) {
          this.handleQuerySectorInfo();
          this.handleQueryLogList();
          this.setState({
            editBool: false,
          });
        }
      });
  };

  // 分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params);
  };

  // 格式化输入金额
  formatMoney = value => {
    if (isEmpty(value)) return '';

    return numeral(value).format('0,0');
  };

  // 格式化整数
  formatCount = value => {
    if (isEmpty(value)) return '';
    return numeral(value).format();
  };

  // 自动计算维保支付日期
  autoCalc = () => {
    const values = this.props.form.getFieldsValue(['freeDefendDate', 'projectCheckTime']);
    values.projectCheckTime = values.projectCheckTime
      ? moment(values.projectCheckTime).format('YYYY-MM-DD')
      : null;
    if (values.freeDefendDate && values.projectCheckTime) {
      const str = moment(values.projectCheckTime)
        .add(Number(values.freeDefendDate) - 1, 'months')
        .format('YYYY-MM-DD');
      this.setState({
        freePayDay: str,
      });
    } else {
      this.setState({
        freePayDay: '',
      });
    }
  };

  autoCalcEdit = () => {
    const values = this.props.form.getFieldsValue(['freeDefendDateEdit', 'projectCheckTimeEdit']);
    values.projectCheckTimeEdit = values.projectCheckTimeEdit
      ? moment(values.projectCheckTimeEdit).format('YYYY-MM-DD')
      : null;
    if (values.freeDefendDateEdit && values.projectCheckTimeEdit) {
      const str = moment(values.projectCheckTimeEdit)
        .add(Number(values.freeDefendDateEdit) - 1, 'months')
        .format('YYYY-MM-DD');
      this.setState({
        freePayDayEdit: str,
        payChange: true,
      });
    } else {
      this.setState({
        payChange: true,
        freePayDayEdit: '',
      });
    }
  };

  // 项目完结确认
  handleModalVisible = bool => {
    this.setState({
      modalVisible: bool,
    });
  };

  handleSurePro = () => {
    const { freePayDay } = this.state;
    this.props.form.validateFields(['freeDefendDate', 'projectCheckTime'], (err, val) => {
      if (err) return;
      const values = val;
      values.defendPayTime = freePayDay;
      values.projectCheckTime = moment(values.projectCheckTime).format('YYYY-MM-DD');
      this.chekeProject(values);
    });
  };

  render() {
    const w = '100%';
    const {
      editBool,
      modalVisible,
      freePayDay,
      descriptionState,
      freePayDayEdit,
      payChange,
    } = this.state;
    const {
      logList,
      loadingQueryInfo,
      loadingQueryLogData,
      contractInfo,
      form,
      loadingUpdate,
      deptList,
      projectList,
      supplierList,
      headerList,
      budgetList,
      systemList,
      loadingSureProject,
    } = this.props;
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
      headerId,
      headerName,
      headerGroupId,
      headerGroupName,
      projectCheckTime,
      freeDefendDate,
      defendPayTime,
      payRecords,
      clusterName,
    } = contractInfo;
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
      },
    ];
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人', { width: '100px' }),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间', { width: '100px' }),
    ];
    const detailList = [
      { span: 3, required: false, name: '合同名称', value: name, style: { whiteSpace: 'pre' } },
      { span: 1, required: false, name: '合同编号', value: number },
      { span: 1, required: false, name: '预算编号', value: budgetNumber },
      { span: 1, required: false, name: '所属集群/板块', value: clusterName },
      { span: 1, required: false, name: '所属项目', value: projectName },
      { span: 1, required: false, name: '供应商', value: providerCompanyName },
      { span: 1, required: false, name: '所属部门', value: deptName },
      { span: 1, required: false, name: '首次报价金额', value: firstOfferAmount },
      { span: 1, required: false, name: '合同成交金额', value: transactionAmount },
      { span: 1, required: false, name: '合同负责人', value: headerName },
      { span: 1, required: false, name: '合同负责人团队', value: headerGroupName },
      { span: 1, required: false, name: '合同签订时间', value: signingTime },
      { span: 1, required: false, name: '录入人', value: userName },
      { span: 1, required: false, name: '录入时间', value: createTime },
      { span: 1, required: false, name: '项目验收日期', value: projectCheckTime },
      { span: 1, required: false, name: '免费维保期', value: freeDefendDate },
      { span: 1, required: false, name: '维保支付期', value: defendPayTime },
      // { span: 3, required: false, name: '项目报告', value: name },
      { span: 3, required: false, name: '涉及系统', value: systemName },
      { span: 3, required: false, name: '合同描述', value: description, dataIndex: 'description' },
      // { span: 3, required: false, name: '附件', value: name },
    ];
    const { token } = getUserInfo();
    return (
      <Fragment>
        <Websocket
          url={`ws://10.90.48.22:80/websocket/${token}`}
          // onMessage={this.handleReceiveMessage}
          // onOpen={this.handleOpen}
          // onClose={this.handleClose}
          // reconnect
          // debug
          // ref={Websocket => {
          //   this.refWebSocket = Websocket;
          // }}
        />
        <GlobalSandBox
          img={budget_xq}
          title="合同详情"
          optNode={
            !editBool ? (
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                onClick={() =>
                  this.setState({
                    editBool: true,
                    payChange: false,
                    freePayDay: '',
                    descriptionState: description,
                  })
                }
                img={editIcon}
                text="编辑"
              />
            ) : (
              <div>
                <Button
                  icon="close"
                  onClick={() =>
                    this.setState({
                      editBool: false,
                      freePayDay: '',
                    })
                  }
                >
                  取消
                </Button>
                <Button
                  style={{
                    marginLeft: '16px',
                  }}
                  type="primary"
                  ghost
                  loading={loadingUpdate}
                  onClick={() => this.handleSubmit()}
                >
                  保存
                </Button>
              </div>
            )
          }
        >
          <Spin spinning={loadingQueryInfo}>
            {editBool ? (
              <Descriptions column={3} bordered className={styles.clearFormMargin}>
                <DescriptionItem
                  span={3}
                  label={<>{<span style={{ color: 'red' }}>*</span>}合同名称</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入合同名称!' }],
                      initialValue: name,
                    })(
                      <Input.TextArea placeholder="请输入合同名称" cols={1} rows={1} allowClear />,
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
                      initialValue: number,
                    })(<Input disabled style={{ width: w }} placeholder="请输入合同编号" />)}
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
                    })(
                      <Select placeholder="请输入预算编号" style={{ width: w }}>
                        {!_.isEmpty(budgetList) &&
                          budgetList.map(d => (
                            <Option key={d.number} value={d.number}>
                              {d.number}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}所属集群/板块 </>}
                >
                  <FormItem>
                    {form.getFieldDecorator('clusterName', {
                      rules: [{ required: true, message: '请输入所属集群/板块' }],
                      initialValue: clusterName,
                    })(<Input disabled />)}
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
                    })(
                      <Select placeholder="请输入所属项目" style={{ width: w }}>
                        {!_.isEmpty(projectList) &&
                          projectList.map(d => (
                            <Option key={d.number} value={d.number}>
                              {d.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
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
                    })(
                      <Select placeholder="请输入供应商" style={{ width: w }}>
                        {!_.isEmpty(supplierList) &&
                          supplierList.map(d => (
                            <Option key={d.supplierId} value={d.supplierId}>
                              {d.supplierName}
                            </Option>
                          ))}
                      </Select>,
                    )}
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
                    })(
                      <Select
                        allowClear
                        placeholder="请输入所属部门"
                        style={{
                          width: '100%',
                        }}
                      >
                        {!_.isEmpty(deptList) &&
                          deptList.map(d => (
                            <Option key={d.deptId} value={d.deptId}>
                              {d.deptName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}首次报价金额</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('firstOfferAmount', {
                      rules: [
                        {
                          required: true,
                          message: '请输入首次报价金额',
                          pattern: /^[0-9]+$|,/g,
                          whitespace: true,
                        },
                      ],
                      normalize: this.formatMoney,
                      initialValue: firstOfferAmount,
                    })(
                      <Input
                        style={{ width: w }}
                        addonAfter="元"
                        placeholder="请输入首次报价金额"
                      />,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }}>*</span>}合同成交额</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('transactionAmount', {
                      rules: [
                        {
                          required: true,
                          message: '请输入合同成交额',
                          pattern: /^[0-9]+$|,/g,
                          whitespace: true,
                        },
                      ],
                      normalize: this.formatMoney,
                      initialValue: transactionAmount,
                    })(
                      <Input style={{ width: w }} addonAfter="元" placeholder="请输入合同成交额" />,
                    )}
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
                    })(
                      <Select
                        allowClear
                        // showSearch
                        placeholder="请输入合同负责人"
                        style={{ width: w }}
                      >
                        {!_.isEmpty(headerList) &&
                          headerList.map(d => (
                            <Option key={d.leaderId} value={d.leaderId}>
                              {d.leaderName}
                            </Option>
                          ))}
                      </Select>,
                    )}
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
                    })(
                      <Select
                        allowClear
                        // showSearch
                        placeholder="请输入合同负责人团队"
                        style={{ width: w }}
                      >
                        {!_.isEmpty(headerList) &&
                          headerList.map(d => (
                            <Option key={d.number} value={d.number}>
                              {d.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
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
                    })(<DatePicker style={{ width: w }} placeholder="请输入合同签订时间" />)}
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
                    })(
                      <Select
                        allowClear
                        // showSearch
                        disabled
                        placeholder="请输入录入人"
                        style={{ width: w }}
                      >
                        <Option key={1} value={1}>
                          自定义
                        </Option>
                      </Select>,
                    )}
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
                    })(<DatePicker disabled style={{ width: w }} placeholder="请输入录入时间" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }} />}项目验收日期</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('projectCheckTimeEdit', {
                      rules: [{ required: false, message: '请输入项目验收日期' }],
                      initialValue: projectCheckTime ? moment(projectCheckTime) : null,
                    })(
                      <DatePicker
                        style={{ width: w }}
                        onChange={_.debounce(this.autoCalcEdit, 500)}
                        placeholder="请输入项目验收日期"
                      />,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={1}
                  label={<>{<span style={{ color: 'red' }} />}免费维保期</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('freeDefendDateEdit', {
                      rules: [
                        {
                          required: false,
                          message: '请输入免费维保期',
                          pattern: /^[0-9]+$/,
                        },
                      ],
                      normalize: this.formatCount,
                      initialValue: freeDefendDate,
                    })(
                      <Input
                        style={{ width: w }}
                        onChange={_.debounce(this.autoCalcEdit, 500)}
                        placeholder="请输入免费维保期"
                        addonAfter="月"
                      />,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={1} label={<>维保支付期</>}>
                  <FormItem>
                    {form.getFieldDecorator('defendPayTimeEdit', {
                      rules: [
                        {
                          required: false,
                          message: '请输入维保支付期',
                        },
                      ],
                      initialValue: payChange ? freePayDayEdit : defendPayTime,
                    })(<Input style={{ width: w }} disabled placeholder="请输入维保支付日期" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={3}
                  label={<>{<span style={{ color: 'red' }}>*</span>}涉及系统</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('systemId', {
                      rules: [{ required: true, message: '请输入所属系统' }],
                      initialValue: systemId,
                    })(
                      <Select
                        allowClear
                        // showSearch
                        placeholder="请输入所属系统"
                        style={{ width: '100%' }}
                      >
                        {!_.isEmpty(systemList) &&
                          systemList.map(d => (
                            <Option key={d.systemId} value={d.systemId}>
                              {d.systemName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem span={3} label={<>描述</>}>
                  <FormItem>
                    <Editor
                      editorKey="myContractAdd"
                      height={300}
                      content={descriptionState}
                      onContentChange={content => this.handleChangeDesc(content)}
                    />
                  </FormItem>
                </DescriptionItem>
              </Descriptions>
            ) : (
              <Descriptions column={3} bordered className={styles.formatDetailDesc}>
                {detailList.map((v, i) => (
                  <DescriptionItem
                    key={i.toString()}
                    span={v.span}
                    label={
                      <>
                        {v.required && <span style={{ color: 'red' }}>*</span>}
                        {v.name}
                      </>
                    }
                  >
                    {v.dataIndex === 'description' ? (
                      /* eslint-disable */
                      <div
                        className="infoDescription"
                        style={{ border: 0 }}
                        dangerouslySetInnerHTML={{ __html: v.value ? v.value : '--' }}
                      /> /* eslint-disable */
                    ) : (
                      <div style={v.style}>{v.value}</div>
                    )}
                  </DescriptionItem>
                ))}
              </Descriptions>
            )}
          </Spin>
        </GlobalSandBox>
        <div style={{ height: '16px' }} />
        <Spin spinning={loadingQueryInfo}>
          <GlobalSandBox
            img={payIcon}
            title="付款笔数"
            optNode={
              <Button onClick={() => this.handleModalVisible(true)} type="primary" ghost>
                项目完结确认
              </Button>
            }
          >
            <Table columns={payColumns} dataSource={payRecords} pagination={false} />
          </GlobalSandBox>
        </Spin>
        <div style={{ height: '16px' }} />
        <GlobalSandBox img={budget_log} title="操作日志">
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            data={logList}
            loading={loadingQueryLogData}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
        {modalVisible && (
          <Modal
            title="项目完结确认"
            visible={modalVisible}
            onCancel={() => this.handleModalVisible(false)}
            // onOk={this.handleSurePro}
            width={794}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CustomBtn
                  onClick={() => this.handleModalVisible(false)}
                  type="cancel"
                  style={{ marginRight: '18px' }}
                />
                <CustomBtn loading={loadingSureProject} onClick={this.handleSurePro} type="save" />
              </div>
            }
          >
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="项目验收日期">
              {form.getFieldDecorator('projectCheckTime', {
                rules: [{ required: modalVisible, message: '请输入项目验收日期' }],
                initialValue: projectCheckTime ? moment(projectCheckTime) : null,
              })(
                <DatePicker
                  onChange={_.debounce(this.autoCalc, 500)}
                  placeholder="请输入项目验收日期"
                />,
              )}
            </FormItem>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="免费维保期">
              {form.getFieldDecorator('freeDefendDate', {
                rules: [
                  {
                    required: modalVisible,
                    message: '请输入免费维保期',
                    pattern: /^[0-9]+$/,
                  },
                ],
                normalize: this.formatCount,
                initialValue: freeDefendDate,
              })(
                <Input
                  onChange={_.debounce(this.autoCalc, 500)}
                  placeholder="请输入免费维保期"
                  addonAfter="月"
                />,
              )}
            </FormItem>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} label="维保支付日期">
              <Input value={freePayDay} disabled placeholder="请输入维保支付日期" />
            </FormItem>
            {/* <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="项目验收报告">
            <Button type='primary' ghost>上传</Button>
          </FormItem> */}
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default Detail;
