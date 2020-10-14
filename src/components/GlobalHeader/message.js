import React, { memo } from 'react';
import styles from './message.less';
import { Button, Empty, message, Popconfirm } from 'antd';
import OptButton from '@/components/commonUseModule/optButton';
import readButton from '@/assets/icon/read.svg';
import storage from '@/utils/storage';
import { withRouter } from 'umi/index';

const isEqual = (preProps, nextProps) => {
  if (preProps?.messageList !== nextProps?.messageList) return false;
  return true;
};
const { userInfo } = storage.get('gd-user', {});
const Index = memo(
  withRouter(props => {
    const { messageList, handleBatchModifyRead, handleQueryMessageList, handleVisible } = props;
    const handleGotoTargetByType = rows => {
      //   { key: 'p', value: '项目需求' },
      //   { key: 'u', value: '一般需求' },
      const { demandId, demandType, linkUrlType, linkId, title } = rows;
      if (linkUrlType === 1 && demandType === 'u') {
        props.history.push({
          pathname: '/demand/generalDemand/detail',
          query: {
            id: demandId,
            no: linkId,
          },
        });
        handleVisible(false);
        handleBatchModifyRead({
          flag: 1,
          notices: [rows.id],
        });
        return;
      }
      if (linkUrlType === 1 && demandType === 'p') {
        props.history.push({
          pathname: '/demand/projectDemand/detail',
          query: {
            id: demandId,
            no: linkId,
          },
        });
        handleVisible(false);
        handleBatchModifyRead({
          flag: 1,
          notices: [rows.id],
        });
        return;
      }
      if (linkUrlType === 3) {
        props.history.push({
          pathname: '/survey',
          query: {
            no: linkId,
            t: title,
          },
        });
        handleVisible(false);
        handleBatchModifyRead({
          flag: 1,
          notices: [rows.id],
        });
        return;
      }
      message.warning('该消息类型暂不支持跳转');
    };

    return (
      <div style={{ width: 496, margin: '-12px -16px' }}>
        <div className={styles.msgContent}>
          {messageList?.data && messageList?.data.length > 0 ? (
            messageList.data.map(v => (
              <div className={styles.msgItem} key={v.id}>
                <span>{v.userName || '系统'}</span>
                <a onClick={() => handleGotoTargetByType(v)}>{v.content}</a>
                <Popconfirm
                  title={`确定要标记（${v.title}）为已读吗?`}
                  onConfirm={() =>
                    handleBatchModifyRead(
                      {
                        flag: 1,
                        notices: [v.id],
                      },
                      () => message.success('标记成功'),
                    )
                  }
                  okText="确定"
                  cancelText="取消"
                >
                  <OptButton img={readButton} text="标为已读" showText={false} />
                </Popconfirm>
              </div>
            ))
          ) : (
            <div style={{ height: '100%' }} className="xyCenter">
              <Empty />
            </div>
          )}
        </div>
        {messageList?.currentPage * messageList?.pageSize < messageList?.total && (
          <div
            className={styles.checkMore}
            onClick={() => {
              handleQueryMessageList({
                currentPage: messageList?.currentPage + 1,
              });
            }}
          >
            查看更多
          </div>
        )}
        {messageList?.data && messageList?.data.length > 0 && (
          <div className={styles.msgFooter}>
            <Button
              onClick={() =>
                handleBatchModifyRead(
                  {
                    flag: 2,
                    userId: userInfo?.userId,
                  },
                  () => message.success('标记成功'),
                )
              }
              ghost
              type="primary"
            >
              全部已读
            </Button>
          </div>
        )}
      </div>
    );
  }),
  isEqual,
);

export default Index;
