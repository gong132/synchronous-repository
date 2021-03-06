import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { withRouter } from 'umi';
import { DefaultPage } from '@/utils/helper';
// import _ from 'lodash'
import CustomBtn from '@/components/commonUseModule/customBtn';
// import {
//   Dropdown,
//   Button,
//   Icon
// } from 'antd'

import CreateDemand from './components/createModal';
import DemandBoard from './demandBoard';
import DemandList from './demandList/index';
import styles from './index.less';
import { Select } from 'antd';
import { DEMAND_GROUP } from '@/pages/demand/util/constant';
// import spIcon from '@/assets/icon/Button_oajssp.svg'
import unGzIcon from '@/assets/icon/Button_gz.svg';
import gzIcon from '@/assets/icon/sc.svg';

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
let timer;
const Index = memo(
  withRouter(props => {
    const {
      dispatch,
      demand: { formType, searchList },
    } = props;
    const [visibleModal, setVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('创建需求');

    const [searchForm, setSearchForm] = useState({});
    const [commonSearchValue, setCommonSearchValue] = useState({ active: 0, myGroup: "" });

    const handleViewModal = (bool, title) => {
      setVisibleModal(bool);
      setModalTitle(title);
    };

    // 启动定时器
    const startTimer = callback => {
      timer = setInterval(() => {
        callback && callback();
        // 自动保存功能暂时不上
      }, 2000000000);
    };

    // 关闭定时器
    const clearTimer = () => {
      clearInterval(timer);
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

    // 查询下拉搜索列表
    const handleQuerySearchList = () => {
      dispatch({
        type: 'demand/querySearchList',
        payload: {
        },
      }).then(data => {
        if (!data) return
        setCommonSearchValue(obj => ({ ...obj, myGroup: data && data?.length ? Number(data[0]?.id) : 1 }))
      });
    };
    // 查询团队
    const handleQueryGroup = params => {
      dispatch({
        type: 'demand/fetchHeaderGroup',
        payload: {
          ...params,
        },
      });
    };

    // 查预算编号
    const handleQueryBudget = number => {
      dispatch({
        type: 'demand/fetchBudgetNumber',
        payload: {
          number,
        },
      });
    };

    // 根据路由查询不同接口
    const handleQueryDemandList = params => {
      const { myGroup, active, ...others } = commonSearchValue;
      const demandType = (demandRoutes[props.location.pathname] === '项目'  && 1) ||
        (demandRoutes[props.location.pathname] === '一般需求'  && 2) || null
      const searchParams = {
        ...searchForm,
        ...others,
        type: demandType,
        myGroup: Number(myGroup),
        active: Number(active),
        ...params,
      };
      if (demandRoutes[props.location.pathname] === '我的需求') {
        handleQueryList(searchParams);
        return;
      }
      handleQueryDemandProject(searchParams);
    };

    // 查询看板
    const handleQueryBoard = (params = {}) => {
      console.log(props.location.pathname);
      let type = 2;
      if (demandRoutes[props.location.pathname] === '项目') {
        type = 1;
      }
      dispatch({
        type: 'demand/queryDemandBoard',
        payload: {
          // ...DefaultPage,
          ...commonSearchValue,
          ...params,
          type,
        },
      });
    };

    const handleQueryUser = userName => {
      dispatch({
        type: 'demand/fetchUserData',
        payload: {
          userName,
        },
      });
    };

    const handleFormMenuClick = type => {
      dispatch({
        type: 'demand/setData',
        payload: { formType: type },
      });
      // if (type === 'list') {
      //   handleQueryDemandList();
      // } else if (type === 'board') {
      //   handleQueryBoard();
      // }
    };

    useEffect(() => {
      if (formType === 'list') {
        handleQueryDemandList();
      } else if (formType === 'board') {
        handleQueryBoard();
      }
    }, [searchForm, formType, commonSearchValue]);

    useEffect(() => {
      handleQueryGroup();
      handleQueryBudget();
      handleQueryUser();
      handleQuerySearchList()
    }, []);

    // 查看详情
    // const handleViewDetail = () => {
    //   router.push({
    //     pathname: '/demand/myDemand/detail',
    //   });
    // };

    const createModalProps = {
      visibleModal,
      modalTitle,
      startTimer,
      clearTimer,
      handleViewModal,
      handleQueryDemandList,
      handleQueryBoard,
      handleQueryList,
      handleQueryUser,
    };
    return (
      <Fragment>
        {visibleModal && <CreateDemand {...createModalProps} />}
        <div className="yCenter-between">
          <CustomBtn
            onClick={() => handleViewModal(true, '创建')}
            icon="plus"
            type="create"
            title="创建需求"
          />
          {/* <CustomBtn onClick={handleViewDetail} type='create' title='详情' /> */}

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
            {/* <CustomBtn
              onClick={() => handleViewModal(true, '创建')}
              type="others"
              title="发起OA审批"
              icon={spIcon}
              style={{ marginLeft: '16px' }}
            /> */}

            <CustomBtn
              onClick={() => {
                setCommonSearchValue(obj => ({ ...obj, active: obj.active === '1' ? '0' : '1' }));
              }}
              type="others"
              icon={commonSearchValue?.active === '1' ? gzIcon : unGzIcon}
              title="我的关注"
              style={{ marginLeft: '16px' }}
            />
            <div className={styles.dropStyle}>
              <Select
                value={commonSearchValue.myGroup}
                onChange={val => setCommonSearchValue(obj => ({ ...obj, myGroup: Number(val) }))}
              >
                {searchList && searchList.map(v => (
                  <Select.Option value={v.id} key={v.id}>
                    {v.desc}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        {formType === 'list' && (
          <DemandList handleQueryDemandList={handleQueryDemandList} setSearchForm={setSearchForm} />
        )}
        {formType === 'board' && <DemandBoard handleQueryBoard={handleQueryBoard}  />}
      </Fragment>
    );
  }),
);
export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Index);
