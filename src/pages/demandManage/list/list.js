import React, {Fragment, useEffect, useState} from "react";
import { connect } from "dva"
import { Button, Col, DatePicker, Form, Icon, Input, Popover, Row, Select, Tabs, Tooltip } from "antd";
import { withRouter } from "umi/index";
import { PagerHelper, TableColumnHelper } from "@/utils/helper";
import StandardTable from "@/components/StandardTable";
import { isEmpty } from "@/utils/lang";
import {
  DEMAND_LEVEL,
  DEMAND_PRIORITY_ARR,
  DEMAND_STATUS,
  DEMAND_TYPE,
  DEMAND_TYPE_ARR
} from "@/pages/demand/util/constant";
import OptButton from "@/components/commonUseModule/optButton";
import { formLayoutItem, formLayoutItem2 } from "@/utils/constant";
import classNames from "classnames";
import bottomIcon from "@/assets/icon/drop_down.svg";
import upIcon from "@/assets/icon/Pull_up.svg";

import styles from "./list.less";
import {DEMAND_TYPE_SEARCH} from "@/pages/demandManage/utils/constant";

const demandRoutes = {
  'i': '/demand/myDemand',
  'u': '/demand/generalDemand',
  'p': '/demand/projectDemand',
};

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const Index = withRouter(props => {
  const { form, dispatch, loading, demandManage: { demandManageList }, global: { userList } } = props;

  const [searchMore, setSearchMore] = useState(false)
  const [demandStatus, setDemandStatus] = useState('0')

  const handleQueryDemandList = params => {
    dispatch({
      type: "demandManage/queryDemandList",
      payload: {
        receiverId: props?.location?.query?.id,
        flag: "0",
        ...PagerHelper.DefaultPage,
        ...params,
      }
    })
  }
  const handleQueryUserList = () => {
    dispatch({
      type: "global/queryUserList",
      payload: {
      }
    })
  }

  useEffect(() => {
    if (props?.location?.query?.id) {
      handleQueryDemandList()
      handleQueryUserList()
    }
  }, [])


  const columns = [
    {
      title: '需求编号',
      key: 'demandNumber',
      sorter: true,
      render: rows => {
        if (isEmpty(rows.demandNumber, true)) return '';
        return (
          <Tooltip placement="top" title={rows.demandNumber}>
            <span
              style={{ color: '#2E5BFF', cursor: 'pointer' }}
              onClick={() => {
                if (!rows.type) return;
                props.history.push({
                  pathname: `${demandRoutes[rows.type]}/detail`,
                  query: {
                    id: rows.id,
                    no: rows.demandNumber,
                  },
                });
              }}
            >
              {rows.demandNumber.length > 10
                ? `${rows.demandNumber.substring(0, 10)}...`
                : rows.demandNumber.substring(0, 10)}
            </span>
          </Tooltip>
        );
      },
    },
    TableColumnHelper.genPlanColumn('title', '标题'),
    TableColumnHelper.genSelectColumn('type', '需求类型', DEMAND_TYPE, { sorter: true }),
    TableColumnHelper.genPlanColumn('status', '状态',{ sorter: true }),
    TableColumnHelper.genSelectColumn(
      'priority',
      '优先级',
      DEMAND_PRIORITY_ARR.map(v => ({ ...v, value: v.val })),
      { sorter: true },
    ),
    TableColumnHelper.genPlanColumn('acceptTeam', '受理团队', { sorter: true }),
    TableColumnHelper.genPlanColumn('receiverName', '受理人', { sorter: true }),
    TableColumnHelper.genDateTimeColumn('expectedCompletionDate', '期望完成日期', 'YYYY-MM-DD', {
      sorter: true,
    }),
    TableColumnHelper.genDateTimeColumn('plannedLaunchDate', '计划上线日期', 'YYYY-MM-DD', {
      sorter: true,
    }),
    TableColumnHelper.genDateTimeColumn('actualLineDate', '实际上线日期', 'YYYY-MM-DD'),
    {
      title: '操作',
      width: 120,
      align: 'center',
      render: rows => (
        <Fragment>
          <OptButton
            icon="eye"
            showText={false}
            text="查看"
            onClick={() => {
              if (!rows.type) return;

              props.history.push({
                pathname: `${demandRoutes[rows.type]}/detail`,
                query: {
                  id: rows.id,
                  no: rows.demandNumber,
                },
              });
            }}
          />
        </Fragment>
      ),
    },
  ];

  const handleSearchForm = () =>{
    const { createTime, expectedTime, planTime, actualTime, ...others } = form.getFieldsValue()
    const params = {
      flag: demandStatus,
      ...others,
      startTime: createTime && createTime?.length > 0 ? createTime[0].format("YYYY-MM-DD") : null,
      endTime: createTime && createTime?.length > 0 ? createTime[1].format("YYYY-MM-DD") : null,
      expectedStartTime: expectedTime && expectedTime?.length > 0 ? expectedTime[0].format("YYYY-MM-DD") : null,
      expectedEndTime: expectedTime && expectedTime?.length > 0 ? expectedTime[1].format("YYYY-MM-DD") : null,
      planStartTime: planTime && planTime?.length > 0 ? planTime[0].format("YYYY-MM-DD") : null,
      planEndTime: planTime && planTime?.length > 0 ? planTime[1].format("YYYY-MM-DD") : null,
      actualStartTime: actualTime && actualTime?.length > 0 ? actualTime[0].format("YYYY-MM-DD") : null,
      actualEndTime: actualTime && actualTime?.length > 0 ? actualTime[1].format("YYYY-MM-DD") : null,
    }

    handleQueryDemandList(params)
  }

  const handleFormReset = () =>{
    form.resetFields()
    handleQueryDemandList()
  }
  const handleTabsChange = key =>{
    setDemandStatus(key)
    handleQueryDemandList({ flag: key })
  }

  // 分页操作
  const handleStandardTableChange = (pagination, filters, sorter) => {

    const { createTime, expectedTime, planTime, actualTime, ...others } = form.getFieldsValue()

    const formValues = {
      ...others,
      startTime: createTime ? createTime[0].format("YYYY-MM-DD") : null,
      endTime: createTime ? createTime[1].format("YYYY-MM-DD") : null,
      expectedStartTime: expectedTime ? expectedTime[0].format("YYYY-MM-DD") : null,
      expectedEndTime: expectedTime ? expectedTime[1].format("YYYY-MM-DD") : null,
      planStartTime: planTime ? planTime[0].format("YYYY-MM-DD") : null,
      planEndTime: planTime ? planTime[1].format("YYYY-MM-DD") : null,
      actualStartTime: actualTime ? actualTime[0].format("YYYY-MM-DD") : null,
      actualEndTime: actualTime ? actualTime[1].format("YYYY-MM-DD") : null,
    }
    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    const params = {
      flag: demandStatus,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
      ...sortParams, // 排序参数
    };
    handleQueryDemandList(params)
  }

  const renderForm = () => {
    const { getFieldDecorator } = form;
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="需求类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择项目类型" allowClear>
                  {DEMAND_TYPE_ARR.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="优先级">
              {getFieldDecorator('priority')(
                <Select placeholder="请选择项目类型" allowClear>
                  {DEMAND_PRIORITY_ARR.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="期望完成日期">
              {getFieldDecorator('expectedTime')(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="计划上线日期">
              {getFieldDecorator('planTime')(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="实际上线日期">
              {getFieldDecorator('actualTime')(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="需求紧迫性">
              {getFieldDecorator('urgency')(
                <Select placeholder="请选择项目类型" allowClear>
                  {DEMAND_LEVEL.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="是否涉及业务风控功能">
              {getFieldDecorator('riskControl')(
                <Select placeholder="请选择项目类型" allowClear>
                  {[
                    { key: 'y', value: '是' },
                    { key: 'n', value: '否' },
                  ].map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="是否涉及业务合规性">
              {getFieldDecorator('businessControl')(
                <Select placeholder="请选择项目类型" allowClear>
                  {[
                    { key: 'y', value: '是' },
                    { key: 'n', value: '否' },
                  ].map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={handleSearchForm}>查询</Button>
          <Button onClick={() => setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );

    const queryStatusOption = () => {
      let optionArr = [];
      if (demandStatus === "0")  optionArr = DEMAND_STATUS
      if (demandStatus === "1")  optionArr = DEMAND_STATUS.filter(v => v.key !== "0" && v.key !== "1" && v.key !== "2")
      if (demandStatus === "2")  optionArr = DEMAND_STATUS.filter(v => v.key === "9")
      if (demandStatus === "3")  optionArr = DEMAND_STATUS.filter(v => v.key === "3")
      return optionArr.map(v => (
        <Option value={v.key} key={v.key.toString()}>
          {v.value}
        </Option>
      ))
    }
    return (
      <Form layout="inline">
        <Row>
          <Col span={6}>
            <FormItem {...formLayoutItem} label="需求标题和描述">
              {getFieldDecorator('titleOrDescription')(
                <Input
                  allowClear
                  onBlur={handleSearchForm}
                  placeholder="请输入需求标题或描述关键字"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem {...formLayoutItem} label="创建人">
              {getFieldDecorator(
                'creator',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onBlur={handleSearchForm}
                  placeholder="请输入创建人"
                >
                  {
                    userList?.list && userList.list.map(v => (
                      <Option value={v.userId} key={v.userId.toString()}>
                        {v.userName}
                      </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem {...formLayoutItem} label="状态">
              {getFieldDecorator(
                'status',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onBlur={handleSearchForm}
                  placeholder="请选择状态"
                >
                  {queryStatusOption()}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="创建日期">
              {getFieldDecorator('createTime', {})(<RangePicker onBlur={handleSearchForm} format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button
                ghost
                className={classNames('margin-right-6', styles.orangeForm)}
                onClick={() => handleFormReset()}
              >
                重置
              </Button>
              <Popover
                visible={searchMore}
                placement="bottomRight"
                content={content}
                trigger="click"
              >
                <div className="yCenter">
                  {!searchMore ? (
                    <span className="activeColor" onClick={() => setSearchMore(true)}>
                      <Icon style={{ verticalAlign: '-0.4em' }} component={bottomIcon} />
                      更多
                    </span>
                  ) : (
                    <span className="activeColor" onClick={() => setSearchMore(false)}>
                      <Icon style={{ verticalAlign: '-0.4em' }} component={upIcon} />
                      隐藏
                    </span>
                  )}
                </div>
              </Popover>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };
  return (
    <div className="main">
      <div className={styles.tableListForm}>{renderForm()}</div>
      <div className={styles.tableList}>
        <Tabs activeKey={demandStatus} className={styles.tabBarStyle} onChange={handleTabsChange}>
          {
            DEMAND_TYPE_SEARCH.map(v => (
              <Tabs.TabPane key={v.key} tab={v.value}>
                <StandardTable
                  rowKey="id"
                  loading={loading}
                  columns={columns}
                  data={demandManageList}
                  onChange={handleStandardTableChange}
                />
              </Tabs.TabPane>
            ))
          }
        </Tabs>
      </div>
    </div>
  )
})

export default connect(
  ({
    global,
    demandManage,
    loading,
  }) => ({
    global,
    demandManage,
    loading: loading.models.demandManage,
  }))(Form.create()(Index))
