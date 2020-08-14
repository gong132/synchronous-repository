import React, { Fragment } from 'react';
import { Icon } from 'antd';
import styles from './UserLayout.less';
import bg from '../assets/bg.jpg';
import logo from '../assets/logo.svg';
// import GlobalFooter from "@/components/GlobalFooter";

const copyright = (
  <Fragment>
    <div className={styles.footer}>
      Copyright <Icon type="copyright" /> 2020 光大证券
    </div>
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container} id="layout">
        <div className={styles.background}>
          <img alt="logo" className={styles.logo} src={logo} />
          <img alt="gd-bg" className={styles.bg} src={bg} />
          <div className={styles.footer}>
            Copyright <Icon type="copyright" /> 2020 光大证券
            {/* 晨腾科技提供技术支持 */}
          </div>
        </div>
        <div className={styles.content}>{children}</div>
        {/*<div className={styles.copyright}>*/}
        {/*  <GlobalFooter copyright={copyright} />*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default UserLayout;
