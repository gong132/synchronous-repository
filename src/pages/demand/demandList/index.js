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
import arrowRight from '@/assets/icon/arrowRight.svg';
import arrowBottom from '@/assets/icon/arrowbottom.svg';
import {formLayoutItem, formLayoutItem2} from "@/utils/constant";
import classNames from "classnames";
import bottomIcon from "@/assets/icon/drop_down.svg";
import upIcon from "@/assets/icon/Pull_up.svg";
import {
  DEMAND_LEVEL,
  DEMAND_PRIORITY_ARR,
  DEMAND_STATUS,
  DEMAND_TYPE,
  DEMAND_TYPE_ARR
} from "@/pages/demand/util/constant";

import AssignUser from "../components/story/assignUser"
import storage from "@/utils/storage";

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目',
};
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const Index = memo(
  withRouter(props => {
    const {
      dispatch,
      form,
      setSearchForm,
      demand: { demandList, allBudgetList, groupList },
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

    const handleQueryBudgetList = () => {
      dispatch({
        type: "demand/queryBudgetList",
        payload: {
          ...PagerHelper.MaxPage,
        },
      })
    }
    const handleQueryHeaderGroupList = () => {
      dispatch({
        type: "demand/fetchHeaderGroup",
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


    // 同步JIRA
    const handleSyncStory = () => {
      dispatch({
        type: "demand/syncStory",
        payload: {
          storyId: props?.location?.query?.id,
        },
      }).then(res => {
        if (!res) return;
        message.success("同步成功")
        handleQueryDemandList();
      })
    }

    useEffect(() => {
      handleQueryDemandList();
      handleQueryUserList()
      handleQueryBudgetList()
      handleQueryHeaderGroupList()
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
                style={{ color: '#2E5BFF', cursor: "pointer" }}
                onClick={() => {
                  const pathname = props?.location?.pathname;
                  if (!pathname) return
                  props.history.push({
                    pathname: `${pathname}/detail`,
                    query: {
                      id: rows.id,
                      no: rows.demandNumber
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
      TableColumnHelper.genSelectColumn('type', '需求类型', DEMAND_TYPE),
      TableColumnHelper.genSelectColumn('status', '状态', DEMAND_STATUS),
      TableColumnHelper.genSelectColumn('priority', '优先级',DEMAND_PRIORITY_ARR.map(v => ({...v, value: v.val}))),
      TableColumnHelper.genPlanColumn('acceptTeam', '受理团队'),
      TableColumnHelper.genPlanColumn('receiverId', '受理人'),
      TableColumnHelper.genPlanColumn('expectedCompletionDate', '期望完成日期'),
      TableColumnHelper.genPlanColumn('plannedLaunchDate', '计划上线日期'),
      {
        title: '操作',
        width: 120,
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
                    no: rows.demandNumber
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
                  style={{ color: '#2E5BFF', cursor: "pointer" }}
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
          render: rows => {
            const { userInfo } = storage.get("gd-user", {})
            const isDelete = userInfo?.userId === rows?.userId && !rows?.issueId
            return (
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

                <Popconfirm
                  title="确定要同步JIRA吗?"
                  onConfirm={(userInfo.userId !== rows.assessor || rows?.issueId) && handleSyncStory}
                  okText="确定"
                  cancelText="取消"
                >
                  <OptButton
                    icon="sync"
                    text="同步"
                    disabled={userInfo.userId !== rows.assessor || rows?.issueId}
                    showText={false}
                  />
                </Popconfirm>
                <Divider type="vertical" />

                <Popconfirm
                  title={`确定要删除${row.title}吗?`}
                  onConfirm={() => isDelete && handleUpdateStory(rows.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <OptButton
                    img={deleteIcon}
                    showText={false}
                    style={isDelete ? {color: "#d63649"} : {color: "#b0bac9"}}
                    text="删除"
                    disabled={!isDelete}
                  />
                </Popconfirm>
              </Fragment>
            )
          }
        },
      ];
      return (
        <StandardTable
          rowKey="id"
          columns={subColumns}
          data={{ list: row.storyList }}
          pagination={false}
          scroll={{ x: 2550, y: 550 }}
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
      const formValues = form.getFieldsValue()
      const { requirementDescription, plannedLaunchDate, actualLineDate, createTime } = formValues;
      const params = {
        ...formValues,
        minExpectedCompletionDate: requirementDescription ? requirementDescription[0].format("YYYY-MM-DD") : null,
        maxExpectedCompletionDate: requirementDescription ? requirementDescription[1].format("YYYY-MM-DD") : null,
        minPlannedLaunchDate: plannedLaunchDate ? plannedLaunchDate[0].format("YYYY-MM-DD") : null,
        maxPlannedLaunchDate: plannedLaunchDate ? plannedLaunchDate[1].format("YYYY-MM-DD") : null,
        minActualLineDate: actualLineDate ? actualLineDate[1].format("YYYY-MM-DD") : null,
        maxActualLineDate: actualLineDate ? actualLineDate[1].format("YYYY-MM-DD") : null,
        minCreateDate: createTime ? createTime[1].format("YYYY-MM-DD") : null,
        maxCreateDate: createTime ? createTime[1].format("YYYY-MM-DD") : null,
      }
      setSearchForm(obj => ({ ...obj, ...params}))
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
                {getFieldDecorator('budgetNumbers')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {allBudgetList && allBudgetList.map(v => (
                      <Option value={v.id} key={v.id}>
                        {v.name}
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
                    {DEMAND_TYPE_ARR.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.val}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择状态" allowClear>
                    {DEMAND_STATUS.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="优先级">
                {getFieldDecorator('priority')(
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
              <FormItem {...formLayoutItem2} label="需求提出人">
                {getFieldDecorator('introducer')(
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
                {getFieldDecorator('acceptTeam')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {groupList && groupList.map(v => (
                      <Option value={v.id} key={v.id}>
                        {v.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="受理人">
                {getFieldDecorator('receiver')(
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
                {getFieldDecorator('requirementDescription')(<Input />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="期望完成日期">
                {getFieldDecorator('requirementDescription')(
                  <RangePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="计划上线日期">
                {getFieldDecorator('plannedLaunchDate')(
                  <RangePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="实际上线日期">
                {getFieldDecorator('actualLineDate')(
                  <RangePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} label="需求紧迫性">
                {getFieldDecorator('demandUrgency')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {DEMAND_LEVEL.map(v => (
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
                {getFieldDecorator('riskControlFunction')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[{ key: "y", value: "是"},{ key: "n", value: "否"}].map(v => (
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
                {getFieldDecorator('businessCompliance')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[{ key: "y", value: "是"},{ key: "n", value: "否"}].map(v => (
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
                    placeholder="请输入需求标题或描述关键字"
                  />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formLayoutItem} label="创建人">
                {getFieldDecorator('creatorId',{
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
                {getFieldDecorator('status',{
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
            <Col span={5}>
              <FormItem {...formLayoutItem} label="创建日期">
                {getFieldDecorator('createTime',{
                })(
                  <RangePicker
                    format="YYYY-MM-DD"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
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

    const contentWidth = document.body.clientWidth - 188 - 32 - 32 + 1
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
              return !prop?.expanded ? (
                <span style={{cursor: "pointer"}}>
                  <Icon component={arrowRight} />
                </span>
              ) : (
                <span style={{cursor: "pointer"}}>
                  <Icon component={arrowBottom} />
                </span>
              )
            }}
            onChange={handleDemandTableChange}
            expandRowByClick
            scroll={{ x: contentWidth }}
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
