import React, {useEffect} from "react";
import { connect } from "dva";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";

import styles  from "./index.less";

const Index = props => {
  const { dispatch, budgetChart: { budgetDetails, budgetDetailInfo }, loading,  location: { query: { id }}, } = props;

  const handleQueryDetailTableList = params => {
    dispatch({
      type: "budgetChart/queryBudgetDetails",
      payload: {
        budgetNumber: id,
        ...PagerHelper.DefaultPage,
        ...params,
      }
    })
  }
  // 分页操作
  const handleStandardTableChange = (pagination, filters, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    const sortParams = {
      orderBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    handleQueryDetailTableList({ ...params, ...sortParams });
  };

  useEffect(() => {
    handleQueryDetailTableList()
  }, [])

  const columns = [
    TableColumnHelper.genPlanColumn("demandNo", "需求编号", { sorter: true }),
    TableColumnHelper.genPlanColumn("pjCode", "项目编号", { sorter: true }),
    TableColumnHelper.genPlanColumn("pjName", "项目名称", { sorter: true }),
    TableColumnHelper.genPlanColumn("estAmount", "立项金额(元)", { sorter: true }),
    TableColumnHelper.genPlanColumn("contractAmount", "合同成交金额(元)", { sorter: true }),
    TableColumnHelper.genDateTimeColumn("createTime", "项目接收日期", "YYYY-MM-DD",{ sorter: true }),
    TableColumnHelper.genPlanColumn("clusterName", "所属集群/板块", { sorter: true }),
  ]
  console.log(budgetDetailInfo, "budgetDetailInfo")
  return (
    <GlobalSandBox
      title="所属预算"
      optNode={(
        <div className={styles.headBox}>
          <div>预算编号: <span>{budgetDetailInfo?.budgetNumber}</span></div>
          <div className="margin-left-12">
            预算金额(万):
            <span>
              {budgetDetailInfo?.budgetTotalAmount}
            </span>
          </div>
          <div className="margin-left-12">
            预算剩余可用额(万):
            <span>
              {budgetDetailInfo?.budgetSurplusAmount}
            </span>
          </div>
        </div>
      )}
    >
      <StandardTable
        rowKey="id"
        columns={columns}
        data={budgetDetails}
        loading={loading}
        onChange={handleStandardTableChange}
      />
    </GlobalSandBox>
  )
}

export default connect(
  ({
     budgetChart,
     loading,
   }) => ({
    budgetChart,
    loading: loading.models.budgetChart,
  }))(Index)

