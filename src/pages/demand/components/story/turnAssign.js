import React, {memo, useEffect, useState} from "react";
import { connect } from "dva"
import {Modal, message, Select,} from "antd";
import StandardTable from "@/components/StandardTable";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import {isEmpty} from "@/utils/lang";


const Index = memo(props => {
  const { dispatch, values, modalVisible, handleModalVisible, loading,
    demand: { storyList }, global: { userList }  } = props;

  const [changeRows, setChangeRows] = useState([])
  const handleQueryStoryList = params => {
    dispatch({
      type: "demand/queryStoryList",
      payload: {
        operateType: 1,
        demandNumber: values?.demandNumber,
        ...PagerHelper.DefaultPage,
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

  useEffect(() => {
    handleQueryStoryList()
    handleQueryUserList()
  }, []);

  const handleChangeRows = (tag, val, rows) => {
    // 如果不存在, 新增
    if (isEmpty(changeRows.find(v => v.id === rows.id))) {
      const newRows = {
        ...rows,
        [tag]: val,
      }
      setChangeRows(arr => [...arr, newRows])
      return
    }
    // 如果已存在, 修改
    setChangeRows(arr => {
      const newArr = arr.filter(v => v?.id !== rows?.id)
      const findRows = arr.find(v => v?.id === rows?.id);
      findRows[tag] = val
      if (!findRows.evaluateTime && !findRows.developWorkload && !findRows.testWorkload) {
        return [...newArr]
      }
      return [...newArr, findRows]
    })
  }

  const columns = [
    TableColumnHelper.genPopoverColumn("number", "story编号", 8),
    TableColumnHelper.genPopoverColumn("title", "story名称", 6),
    TableColumnHelper.genPlanColumn("systemName", "所属系统"),
    TableColumnHelper.genDateTimeColumn("evaluateTime", "IT预计上线日期", "YYYY-MM-DD"),
    TableColumnHelper.genPlanColumn("developWorkload", "开发预计工作量"),
    TableColumnHelper.genPlanColumn("testWorkload", "测试预计工作量"),
    {
      title: "转评估人",
      align: "center",
      key: "assessor",
      width: 180,
      render: rows => (
        <Select
          style={{ width: 170 }}
          onChange={val => handleChangeRows("assessor", val, rows)}
          defaultValue={rows?.assessor}
        >
          {
            userList?.list && userList.list.map(v => (
              <Select.Option value={v.loginid} key={v.loginid}>{v.lastname}</Select.Option>
            ))
          }
        </Select>
      )
    },
  ]

  const handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    setChangeRows([])
    handleQueryStoryList(params);
  };

  const handleOk = () => {
    if (changeRows.length === 0) {
      message.warning("当前数据未修改, 请修改后提交.")
      return
    }
    const monitorErr = changeRows.map(v => {
      if (!v.assessor) return false
      return true
    }).filter(v => !v).length > 0

    if (monitorErr) {
      message.error("转评估人不能为空")
      return
    }

    dispatch({
      type: "demand/batchAssessStory",
      payload: {
        stories: changeRows,
        operateType: 1,
      }
    }).then(res => {
      if (!res) return;
      message.success("转评估成功")
    })
  }

  return (
    <Modal
      width={980}
      title="IT评估"
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleOk}
    >
      <StandardTable
        bordered
        rowKey="id"
        columns={columns}
        data={{
          ...storyList,
          list: storyList.list.map(v => ({ ...v, expectedCompletionDate: values?.expectedCompletionDate}))
        }}
        loading={loading}
        onChange={handleStandardTableChange}
      />
    </Modal>
  )
})

export default connect(({
                          global,
                          demand,
                          loading,
                        }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index)
