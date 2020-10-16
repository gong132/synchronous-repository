import React, {useEffect, useState} from "react";
import {Col, Form, Tree, Empty, Modal, Row} from "antd";
import { connect } from 'dva'
import {formLayoutItem, formLayoutItemAddEdit} from "@/utils/constant";
import {isArray, isEmpty} from "@/utils/lang";
import styles from './index.less'
import _filter from "lodash/filter";
import _sortBy from "lodash/sortBy";

const { TreeNode } = Tree;
const FormItem = Form.Item;
const Index = props => {
  const { dispatch, modalVisible, handleModalVisible, values, authorManage: { menuList } } = props;


  // 根据角色Id获取对应菜单
  const handleQueryAuthorByRoleId = roleId => {
    dispatch({
      type: 'authorManage/queryAuthorByRoleId',
      payload: {
        id: roleId
      },
    })
  };

  useEffect(() => {
    if (!isEmpty(values)) {
      handleQueryAuthorByRoleId(values.id)
    }
  }, []);

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

  const renderTreeNodes = data => {
    if (data && data.length > 0) {
      return data.map(item => {
        if (item.children) {
          return (
            <TreeNode icon={<span className={styles.treeShowIcon}>√</span>} title={item.title} key={item.key} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode icon={<span className={styles.treeShowIcon}>√</span>} {...item} />;
      });
    }
    return [];
  };
  return (
    <Modal
      width={800}
      title={<>查看 <span className={styles.modalSubTitle}>{values && values.roleName || ''}</span></>}
      visible={modalVisible}
      onCancel={handleModalVisible}
      onOk={handleModalVisible}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItemAddEdit} label="角色名称">
              {values && values.roleName || ''}
            </FormItem>
            <FormItem {...formLayoutItemAddEdit} label="角色描述">
              {values && values.description || ''}
            </FormItem>
            <FormItem {...formLayoutItemAddEdit} label="角色功能">
              {
                menuList && !isEmpty(menuList) && <div className={styles.treeShow}>
                  {
                    generateAllMenu(menuList).map(v => {
                      return (
                        <Tree
                          key={v.key}
                          showLine
                          selectedKeys={menuList.map(v=>v.id)}
                          defaultExpandAll
                        >
                          {renderTreeNodes([v])}
                        </Tree>
                      )
                    })
                  }
                </div>
              }
              {
                menuList && isEmpty(menuList) && <div className={styles.treeShowEmpty}>
                  <Empty />
                </div>
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
};
export default connect(
  ({
     authorManage,
  }) => ({
    authorManage,
  }))(Index)
