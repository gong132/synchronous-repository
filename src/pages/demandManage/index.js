import React, {useEffect} from "react";
import { connect } from "dva"
import {Card, Col, Row} from "antd";

import DeptPie from "./chart/deptPie"
import TeamBar from "./chart/teamBar"
import StatusBar from "./chart/statusBar"
import SystemLine from "./chart/systemLine"
import DetailTable from "./chart/detailTable"
import storage from "@/utils/storage";

const { userInfo } = storage.get("gd-user", {})
const Index = props => {
  const { dispatch, demandManage: {
    demandTableList,
    demandDeptInfo,
    demandTeamList,
    demandStatusList,
    demandSystemList,
    pendingCount,
    othersData,
  }} = props;

  const handleQueryDemandInfo = params => {
    dispatch({
      type: "demandManage/queryDemandInfo",
      payload: {
        teamId: userInfo?.teamId,
        ...params,
      }
    })
  }

  useEffect(() => {
    handleQueryDemandInfo()
  }, [])

  return (
    <div className="main">
      <Row>
        <Col span={24}>搜索</Col>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card style={{ marginRight: 8 }} title="需求所属部门">
            <DeptPie demandDeptInfo={demandDeptInfo} />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ marginLeft: 8 }}>
            <TeamBar />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card style={{ marginRight: 8 }}>
            <StatusBar />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ marginLeft: 8 }}>
            <SystemLine />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card>
            <DetailTable />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect(
  ({
    demandManage,
  }) => ({
    demandManage,
  }))(Index)
