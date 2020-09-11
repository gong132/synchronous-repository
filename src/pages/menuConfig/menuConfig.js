import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Icon, Form, Divider, Popconfirm, Tree } from 'antd';
import _filter from 'lodash/filter';
import _sortBy from 'lodash/sortBy';
import { isEmpty } from '@/utils/lang';
import { MenuActionHelper } from '@/utils/helper';
import { MENU_ITEM_TYPE } from '@/utils/constant';
import AdminRouters from '@/pages/routes.config';

import styles from './index.less';

// const FormItem = Form.Item;
const { TreeNode } = Tree;
const Index = props => {
  const {
    global: { allMenuList },
  } = props;

  MenuActionHelper.getFlatMenus(MenuActionHelper.getMenuData(AdminRouters.routes[0].routes, '/'));

  useEffect(() => {}, []);

  // 递归序列初始化所有菜单树
  const generateAllMenu = (menuArray, pid = 0) => {
    const menuJson = _filter(menuArray, o => String(o.pid) === String(pid));
    if (menuJson.length === 0) {
      return null;
    }
    const menu = _sortBy(menuJson, 'id').map(item => {
      const menuItem = {
        id: item.id,
        key: item.id,
        pid: item.pid,
        url: item.url,
        icon: item.icon,
        name: item.name,
        title: item.name,
        perms: item.perms,
        type: item.type,
      };
      const childMenu = generateAllMenu(menuArray, item.id);
      if (childMenu != null) menuItem.children = childMenu;
      return menuItem;
    });
    return menu;
  };
  const getNodeTitle = node => (
    <div className={styles.nodeItem}>
      {node.title}
      <span className={styles.nodeOperations}>
        <Fragment>
          <Icon
            type="edit"
            title="编辑"
            // onClick={() => this.handleUpdate(node)}
          />
          <Divider type="vertical" />
        </Fragment>

        {node.type !== MENU_ITEM_TYPE.ACTION && (
          <Fragment>
            <Icon
              type="plus-circle"
              title="添加"
              // onClick={() => this.handleAdd(node)}
            />
            <Divider type="vertical" />
          </Fragment>
        )}

        <Popconfirm
          title={`确定要删除（${node.title}）吗?`}
          // onConfirm={() => handleDelete(node)}
          okText="确定"
          cancelText="取消"
        >
          <Icon type="delete" title="删除" />
        </Popconfirm>
      </span>
    </div>
  );

  const renderTreeNodes = data => {
    if (isEmpty(data)) return [];
    return data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.key} title={getNodeTitle(item)}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={getNodeTitle(item)} />;
    });
  };

  return (
    <Card title="菜单配置">
      <div>{allMenuList && <Tree>{renderTreeNodes(generateAllMenu(allMenuList))}</Tree>}</div>
    </Card>
  );
};

export default connect(({ global, menuConfig }) => ({ global, menuConfig }))(Form.create()(Index));
