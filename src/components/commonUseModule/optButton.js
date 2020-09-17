import React from "react";
import { Icon, Button } from "antd";
import styles from  './index.less'

const Index = props => {
  const { style, text, img, onClick, icon, disabled } = props;


  return (
    <div className={styles.operateBtnBox}>
      <Button
        onClick={onClick}
        className={styles.operateBtn}
        style={style}
        disabled={disabled}
      >
        <Icon type={icon} component={img} style={{ fontSize: 14 }} />
        {text}
      </Button>
    </div>
  )
};
export default Index
