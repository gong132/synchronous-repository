/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, getMenuData } from '@ant-design/pro-layout';
import React, { useEffect, Fragment } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logoImg.png';
import logoBg from '../assets/logo.png'
import storage from "@/utils/storage";
import {isEmpty} from "@/utils/lang";

const noMatch = status => {
  return (
    <Result
      status={403}
      title="403"
      subTitle="对不起，您没有权限访问此页."
      extra={
        <Button type="primary">
          <Link to="/user/login">去登陆</Link>
        </Button>
      }
    />
  )
};

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */


  const  getAllMenu = () => {
    dispatch({
      type: 'global/queryAllMenuList',
      payload: {},
    }).then(data => {
      // console.log(data, 'data')
      // this.getCurrentUser();
    })
  };

  /**
   * use Authorized check all menu item
   */
  const menuDataRender = menuList =>{
    const {
      global: {
        allMenuList,
      },
    } = props;
    const newMenuList = [...menuList].filter(x => [...allMenuList].some(y => y.url === x.path));
    return newMenuList.map(item => {
      const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
      return Authorized.check(item.authority, localItem, null);
    })
  };


  useEffect(() => {

    // 判断是否登录了，未登录直接跳转登录
    const gdUser = storage.get('gd-user');
    if (gdUser) {
      // this.getSetting();
      // this.getRegions();
      getAllMenu();
    } else {
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
    }

    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
  }, []);
  useEffect(() => {
    const {
      routes,
      menu,
      formatMessage,
      menuDataRender,
    } = props
    const { breadcrumb, menuData } = getMenuData(
      routes,
      menu,
      formatMessage,
      menuDataRender,
    );

  }, [props])
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  // get children authority
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const renderHeader = logo => <div
    style={{
      lineHeight: '56px'
    }}
  >
    {logo}
  </div>

  return (
    <ProLayout
      logo={props.collapsed ? logo : logoBg}
      title='光大证券'
      siderWidth={188}
      menuHeaderRender={(logo, title) => renderHeader(logo, title, props.collapsed)}
      onMenuHeaderClick={(e) => console.log(e)} // logo和title的位置
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      onPageChange={props => console.log(props, 'props')}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={(props) => <RightContent {...props} />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  global,
  settings,
}))(BasicLayout);
