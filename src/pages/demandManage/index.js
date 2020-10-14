import React, { useEffect } from "react";
import { connect } from "dva"
import {DatePicker, Col, Form, Row, Button, Select, Spin} from "antd";

import DeptPie from "./chart/deptPie"
import TeamBar from "./chart/teamBar"
import StatusBar from "./chart/statusBar"
import SystemLine from "./chart/systemLine"
import DetailTable from "./chart/detailTable"
import storage from "@/utils/storage";
import {formLayoutItemLabel7} from "@/utils/constant";
import classNames from "classnames";
import styles from "./index.less";
import {PagerHelper} from "@/utils/helper";
import {DEMAND_STATUS} from "@/pages/demandManage/utils/constant";

const { userInfo } = storage.get("gd-user", {})
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const Index = props => {
  const { form, dispatch, loading,
    demandManage: {
      demandTableList,
      demandDeptInfo,
      demandTeamList,
      demandStatusList,
      demandSystemList,
      pendingCount,
      othersData,
    },
    global: {
      systemList,
      deptList,
      userList,
    }
  } = props;


  const handleQueryDemandInfo = params => {
    dispatch({
      type: "demandManage/queryDemandInfo",
      payload: {
        teamId: userInfo?.teamId,
        ...params,
      }
    })
  }
  const handleQueryUserList = () => {
    dispatch({
      type: "global/queryUserList",
      payload: {
        ...PagerHelper.MaxPage,
      }
    })
  }
  const handleQuerySystemList = () => {
    dispatch({
      type: "global/querySystemList",
      payload: {
        ...PagerHelper.MaxPage,
      }
    })
  }
  const handleQueryDeptList = () => {
    dispatch({
      type: "global/queryDeptList",
      payload: {
        ...PagerHelper.MaxPage,
      }
    })
  }

  useEffect(() => {
    handleQueryDemandInfo()
    handleQueryUserList()
    handleQuerySystemList()
    handleQueryDeptList()
  }, [])

  const handleSearchForm = () => {
    const { rangeDate, ...others } = form.getFieldsValue();
    const params = {
      ...others,
      startTime: rangeDate && rangeDate[0].format("YYYY-MM-DD"),
      endTime: rangeDate && rangeDate[1].format("YYYY-MM-DD"),
    }
    handleQueryDemandInfo(params)
  }
  const handleResetForm = () => {
    form.resetFields()
    handleQueryDemandInfo()
  }
  const renderForm = () => {
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem {...formLayoutItemLabel7} label="需求创建时间" colon={false}>
              {getFieldDecorator(
                'rangeDate',
              )(<RangePicker allowClear onBlur={handleSearchForm} format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem {...formLayoutItemLabel7} label="所属系统" colon={false}>
              {getFieldDecorator(
                'systemId',
              )(
                <Select
                  allowClear
                  onChange={handleSearchForm}
                  placeholder="请选择所属系统"
                >
                  {
                    systemList?.list && systemList.list.map(v => (
                      <Option value={v.id} key={v.id}>{v.sysName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem {...formLayoutItemLabel7} label="团队成员" colon={false}>
              {getFieldDecorator(
                'userId',
              )(
                <Select
                  allowClear
                  onChange={handleSearchForm}
                  placeholder="请选择团队成员"
                >
                  {
                    userList?.list && userList.list.map(v => (
                      <Option value={v.userId} key={v.userId.toString()}>
                        {v.userName}
                      </Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItemLabel7} label="需求所属部门" colon={false}>
              {getFieldDecorator(
                'deptId',
              )(
                <Select
                  allowClear
                  onChange={deptId => {
                    handleQueryDemandInfo({deptId})
                    handleSearchForm()
                  }}
                  placeholder="请选择需求所属部门"
                >
                  {
                    deptList?.list && deptList.list.map(v => (
                      <Option value={v.id.toString()} key={v.id}>{v.name}</Option>
                    ))
                  }
                  <Option value="0">其他</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem {...formLayoutItemLabel7} label="需求状态">
              {getFieldDecorator(
                'boardId',
              )(
                <Select
                  allowClear
                  onChange={handleSearchForm}
                  placeholder="请选择需求状态"
                >
                  {DEMAND_STATUS.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              ghost
              className={classNames('margin-left-6', styles.orangeForm)}
              onClick={handleResetForm}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
  return (
    <div className="main">
      <div className={styles.tableListForm}>{renderForm()}</div>
      <Spin spinning={loading}>
        <Row style={{ marginTop: 16 }}>
          <Col span={12} className="padding-right-8">
            <DeptPie handleSetDeptId={value => form.setFieldsValue({deptId: value})} handleQueryDemandInfo={handleQueryDemandInfo} demandDeptInfo={demandDeptInfo} />
          </Col>
          <Col span={12} className="padding-left-8">
            <TeamBar demandTeamList={demandTeamList} />
          </Col>
        </Row>
        <Row>
          <Col span={12} className="padding-right-8">
            <StatusBar demandStatusList={demandStatusList} />
          </Col>
          <Col span={12} className="padding-left-8">
            <SystemLine demandSystemList={demandSystemList} />
          </Col>
        </Row>
      </Spin>
      <Row style={{height: 600 }}>
        <Col span={24}>
          <DetailTable
            demandTableList={demandTableList}
            pendingCount={pendingCount}
            othersData={othersData}
            handleQueryDemandInfo={handleQueryDemandInfo}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  )
}

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
