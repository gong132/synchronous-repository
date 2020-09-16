import React, { Fragment, memo, useEffect } from 'react';
import { connect } from 'dva';
import { withRouter } from 'umi/index';
import { isEmpty } from '@/utils/lang';
import { Tooltip } from 'antd';
import { DefaultPage, TableColumnHelper } from '@/utils/helper';
// import {MENU_ACTIONS} from "@/utils/constant";
import OptButton from '@/components/commonUseModule/optButton';
import edit from '@/assets/icon/Button_bj.svg';
import StandardTable from '@/components/StandardTable';

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
const Index = memo(
  withRouter(props => {
    const {
      dispatch,
      demand: { demandList },
    } = props;

    const handleQueryMyDemand = params => {
      dispatch({
        type: 'demand/queryDemand',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };
    const handleQueryDemandProject = params => {
      dispatch({
        type: 'demand/queryDemandProject',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    const handleQueryDemandList = params => {
      if (demandRoutes[props.location.pathname] === '我的需求') {
        handleQueryMyDemand(params);
        return;
      }
      handleQueryDemandProject(params);
    };
    useEffect(() => {
      handleQueryDemandList();
    }, []);

    const columns = [
      {
        title: '需求编号',
        key: 'demandNumber',
        sorter: true,
        render: rows => {
          if (isEmpty(rows.demandNumber, true)) return '';
          return (
            <Tooltip placement="top" title={rows.demandNumber}>
              <span
                style={{ color: '#2E5BFF' }}
                onClick={() => {
                  props.history.push({
                    pathname: '/contract-budget/budget/detail',
                    query: {
                      id: rows.id,
                    },
                  });
                }}
              >
                {rows.demandNumber.length > 10
                  ? `${rows.demandNumber.substring(0, 10)}...`
                  : rows.demandNumber.substring(0, 10)}
              </span>
            </Tooltip>
          );
        },
      },
      TableColumnHelper.genPlanColumn('title', '标题'),
      TableColumnHelper.genPlanColumn('type', '需求类型'),
      TableColumnHelper.genPlanColumn('status', '状态'),
      TableColumnHelper.genPlanColumn('priority', '优先级'),
      TableColumnHelper.genPlanColumn('acceptTeam', '受理团队'),
      TableColumnHelper.genPlanColumn('receiverId', '受理人'),
      TableColumnHelper.genPlanColumn('expectedCompletionDate', '期望完成日期'),
      TableColumnHelper.genPlanColumn('plannedLaunchDate', '计划上线日期'),
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
        ),
      },
    ];

    const expandedRowRender = row => {
      if (isEmpty(row.aaa)) return null;
      const subColumns = [
        {
          title: 'story编号',
          key: 'demandNumber',
          sorter: true,
          render: rows => {
            if (isEmpty(rows.demandNumber, true)) return '';
            return (
              <Tooltip placement="top" title={rows.demandNumber}>
                <span
                  style={{ color: '#2E5BFF' }}
                  onClick={() => {
                    props.history.push({
                      pathname: '/contract-budget/budget/detail',
                      query: {
                        id: rows.id,
                      },
                    });
                  }}
                >
                  {rows.demandNumber.length > 10
                    ? `${rows.demandNumber.substring(0, 10)}...`
                    : rows.demandNumber.substring(0, 10)}
                </span>
              </Tooltip>
            );
          },
        },
        TableColumnHelper.genPlanColumn('storyName', '标题'),
        TableColumnHelper.genPlanColumn('floorName', '状态'),
        TableColumnHelper.genPlanColumn('firstOperationTypeName', '优先级'),
        TableColumnHelper.genPlanColumn('type', 'story类型'),
        TableColumnHelper.genPlanColumn('buildUnitNumber', 'IT评估上线时间'),
        TableColumnHelper.genPlanColumn('coveredArea', '开发预计工作量'),
        TableColumnHelper.genPlanColumn('buildRoomArea', '测试预计工作量'),
        TableColumnHelper.genPlanColumn('buildRoomArea1', '经办人'),
        TableColumnHelper.genPlanColumn('buildRoomArea2', '创建人'),
        TableColumnHelper.genPlanColumn('buildRoomArea3', '创建时间'),
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
          ),
        },
      ];
      return (
        <StandardTable rowKey="id" columns={subColumns} data={row.buildUnits} pagination={false} />
      );
    };
    return (
      <StandardTable
        rowKey="id"
        expandedRowRender={expandedRowRender}
        columns={columns}
        data={demandList}
      />
    );
  }),
);

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index);
