/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from "@ant-design/pro-layout";
import React, { useEffect } from "react";
import { Link } from "umi";
import { connect } from "dva";
import { Result, Button } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import Authorized from "@/utils/Authorized";
import RightContent from "@/components/GlobalHeader/RightContent";
import { getAuthorityFromRouter } from "@/utils/utils";
import logo from "../assets/logoImg.png";
import logoBg from "../assets/logo.png"
import storage from "@/utils/storage";

const noMatch = () => {
  return (
    <Result
      status={403}
      title="403"
      subTitle="对不起，您没有权限访问此页."
      extra={
        <Button type="primary">
          <Link to="/user/login">login</Link>
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
   * use Authorized check all menu item
   */
  const menuDataRender = menuList =>{
    const {
      global: {
        currentUserMenuList,
      },
    } = props;
    const newMenuList = [...menuList].filter(x => [...currentUserMenuList].some(y => y.url === x.path));
    return newMenuList.map(item => {
      const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
      return Authorized.check(item.authority, localItem, null);
    })
  };

  useEffect(() => {
    // 判断是否登录了，未登录直接跳转登录
    const gdUser = storage.get('gd-user');
    if (gdUser) {
      dispatch({
        type: 'global/queryCurrentUserMenuList',
        payload: {},
      }).then(data => {
        if (!data) return;
        dispatch({
          type: 'global/queryCurrentUserInfo',
        });
      })
    } else {
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
    }
  }, []);
  useEffect(() => {
    // const {
    //   routes,
    //   menu,
    // } = props
    // const { breadcrumb, menuData } = getMenuData(
    //   routes,
    //   menu,
    //   formatMessage,
    //   menuDataRender,
    // );

  }, [props]);
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

  const renderHeader = logoImg => (
    <div
      style={{
        lineHeight: '56px'
      }}
    >
      {logoImg}
    </div>
  );

  return (
    <ProLayout
      logo={props.collapsed ? logo : logoBg}
      title='光大证券'
      siderWidth={188}
      menuHeaderRender={(logoImg, title) => renderHeader(logoImg, title, props.collapsed)}
      onMenuHeaderClick={(e) => console.log(e)} // logo和title的位置
      onCollapse={prop => handleMenuCollapse(prop)}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      onPageChange={prop => console.log(prop, 'props')}
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
      rightContentRender={(prop) => <RightContent {...prop} />}
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
