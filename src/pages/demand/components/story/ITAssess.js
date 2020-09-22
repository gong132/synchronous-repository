import React, {memo, useEffect, useState} from "react";
import { connect } from "dva"
import moment from "moment";
import {Modal, DatePicker, Input, message,} from "antd";
import StandardTable from "@/components/StandardTable";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import {isEmpty} from "@/utils/lang";


const Index = memo(props => {
  const { dispatch, values, modalVisible, handleModalVisible,
    demand: { storyList }, loading } = props;

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

  useEffect(() => {
    handleQueryStoryList()
  }, []);

  const handleChangeRows = (tag, val, rows) => {
    console.log(tag, val, rows, '11111111')

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
    TableColumnHelper.genDateTimeColumn("expectedCompletionDate", "需求期望上线日期", "YYYY-MM-DD"),
    {
      title: "IT预计上线日期",
      align: "center",
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
    handleQueryStoryList(params);
  };

  const handleOk = () => {
    const monitorErr = changeRows.map(v => {
      if (!v.evaluateTime || !v.developWorkload || !v.testWorkload) return false
      return true
    }).filter(v => !v).length > 0

    if (monitorErr) {
      message.error("请输入完整内容")
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
    demand,
    loading,
  }) => ({
    demand,
    loading: loading.models.demand,
  }))(Index)
