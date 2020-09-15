import React, { Fragment, memo, useState } from 'react';
import { connect } from 'dva';
import { withRouter } from 'umi/index';
import { DefaultPage } from '@/utils/helper';
import CustomBtn from '@/components/commonUseModule/customBtn';
import styles from '@/pages/demand/index.less';

import CreateDemand from './components/createModal';

const demandroutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
console.log(demandroutes);
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

    const handleFormMenuClick = type => {
      dispatch({
        type: 'demand/setData',
        payload: { type },
      });
    };

    // 启动定时器
    const startTimer = callback => {
      this.timer = setInterval(() => {
        callback && callback();
      }, 100000000000);
    };

    // 关闭定时器
    const clearTimer = () => {
      clearInterval(this.timer);
    };

    // 查询列表
    const handleQueryList = (params = {}) => {
      this.props.dispatch({
        type: 'demand/queryDemand',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    // 查询看板
    const handleQueryBoard = (params = {}) => {
      this.props.dispatch({
        type: 'demand/queryDemandBoard',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    const createModalProps = {
      visibleModal,
      modalTitle,
      startTimer,
      clearTimer,
      handleViewModal,
      handleQueryList,
      handleQueryBoard,
    };
    return (
      <Fragment>
        {visibleModal && <CreateDemand {...createModalProps} />}
        <div className="yCenter-between">
          <CustomBtn
            onClick={() => this.handleViewModal(true, '创建')}
            type="create"
            title="创建需求"
          />
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
              onClick={() => this.handleViewModal(true, '创建')}
              type="others"
              title="发起OA审批"
              style={{ marginLeft: '16px' }}
            />
            <CustomBtn
              onClick={() => this.handleViewModal(true, '创建')}
              type="others"
              // icon='gzIcon'
              title="我的关注"
              style={{ marginLeft: '16px' }}
            />
          </div>
        </div>
        {/* {formType === 'list' && <DemandList />} */}
        {/* {formType === 'board' && <DemandBoard />} */}
      </Fragment>
    );
  }),
);
export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading,
}))(Index);
