import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { router, withRouter } from 'umi/index';
import { isEmpty } from '@/utils/lang';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Popconfirm,
  Popover,
  Row,
  Select,
  Tooltip
} from 'antd';
import {DefaultPage, PagerHelper, TableColumnHelper} from '@/utils/helper';
// import {MENU_ACTIONS} from "@/utils/constant";
import OptButton from '@/components/commonUseModule/optButton';
import edit from '@/assets/icon/Button_bj.svg';
import StandardTable from '@/components/StandardTable';

import AddStory from '../components/story/addStory';

import styles from '../index.less';

import deleteIcon from '@/assets/icon/Button_del.svg';
import assignIcon from '@/assets/icon/cz_zp.svg';
import {formLayoutItem, formLayoutItem2} from "@/utils/constant";
import classNames from "classnames";
import bottomIcon from "@/assets/icon/drop_down.svg";
import upIcon from "@/assets/icon/Pull_up.svg";
import {DEMAND_PRIORITY_ARR, DEMAND_STATUS} from "@/pages/demand/util/constant";

import AssignUser from "../components/story/assignUser"

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
const FormItem = Form.Item;
const { Option } = Select;
const Index = memo(
  withRouter(props => {
    const {
      dispatch,
      form,
      demand: { demandList },
      global: { userList }
    } = props;

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState({});
    const [searchMore, setSearchMore] = useState(false);

    const [assignVisible, setAssignVisible] = useState(false)
    const handleQueryMyDemand = params => {
      dispatch({
        type: 'demand/queryDemand',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    const handleQueryDemandProject = params => {
      dispatch({
        type: 'demand/queryDemandProject',
        payload: {
          ...DefaultPage,
          ...params,
        },
      });
    };

    const handleQueryDemandList = params => {
      if (demandRoutes[props.location.pathname] === '我的需求') {
        handleQueryMyDemand(params);
        return;
      }
      handleQueryDemandProject(params);
    };


    const handleQueryUserList = () => {
      dispatch({
        type: "global/queryUserList",
        payload: {
          ...PagerHelper.MaxPage,
        },
      })
    }
    const handleAssign = (params, rows, callback) => {
      dispatch({
        type: "demand/assignUser",
        payload: {
          ...params,
          type: 1,
        },
      }).then(result => {
        if (!result) return;
        message.success("指派成功")
        callback && callback()
        handleQueryUserList()
      })
    }

    const handleUpdateStory = ids => {
      dispatch({
        type: 'demand/updateStory',
        payload: {
          id: ids,
          isDelete: 1,
        },
      }).then(sure => {
        if (!sure) return;
        message.success('删除成功');
        handleQueryDemandList();
      });
    };

    useEffect(() => {
      handleQueryDemandList();
      handleQueryUserList()
    }, []);

    const columns = [
      {
        title: '需求编号',
        key: 'demandNumber',
        sorter: true,
        render: rows => {
          if (isEmpty(rows.demandNumber, true)) return '';
          return (
            <Tooltip placement="top" title={rows.demandNumber}>
              <span
                style={{ color: '#2E5BFF' }}
                onClick={() => {
                  const pathname = props?.location?.pathname;
                  if (!pathname) return
                  props.history.push({
                    pathname: `${pathname}/detail`,
                    query: {
                      id: rows.id,
                    },
                  });
                }}
              >
                {rows.demandNumber.length > 10
                  ? `${rows.demandNumber.substring(0, 10)}...`
                  : rows.demandNumber.substring(0, 10)}
              </span>
            </Tooltip>
          );
        },
      },
      TableColumnHelper.genPlanColumn('title', '标题'),
      TableColumnHelper.genSelectColumn('type', '需求类型', DEMAND_PRIORITY_ARR),
      TableColumnHelper.genSelectColumn('status', '状态', DEMAND_STATUS),
      TableColumnHelper.genSelectColumn('priority', '优先级',DEMAND_PRIORITY_ARR),
      TableColumnHelper.genPlanColumn('acceptTeam', '受理团队'),
      TableColumnHelper.genPlanColumn('receiverId', '受理人'),
      TableColumnHelper.genPlanColumn('expectedCompletionDate', '期望完成日期'),
      TableColumnHelper.genPlanColumn('plannedLaunchDate', '计划上线日期'),
      {
        title: '操作',
        width: 200,
        align: 'center',
        render: rows => (
          <Fragment>
            <OptButton
              icon="eye"
              showText={false}
              text="查看"
              onClick={() => {
                router.push({
                  pathname: `${props.location.pathname}/detail`,
                  query: {
                    id: rows.id,
                  },
                });
              }}

            />
            <Divider type="vertical" />
            <Popover
              content={(
                <AssignUser
                  userList={userList}
                  rows={rows}
                  onOk={handleAssign}
                  handleVisible={setAssignVisible}
                />
              )}
              title="指派关注人"
              trigger="click"
              placement="left"
              visible={rows.id === assignVisible}
              onClick={e => e.stopPropagation()}
              onVisibleChange={visible =>{
                setAssignVisible( visible && rows.id)
              }}
            >
              <OptButton onClick={e => e.stopPropagation()} img={assignIcon} showText={false} text="指派" />
            </Popover>
          </Fragment>
        ),
      },
    ];

    const expandedRowRender = row => {
      if (isEmpty(row.storyList)) return null;
      const subColumns = [
        {
          title: 'story编号',
          key: 'number',
          sorter: true,
          width: 120,
          render: rows => {
            if (isEmpty(rows.number, true)) return '';
            return (
              <Tooltip placement="top" title={rows.number}>
                <span
                  style={{ color: '#2E5BFF' }}
                  onClick={() => {
                    props.history.push({
                      pathname: '/demand/storyDetail',
                      query: {
                        id: rows.id,
                      },
                    });
                  }}
                >
                  {rows.number.length > 8
                    ? `${rows.number.substring(0, 8)}...`
                    : rows.number.substring(0, 8)}
                </span>
              </Tooltip>
            );
          },
        },
        TableColumnHelper.genLangColumn('title', '标题', { width: 150 }, 10),
        TableColumnHelper.genPlanColumn('status', '状态'),
        TableColumnHelper.genPlanColumn('priority', '优先级'),
        TableColumnHelper.genPlanColumn('type', 'story类型'),
        TableColumnHelper.genPlanColumn('evaluateTime', 'IT评估上线时间', { width: 170 }),
        TableColumnHelper.genPlanColumn('developWorkload', '开发预计工作量', { width: 130 }),
        TableColumnHelper.genPlanColumn('testWorkload', '测试预计工作量', { width: 130 }),
        TableColumnHelper.genPlanColumn('assigneeName', '经办人'),
        TableColumnHelper.genPlanColumn('userName', '创建人'),
        TableColumnHelper.genPlanColumn('createTime', '创建时间', { width: 170 }),
        {
          title: '操作',
          width: 170,
          align: 'center',
          fixed: "right",
          render: rows => (
            <Fragment>
              <OptButton
                img={edit}
                showText={false}
                text="编辑"
                onClick={() => {
                  setAddModalVisible(true);
                  setSelectedRows(rows);
                }}
              />
              <Divider type="vertical" />
              <OptButton
                icon="eye"
                text="查看"
                showText={false}
                onClick={() => {
                  router.push({
                    pathname: "/demand/storyDetail",
                    query: {
                      id: rows.id,
                    },
                  });
                }}
              />
              <Divider type="vertical" />
              <OptButton
                icon="sync"
                text="同步"
                showText={false}
                onClick={() => {
                  // setAddModalVisible(true);
                  // setSelectedRows(rows)
                }}
              />
              <Divider type="vertical" />

              <Popconfirm
                title={`确定要删除${row.title}吗?`}
                onConfirm={() => handleUpdateStory(rows.id)}
                okText="确定"
                cancelText="取消"
              >
                <OptButton
                  img={deleteIcon}
                  showText={false}
                  text="删除"
                />
              </Popconfirm>
            </Fragment>
          ),
        },
      ];
      return (
        <StandardTable
          rowKey="id"
          columns={subColumns}
          data={{ list: row.storyList }}
          pagination={false}
          scroll={{ x: 1550, y: 550 }}
        />
      );
    };

    const handleDemandTableChange = pagination => {
      // const formValues = form.getFieldsValue();
      const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        // ...formValues, // 添加已查询条件去获取分页
      };
      handleQueryDemandList(params);
    };

    const handleSearchForm = () => {

    }

    const handleResetForm = () => {

    }

    const renderForm = () => {
      const { getFieldDecorator } = form;
      const content = (
        <div className={styles.moreSearch}>
          <Row>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="所属预算">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="需求类型">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {DEMAND_PRIORITY_ARR.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.val}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="优先级">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {DEMAND_PRIORITY_ARR.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="需求提出人">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择需求提出人" allowClear>
                    {userList?.list && userList?.list.map(v => (
                      <Option value={v.loginid} key={v.loginid.toString()}>
                        {v.lastname}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="受理团队">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="受理人">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择受理人" allowClear>
                    {userList?.list && userList?.list.map(v => (
                      <Option value={v.loginid} key={v.loginid.toString()}>
                        {v.lastname}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="需求描述">
                {getFieldDecorator('type')(<Input />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="期望完成日期">
                {getFieldDecorator('type')(
                  <DatePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="计划上线日期">
                {getFieldDecorator('type')(
                  <DatePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="实际上线日期">
                {getFieldDecorator('type')(
                  <DatePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="需求紧迫性">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="是否涉及业务风控功能">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="是否涉及业务合规性">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <div className={styles.moreSearchButton}>
            <Button onClick={handleSearchForm}>查询</Button>
            <Button onClick={() => setSearchMore(false)}>取消</Button>
          </div>
        </div>
      );
      return (
        <Form layout="inline">
          <Row>
            <Col span={6}>
              <FormItem {...formLayoutItem} label="需求标题和描述">
                {getFieldDecorator('number')(
                  <Input
                    allowClear
                    onBlur={handleSearchForm}
                    placeholder="请输入需求标题和描述"
                  />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formLayoutItem} label="创建人">
                {getFieldDecorator('deptId',{
                })(
                  <Select
                    allowClear
                    showSearch
                    onBlur={handleSearchForm}
                    // onSearch={val => handleSearch(handleQueryAllTeam({ groupName: val }))}
                    placeholder="请输入创建人"
                  >
                    {userList?.list && userList?.list.map(v => (
                      <Option value={v.loginid} key={v.loginid.toString()}>
                        {v.lastname}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formLayoutItem} label="状态">
                {getFieldDecorator('deptId',{
                })(
                  <Select
                    allowClear
                    showSearch
                    onBlur={handleSearchForm}
                    // onSearch={val => handleSearch(handleQueryAllTeam({ groupName: val }))}
                    placeholder="请选择状态"
                  >
                    {DEMAND_STATUS.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formLayoutItem} label="创建日期">
                {getFieldDecorator('deptId',{
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  ghost
                  className={classNames('margin-right-6', styles.orangeForm)}
                  onClick={handleResetForm}
                >
                  重置
                </Button>
                <Popover
                  visible={searchMore}
                  placement="bottomRight"
                  content={content}
                  trigger="click"
                >
                  <div className="yCenter">
                    {!searchMore ? (
                      <span className="activeColor" onClick={() => setSearchMore(true)}>
                        <Icon style={{ verticalAlign: '-0.4em' }} component={bottomIcon} />
                        更多
                      </span>
                    ) : (
                      <span className="activeColor" onClick={() => setSearchMore(false)}>
                        <Icon style={{ verticalAlign: '-0.4em' }} component={upIcon} />
                        隐藏
                      </span>
                    )}
                  </div>
                </Popover>
              </div>
            </Col>
          </Row>
        </Form>
      );
    };
    return (
      <div className={styles.childrenTable}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{renderForm()}</div>
          <StandardTable
            rowKey="id"
            expandedRowRender={expandedRowRender}
            columns={columns}
            data={demandList}
            expandIcon={prop => {
              if (prop?.record?.storyList?.length < 1) return ""
              return !prop?.expanded ? ">" : "v"
            }}
            onChange={handleDemandTableChange}
            expandRowByClick
            scroll={{ x: 1350 }}
          />
        </div>
        {addModalVisible && (
          <AddStory
            values={selectedRows}
            modalVisible={addModalVisible}
            handleModalVisible={() => {
              setAddModalVisible(false);
              setSelectedRows({});
            }}
          />
        )}
      </div>
    );
  }),
);

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.demand,
}))(Form.create()(Index));
