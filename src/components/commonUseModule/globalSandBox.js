import React from "react";
import { Icon } from "antd";
import styles from  './index.less'

const Index = props => {
  const { sandboxStyle, titleStyle, title, img, optNode } = props;

  const headerRender = () => (
    <div className={styles.sandboxHeadBox}>
      <div className={styles.sandboxHead} style={titleStyle}>
        <Icon component={img} />
        <div className={styles.sandboxHead_title}>{title}</div>
      </div>
      <div>{optNode}</div>
    </div>
  );
  return (
    <div className={styles.sandbox} style={sandboxStyle}>
      {headerRender()}
      <div>{props.children}</div>
    </div>
  )
};
export default Index
