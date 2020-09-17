import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { router, withRouter } from 'umi'
import { DefaultPage } from '@/utils/helper';
// import _ from 'lodash'
import CustomBtn from '@/components/commonUseModule/customBtn';
// import {
//   Form,
//   Select,
//   DatePicker
// } from 'antd'

import CreateDemand from './components/createModal';
import DemandBoard from './demandBoard';
import DemandList from './demandList/index';
import styles from './index.less';

// import gzIcon from '@/assets/icon/Button_gz.svg'

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
const Index = memo(
  withRouter(props => {
    const {
      dispatch,
      demand: { formType },
    } = props;
    const [visibleModal, setVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('创建需求');

    // const [searchMore, setSearchMore] = useState(false)

    const handleViewModal = (bool, title) => {
      setVisibleModal(bool);
      setModalTitle(title);
    };

    // 启动定时器
    const startTimer = callback => {
      window.timer = setInterval(() => {
        callback && callback();
      }, 10000000);
    };

    // 关闭定时器
    const clearTimer = () => {
      clearInterval(window.timer);
    };

    // 查询我的需求列表
    const handleQueryList = (params = {}) => {
      dispatch({
        type: 'demand/queryDemand',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    // 查询项目,需求列表
    const handleQueryDemandProject = params => {
      dispatch({
        type: 'demand/queryDemandProject',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    // 查询团队
    const handleQueryGroup = (params) => {
      dispatch({
        type: 'demand/fetchHeaderGroup',
        payload: {
          ...params
        }
      });
    };

    // 查预算编号
    const handleQueryBudget = (number) => {
      dispatch({
        type: 'demand/fetchBudgetNumber',
        payload: {
          number
        }
      })
    }

    // 根据路由查询不同接口
    const handleQueryDemandList = params => {
      if (demandRoutes[props.location.pathname] === '我的需求') {
        handleQueryList(params);
        return;
      }
      handleQueryDemandProject(params);
    };

    // 查询看板
    const handleQueryBoard = (params = {}) => {
      dispatch({
        type: 'demand/queryDemandBoard',
        payload: {
          ...DefaultPage,
          ids: '1,2,3,4,5,6,7,8,9',
          ...params,
        },
      });
    };

    const handleFormMenuClick = type => {
      dispatch({
        type: 'demand/setData',
        payload: { formType: type },
      });
      if (type === 'list') {
        handleQueryDemandList();
      } else if (type === 'board') {
        handleQueryBoard();
      }
    };

    useEffect(() => {
      if (formType === 'list') {
        handleQueryDemandList();
      } else if (formType === 'board') {
        handleQueryBoard();
      }
    }, []);

    useEffect(() => {
      handleQueryGroup()
      handleQueryBudget()
    }, [])

    // 查看详情
    const handleViewDetail = () => {
      router.push({
        pathname: '/demand/myDemand/detail',
      });
    };

    const createModalProps = {
      visibleModal,
      modalTitle,
      startTimer,
      clearTimer,
      handleViewModal,
      handleQueryDemandList,
      handleQueryBoard,
      handleQueryList,
    };
    return (
      <Fragment>
        {visibleModal && <CreateDemand {...createModalProps} />}
        <div className="yCenter-between">
          <CustomBtn onClick={() => handleViewModal(true, '创建')} icon='plus' type="create" title="创建需求" />
          <CustomBtn onClick={handleViewDetail} type='create' title='详情' />

          <div className="xCenter">
            <div className={styles.switch}>
              <div
                onClick={() => handleFormMenuClick('board')}
                className={formType === 'board' ? styles.switch__left : styles.switch__right}
              >
                看板
              </div>
              <div
                onClick={() => handleFormMenuClick('list')}
                className={formType === 'list' ? styles.switch__left : styles.switch__right}
              >
                列表
              </div>
            </div>
            <CustomBtn
              onClick={() => handleViewModal(true, '创建')}
              type="others"
              title="发起OA审批"
              style={{ marginLeft: '16px' }}
            />
            <CustomBtn
              onClick={() => handleViewModal(true, '创建')}
              type="others"
              // icon='gzIcon'
              title="我的关注"
              style={{ marginLeft: '16px' }}
            />
          </div>
        </div>
        {formType === 'list' && <DemandList />}
        {formType === 'board' && <DemandBoard />}
      </Fragment>
    );
  }),
);
export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index);
