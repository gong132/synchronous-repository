import React from "react";
import { Icon, Button } from "antd";
import styles from  './index.less'

const Index = props => {
  const { style, text, img, onClick, icon } = props;

  const headerRender = () => (
    <div className={styles.sandboxHead} style={titleStyle}>
      <Icon component={img}/>
      <div className={styles.sandboxHead_title}>{title}</div>
    </div>
  );
  return (
    <Button
      onClick={onClick}
      className={styles.operateBtn}
      style={style}
      icon={icon}
    >
      <Icon component={img} style={{ fontSize: 14 }}/>
      {text}
    </Button>
  )
};
export default Index
