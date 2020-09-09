import React, {useEffect, useState} from "react";
import {Button, DatePicker, Descriptions, Form, Input, message, Radio, Select} from "antd";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import {connect} from "dva";
import {DefaultPage, findValueByArray, moneyFormatAfter, TableColumnHelper, toInteger} from "@/utils/helper";
import {BUDGET_TYPE, PROJECT_TYPE} from "@/pages/contractBudget/util/constant";
import StandardTable from "@/components/StandardTable";
import RadioGroup from "antd/es/radio/group";
import moment from "moment";
import {isEmpty} from "@/utils/lang";
import Editor from "@/components/TinyEditor";
import styles from '../index.less'

const FormItem = Form;
const Index = props => {
  const { form, dispatch, budgetManage: { budgetDetails, budgetLogList, clusterList, allDeptList, groupList, groupByDept },
    values, editLoading, loading } = props;

  const columns = [
    TableColumnHelper.genPlanColumn('operateUserName', '修改人', { width: 200 }),
    TableColumnHelper.genPlanColumn('content', '修改人'),
    TableColumnHelper.genDateTimeColumn('createTime', '修改时间', "YYYY-MM-DD HH:mm:ss",{ width: 200 }),
  ];

  // 描述
  const [description, setDescription] = useState(budgetDetails.description || '');

  //edit
  const [editModalVisible, setEditModalVisible] = useState(false)

  const handleQueryGroupByDept = id => {
    dispatch({
      type: 'budgetManage/queryGroupByDept',
      payload: {
        deptId: id,
      }
    }).then(data => {
      if (!data) return;
      form.setFieldsValue({ clusterId: data.id})
    })
  };

  const handleQueryDeptList = id => {
    dispatch({
      type: 'budgetManage/queryAllDeptList',
      payload: {
        clusterId: id,
      }
    })
  };

  const handleQueryBudgetDetails = () => {
    const { id } = props.history.location.query;
    dispatch({
      type: 'budgetManage/queryBudgetDetails',
      payload: {
        id,
      }
    })
  };

  const handleQueryBudgetLog = params => {
    const { id } = props.history.location.query;
    dispatch({
      type: 'budgetManage/queryLogList',
      payload: {
        ...DefaultPage,
        linkId: id,
        type: 2,
        ...params,
      }
    })
  };

  const handleQueryClusterList = () => {
    dispatch({
      type: 'budgetManage/queryClusterList',
      payload: {
      }
    })
  };

  const handleSubmitForm = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue, 'fieldsValue');
      fieldsValue.expectSetTime = fieldsValue.expectSetTime ? fieldsValue.expectSetTime.format('YYYY-MM-DD') : null;
      fieldsValue.clusterName = fieldsValue.clusterId ? clusterList.find(v => v.id === fieldsValue.clusterId).name : null;
      fieldsValue.deptName = fieldsValue.deptId ? allDeptList.find(v => v.deptId === fieldsValue.deptId).deptName : null;
      fieldsValue.receiveGroupName = fieldsValue.receiveGroupId ? groupList.find(v => v.number === fieldsValue.receiveGroupId).name : null;
      dispatch({
        type: 'budgetManage/updateBudget',
        payload: {
          id: budgetDetails.id,
          ...fieldsValue,
          description: description,
          hardwareExpectAmount: Number(fieldsValue.hardwareExpectAmount),
          softwareExpectAmount: Number(fieldsValue.softwareExpectAmount),
          otherExpectAmount: Number(fieldsValue.otherExpectAmount),
          expectTotalAmount: Number(fieldsValue.expectTotalAmount),
        },
      }).then(sure => {
        if (!sure) return;
        message.success( '修改成功');
        setEditModalVisible(false);
        handleQueryBudgetDetails()
      })
    })
  };

  const handleQueryGroupList = () => {
    dispatch({
      type: 'budgetManage/queryGroupList',
      payload: {
      }
    })
  };
// 分页操作
  const handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    handleQueryBudgetLog(params)
  };

  useEffect(() => {
    handleQueryBudgetDetails();
    handleQueryBudgetLog();
    handleQueryDeptList();
    handleQueryClusterList();
    handleQueryGroupList()
  }, []);

  // 详情描述列表
  const detailsList = [
    { span: 2, required: false, name: '项目名称', value: budgetDetails.name },
    { span: 1, required: true, name: '预算编号', value: budgetDetails.number },
    { span: 1, required: false, name: '需求部门', value: budgetDetails.deptName },
    { span: 1, required: false, name: '预计立项时间', value: budgetDetails.expectSetTime },
    { span: 1, required: false, name: '其他预算金额', value: budgetDetails.otherExpectAmount },
    { span: 1, required: false, name: '预算总金额', value: budgetDetails.expectTotalAmount },
    { span: 1, required: false, name: '硬件预算金额', value: budgetDetails.hardwareExpectAmount },
    { span: 1, required: false, name: '软件预算金额', value: budgetDetails.softwareExpectAmount },
    { span: 1, required: true, name: '项目类型', value: findValueByArray(PROJECT_TYPE, 'key', budgetDetails.type, 'value') },
    { span: 1, required: true, name: '预算类型', value: findValueByArray(BUDGET_TYPE, 'key', budgetDetails.budgetType, 'value') },
    { span: 1, required: false, name: '承建团队', value: budgetDetails.receiveGroupName },
    { span: 1, required: false, name: '录入人', value: budgetDetails.userName },
    { span: 1, required: false, name: '所属集群或板块', value: budgetDetails.clusterName },
    { span: 3, required: false, name: '录入时间', value: budgetDetails.createTime },
  ];

  const renderEditForm = () => {
    const calculateAmount = (val, id) => {
      let totalAmount = 0;
      let hardwareAmount = form.getFieldValue('hardwareExpectAmount') || 0;
      let softwareAmount = form.getFieldValue('softwareExpectAmount') || 0;
      let otherwareAmount = form.getFieldValue('otherExpectAmount') || 0;

      if (id === 'hardwareExpectAmount') hardwareAmount = val || 0;
      if (id === 'softwareExpectAmount') softwareAmount = val || 0;
      if (id === 'otherExpectAmount') otherwareAmount = val || 0;
      totalAmount = (hardwareAmount * 1 + softwareAmount * 1 + otherwareAmount * 1);
      form.setFieldsValue({ expectTotalAmount: !totalAmount ? 0 : Number.parseInt(totalAmount) })
    };

    return (
      <div className={styles.editPanel}>
        <Descriptions column={3} bordered>
          <Descriptions.Item span={2} label="项目名称">
            <FormItem>
              {form.getFieldDecorator('name', {
                rules: [{required: true, message: '请输入项目名称'}],
                initialValue: budgetDetails && budgetDetails.name,
              })(<Input placeholder="请输入项目名称"/>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="预算编号">
            <FormItem>
              {budgetDetails && budgetDetails.number}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="需求部门">
            <FormItem>
              {form.getFieldDecorator('deptId', {
                rules: [{required: true, message: '请选择需求部门'}],
                initialValue: budgetDetails && budgetDetails.deptId,
              })(<Select
                onChange={val => handleQueryGroupByDept(val)}
                placeholder="请选择需求部门"
              >
                {
                  allDeptList&& allDeptList.map(v => (
                    <Option value={v.deptId} key={v.deptId}>{v.deptName}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="预计立项时间">
            <FormItem>
              {form.getFieldDecorator('expectSetTime', {
                rules: [{required: true, message: '请选择预计立项时间'}],
                initialValue: budgetDetails && budgetDetails.expectSetTime && moment(budgetDetails.expectSetTime),
              })(<DatePicker
                format="YYYY-MM-DD"
              />)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="其他预算金额">
            <FormItem>
              {form.getFieldDecorator('otherExpectAmount', {
                rules: [{
                  required: true,
                  message: '请输入软件预算金额',
                  transform: value => toInteger(value, 'otherExpectAmount', form)
                }],
                initialValue: budgetDetails && budgetDetails.otherExpectAmount,
              })(<Input
                onChange={e => calculateAmount(e.target.value, 'otherExpectAmount')}
                onBlur={e => calculateAmount(e.target.value, 'otherExpectAmount')}
                placeholder="请输入其他预算金额"
                addonAfter="万"/>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="预算总金额">
            <FormItem>
              {form.getFieldDecorator('expectTotalAmount', {
                rules: [{ required: true, message: '请输入软件预算金额'}],
                initialValue: budgetDetails.expectTotalAmount,
              })(<Input disabled addonAfter="万"/>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="硬件预算金额">
            <FormItem>
              {form.getFieldDecorator('hardwareExpectAmount', {
                rules: [{
                  required: true,
                  message: '请输入硬件预算金额',
                  transform: value => toInteger(value, 'hardwareExpectAmount', form)
                }],
                initialValue: budgetDetails && budgetDetails.hardwareExpectAmount,
              })(<Input
                placeholder="请输入硬件预算金额"
                onChange={e => calculateAmount(e.target.value, 'hardwareExpectAmount')}
                onBlur={e => calculateAmount(e.target.value, 'hardwareExpectAmount')}
                addonAfter="万"/>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="软件预算金额">
            <FormItem>
              {form.getFieldDecorator('softwareExpectAmount', {
                rules: [{
                  required: true,
                  message: '请输入软件预算金额',
                  transform: value => toInteger(value, 'softwareExpectAmount', form)
                }],
                initialValue: budgetDetails && budgetDetails.softwareExpectAmount,
              })(<Input
                onChange={e => calculateAmount(e.target.value, 'softwareExpectAmount')}
                onBlur={e => calculateAmount(e.target.value, 'softwareExpectAmount')}
                placeholder="请输入软件预算金额"
                addonAfter="万"/>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="项目类型">
            <FormItem>
              {form.getFieldDecorator('type', {
                rules: [{required: true, message: '请选择项目类型'}],
                initialValue: budgetDetails && budgetDetails.type,
              })(
                <RadioGroup placeholder="请选择项目类型">
                  {PROJECT_TYPE.map(v => (
                    <Radio value={v.key} key={v.key}>{v.value}</Radio>
                  ))}
                </RadioGroup>
              )}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="预算类型">
            <FormItem>
              {form.getFieldDecorator('budgetType', {
                rules: [{required: true, message: '请选择预算类型'}],
                initialValue: budgetDetails && budgetDetails.budgetType,
              })(<RadioGroup placeholder="请选择项目类型">
                {BUDGET_TYPE.map(v => (
                  <Radio value={v.key} key={v.key}>{v.value}</Radio>
                ))}
              </RadioGroup>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="承建团队">
            <FormItem>
              {form.getFieldDecorator('receiveGroupId', {
                rules: [{required: true, message: '请选择承建团队'}],
                initialValue: budgetDetails && budgetDetails.receiveGroupId,
              })(<Select
                placeholder="请选择承建团队"
              >
                {
                  groupList && groupList.map(v => (
                    <Option value={v.number} key={v.number}>{v.name}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="录入人">
            <FormItem>
              {
                budgetDetails && budgetDetails.userName
              }
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="录入时间">
            <FormItem>
              {
                budgetDetails && budgetDetails.createTime
              }
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="所属集群或板块">
            <FormItem>
              {form.getFieldDecorator('clusterId', {
                rules: [{required: true, message: '请选择所属集群或板块'}],
                initialValue: budgetDetails&& budgetDetails.clusterId,
              })(<Select
                disabled>
                {
                  clusterList&& clusterList.map(v => (
                    <Option value={v.id} key={v.id}>{v.name}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={3} label="描述">
            <Editor
              height={300}
              content={description}
              onContentChange={content => setDescription(content)}
            />
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  };

  return (
    <div className="main">
      <GlobalSandBox
        img={budget_xq}
        title="预算详情"
        optNode={
          !editModalVisible ? <Button onClick={() => setEditModalVisible(true)} type="primary">编辑</Button> : (
            <>
              <Button onClick={() => setEditModalVisible(false)} type="default">取消</Button>
              <Button loading={editLoading} className="margin-left-12" onClick={() => handleSubmitForm()} type="primary">保存</Button>
            </>
          )
        }
      >
        <Form>
          {!editModalVisible && (
            <Descriptions column={3} bordered>
              {
                detailsList.map((v, i) => (
                  <Descriptions.Item
                    key={i.toString()}
                    span={v.span}
                    label={<>{v.required && <span style={{ color: 'red' }}>*</span>}{v.name}</>}
                  >
                    {v.value}
                  </Descriptions.Item>
                ))
              }
              <Descriptions.Item span={3} label="项目描述">
                <div dangerouslySetInnerHTML={{ __html: budgetDetails.description}}/>
              </Descriptions.Item>
            </Descriptions>
          )}
          {
            editModalVisible && renderEditForm()
          }
        </Form>
      </GlobalSandBox>
      <GlobalSandBox
        img={budget_log}
        title="操作日志"
        sandboxStyle={{ marginTop: 16 }}
      >
          <StandardTable
            rowKey="id"
            loading={loading}
            columns={columns}
            data={budgetLogList}
            onChange={handleStandardTableChange}
          />
      </GlobalSandBox>
    </div>
  )
};
export default connect(({ budgetManage, loading }) => ({
    budgetManage,
    loading: loading.models.budgetManage,
    editLoading: loading.effects['budgetManage/updateBudget'],
  }))(Form.create()(Index))
