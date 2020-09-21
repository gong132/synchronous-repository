import React from 'react';
import { Icon, Button } from 'antd';
import styles from './index.less';

const Index = props => {
  const { style, text, img, onClick, icon, disabled, showText = true } = props;

  return !showText ? (
    <Icon
      type={icon}
      component={img}
      title={text}
      onClick={onClick}
      style={{ cursor: 'pointer', color: '#2E5BFF' }}
    />
  ) : (
    <div className={styles.operateBtnBox}>
      <Button
        onClick={onClick}
        className={styles.operateBtn}
        style={style}
        disabled={disabled}
        title={text}
      >
        <Icon type={icon} component={img} style={{ fontSize: 14 }} />
        {text}
      </Button>
    </div>
  );
};
export default Index;
