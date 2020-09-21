import React, { memo, useEffect} from "react";
import { withRouter } from "umi";
import styles from "./index.less";
import {StandardTable} from "@/components/StandardTable";
import { connect } from "dva";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import { Form} from "antd";
// import OptButton from "@/components/commonUseModule/optButton";
// import assignIcon from "@/assets/icon/cz_zp.svg";


const isEqual = (preProps, nextProps) => {
 console.log(preProps, nextProps, '1111111111')
  if (!nextProps.done) return false
  return true
}

const Index = memo(withRouter(props => {
  const { dispatch, demand: { storyList }, loading } = props;

  const handleQueryStoryList = () => {
    dispatch({
      type: "demand/queryStoryList",
      payload: {
        ...PagerHelper.DefaultPage,
      }
    })
  }

  useEffect(() => {
    console.log(props, 2)
    handleQueryStoryList()
  }, [])

  const renderForm = () => {
    return (
      <div>1111</div>
    )
  }

  const columns = [
    TableColumnHelper.genPlanColumn("number","story编号"),
    TableColumnHelper.genPlanColumn("title","标题"),
    TableColumnHelper.genPlanColumn("status","状态"),
    TableColumnHelper.genPlanColumn("priority","优先级"),
    TableColumnHelper.genPlanColumn("type","story类型"),
    TableColumnHelper.genPlanColumn("systemName","所属系统"),
    TableColumnHelper.genDateTimeColumn("evaluateTime","IT预计上线时间"),
    TableColumnHelper.genPlanColumn("developWorkload","开发预计测试工作量"),
    TableColumnHelper.genPlanColumn("testWorkload","测试预计测试工作量"),
    TableColumnHelper.genPlanColumn("assessor","评估人"),
    TableColumnHelper.genPlanColumn("userName","创建人"),
    TableColumnHelper.genDateTimeColumn("createTime","创建时间"),
  ]
  return (
    <div className={styles.tableList}>
      <div className={styles.tableListForm}>{renderForm()}</div>
      <StandardTable
        rowKey="id"
        columns={columns}
        data={storyList}
        loading={loading}
      />
    </div>
  )
}), isEqual)


export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Form.create()(Index));
