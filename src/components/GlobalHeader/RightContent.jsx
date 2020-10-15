/* eslint-disable no-undef */
import { Icon, Badge, Breadcrumb, Popover } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { PagerHelper } from '@/utils/helper';

import Message from './message';

const GlobalHeaderRight = props => {
  const {
    dispatch,
    theme,
    layout,
    global: { messageList },
  } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const createBreadcrumb = () => {
    const {
      location: { pathname },
      breadcrumb,
    } = props;
    // console.log(pathname, breadcrumb)
    const arr = pathname.split('/');
    const breadPath = breadcrumb[pathname] || {};
    // console.log(breadcrumb, pathname, arr);
    // 单独给storydetail写一个面包屑
    if (arr[2] === "storyDetail") {
      return (<Breadcrumb separator="|">
        <Breadcrumb.Item>
          我的需求
          </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => window.history.back('/projectManage')}>需求详情</Breadcrumb.Item>
        <Breadcrumb.Item>story详情</Breadcrumb.Item>
      </Breadcrumb>)
    }

    if (breadPath.path === '/projectDetail') {
      return (
        <Breadcrumb separator="|">
          <Breadcrumb.Item onClick={() => window.history.back('/projectManage')}>
            项目管理
          </Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
      );
    }
    if (arr.length === 4) {
      arr.pop();
      const secPath = arr.join('/');
      const fB = breadPath.parentKeys ? breadcrumb[breadPath.parentKeys[1]] : {};
      return (
        <Breadcrumb separator="|">
          <Breadcrumb.Item>{fB.name}</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => window.history.back(secPath)}>
            {breadcrumb[secPath] && breadcrumb[secPath].name}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{breadPath.name && breadPath.name.slice(-2)}</Breadcrumb.Item>
        </Breadcrumb>
      );
    }
    if (breadPath && breadPath.parentKeys && breadPath.parentKeys.length === 2) {
      const fB = breadcrumb[breadPath.parentKeys[1]];
      return (
        <Breadcrumb separator="|">
          <Breadcrumb.Item>{fB.name}</Breadcrumb.Item>
          <Breadcrumb.Item>{breadPath.name}</Breadcrumb.Item>
        </Breadcrumb>
      );
    }
    return (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>{breadPath.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const [msgType, setMsgType] = useState('1');
  const [msgVisible, setMsgVisible] = useState(false);

  const handleQueryMessageList = params => {
    dispatch({
      type: 'global/queryMessageList',
      payload: {
        readStatus: 0,
        type: msgType,
        ...PagerHelper.DefaultPage,
        ...params,
      },
    });
  };

  const handleBatchModifyRead = (params, callback) => {
    dispatch({
      type: 'home/batchModifyRead',
      payload: {
        ...params,
      },
    }).then(res => {
      if (!res) return;
      handleQueryMessageList();
      callback && callback();
    });
  };
  return (
    <div className={className}>
      <div className={styles.lContent}>{createBreadcrumb()}</div>
      <div className={styles.rContent}>
        <Popover
          placement="bottomLeft"
          visible={msgVisible}
          title={
            <div className={styles.tabsContainer}>
              <div
                onClick={() => {
                  setMsgType('1');
                  handleQueryMessageList({ type: 1 });
                }}
                className={classNames(styles.tab, (msgType === '1' && styles.tabActive) || '')}
              >
                系统@我
              </div>
              <div
                onClick={() => {
                  setMsgType('2');
                  handleQueryMessageList({ type: 2 });
                }}
                className={classNames(styles.tab, (msgType === '2' && styles.tabActive) || '')}
              >
                普通@我
              </div>
            </div>
          }
          content={
            <Message
              handleQueryMessageList={handleQueryMessageList}
              messageList={messageList}
              handleBatchModifyRead={handleBatchModifyRead}
              handleVisible={setMsgVisible}
            />
          }
          trigger="click"
        >
          <Badge count={messageList?.unReadCount}>
            <span className={styles.rContent_mail}>
              <Icon onClick={() => setMsgVisible(flag => !flag)} type="mail" />
            </span>
          </Badge>
        </Popover>
      </div>
      <Avatar />
      {/* {BUILD_ENV && <Tag color={ENVTagColor[BUILD_ENV]}>{BUILD_ENV}</Tag>} */}
    </div>
  );
};

export default connect(({ global, settings, loading }) => ({
  global,
  theme: settings.navTheme,
  layout: settings.layout,
  loading: loading.models.message,
}))(GlobalHeaderRight);
