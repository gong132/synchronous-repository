/* eslint-disable no-undef */
import { Tag, Icon, Badge, Breadcrumb } from 'antd';
import React from 'react';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const createBreadcrumb = () => {
    const { location: { pathname }, breadcrumb } = props
    // console.log(pathname, breadcrumb)
    let arr = pathname.split('/')
    const breadPath = breadcrumb[pathname] || {}
    // console.log(breadcrumb, pathname, arr);
    if (arr.length === 4) {
      arr.pop()
      let secPath = arr.join('/')
      const fB = breadPath.parentKeys ? breadcrumb[breadPath.parentKeys[1]] : {}
      return (
        <Breadcrumb separator="|">
          <Breadcrumb.Item>{fB.name}</Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => window.history.back(secPath)}
          >{breadcrumb[secPath] && breadcrumb[secPath].name}</Breadcrumb.Item>
          <Breadcrumb.Item>{breadPath.name}</Breadcrumb.Item>
        </Breadcrumb>
      )
    }
    if (breadPath && breadPath.parentKeys && breadPath.parentKeys.length === 2) {
      const fB = breadcrumb[breadPath.parentKeys[1]]
      return (
        <Breadcrumb separator="|">
          <Breadcrumb.Item>{fB.name}</Breadcrumb.Item>
          <Breadcrumb.Item>{breadPath.name}</Breadcrumb.Item>
        </Breadcrumb>
      )
    }
    return (
      <Breadcrumb separator="|">
        <Breadcrumb.Item>{breadPath.name}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  return (
    <div className={className}>
      <div className={styles.lContent}>
        {createBreadcrumb()}
      </div>
      <div className={styles.rContent}>
        <Badge count={1}>
          <span className={styles.rContent_mail}>
            <Icon type='mail' />
          </span>
        </Badge>
      </div>
      <Avatar />
      {/*{REACT_APP_ENV && <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>}*/}
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
