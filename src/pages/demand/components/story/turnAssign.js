import React, {memo, useEffect, useState} from "react";
import { connect } from "dva"
import {Modal, message, Select,} from "antd";
import StandardTable from "@/components/StandardTable";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import {isEmpty} from "@/utils/lang";


const Index = memo(props => {
  const { dispatch, values, modalVisible, handleModalVisible, loading,
    demand: { storyAssignList }, global: { userList }, handleQueryStoryList  } = props;

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
  const handleQueryUserList = () => {
    dispatch({
      type: "global/queryUserList",
      payload: {
        ...PagerHelper.MaxPage,
      }
    })
  }

  useEffect(() => {
    handleQueryStoryAssignList()
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
    TableColumnHelper.genPopoverColumn("number", "story编号", 8, { width: 120 }),
    TableColumnHelper.genPopoverColumn("title", "story名称", 6, { width: 140 }),
    TableColumnHelper.genLangColumn("systemName", "所属系统", { width: 180 }, 12 ),
    TableColumnHelper.genDateTimeColumn("evaluateTime", "IT预计上线日期", "YYYY-MM-DD", { width: 160 }),
    TableColumnHelper.genPlanColumn("developWorkload", "开发预计工作量", { width: 160 }),
    TableColumnHelper.genPlanColumn("testWorkload", "测试预计工作量", { width: 160 }),
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
              <Select.Option value={v.userId} key={v.userId}>{v.userName}</Select.Option>
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
    handleQueryStoryAssignList(params);
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
        stories: changeRows.map(v => {
          const obj = {...v}
          obj.assessorName = userList.list.find(o => o.userId === v.assessor)?.userName
          return obj
        }),
        operateType: 1,
      }
    }).then(res => {
      if (!res) return;
      message.success("转评估成功")
      handleQueryStoryAssignList()
      handleQueryStoryList()
      handleModalVisible(false, "turnAssessModalVisible")
    })
  }

  return (
    <Modal
      width={1100}
      title="转评估人"
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
                          global,
                          demand,
                          loading,
                        }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index)
