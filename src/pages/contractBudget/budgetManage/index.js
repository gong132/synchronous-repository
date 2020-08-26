import React, {Fragment, useEffect, useState} from "react";
import {withRouter} from "umi";
import { connect } from 'dva'
import {DefaultPage, TableColumnHelper} from "@/utils/helper";
import StandardTable from "@/components/StandardTable";
import {Button, Col, Divider, Form, Input, Popover, Row, Tooltip} from "antd";
import {isEmpty} from "@/utils/lang";
import styles from "../index.less";
import {formLayoutItem, formLayoutItem1} from "@/utils/constant";

const FormItem = Form.Item;
const Index = props => {

  const { dispatch, budgetManage:{ budgetList }, loading, form } = props;

  // 查询更多
  const [searchMore, setSearchMore] = useState(false)

  const handleQueryBudgetData = params => {
    dispatch({
      type: 'budgetManage/fetchBudgetData',
      payload: {
        // ...DefaultPage,
        // ...params,
        id: 1,
      }
    })
  };

  const columns = [
    {
      title: '预算编号',
      key: 'budgetId',
      render: rows =>{
        if (isEmpty(rows.budgetId, true)) return ''
        return (
          <Tooltip placement="top" title={rows.budgetId}>
            <a style={{ color: '#FF9716' }}>{`${rows.budgetId.substring(0, 5)}...`}</a>
          </Tooltip>
        )
      },
    },
    TableColumnHelper.genLangColumn('budgetName', '项目名称', {}, 4),
    TableColumnHelper.genPlanColumn('reporter', '录入人'),
    TableColumnHelper.genDateTimeColumn('reportTime', '录入时间', "YYYY-MM-DD"),
    TableColumnHelper.genPlanColumn('deptName', '需求部门'),
    TableColumnHelper.genLangColumn('gather', '所属集群或板块', {}, 4),
    TableColumnHelper.genDateTimeColumn('expectStartTime', '预计立项时间', "YYYY-MM-DD"),
    TableColumnHelper.genMoneyColumn('expectTotalAmount', '预算总金额'),
    TableColumnHelper.genMoneyColumn('expectHardwareAmount', '硬件预算金额'),
    {
      title: '操作',
      align: 'center',
      render: rows => (
        <Fragment>
          <a>编辑</a>
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
  useEffect(() => {
    handleQueryBudgetData()
  }, []);
  const renderForm = () => {
    const { getFieldDecorator } = form;
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="项目类型">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请选择项目类型" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算总金额">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入预算总金额" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算类型">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入预算类型" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预计立项时间">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入预计立项时间" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="承建团队">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入承建团队" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="所属集群或板块">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入所属集群或板块" />)}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button>查询</Button>
          <Button onClick={() => setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="预算编号">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入预算编号" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="项目名称">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入项目名称" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="需求部门">
              {getFieldDecorator('budgetName', {
              })(<Input placeholder="请输入需求部门" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <Button
                  // className={styles.addForm}
                  ghost
                  type="primary"
                  style={{ marginRight: 6 }}
                  icon="plus"
                >新建</Button>
                <Button
                  ghost
                  type="danger"
                  className="margin-right-6"
                  onClick={handleResetForm}
                >重置</Button>
                <Button
                  type="default"
                >导出</Button>
              </div>
              <Popover visible={searchMore} placement="bottomRight" content={content} trigger="click">
                {
                  !searchMore ? <a className="margin-right-6" onClick={() => setSearchMore(true)}>更多</a> :
                    <a className="margin-right-6" onClick={() => setSearchMore(false)}>隐藏</a>
                }
              </Popover>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
  return (
    <div className="main">
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          {renderForm()}
        </div>
        <StandardTable
          rowKey="budgetId"
          loading={loading}
          data={budgetList}
          columns={columns}
          onChange={handleStandardTableChange}
        />
      </div>
    </div>
  )
}

export default connect(
  ({ budgetManage, loading }) => ({
    budgetManage,
    // fetchOrderDataLoading: loading.effects['budgetManage/fetchOrderData'],
    loading: loading.models.budgetManage
  })
)(Form.create()(Index))
