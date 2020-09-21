import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { router, withRouter } from 'umi/index';
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
import assignIcon from '@/assets/icon/cz_zp.svg';

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
        render: rows => (
          <Fragment>
            <OptButton
              icon="eye"
              showText={false}
              text="查看"
              onClick={() => {
                router.push({
                  pathname: `${props.location.pathname}/detail`,
                  query: {
                    id: rows.id,
                  },
                });
              }}
            />
            <Divider type="vertical" />
            <OptButton img={assignIcon} showText={false} text="指派" onClick={() => {}} />
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

    const handleDemandTableChange = pagination => {
      // const formValues = form.getFieldsValue();
      const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        // ...formValues, // 添加已查询条件去获取分页
      };
      handleQueryDemandList(params);
    };
    return (
      <div className={styles.childrenTable}>
        <StandardTable
          rowKey="id"
          expandedRowRender={expandedRowRender}
          columns={columns}
          data={demandList}
          onChange={handleDemandTableChange}
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
