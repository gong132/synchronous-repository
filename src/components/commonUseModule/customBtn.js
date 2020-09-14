import React, { Fragment } from 'react';
import dcBtn from '@/assets/icon/Button_dc.svg';
import { Icon, Button } from 'antd';
import styles from './customBtn.less';

const CustomBtn = props => {
  const { type, style = {}, onClick, loading, title } = props;
  return (
    <Fragment>
      {type === 'create' && (
        <div className={styles.createBtn} style={style} onClick={onClick}>
          {/* <div className={styles.createBtn_icon}>
          <span>+</span>
        </div> */}
          <div className={styles.createBtn_text}>
            <Icon type="plus" className={styles.createBtn_text_icon} />
            <span>{title || '新建'}</span>
          </div>
        </div>
      )}
      {type === 'cancel' && (
        <div className={styles.cancelBtn} style={style} onClick={onClick}>
          <span>取消</span>
        </div>
      )}
      {type === 'save' && (
        <Button
          loading={loading}
          type="primary"
          className={styles.saveBtn}
          style={style}
          onClick={onClick}
        >
          <span>保存</span>
        </Button>
      )}
      {type === 'edit' && (
        <div className={styles.saveBtn} style={style} onClick={onClick}>
          <span>编辑</span>
        </div>
      )}
      {type === 'reset' && (
        <Button
          className={styles.resetBtn}
          style={style}
          onClick={onClick}
          type="default"
          loading={loading}
        >
          <span>重置</span>
        </Button>
      )}
      {type === 'export' && (
        <div className={styles.exportBtn} style={style} onClick={onClick}>
          <Icon component={dcBtn} />
          <span>导出</span>
        </div>
      )}
    </Fragment>
  );
};

export default CustomBtn;
