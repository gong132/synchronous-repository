import React, {Fragment, memo} from 'react';
import { connect } from "dva"
import {withRouter} from "umi/index";
import {isEmpty} from "@/utils/lang";
import {Tooltip} from "antd";
import {TableColumnHelper} from "@/utils/helper";
// import {MENU_ACTIONS} from "@/utils/constant";
import OptButton from "@/components/commonUseModule/optButton";
import edit from "@/assets/icon/Button_bj.svg";
import StandardTable from "@/components/StandardTable";

const Index = memo(withRouter(props => {
  console.log(props);
  const columns = [
    {
      title: "需求编号",
      key: "number",
      sorter: true,
      render: rows => {
        if (isEmpty(rows.number, true)) return "";
        return (
          <Tooltip placement="top" title={rows.number}>
            <span
              style={{ color: "#2E5BFF" }}
              onClick={() => {
                props.history.push({
                  pathname: "/contract-budget/budget/detail",
                  query: {
                    id: rows.id,
                  }
                })
              }}
            >
              { rows.number.length > 10 ? `${rows.number.substring(0, 10)}...` : rows.number.substring(0, 10) }
            </span>
          </Tooltip>
        )
      },
    },
    TableColumnHelper.genPlanColumn('title', "标题"),
    TableColumnHelper.genPlanColumn('title1', "需求类型"),
    TableColumnHelper.genPlanColumn('title2', "状态"),
    TableColumnHelper.genPlanColumn('title3', "优先级"),
    TableColumnHelper.genPlanColumn('title4', "受理团队"),
    TableColumnHelper.genPlanColumn('title5', "受理人"),
    TableColumnHelper.genPlanColumn('title6', "期望完成日期"),
    TableColumnHelper.genPlanColumn('title7', "计划上线日期"),
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: () => (
        <Fragment>
          <OptButton
            img={edit}
            text="编辑"
            onClick={() => {
              // setAddModalVisible(true);
              // setSelectedRows(rows)
            }}
          />

        </Fragment>
      )
    },
  ]
  return (
    <StandardTable
      rowKey="id"
      columns={columns}
      data={{list: []}}
    />
  );
}))

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index);
