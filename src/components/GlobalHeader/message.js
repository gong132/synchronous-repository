import React, {memo} from "react";
import styles from "./message.less"
import {Button, Empty, Popconfirm} from "antd";
import OptButton from "@/components/commonUseModule/optButton";
import readButton from "@/assets/icon/read.svg";
import storage from "@/utils/storage";

const isEqual = (preProps, nextProps) => {
  if (preProps?.messageList !== nextProps?.messageList) return false
  return true
};
const { userInfo } = storage.get("gd-user", {})
const Index = memo(props => {
  const { messageList, handleBatchModifyRead, handleQueryMessageList } = props
  return (
    <div style={{ width: 496, margin: '-12px -16px'}}>
      <div className={styles.msgContent}>
        {
          messageList?.data && messageList?.data.length > 0 ? messageList.data.map(v => (
            <div className={styles.msgItem} key={v.id}>
              <span>{v.toUserName}</span>
              <a>{v.content}</a>
              <Popconfirm
                title={`确定要标记（${v.title}）为已读吗?`}
                onConfirm={() => handleBatchModifyRead({
                  flag: 1,
                  notices: [v.id],
                })}
                okText="确定"
                cancelText="取消"
              >
                <OptButton
                  img={readButton}
                  text="标为已读"
                  showText={false}
                />
              </Popconfirm>
            </div>
          )) : (
            <div style={{ height: "100%" }} className="xyCenter">
              <Empty />
            </div>
          )
        }
      </div>
      {messageList?.currentPage * messageList?.pageSize < messageList?.total && (
        <div
          className={styles.checkMore}
          onClick={() => {
            handleQueryMessageList({
              currentPage: messageList?.currentPage + 1
            })
          }}
        >
          查看更多
        </div>
      )}
      {
        (messageList?.data && messageList?.data.length > 0) && (
          <div className={styles.msgFooter}>
            <Button
              onClick={() => handleBatchModifyRead({
                flag: 2,
                userId: userInfo?.userId,
              })}
              ghost
              type="primary"
            >
              全部已读
            </Button>
          </div>
        )
      }
    </div>
  )
}, isEqual)

export default Index
