import React, {Fragment, useEffect, useState} from "react";
import { connect } from "dva"
import classNames from "classnames";
import {DefaultPage, TableColumnHelper} from "@/utils/helper";
import StandardTable from "@/components/StandardTable";
import {Button, Col, Form, Input, Popover, Row, Select, Tooltip, DatePicker, Icon, Card} from "antd";
import {isEmpty} from "@/utils/lang";
import {formLayoutItem, formLayoutItem1, MENU_ACTIONS} from "@/utils/constant";
import {BUDGET_TYPE, PROJECT_TYPE} from "@/pages/contractBudget/util/constant";
import OptButton from "@/components/commonUseModule/optButton";
import edit from "@/assets/icon/Button_bj.svg"
import upIcon from "@/assets/icon/Pull_up.svg"
import bottomIcon from "@/assets/icon/drop_down.svg"

import AddForm from "./addForm"
import styles from "../index.less";

const FormItem = Form.Item;
const { Option } = Select;

const Index = props => {
  const { dispatch, budgetManage:{ budgetList }, loading, form,
    global: { authActions },
  } = props;

  // 查询更多
  const [searchMore, setSearchMore] = useState(false);
  // 新增/编辑
  const [addModalVisible, setAddModalVisible] = useState(false);
  // 选中行
  const [selectedRows, setSelectedRows] = useState({});

  const handleQueryBudgetData = params => {
    dispatch({
      type: "budgetManage/fetchBudgetData",
      payload: {
        ...DefaultPage,
        ...params,
        id: 1,
      }
    })
  };

  const columns = [
    {
      title: "预算编号",
      key: "number",
      render: rows => {
        if (isEmpty(rows.number, true)) return "";
        return (
          <Tooltip placement="top" title={rows.number}>
          <span
            style={{ color: "#2E5BFF" }}
            onClick={() => {
              props.history.push({
                pathname: "/contract-budget/budget/detail",
                query: {
                  id: rows.id,
                }
              })
            }}
          >
            { rows.number.length > 10 ? `${rows.number.substring(0, 10)}...` : rows.number.substring(0, 10) }
          </span>
          </Tooltip>
        )
      },
    },
    TableColumnHelper.genSelectColumn('type', '项目类型', PROJECT_TYPE),
    TableColumnHelper.genLangColumn('name', '项目名称', {}, 4),
    TableColumnHelper.genPlanColumn('userName', '录入人'),
    TableColumnHelper.genDateTimeColumn('createTime', '录入时间', "YYYY-MM-DD"),
    TableColumnHelper.genPlanColumn('deptName', '需求部门'),
    TableColumnHelper.genLangColumn('clusterName', '集群或板块', {}, 4),
    TableColumnHelper.genDateTimeColumn('expectSetTime', '预计立项时间', "YYYY-MM-DD"),
    TableColumnHelper.genMoneyColumn('expectTotalAmount', '预算总金额'),
    TableColumnHelper.genMoneyColumn('hardwareExpectAmount', '硬件预算金额'),
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: rows => (
        <Fragment>
          {
            authActions.includes(MENU_ACTIONS.EDIT) && (
              <OptButton
                img={edit}
                text="编辑"
                onClick={() => {
                  setAddModalVisible(true);
                  setSelectedRows(rows)
                }}
              />
            )
          }
          <OptButton
            icon="eye"
            text="查看"
            onClick={() => {
              props.history.push({
                pathname: '/contract-budget/budget/detail',
                query: {
                  id: rows.id,
                }
              })
            }}
          />
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
    handleQueryBudgetData(formValues)
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
                <div className="yCenter">
                  {
                    !searchMore ? <span className="activeColor" onClick={() => setSearchMore(true)}><Icon style={{ verticalAlign: '-0.4em'}} component={bottomIcon}/>更多</span> :
                      <span className="activeColor" onClick={() => setSearchMore(false)}><Icon style={{ verticalAlign: '-0.4em'}} component={upIcon}/>隐藏</span>
                  }
                </div>
              </Popover>
            </div>
          </Col>
        </Row>
      </Form>
    )
  };
  return (
    <div className="main">
      <div style={{ marginBottom: 12 }} className="yCenter-between">
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
        <Card bordered={false}>
          <StandardTable
            rowKey="id"
            loading={loading}
            data={budgetList}
            columns={columns}
            onChange={handleStandardTableChange}
            scroll={{ x: 1450 }}
          />
        </Card>
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
  ({ budgetManage, global, loading }) => ({
    budgetManage,
    global,
    loading: loading.models.budgetManage
  })
)(Form.create()(Index))
