import React, {Fragment, useEffect, useState} from "react";
import { connect } from 'dva'
import classNames from "classnames";
import {DefaultPage, TableColumnHelper} from "@/utils/helper";
import StandardTable from "@/components/StandardTable";
import {Button, Col, Divider, Form, Input, Popover, Row, Select, Tooltip, DatePicker} from "antd";
import {isEmpty} from "@/utils/lang";
import styles from "../index.less";
import {formLayoutItem, formLayoutItem1} from "@/utils/constant";
import {BUDGET_TYPE, PROJECT_TYPE} from "@/pages/contractBudget/util/constant";

import AddForm from './addForm'

const FormItem = Form.Item;
const { Option } = Select;

const Index = props => {
  const { dispatch, budgetManage:{ budgetList, clusterList, deptList, groupList }, loading, form } = props;

  // 查询更多
  const [searchMore, setSearchMore] = useState(false);
  // 新增/编辑
  const [addModalVisible, setAddModalVisible] = useState(false);
  // 选中行
  const [selectedRows, setSelectedRows] = useState({});

  const handleQueryBudgetData = params => {
    dispatch({
      type: 'budgetManage/fetchBudgetData',
      payload: {
        ...DefaultPage,
        ...params,
        id: 1,
      }
    })
  };

  const columns = [
    {
      title: '预算编号',
      key: 'number',
      render: rows =>{
        if (isEmpty(rows.number, true)) return '';
        return (
          <Tooltip placement="top" title={rows.number}>
            <a style={{ color: '#FF9716' }}>
              {rows.number.length > 10 ? `${rows.number.substring(0, 10)}...` : rows.number.substring(0, 10)}
            </a>
          </Tooltip>
        )
      },
    },
    TableColumnHelper.genSelectColumn('type', '项目类型', PROJECT_TYPE),
    TableColumnHelper.genLangColumn('name', '项目名称', {}, 4),
    TableColumnHelper.genPlanColumn('userName', '录入人'),
    TableColumnHelper.genDateTimeColumn('createTime', '录入时间', "YYYY-MM-DD"),
    TableColumnHelper.genPlanColumn('deptName', '需求部门'),
    TableColumnHelper.genLangColumn('clusterName', '所属集群或板块', {}, 4),
    TableColumnHelper.genDateTimeColumn('expectSetTime', '预计立项时间', "YYYY-MM-DD"),
    TableColumnHelper.genMoneyColumn('expectTotalAmount', '预算总金额'),
    TableColumnHelper.genMoneyColumn('hardwareExpectAmount', '硬件预算金额'),
    {
      title: '操作',
      align: 'center',
      render: rows => (
        <Fragment>
          <a onClick={() => {
            setAddModalVisible(true);
            setSelectedRows(rows)
          }}>编辑</a>
          <Divider type="vertical" />
          <a>查看</a>
        </Fragment>
      )
    },
  ];
// 分页操作
  const handleStandardTableChange = pagination => {
    // const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues, // 添加已查询条件去获取分页
    };
    handleQueryBudgetData(params)
  };

  const handleResetForm = () => {
    setSearchMore(true);
    form.resetFields();
    setSearchMore(false);
    handleQueryBudgetData()
  };

  const handleSearchForm = () => {
    const formValues = form.getFieldsValue();
    console.log(formValues, 'formValues')
    handleQueryBudgetData(formValues)
  }

  // 获取搜索条件,转换成数组
  const getSearchValuesToList = () => {
    const formValues = form.getFieldsValue()

  };

  const handleQueryClusterList = () => {
    dispatch({
      type: 'budgetManage/queryClusterList',
      payload: {
      }
    })
  };
  const handleQueryGroupList = () => {
    dispatch({
      type: 'budgetManage/queryGroupList',
      payload: {
      }
    })
  };

  useEffect(() => {
    handleQueryBudgetData();
    handleQueryClusterList();
    handleQueryGroupList();
  }, []);

  const renderForm = () => {
    const { getFieldDecorator } = form;
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="项目类型">
              {getFieldDecorator('type', {
              })(<Select
                placeholder="请选择项目类型"
                allowClear
              >
                {
                  PROJECT_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算总金额">
              {getFieldDecorator('expectTotalAmount', {
              })(<Input
                allowClear
                placeholder="请输入预算总金额" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算类型">
              {getFieldDecorator('budgetType', {
              })(<Select
                placeholder="请选择预算类型"
                allowClear
              >
                {
                  BUDGET_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>{v.value}</Option>
                  ))
                }
              </Select>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预计立项时间">
              {getFieldDecorator('expectSetTime', {
              })(<DatePicker
                allowClear
                format="YYYY-MM-DD"
              />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="承建团队">
              {getFieldDecorator('receiveGroupId', {
              })(<Input
                allowClear
                placeholder="请输入承建团队" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="所属集群或板块">
              {getFieldDecorator('clusterId', {
              })(<Input
                allowClear
                placeholder="请输入所属集群或板块" />)}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={handleSearchForm}>查询</Button>
          <Button onClick={() => setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="预算编号">
              {getFieldDecorator('number', {
              })(<Input
                allowClear
                onBlur={handleSearchForm}
                placeholder="请输入预算编号" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="项目名称">
              {getFieldDecorator('name', {
              })(<Input
                allowClear
                onBlur={handleSearchForm}
                placeholder="请输入项目名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="需求部门">
              {getFieldDecorator('deptName', {
              })(<Input
                allowClear
                onBlur={handleSearchForm}
                placeholder="请输入需求部门" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button
                ghost
                className={classNames('margin-right-6',styles.orangeForm)}
                onClick={handleResetForm}
              >重置</Button>
              <Popover visible={searchMore} placement="bottomRight" content={content} trigger="click">
                {
                  !searchMore ? <span className="activeColor" onClick={() => setSearchMore(true)}>更多</span> :
                    <span className="activeColor" onClick={() => setSearchMore(false)}>隐藏</span>
                }
              </Popover>
            </div>
          </Col>
        </Row>
      </Form>
    )
  };
  return (
    <div className="main">
      <div className="yCenter-between">
        <Button
          className={styles.addForm}
          icon="plus"
          onClick={() => setAddModalVisible(true)}
        >新建</Button>
        <Button
          type="default"
        >导出</Button>
      </div>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          {renderForm()}
        </div>
        <StandardTable
          rowKey="id"
          loading={loading}
          data={budgetList}
          columns={columns}
          onChange={handleStandardTableChange}
        />
        { addModalVisible && (
          <AddForm
            modalVisible={addModalVisible}
            handleModalVisible={() => {
              setAddModalVisible(false);
              setSelectedRows({})
            }}
            handleQueryBudgetData={handleQueryBudgetData}
            values={selectedRows}
          />
        )}
      </div>
    </div>
  )
}

export default connect(
  ({ budgetManage, loading }) => ({
    budgetManage,
    loading: loading.models.budgetManage
  })
)(Form.create()(Index))
