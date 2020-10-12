import React, { useEffect, useState} from "react"
import classNames from "classnames";
import CustomBtn from "@/components/commonUseModule/customBtn"
import { connect } from "dva"
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import StandardTable from "@/components/StandardTable";
import MenuTree from "./component/menuTree";

import AddForm from "./addForm"
import Detail from "./detail"
import styles from "./index.less"
import {Button, Card, Col, Divider, Form, message, Popconfirm, Row} from "antd";
import {isEmpty} from "@/utils/lang";
import OptButton from "@/components/commonUseModule/optButton";
import deleteIcon from "@/assets/icon/Button_del.svg"
import storage from "@/utils/storage";

const { userInfo } = storage.get('gd-user', {});
const AuthorManage = props => {
  const { dispatch, authorManage: { roleList, allMenuList }, loadingUpdate } = props;

  // 选中菜单
  const [selectedMenu, setSelectedMenu] = useState([]);
  // 左侧选中行
  const [selectedRows, setSelectedRows] = useState({});
  // 展开行
  const [expandedRow, setExpandedRow] = useState([]);
  // 新增角色
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 获取所有菜单
  const handleQueryAllMenuList = () => {
    dispatch({
      type: "authorManage/queryMenuList",
      payload: {},
    })
  };
  // 根据角色Id获取对应菜单
  const handleQueryAuthorByRoleId = roleId => {
    dispatch({
      type: "authorManage/queryAuthorByRoleId",
      payload: {
        id: roleId
      },
    }).then(data => {
      if (!data) return;
      setExpandedRow(data);
      setSelectedMenu(data)
    })
  };

  const handleQueryAllRolesList = params => {
    dispatch({
      type:"authorManage/queryAllRolesList",
      payload: {
        ...DefaultPage,
        ...params,
      }
    }).then(data => {
      if (data && !isEmpty(data) ) {
        setSelectedRows(data[0]);
        handleQueryAuthorByRoleId(data[0].id)
      }
    })
  };

  const handleQueryCurrentUserInfo = () => {
    dispatch({
      type: "global/queryCurrentUserInfo'",
      payload: {
      },
    })
  }
  const handleSaveMenu = (params, callback) => {
    dispatch({
      type: params.id ? "authorManage/updateRoleAuthor" : "authorManage/addRoleAuthor",
      payload: {
        ...params
      }
    }).then(sure => {
      if (!sure) return;
      message.success(selectedRows.id ? "修改成功" : "新增成功");
      callback && callback();
      handleQueryCurrentUserInfo();
      handleQueryAllRolesList();
      handleQueryAuthorByRoleId(userInfo.roleId)
    })
  };
  const handleDeleteRole = params => {
    dispatch({
      type: "authorManage/deleteRoleAuthor",
      payload: {
        id: params.id
      }
    }).then(sure => {
      if (!sure) return;
      message.success("删除成功");
      handleQueryAllRolesList();
    })
  };

  useEffect (()=> {
    handleQueryAllMenuList();
    handleQueryAllRolesList();
  }, []);

  useEffect (()=> {
    setExpandedRow(selectedMenu)
  }, [selectedMenu]);

  const columns = [
    TableColumnHelper.genPlanColumn("roleName", "角色名"),
    {
      title: "操作",
      align: "center",
      render: rows => (
        <>
          <OptButton
            icon="eye"
            showText={false}
            onClick={() => {
              setDetailModalVisible(true);
              setSelectedRows(rows)
          }}
            text="查看"
          />
          <Divider type="vertical" />
          <Popconfirm
            title={`确定要删除（${rows.roleName}）吗?`}
            onConfirm={() => handleDeleteRole(rows)}
            okText="确定"
            cancelText="取消"
          >
            <OptButton showText={false} img={deleteIcon} text="删除" iconStyle={{color: "#d63649"}} style={{color: "#d63649"}} />
          </Popconfirm>
        </>
      )
    }
  ];

  // // 搜索菜单树
  // const searchTree = () => {
  //   if (searchValue === '') return setExpandedRow([]);
  //   // 递归找到当前节点的所有父节点(不包括当前节点)
  //   const findParentMenu = (menuArray, pid, newArr = []) => {
  //     const menuJson = _filter(menuArray, o => String(o.id) === String(pid));
  //     if (isEmpty(menuJson)) {
  //       return null;
  //     }
  //     _sortBy(menuJson, 'id').map(v => {
  //       newArr.push(v);
  //       findParentMenu(menuArray, v.pid, newArr);
  //     })
  //   };
  //   const parentMenu = allMenuList.filter(v => v.name.includes(searchValue));
  //   parentMenu.map(v=> {
  //     findParentMenu(allMenuList, v.pid, parentMenu)
  //   });
  //   if (isEmpty(parentMenu)) return;
  //   setExpandedRow(parentMenu)
  // };

  return (
    <div className="main">
      <CustomBtn
        onClick={() => setAddModalVisible(true)}
        type='create'
        icon='plus'
      />
      <div className={styles.tableList}>
        {/* <div className={styles.tableListForm}> */}
        {/* </div> */}
        <Card bordered={false}>
          <Row>
            <Col span={10}>
              <div className={styles.leftTable}>
                <div className={styles.title}>选择角色</div>
                <StandardTable
                  rowkey="id"
                  rowClassName={record => record.id === selectedRows.id ? styles.clickRowSty : ''}
                  columns={columns}
                  data={roleList}
                  scroll={{ y: 800 }}
                  pagination={false}
                  onRow={record => {
                    return {
                      onClick: () => {
                        setSelectedRows(record);
                        setExpandedRow([]);
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
                      <div className={styles.addOpt} onClick={() => setExpandedRow(allMenuList)} />
                      <div className={styles.minusOpt} onClick={() => setExpandedRow([])} />
                    </div>
                  </div>
                  <div className={styles.searchForm}>
                    {/* <Input */}
                    {/*  value={searchValue} */}
                    {/*  onChange={e => setSearchValue(e.target.value)} */}
                    {/*  style={{ width: 120, height: 28 }} */}
                    {/*  allowClear */}
                    {/*  onBlur={() => searchTree()} */}
                    {/*  onPressEnter={() => searchTree()} */}
                    {/* /> */}
                  </div>
                </div>
                <div className={styles.tree}>
                  <MenuTree
                    selectedRows={selectedMenu}
                    setSelectedRows={setSelectedMenu}
                    allMenuList={allMenuList}
                    expandedRow={expandedRow}
                    setExpandedRow={setExpandedRow}
                  />
                </div>
                <div className={classNames(styles.okBtn,"xyCenter")}>
                  <Button
                    type="primary"
                    loading={loadingUpdate}
                    onClick={() => {
                      handleSaveMenu({
                        id: selectedRows.id,
                        roleName: selectedRows.roleName,
                        resourceIds: selectedMenu.map(v => v.id).join(','),
                      })
                    }}
                  >
                    保存
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {
          addModalVisible && (
            <AddForm
              modalVisible={addModalVisible}
              handleModalVisible={() => setAddModalVisible(false)}
              onOk={handleSaveMenu}
            />
          )
        }
        {
          detailModalVisible && (
            <Detail
              modalVisible={detailModalVisible}
              handleModalVisible={() => setDetailModalVisible(false)}
              values={selectedRows}
            />
          )
        }
      </div>
    </div>
  )
}


export default connect(
  ({ authorManage, global, loading }) => ({
    authorManage,
    global,
    loading: loading.models.authorManage,
    loadingUpdate: loading.effects['authorManage/updateRoleAuthor'],
  })
)(Form.create()(AuthorManage))
