import React, { Fragment, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { router, withRouter } from 'umi/index';
import moment from "moment";
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
  Tooltip,
} from 'antd';
import { PagerHelper, TableColumnHelper } from '@/utils/helper';
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
import { formLayoutItem, formLayoutItem2 } from '@/utils/constant';
import classNames from 'classnames';
import bottomIcon from '@/assets/icon/drop_down.svg';
import upIcon from '@/assets/icon/Pull_up.svg';
import {
  DEMAND_LEVEL,
  DEMAND_PRIORITY_ARR,
  DEMAND_STATUS,
  DEMAND_TYPE,
  DEMAND_TYPE_ARR,
  RISK_CONTROL,
} from '@/pages/demand/util/constant';

import AssignUser from '../components/story/assignUser';
import storage from '@/utils/storage';

const demandRoutes = {
  '/demand/myDemand': '我的需求',
  '/demand/generalDemand': '一般需求',
  '/demand/projectDemand': '项目需求',
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
      handleQueryDemandList,
      demand: { demandList, allBudgetList, groupList },
      global: { userList },
      location: { pathname },
    } = props;

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState({});
    const [searchMore, setSearchMore] = useState(false);

    const [assignVisible, setAssignVisible] = useState(false);

    const handleQueryUserList = () => {
      dispatch({
        type: 'global/queryUserList',
        payload: {
          ...PagerHelper.MaxPage,
        },
      });
    };

    const handleQueryBudgetList = () => {
      dispatch({
        type: 'demand/queryBudgetList',
        payload: {
          ...PagerHelper.MaxPage,
        },
      });
    };
    const handleQueryHeaderGroupList = () => {
      dispatch({
        type: 'demand/fetchHeaderGroup',
        payload: {
          ...PagerHelper.MaxPage,
        },
      });
    };
    const handleAssign = (params, rows, callback) => {
      dispatch({
        type: 'demand/assignUser',
        payload: {
          ...params,
          type: 1,
        },
      }).then(result => {
        if (!result) return;
        message.success('指派成功');
        callback && callback();
        handleQueryUserList();
      });
    };

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
        type: 'demand/syncStory',
        payload: {
          storyId: props?.location?.query?.id,
        },
      }).then(res => {
        if (!res) return;
        message.success('同步成功');
        handleQueryDemandList();
      });
    };

    const columns = [
      {
        title: '需求编号',
        key: 'demandNumber',
        sorter: true,
        width: 120,
        render: rows => {
          if (isEmpty(rows.demandNumber, true)) return '';
          return (
            <Tooltip placement="top" title={rows.demandNumber}>
              <span
                style={{ color: '#2E5BFF', cursor: 'pointer' }}
                onClick={() => {
                  if (!pathname) return;
                  props.history.push({
                    pathname: `${pathname}/detail`,
                    query: {
                      id: rows.id,
                      no: rows.demandNumber,
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
      TableColumnHelper.genLangColumn('title', '标题', { width: 160 }, 8),
      TableColumnHelper.genSelectColumn('type', '需求类型', DEMAND_TYPE, {
        sorter: true,
        width: 130,
      }),
      TableColumnHelper.genSelectColumn('status', '状态', DEMAND_STATUS, {
        sorter: true,
        width: 130,
      }),
      TableColumnHelper.genSelectColumn(
        'priority',
        '优先级',

        DEMAND_PRIORITY_ARR.map(v => ({ ...v, value: v.val })),
        { sorter: true, width: 100 },
      ),
      TableColumnHelper.genPlanColumn('acceptTeam', '受理团队', { sorter: true, width: 120 }),
      TableColumnHelper.genPlanColumn('receiverId', '受理人', { sorter: true, width: 100 }),
      TableColumnHelper.genDateTimeColumn('expectedCompletionDate', '期望完成日期', 'YYYY-MM-DD', {
        sorter: true,
        width: 140,
      }),
      TableColumnHelper.genDateTimeColumn('plannedLaunchDate', '计划上线日期', 'YYYY-MM-DD', {
        sorter: true,
        width: 140,
      }),
      TableColumnHelper.genDateTimeColumn('actualLineDate', '实际上线日期', 'YYYY-MM-DD', {
        width: 140,
      }),
      TableColumnHelper.genPlanColumn('estimatedDevelopmentEffort', '开发预计工作量', {
        width: 150,
      }),
      TableColumnHelper.genPlanColumn('estimatedTestWorkload', '测试预计工作量', { width: 150 }),
      TableColumnHelper.genPlanColumn('introducer', '需求提出人', { sorter: true, width: 140 }),
      TableColumnHelper.genPlanColumn('creator', '创建人', { sorter: true, width: 120 }),
      TableColumnHelper.genPlanColumn('createTime', '创建时间', { sorter: true, width: 140 }),
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
                    no: rows.demandNumber,
                  },
                });
              }}
            />
            <Divider type="vertical" />
            <Popover
              content={
                <AssignUser
                  userList={userList}
                  rows={rows}
                  onOk={handleAssign}
                  handleVisible={setAssignVisible}
                />
              }
              title="指派关注人"
              trigger="click"
              placement="left"
              visible={rows.id === assignVisible}
              onClick={e => e.stopPropagation()}
              onVisibleChange={visible => {
                setAssignVisible(visible && rows.id);
              }}
            >
              <OptButton
                onClick={e => e.stopPropagation()}
                img={assignIcon}
                showText={false}
                text="指派"
              />
            </Popover>
          </Fragment>
        ),
      },
    ];

    const myDemandColumns = [
      TableColumnHelper.genSelectColumn('demandUrgency', '需求紧迫性', DEMAND_LEVEL, {
        sorter: true,
        width: 140,
      }),
      TableColumnHelper.genSelectColumn(
        'riskControlFunction',
        '是否涉及业务风控功能',
        RISK_CONTROL,
        { sorter: true, width: 200 },
      ),
      TableColumnHelper.genSelectColumn('businessCompliance', '是否涉及业务合规性', RISK_CONTROL, {
        sorter: true,
        width: 180,
      }),
      TableColumnHelper.genPlanColumn('projectName', '所属项目', { sorter: true, width: 120 }),
    ];
    // 针对不是项目需求的, 放入其他几个字段
    if (demandRoutes[pathname] !== '项目需求') {
      myDemandColumns.forEach((v, i) => {
        columns.splice(12 + i, 0, v);
      });
    }

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
                  style={{ color: '#2E5BFF', cursor: 'pointer' }}
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
          render: rows => {
            const { userInfo } = storage.get('gd-user', {});
            const isDelete = userInfo?.userId === rows?.userId && !rows?.issueId;
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
                      pathname: '/demand/storyDetail',
                      query: {
                        id: rows.id,
                      },
                    });
                  }}
                />
                <Divider type="vertical" />

                <Popconfirm
                  title="确定要同步JIRA吗?"
                  onConfirm={
                    (userInfo.userId !== rows.assessor || rows?.issueId) && handleSyncStory
                  }
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
                    style={isDelete ? { color: '#d63649' } : { color: '#b0bac9' }}
                    text="删除"
                    disabled={!isDelete}
                  />
                </Popconfirm>
              </Fragment>
            );
          },
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

    const handleDemandTableChange = (pagination, filters, sorter) => {
      // const formValues = form.getFieldsValue();
      const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        // ...formValues, // 添加已查询条件去获取分页
      };
      const sortParams = {
        sortBy: sorter.columnKey,
        orderFlag: sorter.order === 'ascend' ? 1 : -1,
      };
      handleQueryDemandList({ ...params, ...sortParams });
    };

    const handleSearchForm = () => {
      const formValues = form.getFieldsValue();
      const {
        requirementDescription,
        plannedLaunchDate,
        actualLineDate,
        createTime,
        ...others
      } = formValues;
      const params = {
        ...others,
        minExpectedCompletionDate: requirementDescription
          ? requirementDescription[0].format('YYYY-MM-DD')
          : null,
        maxExpectedCompletionDate: requirementDescription
          ? requirementDescription[1].format('YYYY-MM-DD')
          : null,
        minPlannedLaunchDate: plannedLaunchDate ? plannedLaunchDate[0].format('YYYY-MM-DD') : null,
        maxPlannedLaunchDate: plannedLaunchDate ? plannedLaunchDate[1].format('YYYY-MM-DD') : null,
        minActualLineDate: actualLineDate ? actualLineDate[1].format('YYYY-MM-DD') : null,
        maxActualLineDate: actualLineDate ? actualLineDate[1].format('YYYY-MM-DD') : null,
        minCreateDate: createTime && moment.isMoment(createTime) ? createTime[1].format('YYYY-MM-DD') : null,
        maxCreateDate: createTime && moment.isMoment(createTime) ? createTime[1].format('YYYY-MM-DD') : null,
      };
      setSearchForm(obj => ({ ...obj, ...params }));
    };

    const renderForm = () => {
      const { getFieldDecorator } = form;
      const content = (
        <div className={styles.moreSearch}>
          <Row>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="所属预算">
                {getFieldDecorator('budgetNumbers')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {allBudgetList &&
                      allBudgetList.map(v => (
                        <Option value={v.id} key={v.id}>
                          {v.name}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="需求类型">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {DEMAND_TYPE_ARR.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.val}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择状态" allowClear>
                    {DEMAND_STATUS.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="优先级">
                {getFieldDecorator('priority')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {DEMAND_PRIORITY_ARR.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.val}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="需求提出人">
                {getFieldDecorator('introducer')(
                  <Select placeholder="请选择需求提出人" allowClear>
                    {userList?.list &&
                      userList?.list.map(v => (
                        <Option value={v.loginid} key={v.loginid.toString()}>
                          {v.lastname}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="受理团队">
                {getFieldDecorator('acceptTeam')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {groupList &&
                      groupList.map(v => (
                        <Option value={v.id} key={v.id}>
                          {v.name}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="受理人">
                {getFieldDecorator('receiver')(
                  <Select placeholder="请选择受理人" allowClear>
                    {userList?.list &&
                      userList?.list.map(v => (
                        <Option value={v.loginid} key={v.loginid.toString()}>
                          {v.lastname}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="需求描述">
                {getFieldDecorator('requirementDescription')(
                  <Input placeholder="请输入需求描述" />,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="期望完成日期">
                {getFieldDecorator('requirementDescription')(<RangePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="计划上线日期">
                {getFieldDecorator('plannedLaunchDate')(<RangePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="实际上线日期">
                {getFieldDecorator('actualLineDate')(<RangePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="需求紧迫性">
                {getFieldDecorator('demandUrgency')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {DEMAND_LEVEL.map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="是否涉及业务风控功能">
                {getFieldDecorator('riskControlFunction')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[
                      { key: 'y', value: '是' },
                      { key: 'n', value: '否' },
                    ].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="是否涉及业务合规性">
                {getFieldDecorator('businessCompliance')(
                  <Select placeholder="请选择项目类型" allowClear>
                    {[
                      { key: 'y', value: '是' },
                      { key: 'n', value: '否' },
                    ].map(v => (
                      <Option value={v.key} key={v.key.toString()}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <div className={styles.moreSearchButton}>
            <Button ghost type="primary" onClick={() => setSearchMore(false)}>
              取消
            </Button>
            <Button type="primary" className="margin-left-12" onClick={handleSearchForm}>
              确认
            </Button>
          </div>
        </div>
      );
      return (
        <Form layout="inline">
          <Row>
            <Col span={6}>
              <FormItem {...formLayoutItem} colon={false} label="需求标题和描述">
                {getFieldDecorator('searchKey')(
                  <Input
                    allowClear
                    onBlur={handleSearchForm}
                    placeholder="请输入需求标题或描述关键字"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formLayoutItem} colon={false} label="创建人">
                {getFieldDecorator(
                  'creatorId',
                  {},
                )(
                  <Select
                    allowClear
                    showSearch
                    onBlur={handleSearchForm}
                    // onSearch={val => handleSearch(handleQueryAllTeam({ groupName: val }))}
                    placeholder="请输入创建人"
                  >
                    {userList?.list &&
                      userList?.list.map(v => (
                        <Option value={v.loginid} key={v.loginid.toString()}>
                          {v.lastname}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formLayoutItem} colon={false} label="状态">
                {getFieldDecorator(
                  'status',
                  {},
                )(
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
            <Col span={6}>
              <FormItem {...formLayoutItem} colon={false} label="创建日期">
                {getFieldDecorator('createTime', {})(<RangePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
            <Col span={4}>
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
                  onClick={() => {
                    form.resetFields();
                    setSearchForm({});
                  }}
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

    useEffect(() => {
      handleQueryUserList();
      handleQueryBudgetList();
      handleQueryHeaderGroupList();
    }, []);

    return (
      <div className={styles.childrenTable}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{renderForm()}</div>
          <StandardTable
            rowKey="id"
            expandedRowRender={expandedRowRender}
            columns={columns}
            data={demandList}
            loading={props.loading}
            expandIcon={prop => {
              if (prop?.record?.storyList?.length < 1) return '';
              return !prop?.expanded ? (
                <span style={{ cursor: 'pointer' }}>
                  <Icon component={arrowRight} />
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }}>
                  <Icon component={arrowBottom} />
                </span>
              );
            }}
            onChange={handleDemandTableChange}
            expandRowByClick
            scroll={{ x: demandRoutes[pathname] !== '项目需求' ? 2740 : 2100 }}
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
