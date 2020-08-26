import React, { Fragment } from 'react';
import { Icon } from 'antd';
import styles from './UserLayout.less';
import bgLeft from '../assets/bg_left.png';
import bgRight from '../assets/bg_right.png'
import logo from '../assets/logo.png';
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
          <div className={styles.backgroundLeft}>
            <img alt="gd-bg-left" className={styles.bgLeft} src={bgLeft} />
            <p className={styles.bgContent}>
              <span>
                一体化企业协同管理平台，覆盖、项目管理、任务管理、系统管理、报表管理、预算管理、需求管理等应用，
                满足各行业各场景的个性化办公管理需求
              </span>
            </p>
          </div>
          <img alt="gd-bg-right" className={styles.bgRight} src={bgRight} />
          <div className={styles.footer}>
            <span>
            Copyright <Icon type="copyright" /> 版权2020光大证券股份有限公司
            </span>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}

export default UserLayout;
