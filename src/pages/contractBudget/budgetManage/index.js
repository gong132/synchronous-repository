import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from "moment";
import classNames from 'classnames';
import { DefaultPage, TableColumnHelper } from '@/utils/helper';
import StandardTable from '@/components/StandardTable';
import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Tooltip,
  DatePicker,
  Icon,
  Card, Divider,
} from 'antd';
import { isEmpty } from '@/utils/lang';
import { formLayoutItem, formLayoutItem2, MENU_ACTIONS } from '@/utils/constant';
import { BUDGET_TYPE, PROJECT_TYPE } from '@/pages/contractBudget/util/constant';
import OptButton from '@/components/commonUseModule/optButton';
import YearPicker from '@/components/YearPicker';
import edit from '@/assets/icon/Button_bj.svg';
import upIcon from '@/assets/icon/Pull_up.svg';
import bottomIcon from '@/assets/icon/drop_down.svg';

import AddForm from './addForm';
import styles from '../index.less';
import { exportExcel } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

let timeout;
const Index = props => {
  const {
    dispatch,
    loading,
    form,
    global: { authActions },
    budgetManage: { budgetList },
  } = props;

  // 查询更多
  const [searchMore, setSearchMore] = useState(false);
  // 新增/编辑
  const [addModalVisible, setAddModalVisible] = useState(false);
  // 选中行
  const [selectedRows, setSelectedRows] = useState({});
  const [teamList, setTeamList] = useState([]);
  const [allDeptList, setAllDeptList] = useState([]);

  const [yearTime, setYearTime] = useState(null);

  const handleQueryBudgetData = params => {
    dispatch({
      type: 'budgetManage/fetchBudgetData',
      payload: {
        ...DefaultPage,
        ...params,
      },
    });
  };

  const columns = [
    {
      title: '预算编号',
      key: 'number',
      sorter: true,
      render: rows => {
        if (isEmpty(rows.number, true)) return '';
        return (
          <Tooltip placement="top" title={rows.number}>
            <span
              style={{ color: '#2E5BFF' }}
              onClick={() => {
                props.history.push({
                  pathname: '/contract-budget/budget/detail',
                  query: {
                    id: rows.id,
                  },
                });
              }}
            >
              {rows.number.length > 10
                ? `${rows.number.substring(0, 10)}...`
                : rows.number.substring(0, 10)}
            </span>
          </Tooltip>
        );
      },
    },
    TableColumnHelper.genSelectColumn('type', '项目类型', PROJECT_TYPE, { sorter: true }),
    TableColumnHelper.genLangColumn('name', '預算名称', { sorter: true }, 4),
    TableColumnHelper.genPlanColumn('userName', '录入人', { sorter: true }),
    TableColumnHelper.genDateTimeColumn('createTime', '录入时间', 'YYYY-MM-DD', { sorter: true }),
    TableColumnHelper.genPlanColumn('deptName', '需求部门', { sorter: true }),
    TableColumnHelper.genLangColumn('clusterName', '集群或板块', { sorter: true, width: 150 }, 4),
    TableColumnHelper.genDateTimeColumn('expectSetTime', '预计立项时间', 'YYYY-MM-DD', {
      sorter: true,
      width: 170,
    }),
    TableColumnHelper.genMoneyColumn('expectTotalAmount', '预算总金额', { sorter: true, width: 150 }),
    TableColumnHelper.genMoneyColumn('hardwareExpectAmount', '硬件预算金额', { sorter: true, width: 170 }),
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: rows => (
        <Fragment>
          {authActions.includes(MENU_ACTIONS.EDIT) && (
            <OptButton
              img={edit}
              showText={false}
              text="编辑"
              onClick={() => {
                setAddModalVisible(true);
                setSelectedRows(rows);
              }}
            />
          )}
          <Divider type="vertical" />
          {authActions.includes(MENU_ACTIONS.CHECK) && (
            <OptButton
              icon="eye"
              text="查看"
              showText={false}
              onClick={() => {
                props.history.push({
                  pathname: '/contract-budget/budget/detail',
                  query: {
                    id: rows.id,
                  },
                });
              }}
            />
          )}
        </Fragment>
      ),
    },
  ];
  // 分页操作
  const handleStandardTableChange = (pagination, filters, sorter) => {
    const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };

    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    handleQueryBudgetData({ ...params, ...sortParams });
  };

  const handleResetForm = () => {
    setSearchMore(true);
    form.resetFields();
    setYearTime(null)
    setSearchMore(false);
    handleQueryBudgetData();
  };

  const handleSearchForm = params=> {
    const formValues = form.getFieldsValue();
    handleQueryBudgetData({ ...formValues, ...params });
  };

  const handleDownLoad = () => {
    const formValues = form.getFieldsValue();
    const params = {
      ...formValues,
    };
    const exportUrl = '/budget/export';
    exportExcel(params, exportUrl, 'post', '预算管理表.xls');
  };

  const handleQueryClusterList = () => {
    dispatch({
      type: 'budgetManage/queryClusterList',
      payload: {},
    });
  };
  const handleQueryAllTeam = params => {
    dispatch({
      type: 'budgetManage/queryAllTeam',
      payload: {
        ...params,
      },
    }).then(data => {
      if (!data) return;
      setTeamList(data);
    });
  };
  const handleQueryDeptList = value => {
    dispatch({
      type: 'budgetManage/queryAllDeptList',
      payload: {
        deptName: value,
      },
    }).then(data => {
      if (!data) return;
      setAllDeptList(data);
    });
  };

  useEffect(() => {
    handleQueryBudgetData();
    handleQueryClusterList();
    handleQueryAllTeam();
    handleQueryDeptList();
  }, []);

  const handleSearch = fn => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(fn && fn(), 300);
  };

  const renderForm = () => {
    const { getFieldDecorator } = form;
    const content = (
      <div className={styles.moreSearch} style={{ width: 268 }}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="项目类型">
              {getFieldDecorator(
                'type',
                {},
              )(
                <Select placeholder="请选择项目类型" allowClear>
                  {PROJECT_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="预计立项时间">
              {getFieldDecorator(
                'expectSetTime',
                {},
              )(<DatePicker allowClear format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'expectTotalAmountLow',
                  {},
                )(<Input allowClear addonAfter="万" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'expectTotalAmountMax',
                  {},
                )(<Input allowClear addonAfter="万" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="硬件预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'hardwareExpectAmountLow',
                  {},
                )(<Input allowClear addonAfter="万" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'hardwareExpectAmountMax',
                  {},
                )(<Input allowClear addonAfter="万" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="软件预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'softwareExpectAmountLow',
                  {},
                )(<Input allowClear addonAfter="万" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'softwareExpectAmountMax',
                  {},
                )(<Input allowClear addonAfter="万" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="其他预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'otherExpectAmountLow',
                  {},
                )(<Input allowClear addonAfter="万" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'otherExpectAmountMax',
                  {},
                )(<Input allowClear addonAfter="万" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="项目类型">
              {getFieldDecorator(
                'type',
                {},
              )(
                <Select allowClear>
                  {PROJECT_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="预算类型">
              {getFieldDecorator(
                'budgetType',
                {},
              )(
                <Select allowClear>
                  {BUDGET_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="承建团队">
              {getFieldDecorator(
                'receiveTeamId',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onSearch={val => handleSearch(handleQueryAllTeam({ deptName: val }))}
                >
                  {teamList &&
                    teamList.map(v => (
                      <Option value={v.id} key={v.id.toString()}>
                        {v.name}
                      </Option>
                    ))}
                </Select>,
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
          <Col span={5}>
            <FormItem {...formLayoutItem} label="预算编号" colon={false}>
              {getFieldDecorator(
                'number',
                {},
              )(<Input allowClear onBlur={handleSearchForm} placeholder="请输入预算编号" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="项目名称" colon={false}>
              {getFieldDecorator(
                'name',
                {},
              )(<Input allowClear onBlur={handleSearchForm} placeholder="请输入项目名称" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="需求部门" colon={false}>
              {getFieldDecorator(
                'deptId',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onBlur={handleSearchForm}
                  onSearch={val => handleSearch(handleQueryAllTeam({ groupName: val }))}
                  placeholder="请输入需求部门"
                >
                  {allDeptList &&
                    allDeptList.map(v => (
                      <Option value={v.id} key={v.id.toString()}>
                        {v.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="预算年度" colon={false}>
              <YearPicker
                value={yearTime}
                onChange={val => {
                  setYearTime(val)
                  handleSearchForm({year: moment.isMoment(val) && val.format("YYYY") || null})
                }}
              />
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
    <div className="main">
      <div style={{ marginBottom: 12 }} className="yCenter-between">
        {authActions.includes(MENU_ACTIONS.ADD) && (
          <Button className={styles.addForm} icon="plus" onClick={() => setAddModalVisible(true)}>
            新建
          </Button>
        )}
        {authActions.includes(MENU_ACTIONS.EXPORT) && (
          <Button type="default" onClick={handleDownLoad}>
            导出
          </Button>
        )}
      </div>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{renderForm()}</div>
        <Card bordered={false}>
          <StandardTable
            rowKey="id"
            loading={loading}
            data={budgetList}
            columns={columns}
            onChange={handleStandardTableChange}
            scroll={{ x: 1500 }}
          />
        </Card>
        {addModalVisible && (
          <AddForm
            modalVisible={addModalVisible}
            handleModalVisible={() => {
              setAddModalVisible(false);
              setSelectedRows({});
            }}
            handleQueryBudgetData={handleQueryBudgetData}
            values={selectedRows}
          />
        )}
      </div>
    </div>
  );
};

export default connect(({ budgetManage, global, loading }) => ({
  budgetManage,
  global,
  loading: loading.models.budgetManage,
}))(Form.create()(Index));
