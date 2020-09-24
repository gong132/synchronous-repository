import React from 'react';
import { Icon, Button } from 'antd';
import styles from './index.less';

const Index = props => {
  const { style, text, img, onClick, icon, iconStyle, disabled, showText = true, loading } = props;

  const disableStyle = disabled ? {
    borderColor: "#b0bac9",
    color: "#b0bac9"
  } : {}
  const disabledIconStyle = disabled ? {
    color: "#b0bac9"
  } : {}
  return !showText ? (
    <Icon
      type={icon}
      component={img}
      title={text}
      onClick={(e) => !disabled && onClick(e)}
      style={{ cursor: 'pointer', color: '#2E5BFF', ...disabledIconStyle, ...iconStyle }}
    />
  ) : (
    <div className={styles.operateBtnBox}>
      <Button
        onClick={onClick}
        className={styles.operateBtn}
        style={{...disableStyle, ...style}}
        disabled={disabled}
        title={text}
        loading={loading}
      >
        <Icon type={icon} component={img} style={{ fontSize: 14, color: '#2E5BFF', ...disabledIconStyle, ...iconStyle }} />
        {text}
      </Button>
    </div>
  );
};
export default Index;
