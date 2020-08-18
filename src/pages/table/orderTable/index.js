import React, {useEffect} from "react";
import { connect } from 'dva'
import {DefaultPage, TableColumnHelper} from '@/utils/helper'
import StandardTable from "@/components/StandardTable";

import styles from './index.less'

const Index = props => {
  const { dispatch, order: { orderList }, loading } = props

  const handleQueryOrderList = params => {
    dispatch({
      type: 'order/fetchOrderData',
      payload: {
        ...DefaultPage
      },
    })
  }

  useEffect(() => {
    handleQueryOrderList()
  }, [])

  const columns = [
    TableColumnHelper.genPlanColumn('id', 'ID'),
    TableColumnHelper.genPlanColumn('title', '标题'),
    TableColumnHelper.genPlanColumn('description', '描述'),
    TableColumnHelper.genPlanColumn('extra', '阶段'),
    TableColumnHelper.genPlanColumn('status', '状态'),
    TableColumnHelper.genPlanColumn('type', '类型'),
  ]
  return (
    <div className={styles.main}>
      <div className={styles.tableList}>
        {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
        <StandardTable
          rowKey="id"
          loading={loading}
          data={orderList}
          columns={columns}
          // onChange={this.handleStandardTableChange}
        />
      </div>
    </div>
  )
};

export default connect(
  ({
     order,
    loading,
  }) => ({
    order,
    loading: loading.models.order
  }))(Index)
