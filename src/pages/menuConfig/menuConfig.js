import React, { useEffect, Fragment, useState } from 'react';
import { connect } from 'dva';
import { Card, Icon, Form, Divider, Popconfirm, Tree, message } from 'antd';
import _filter from 'lodash/filter';
import _sortBy from 'lodash/sortBy';
import { isEmpty } from '@/utils/lang';
import { MenuActionHelper } from '@/utils/helper';
import { MENU_ITEM_TYPE } from '@/utils/constant';
import AdminRouters from '@/pages/routes.config';

import AddChildrenNode from './addChildrenNode'
import styles from './index.less';
import storage from "@/utils/storage";

const { currentUserMenuList } = storage.get('gd-user', {})
// const FormItem = Form.Item;
const { TreeNode } = Tree;
const Index = props => {
  const {
    dispatch,
    global: { allMenuList },
  } = props;

  const localMenu = MenuActionHelper.getFlatMenus(MenuActionHelper.getMenuData(AdminRouters.routes[0].routes, '/'));

  // 递归找到当前节点的所有子节点(不包括当前节点)
  const findChildMenu = (menuArray, id, newArr = []) => {
    const menuJson = _filter(menuArray, o => String(o.pid) === String(id));
    if (isEmpty(menuJson)) {
      return null;
    }
    _sortBy(menuJson, 'id').map(v => {
      newArr.push(v);
      findChildMenu(menuArray, v.id, newArr);
    })
    return newArr
  };
  // 递归序列初始化所有菜单树
  const generateAllMenu = (menuArray, pid = 0) => {
    const menuJson = _filter(menuArray, o => String(o.pid) === String(pid));
    if (menuJson.length === 0) {
      return null;
    }
    const menu = _sortBy(menuJson, "id").map(item => {
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

  const [addChildVisible, setAddChildVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState({})

  const handleQueryAllMenu = () => {
    dispatch({
      type: 'global/queryAllMenuList',
      payload: {
      },
    })
  }

  useEffect(() => {
    handleQueryAllMenu()
  }, []);

  const handleDeleteMenu = node => {
    const childrenMenuList = findChildMenu(allMenuList, node.id);
    let idGather = [node];
    if (!isEmpty(childrenMenuList)) {
      idGather = [...idGather, ...childrenMenuList]
    }
    idGather = idGather.map(c => c.id).join(',')
    dispatch({
      type: 'menuConfig/deleteMenu',
      payload: {
        ids: idGather,
      },
    }).then(sure => {
      if (!sure) return;
      message.success("删除成功")
      handleQueryAllMenu();
    })
  }
  const handleAddMenu = (params, callback) => {
    if (isEmpty(params)) {
      message.error('请正确选择菜单及类型')
      return;
    }
    const onlyMenu = allMenuList.find(v => v.url === params.url && params.pid === v.pid)
    if (!isEmpty(onlyMenu)) {
      message.error('禁止添加重复菜单')
      return
    }
    dispatch({
      type: 'menuConfig/addMenu',
      payload: {
        ...params
      },
    }).then(sure => {
      if (!sure) return;
      message.success("新增成功")
      handleQueryAllMenu();
      callback && callback()
    })
  }

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
              onClick={() => {
                setAddChildVisible(true)
                setSelectedNode(node)
              }}
            />
            <Divider type="vertical" />
          </Fragment>
        )}

        <Popconfirm
          title={`确定要删除（${node.title}）吗?`}
          onConfirm={() => handleDeleteMenu(node)}
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

  const firstNode = {
    title: '菜单管理',
    name: '菜单管理',
    type: 0,
    url: 'firstNode',
  }
  return (
    <Card title="菜单配置">
      <div>
        {localMenu && (
          <Tree>
            <TreeNode title={getNodeTitle(firstNode)}>
              {renderTreeNodes(generateAllMenu(allMenuList))}
            </TreeNode>
          </Tree>
        )}
        {
          // console.log(localMenu, currentUserMenuList, selectedNode, '11111111')
        }
        {
          addChildVisible && (
            <AddChildrenNode
              modalVisible={addChildVisible}
              handleModalVisible={() => {
                setAddChildVisible(false)
                setSelectedNode({})
              }}
              localMenu={[...localMenu].filter(x => [...currentUserMenuList].every(y => y.url !== x.path || y.url === selectedNode.url))}
              values={selectedNode}
              handleAddMenu={handleAddMenu}
            />
          )
        }
      </div>
    </Card>
  );
};

export default connect(({ global, menuConfig }) => ({ global, menuConfig }))(Form.create()(Index));
