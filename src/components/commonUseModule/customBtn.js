import React, { Fragment } from 'react'
import styles from './customBtn.less'
// import {Button} from 'antd'
const CustomBtn = (props) => {
  const { type, style = {}, onClick } = props
  return (
    <Fragment>
      {type === 'create' && <div
        className={styles.createBtn}
        style={style}
        onClick={onClick}
      >
        <div className={styles.createBtn_icon}>
          <span>+</span>
        </div>
        <div className={styles.createBtn_text}>
          <span>新建</span>
        </div>
      </div>}
      {
        type === 'cancel' && <div
          className={styles.cancelBtn}
          style={style}
          onClick={onClick}
        >
          <span>取消</span>
        </div>
      }
      {
        type === 'save' && <div
          className={styles.saveBtn}
          style={style}
          onClick={onClick}
        >
          <span>保存</span>
        </div>
      }
      {
        type === 'edit' && <div
          className={styles.saveBtn}
          style={style}
          onClick={onClick}
        >
          <span>编辑</span>
        </div>
      }
      {
        type === 'reset' && <div
          className={styles.resetBtn}
          style={style}
          onClick={onClick}
        >
          <span>重置</span>
        </div>
      }
    </Fragment>
  )
}

export default CustomBtn
