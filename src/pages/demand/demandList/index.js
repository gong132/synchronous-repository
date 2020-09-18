import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { withRouter } from 'umi/index';
import { isEmpty } from '@/utils/lang';
import { Divider, message, Tooltip } from 'antd';
import { DefaultPage, TableColumnHelper } from '@/utils/helper';
// import {MENU_ACTIONS} from "@/utils/constant";
import OptButton from '@/components/commonUseModule/optButton';
import edit from '@/assets/icon/Button_bj.svg';
import StandardTable from '@/components/StandardTable';

import AddStory from '../components/story/addStory';

import styles from '../index.less';

import deleteIcon from '@/assets/icon/Button_del.svg';

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
const Index = memo(
  withRouter(props => {
    const {
      dispatch,
      // demand: { demandList },
    } = props;

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState({});

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

    const handleUpdateStory = ids => {
      dispatch({
        type: 'demand/updateStory',
        payload: {
          id: ids,
          isDelete: 1,
        },
      }).then(sure => {
        if (!sure) return;
        message.success('删除成功');
        handleQueryDemandList();
      });
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
              showText={false}
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
      if (isEmpty(row.storyList)) return null;
      const subColumns = [
        {
          title: 'story编号',
          key: 'number',
          sorter: true,
          render: rows => {
            if (isEmpty(rows.number, true)) return '';
            return (
              <Tooltip placement="top" title={rows.number}>
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
                  {rows.number.length > 10
                    ? `${rows.number.substring(0, 10)}...`
                    : rows.number.substring(0, 10)}
                </span>
              </Tooltip>
            );
          },
        },
        TableColumnHelper.genPlanColumn('title', '标题'),
        TableColumnHelper.genPlanColumn('status', '状态'),
        TableColumnHelper.genPlanColumn('priority', '优先级'),
        TableColumnHelper.genPlanColumn('type', 'story类型'),
        TableColumnHelper.genDateTimeColumn('evaluateTime', 'IT评估上线时间'),
        TableColumnHelper.genPlanColumn('developWorkload', '开发预计工作量'),
        TableColumnHelper.genPlanColumn('testWorkload', '测试预计工作量'),
        TableColumnHelper.genPlanColumn('assigneeName', '经办人'),
        TableColumnHelper.genPlanColumn('userName', '创建人'),
        TableColumnHelper.genPlanColumn('createTime', '创建时间'),
        {
          title: '操作',
          width: 200,
          align: 'center',
          render: rows => (
            <Fragment>
              <OptButton
                img={edit}
                showText={false}
                text="编辑"
                onClick={() => {
                  setAddModalVisible(true);
                  setSelectedRows(rows);
                }}
              />
              <Divider type="vertical" />
              <OptButton
                icon="eye"
                text="查看"
                showText={false}
                onClick={() => {
                  // setAddModalVisible(true);
                  // setSelectedRows(rows)
                }}
              />
              <Divider type="vertical" />
              <OptButton
                icon="sync"
                text="同步"
                showText={false}
                onClick={() => {
                  // setAddModalVisible(true);
                  // setSelectedRows(rows)
                }}
              />
              <Divider type="vertical" />
              <OptButton
                img={deleteIcon}
                showText={false}
                text="删除"
                onClick={() => handleUpdateStory(rows.id)}
              />
            </Fragment>
          ),
        },
      ];
      return (
        <StandardTable
          rowKey="id"
          columns={subColumns}
          data={{ list: row.storyList }}
          pagination={false}
        />
      );
    };

    const list = {
      list: [
        {
          id: '1',
          title: '标题',
          demandNumber: '需求编号',
          creator: '创建人',
          createTime: '2020-9-17',
          type: 'p',
          status: 1,
          priority: 'P1',
          introducer: '提出人',
          acceptTeam: '受理团队',
          receiverId: '受理人',
          requirementDescription: '需求描述',
          communicate: 'n',
          expectedCompletionDate: '2020-9-17',
          plannedLaunchDate: '2020-9-17',
          actualLineDate: '2020-9-17',
          estimatedDevelopmentEffort: '1',
          estimatedTestWorkload: '2',
          demandUrgency: '1',
          riskControlFunction: 'y',
          budgetNumbers: '预算编号',
          projectNo: '所属项目编号',
          ts: '1',
          creatorId: '创建人id',
          acceptTeamId: '受理团队id',
          introducerId: '提出人id',
          storyList: [
            {
              id: 7,
              number: 'story编号',
              title: 'story标题',
              status: '1',
              priority: '高',
              type: 1,
              evaluateTime: '2020-09-17',
              developWorkload: 12,
              testWorkload: 13,
              assignee: '123',
              assigneeName: '123',
              assessor: '123',
              assessorName: '123',
              description: '123',
              userId: '43',
              startTime: '2020-09-17',
              endTime: '2020-09-17',
              systemId: '21345rty',
              systemName: 'esfzf',
              systemLinkProjectKey: '系统对应的项目空间',
              issueId: '2q3wertfg',
              self: 'werghj',
              createTime: '2020-09-17',
              isDelete: '123456',
            },
          ],
        },
      ],
    };
    return (
      <div className={styles.childrenTable}>
        <StandardTable
          rowKey="id"
          expandedRowRender={expandedRowRender}
          columns={columns}
          data={list}
        />
        {addModalVisible && (
          <AddStory
            values={selectedRows}
            modalVisible={addModalVisible}
            handleModalVisible={() => {
              setAddModalVisible(false);
              setSelectedRows({});
            }}
          />
        )}
      </div>
    );
  }),
);

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index);
