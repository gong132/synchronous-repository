import React, {Component, Fragment, useEffect} from 'react'
import CustomBtn from '@/components/commonUseModule/customBtn'
import {connect} from 'dva'
import {DefaultPage, TableColumnHelper} from "@/utils/helper";
import StandardTable from "@/components/StandardTable";

import styles from './index.less'
import {Form} from "antd";

const AuthorManage = props => {
  console.log(props, 'props')
  const { dispatch, authorManage: { roleList }, loading } = props

  const handleQueryAllRolesList = params => {
    dispatch({
      type:'authorManage/queryAllRolesList',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  };

  useEffect(() => {
    handleQueryAllRolesList()
  }, []);

  const columns = [
    TableColumnHelper.genPlanColumn('id', '角色编号'),
    TableColumnHelper.genPlanColumn('roleName', '角色名'),
  ]

  return (
    <div className="main">
      <CustomBtn
        // onClick={() => }
        type='create' />
      <div className={styles.tableList}>
        {/*<div className={styles.tableListForm}>*/}
        {/*</div>*/}
        <StandardTable
          rowkey="id"
          columns={columns}
          data={roleList}
        />
      </div>
    </div>
  )
}


export default connect(
  ({ authorManage, global, loading }) => ({
    authorManage,
    global,
    loading: loading.models.budgetManage
  })
)(AuthorManage)
