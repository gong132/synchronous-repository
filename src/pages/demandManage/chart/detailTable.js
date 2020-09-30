import React, {Fragment, memo} from "react";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import {Button, Tooltip} from "antd";
import styles from "@/pages/contractBudget/index.less";
import StandardTable from "@/components/StandardTable";
import {TableColumnHelper} from "@/utils/helper";
import {isEmpty} from "@/utils/lang";
import OptButton from "@/components/commonUseModule/optButton";
import {withRouter} from "umi/index";


const isEqual = (preProps, nextProps) => {
  if (preProps.demandTableList?.list !== nextProps.demandTableList?.list) return false
  if (preProps.loading !== nextProps.loading) return false
  if (preProps.pendingCount !== nextProps.pendingCount) return false
  return true
}
const Index = memo(withRouter(props => {
  const {demandTableList, pendingCount, handleQueryDemandInfo, loading } = props;

  const columns= [
    {
      title: '团队成员',
      key: 'userName',
      sorter: true,
      render: rows => {
        if (isEmpty(rows.userName, true)) return '';
        return (
          <Tooltip placement="top" title={rows.userName}>
            <span
              style={{ color: '#2E5BFF' }}
              onClick={() => {
                props.history.push({
                  pathname: '/demandManage/list',
                  query: {
                    id: rows.userId,
                  },
                });
              }}
            >
              {rows.userName.length > 10
                ? `${rows.userName.substring(0, 10)}...`
                : rows.userName.substring(0, 10)}
            </span>
          </Tooltip>
        );
      },
    },
    TableColumnHelper.genPlanColumn("demandTotal", "总量"),
    TableColumnHelper.genPlanColumn("handleDemandTotal", "处理中"),
    TableColumnHelper.genPlanColumn("upDemandTotal", "上线"),
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: rows => (
        <Fragment>
          <OptButton
            icon="eye"
            text="查看"
            showText={false}
            onClick={() => {
              props.history.push({
                pathname: '/demandManage/list',
                query: {
                  id: rows.userId,
                },
              });
            }}
          />
        </Fragment>
      ),
    },
  ]

  const handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    handleQueryDemandInfo(params);
  }

  return (
    <GlobalSandBox
      title="明细"
      optNode={<Button ghost type="primary">待受理/{pendingCount}</Button>}
    >
      <div className={styles.tableList}>
        <StandardTable
          rowKey="userId"
          columns={columns}
          data={demandTableList}
          loading={loading}
          onChange={handleStandardTableChange}
        />
      </div>
    </GlobalSandBox>
  )
}), isEqual)

export default Index
