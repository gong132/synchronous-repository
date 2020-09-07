import React, {Component, Fragment, useEffect, useState} from 'react'
import classNames from "classnames";
import CustomBtn from '@/components/commonUseModule/customBtn'
import {connect} from 'dva'
import {DefaultPage, TableColumnHelper} from "@/utils/helper";
import StandardTable from "@/components/StandardTable";
import MenuTree from "./component/menuTree";

import styles from './index.less'
import {Affix, Button, Card, Col, Form, message, Row} from "antd";
import {isEmpty} from "@/utils/lang";

let container;

const AuthorManage = props => {
  const { dispatch, authorManage: { roleList, allMenuList, menuList }, loading } = props;

  // 选中菜单
  const [selectedMenu, setSelectedMenu] = useState([]);
  // 左侧选中行
  const [selectedRows, setSelectedRows] = useState({});

  const handleQueryAllRolesList = params => {
    dispatch({
      type:'authorManage/queryAllRolesList',
      payload: {
        ...DefaultPage,
        ...params,
      }
    }).then(data => {
      if (data && !isEmpty(data) ) {
        setSelectedRows(data[0])
        handleQueryAuthorByRoleId(data[0].id)
      }
    })
  };

  // 获取所有菜单
  const handleQueryAllMenuList = () => {
    dispatch({
      type: 'authorManage/queryMenuList',
      payload: {},
    })
  };
  // 根据角色Id获取对应菜单
  const handleQueryAuthorByRoleId = roleId => {
    dispatch({
      type: 'authorManage/queryAuthorByRoleId',
      payload: {
        id: roleId
      },
    }).then(data => {
      if (!data) return;
      setSelectedMenu(data)
    })
  };

  const handleSaveMenu = () => {
    dispatch({
      type: selectedRows.id ? "authorManage/updateRoleAuthor" : "authorManage/addRoleAuthor",
      payload: {
        id: selectedRows.id,
        roleName: selectedRows.roleName,
        resourceIds: selectedMenu.map(v => v.id)
      }
    }).then(sure => {
      if (!sure) return;
      message.success(selectedRows.id ? "修改成功" : "新增成功")
    })
  };

  useEffect (()=> {
    handleQueryAllMenuList();
    handleQueryAllRolesList();
  }, []);
  useEffect(() => {
  }, [selectedRows]);

  const columns = [
    TableColumnHelper.genPlanColumn('id', '角色编号'),
    TableColumnHelper.genPlanColumn('roleName', '角色名'),
  ];

  return (
    <div className="main">
      <CustomBtn
        // onClick={() => }
        type='create' />
      <div className={styles.tableList}>
        {/*<div className={styles.tableListForm}>*/}
        {/*</div>*/}
        <Card bordered={false}>
          <Row>
            <Col span={10}>
              <div className={styles.leftTable}>
                <div className={styles.title}>选择角色</div>
                <StandardTable
                  rowkey="id"
                  columns={columns}
                  data={roleList}
                  scroll={{ y: 800 }}
                  pagination={false}
                  onRow={record => {
                    return {
                      onClick: event => { setSelectedRows(record);
                        // console.log(record, event, '11111111')
                        handleQueryAuthorByRoleId(record.id)
                      }
                    }
                  }}
                />
              </div>
            </Col>
            <Col span={14}>
              <div className={styles.rightTree}>
                <div className={styles.title}>
                  <div className={styles.titleOpt}>
                    <div className={styles.roleName}>{selectedRows && selectedRows.roleName}</div>
                    <div className={styles.titleName}>选择功能</div>
                    <div className={styles.opt}>
                      <div>+</div>
                      <div>-</div>
                    </div>
                  </div>
                </div>
                <div className={styles.tree}>
                  <MenuTree
                    selectedRows={selectedMenu}
                    setSelectedRows={setSelectedMenu}
                    allMenuList={allMenuList}
                  />
                </div>
                <div className={classNames(styles.okBtn,"xyCenter")}>
                  <Button type="primary" onClick={handleSaveMenu}>保存</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  )
}


export default connect(
  ({ authorManage, global, loading }) => ({
    authorManage,
    global,
    loading: loading.models.authorManage
  })
)(AuthorManage)
