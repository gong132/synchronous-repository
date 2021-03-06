import React, {memo, useEffect, useState} from "react";
import { connect } from "dva"
import moment from "moment";
import {Modal, DatePicker, Input, message,} from "antd";
import StandardTable from "@/components/StandardTable";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import {isEmpty} from "@/utils/lang";


const Index = memo(props => {
  const { dispatch, values, modalVisible, handleModalVisible,
    demand: { storyAssignList }, loading, handleQueryStoryList } = props;

  const [changeRows, setChangeRows] = useState([])
  const handleQueryStoryAssignList = params => {
    dispatch({
      type: "demand/queryStoryAssignList",
      payload: {
        operateType: 1,
        demandNumber: values?.demandNumber,
        ...PagerHelper.DefaultPage,
        ...params,
      }
    })
  }

  useEffect(() => {
    handleQueryStoryAssignList()
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
    TableColumnHelper.genPopoverColumn("number", "story编号", 8, { width: 120 }),
    TableColumnHelper.genPopoverColumn("title", "story名称", 6, { width: 140 }),
    TableColumnHelper.genLangColumn("systemName", "所属系统", { width: 180 }, 12 ),
    TableColumnHelper.genDateTimeColumn("expectedCompletionDate", "需求期望上线日期", "YYYY-MM-DD", { width: 180 }),
    {
      title: "IT预计上线日期",
      align: "center",
      key: "evaluateTime",
      width: 180,
      render: rows => (
        <DatePicker
          defaultValue={rows?.evaluateTime && moment(rows.evaluateTime)}
          onChange={val => handleChangeRows("evaluateTime", val?.format("YYYY-MM-DD"), rows)}
          format="YYYY-MM-DD"
        />
      )
    },
    {
      title: "开发预计工作量",
      align: "center",
      key: "developWorkload",
      width: 150,
      render: rows => (
        <Input
          onChange={val => handleChangeRows("developWorkload", val.target.value, rows)}
          defaultValue={rows?.developWorkload}
        />
      )
    },
    {
      title: "测试预计工作量",
      align: "center",
      key: "testWorkload",
      width: 150,
      render: rows => (
        <Input
          defaultValue={rows?.testWorkload}
          onChange={val => handleChangeRows("testWorkload", val.target.value, rows)}
        />
      )
    },
  ]

  const handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    setChangeRows([])
    handleQueryStoryAssignList(params);
  };

  const handleOk = () => {
    if (changeRows.length === 0) {
      message.warning("当前数据未修改, 请修改后提交.")
      return
    }
    const monitorErrEvaluateTime = changeRows.map(v => {
      if (!v.evaluateTime) return false
      return true
    }).filter(v => !v).length > 0
    const monitorErrDevelopWorkload = changeRows.map(v => {
      if (!v.developWorkload) return false
      return true
    }).filter(v => !v).length > 0
    const monitorErrTestWorkload = changeRows.map(v => {
      if (!v.testWorkload) return false
      return true
    }).filter(v => !v).length > 0

    if (monitorErrEvaluateTime) {
      message.error("IT预计上线日期不能为空")
      return
    }
    if (monitorErrDevelopWorkload) {
      message.error("开发预计工作量不能为空")
      return
    }
    if (monitorErrTestWorkload) {
      message.error("测试预计工作量不能为空")
      return
    }

    dispatch({
      type: "demand/batchAssessStory",
      payload: {
        stories: changeRows,
        operateType: 2,
      }
    }).then(res => {
      if (!res) return;
      message.success("转评估人成功")
      handleQueryStoryAssignList()
      handleQueryStoryList()
      handleModalVisible(false, "itAssessModalVisible")
    })
  }

  return (
    <Modal
      width={1100}
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
          ...storyAssignList,
          list: storyAssignList.list.map(v => ({ ...v, expectedCompletionDate: values?.expectedCompletionDate}))
        }}
        loading={loading}
        onChange={handleStandardTableChange}
      />
    </Modal>
  )
})

export default connect(({
    demand,
    loading,
  }) => ({
    demand,
    loading: loading.models.demand,
  }))(Index)
