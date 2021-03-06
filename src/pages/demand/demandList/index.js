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
  Tooltip,
} from 'antd';
import { PagerHelper, TableColumnHelper } from '@/utils/helper';
// import {MENU_ACTIONS} from "@/utils/constant";
import OptButton from '@/components/commonUseModule/optButton';
import edit from '@/assets/icon/Button_bj.svg';
import sync from '@/assets/icon/Button_tbjira.svg';
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
import _ from 'lodash';
import ListOptBtn from '@/components/commonUseModule/listOptBtn';
import eyeIcon from '@/assets/icon/cz_ck.svg';

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

    const [expandedRowId, setExpandedRowId] = useState([]);

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
    const handleAssign = ({ demandId, userId, userName }) => {
      dispatch({
        type: 'demand/assignUser',
        payload: {
          demandId,
          receiverId: userId,
          receiverName: userName,
          attentionType: 1,
        },
      }).then(result => {
        if (!result) return;
        message.success('指派成功');
        setAssignVisible(false);
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
        width: 160,
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
                {rows.demandNumber.length > 14
                  ? `${rows.demandNumber.substring(0, 14)}...`
                  : rows.demandNumber.substring(0, 14)}
              </span>
            </Tooltip>
          );
        },
      },
      TableColumnHelper.genLangColumn('title', '标题', { width: 120 }, 5),
      TableColumnHelper.genSelectColumn('type', '需求类型', DEMAND_TYPE, {
        sorter: true,
        width: 120,
      }),
      TableColumnHelper.genSelectColumn('status', '状态', DEMAND_STATUS, {
        sorter: true,
        width: 120,
      }),
      TableColumnHelper.genSelectColumn(
        'priority',
        '优先级',
        DEMAND_PRIORITY_ARR.map(v => ({ ...v, value: v.val })),
        { sorter: true, width: 100 },
      ),
      TableColumnHelper.genPlanColumn('acceptTeam', '受理团队', { sorter: true, width: 120 }),
      TableColumnHelper.genPlanColumn('receiverName', '受理人', { sorter: true, width: 100 }),
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
      TableColumnHelper.genDateTimeColumn('createTime', '创建时间', 'YYYY-MM-DD HH:mm:ss', {
        sorter: true,
        width: 180,
      }),
      {
        title: '操作',
        width: 120,
        align: 'center',
        render: rows => (
          <Fragment>
            <ListOptBtn
              title="查看"
              icon={eyeIcon}
              style={{
                fontSize: '24px',
                position: 'relative',
                top: '7px',
              }}
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
            >
              <ListOptBtn
                title="指派"
                icon={assignIcon}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  top: '3px',
                }}
                onClick={e => {
                  e.stopPropagation();
                  setAssignVisible(rows.id);
                }}
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
          title: '',
          width: 20,
          key: 'id',
          render: () => '',
        },
        {
          title: 'story编号',
          key: 'number',
          sorter: true,
          width: 200,
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
                  {rows.number.length > 15
                    ? `${rows.number.substring(0, 15)}...`
                    : rows.number.substring(0, 15)}
                </span>
              </Tooltip>
            );
          },
        },
        TableColumnHelper.genPlanColumn('title', '标题'),
        TableColumnHelper.genPlanColumn('status', '状态'),
        TableColumnHelper.genPlanColumn('priority', '优先级'),
        TableColumnHelper.genPlanColumn('type', 'story类型'),
        TableColumnHelper.genDateTimeColumn('evaluateTime', 'IT评估上线时间', 'YYYY-MM-DD', {
          width: 170,
        }),
        TableColumnHelper.genPlanColumn('developWorkload', '开发预计工作量'),
        TableColumnHelper.genPlanColumn('testWorkload', '测试预计工作量'),
        TableColumnHelper.genPlanColumn('assigneeName', '经办人'),
        TableColumnHelper.genPlanColumn('userName', '创建人'),
        TableColumnHelper.genDateTimeColumn('createTime', '创建时间', 'YYYY-MM-DD HH:mm:ss', {
          width: 210,
        }),
        {
          title: '操作',
          width: 230,
          align: 'center',
          render: rows => {
            const { userInfo } = storage.get('gd-user', {});
            const isDelete = userInfo?.userId === rows?.userId && !rows?.issueId;
            return (
              <Fragment>
                <ListOptBtn
                  title="编辑"
                  icon={edit}
                  style={{
                    color: '#2E5BFF',
                  }}
                  onClick={() => {
                    setAddModalVisible(true);
                    setSelectedRows(rows);
                  }}
                />
                <Divider type="vertical" />

                <OptButton
                  icon="eye"
                  showText={false}
                  text="查看"
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
                  <ListOptBtn
                    title="同步"
                    icon={sync}
                    style={{
                      color: '#2E5BFF',
                      width: 16,
                      fontSize: 16,
                      position: 'relative',
                      top: 3,
                    }}
                    disabled={userInfo.userId !== rows.assessor || rows?.issueId}
                    onClick={() => {
                      // setAddModalVisible(true);
                      // setSelectedRows(rows);
                    }}
                  />
                </Popconfirm>
                <Divider type="vertical" />

                <Popconfirm
                  title={`确定要删除${row.title}吗?`}
                  onConfirm={() => isDelete && handleUpdateStory(rows.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <ListOptBtn
                    title="删除"
                    icon={deleteIcon}
                    style={{ color: isDelete ? '#d63649' : '#b0bac9' }}
                    disabled={userInfo.userId !== rows.assessor || rows?.issueId}
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
          data={row.storyList}
          pagination={false}
          scroll={{ y: 550 }}
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
        expectedCompletionDate,
        plannedLaunchDate,
        actualLineDate,
        createTime,
        ...others
      } = formValues;
      const params = {
        ...others,
        minExpectedCompletionDate:
          expectedCompletionDate && expectedCompletionDate?.length > 0
            ? expectedCompletionDate[0].format('YYYY-MM-DD 00:00:00')
            : null,
        maxExpectedCompletionDate:
          expectedCompletionDate && expectedCompletionDate?.length > 0
            ? expectedCompletionDate[1].format('YYYY-MM-DD 23:59:59')
            : null,
        minPlannedLaunchDate:
          plannedLaunchDate && plannedLaunchDate?.length > 0
            ? plannedLaunchDate[0].format('YYYY-MM-DD 00:00:00')
            : null,
        maxPlannedLaunchDate:
          plannedLaunchDate && plannedLaunchDate?.length > 0
            ? plannedLaunchDate[1].format('YYYY-MM-DD 23:59:59')
            : null,
        minActualLineDate:
          actualLineDate && actualLineDate?.length > 0
            ? actualLineDate[0].format('YYYY-MM-DD 00:00:00')
            : null,
        maxActualLineDate:
          actualLineDate && actualLineDate?.length > 0
            ? actualLineDate[1].format('YYYY-MM-DD 23:59:59')
            : null,
        minCreateDate:
          createTime && createTime?.length > 0 ? createTime[0].format('YYYY-MM-DD 00:00:00') : null,
        maxCreateDate:
          createTime && createTime?.length > 0 ? createTime[1].format('YYYY-MM-DD 23:59:59') : null,
      };
      setSearchForm(obj => ({ ...obj, ...params }));
    };

    const handleExpandedRow = (rows, type) => {
      const {
        record: { id, demandNumber },
      } = rows;
      if (type === 'add') {
        dispatch({
          type: 'demand/queryStoryListByDemandNumber',
          payload: {
            demandNumber,
          },
        }).then(sure => {
          if (!sure) return;
          setExpandedRowId(arr => [...arr, id]);
        });
        return;
      }
      if (type === 'remove') {
        setExpandedRowId(arr => arr.filter(v => v !== id));
      }
    };
    const renderForm = () => {
      const { getFieldDecorator } = form;
      const content = (
        <div className={styles.moreSearch}>
          <Row>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="所属预算">
                {getFieldDecorator('budgetNumbers')(
                  <Select
                    placeholder="请选择所属预算"
                    allowClear
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
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
                  <Select
                    placeholder="请选择需求类型"
                    allowClear
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
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
              <FormItem {...formLayoutItem2} colon={false} label="优先级">
                {getFieldDecorator('priority')(
                  <Select
                    placeholder="请选择优先级"
                    allowClear
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
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
                {getFieldDecorator('introducerId')(
                  <Select
                    placeholder="请选择需求提出人"
                    allowClear
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userList?.list &&
                      userList?.list.map(v => (
                        <Option value={v.userId} key={v.userId.toString()}>
                          {v.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="受理团队">
                {getFieldDecorator('acceptTeam')(
                  <Select
                    placeholder="请选择受理团队"
                    allowClear
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
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
                  <Select
                    placeholder="请选择受理人"
                    allowClear
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userList?.list &&
                      userList?.list.map(v => (
                        <Option value={v.userId} key={v.userId.toString()}>
                          {v.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="需求描述">
                {getFieldDecorator('requirementDescription')(
                  <Input
                    onChange={_.debounce(handleSearchForm, 500)}
                    placeholder="请输入需求描述"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="期望完成日期">
                {getFieldDecorator('expectedCompletionDate')(
                  <RangePicker onChange={handleSearchForm} format="YYYY-MM-DD" />,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="计划上线日期">
                {getFieldDecorator('plannedLaunchDate')(
                  <RangePicker onChange={handleSearchForm} format="YYYY-MM-DD" />,
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formLayoutItem2} colon={false} label="实际上线日期">
                {getFieldDecorator('actualLineDate')(
                  <RangePicker onChange={handleSearchForm} format="YYYY-MM-DD" />,
                )}
              </FormItem>
            </Col>
            {demandRoutes[props.location.pathname] !== '项目需求' && (
              <Col span={24}>
                <FormItem {...formLayoutItem2} colon={false} label="需求紧迫性">
                  {getFieldDecorator('demandUrgency')(
                    <Select
                      placeholder="请选择需求紧迫性"
                      allowClear
                      onChange={_.debounce(handleSearchForm, 500)}
                    >
                      {DEMAND_LEVEL.map(v => (
                        <Option value={v.key} key={v.key.toString()}>
                          {v.value}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            )}
            {demandRoutes[props.location.pathname] !== '项目需求' && (
              <Col span={24}>
                <FormItem {...formLayoutItem2} colon={false} label="是否涉及业务风控功能">
                  {getFieldDecorator('riskControlFunction')(
                    <Select
                      placeholder="请选择是否涉及业务风控"
                      allowClear
                      onChange={_.debounce(handleSearchForm, 500)}
                    >
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
            )}
            {demandRoutes[props.location.pathname] !== '项目需求' && (
              <Col span={24}>
                <FormItem {...formLayoutItem2} colon={false} label="是否涉及业务合规性">
                  {getFieldDecorator('businessCompliance')(
                    <Select
                      placeholder="请选择是否涉及业务合规性"
                      allowClear
                      onChange={_.debounce(handleSearchForm, 500)}
                    >
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
            )}
          </Row>
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
                    onChange={_.debounce(handleSearchForm, 500)}
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
                    placeholder="请输入创建人"
                    showSearch
                    onChange={_.debounce(handleSearchForm, 500)}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      JSON.stringify(option.props.children)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userList?.list &&
                      userList?.list.map(v => (
                        <Option value={v.userId} key={v.userId.toString()}>
                          {v.userName}
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
                    placeholder="请选择状态"
                    onChange={_.debounce(handleSearchForm, 500)}
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
                {getFieldDecorator(
                  'createTime',
                  {},
                )(<RangePicker onChange={_.debounce(handleSearchForm, 500)} format="YYYY-MM-DD" />)}
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
                <Popover placement="bottomRight" content={content} trigger="click">
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
              if (Number(prop?.record?.isHaveStory) === 0) return '';
              return !prop?.expanded ? (
                <span style={{ cursor: 'pointer' }}>
                  <Icon onClick={() => handleExpandedRow(prop, 'add')} component={arrowRight} />
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }}>
                  <Icon onClick={() => handleExpandedRow(prop, 'remove')} component={arrowBottom} />
                </span>
              );
            }}
            onChange={handleDemandTableChange}
            expandedRowKeys={expandedRowId}
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
