import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { DefaultPage, PagerHelper, TableColumnHelper } from '@/utils/helper';
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
  Card,
  message,
} from 'antd';
import { isEmpty } from '@/utils/lang';
import { formLayoutItem, formLayoutItem2, MENU_ACTIONS } from '@/utils/constant';
import { BUDGET_TYPE, PROJECT_TYPE } from '@/pages/contractBudget/util/constant';
import YearPicker from '@/components/YearPicker';
// import edit from '@/assets/icon/Button_bj.svg';
import upIcon from '@/assets/icon/Pull_up.svg';
import bottomIcon from '@/assets/icon/drop_down.svg';

import AddForm from './addForm';
import styles from '../index.less';
import { exportExcel } from '@/utils/utils';
import moment from 'moment';
import _ from 'lodash';
import ListOptBtn from '@/components/commonUseModule/listOptBtn';
import eyeIcon from '@/assets/icon/cz_ck.svg';

const FormItem = Form.Item;
const { Option } = Select;

let timeout;
const Index = props => {
  const {
    dispatch,
    loading,
    form,
    global: { authActions },
    budgetManage: { budgetList, clusterList },
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
  const handleQueryClusterList = params => {
    dispatch({
      type: 'budgetManage/queryClusterList',
      payload: {
        ...PagerHelper.MaxPage,
        ...params,
      },
    });
  };

  const columns = [
    {
      title: '预算编号',
      key: 'number',
      width: 120,
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
    TableColumnHelper.genLangColumn('name', '预算名称', { sorter: true, width: 120 }, 8),
    TableColumnHelper.genLangColumn(
      'clusterName',
      '所属集群/板块',
      { sorter: true, width: 150 },
      6,
    ),
    TableColumnHelper.genLangColumn('deptName', '需求部门', { sorter: true, width: 120 }, 8),
    TableColumnHelper.genSelectColumn('type', '项目类型', PROJECT_TYPE, {
      sorter: true,
      width: 120,
    }),
    TableColumnHelper.genMoneyColumn(
      'expectTotalAmount',
      '预算总金额(万)',
      { sorter: true, width: 150 },
      '',
    ),
    TableColumnHelper.genMoneyColumn(
      'hardwareExpectAmount',
      '硬件预算金额(万)',
      { sorter: true, width: 170 },
      '',
    ),
    TableColumnHelper.genMoneyColumn(
      'softwareExpectAmount',
      '软件预算金额(万)',
      { sorter: true, width: 170 },
      '',
    ),
    TableColumnHelper.genMoneyColumn(
      'otherExpectAmount',
      '其他预计金额(万)',
      { sorter: true, width: 170 },
      '',
    ),
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: rows => (
        <Fragment>
          {/* {authActions.includes(MENU_ACTIONS.EDIT) && (
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
          <Divider type="vertical" /> */}
          {authActions.includes(MENU_ACTIONS.CHECK) && (
            <ListOptBtn
              title="查看"
              icon={eyeIcon}
              style={{
                fontSize: '24px',
                position: 'relative',
                top: '5px',
              }}
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
    form.resetFields();
    setYearTime(null);
    handleQueryBudgetData();
  };

  const handleSearchForm = (params = {}) => {
    const { expectSetTime, ...others } = form.getFieldsValue();
    const {
      expectTotalAmountLow,
      expectTotalAmountMax,
      hardwareExpectAmountLow,
      hardwareExpectAmountMax,
      softwareExpectAmountLow,
      softwareExpectAmountMax,
      otherExpectAmountLow,
      otherExpectAmountMax,
    } = others;

    // 除此之外还可以利用函数arguments类数组对象来生成数组,判断是否违规后再返回状态.
    const judgeIsNumber = a => b => c => d => e => g => f => h => {
      const isNaNCount = val => {
        if (!val) return true;
        if (val && Number.isNaN(Number(val))) return false;
        if (val && Number(val) < 0) return false;
        return true;
      };
      return (
        isNaNCount(a) &&
        isNaNCount(b) &&
        isNaNCount(c) &&
        isNaNCount(d) &&
        isNaNCount(e) &&
        isNaNCount(f) &&
        isNaNCount(g) &&
        isNaNCount(h)
      );
    };
    if (
      !judgeIsNumber(expectTotalAmountLow)(expectTotalAmountMax)(hardwareExpectAmountLow)(
        hardwareExpectAmountMax,
      )(softwareExpectAmountLow)(softwareExpectAmountMax)(otherExpectAmountLow)(
        otherExpectAmountMax,
      )
    ) {
      message.error('金额必须为正数');
      return;
    }
    if (
      expectTotalAmountLow &&
      expectTotalAmountMax &&
      Number(expectTotalAmountLow) - Number(expectTotalAmountMax) > 0
    ) {
      message.error('最小预算总金额不能大于最大预算金额');
      return;
    }
    if (
      hardwareExpectAmountLow &&
      hardwareExpectAmountMax &&
      Number(hardwareExpectAmountLow) - Number(hardwareExpectAmountMax) > 0
    ) {
      message.error('最小硬件金额不能大于最大硬件金额');
      return;
    }
    if (
      hardwareExpectAmountLow &&
      softwareExpectAmountMax &&
      Number(softwareExpectAmountLow) - Number(softwareExpectAmountMax) > 0
    ) {
      message.error('最小软件金额不能大于最大软件金额');
      return;
    }
    if (
      otherExpectAmountLow &&
      otherExpectAmountMax &&
      Number(otherExpectAmountLow) - Number(otherExpectAmountMax) > 0
    ) {
      message.error('最小其他金额不能大于最大其他金额');
      return;
    }

    const { year = yearTime && moment.isMoment(yearTime) && yearTime.format('YYYY') } = params;
    const formValues = {
      ...others,
      expectSetStartTime: !isEmpty(expectSetTime) ? expectSetTime[0].format('YYYY-MM-DD') : null,
      expectSetEndTime: !isEmpty(expectSetTime) ? expectSetTime[1].format('YYYY-MM-DD') : null,
      year: year || null,
    };
    handleQueryBudgetData(formValues);
  };

  const handleDownLoad = () => {
    const formValues = form.getFieldsValue();
    const params = {
      ...formValues,
    };
    const exportUrl = '/budget/export';
    exportExcel(params, exportUrl, 'post', '预算管理表.xls');
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
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={_.debounce(handleSearchForm, 500)}
                  placeholder="请选择项目类型"
                  allowClear
                >
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
              )(
                <DatePicker.RangePicker
                  onChange={_.debounce(handleSearchForm, 500)}
                  allowClear
                  format="YYYY-MM-DD"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'expectTotalAmountLow',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'expectTotalAmountMax',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="硬件预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'hardwareExpectAmountLow',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'hardwareExpectAmountMax',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="软件预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'softwareExpectAmountLow',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'softwareExpectAmountMax',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="其他预算总金额">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'otherExpectAmountLow',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'otherExpectAmountMax',
                  {},
                )(
                  <Input onChange={_.debounce(handleSearchForm, 500)} allowClear addonAfter="万" />,
                )}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="项目描述">
              {getFieldDecorator(
                'description',
                {},
              )(
                <Input onChange={_.debounce(handleSearchForm, 500)} placeholder="请输入项目描述" />,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="预算类型">
              {getFieldDecorator(
                'budgetType',
                {},
              )(
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={_.debounce(handleSearchForm, 500)}
                  placeholder="请选择预算类型"
                  allowClear
                >
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
                  placeholder="请选择承建团队"
                  onChange={_.debounce(handleSearchForm, 500)}
                  onSearch={val => handleSearch(handleQueryAllTeam({ deptName: val }))}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
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
      </div>
    );
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="预算名称" colon={false}>
              {getFieldDecorator(
                'name',
                {},
              )(
                <Input
                  allowClear
                  onChange={_.debounce(handleSearchForm, 500)}
                  placeholder="请输入预算名称"
                />,
              )}
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
                  onChange={_.debounce(handleSearchForm, 500)}
                  onSearch={val => handleSearch(handleQueryAllTeam({ groupName: val }))}
                  placeholder="请输入需求部门"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
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
            <FormItem {...formLayoutItem} label="所属集群/板块" colon={false}>
              {getFieldDecorator(
                'clusterId',
                {},
              )(
                <Select
                  allowClear
                  showSearch
                  onChange={_.debounce(handleSearchForm, 500)}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入所属集群或板块"
                >
                  {clusterList &&
                    clusterList.map(v => (
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
                  setYearTime(val);
                  handleSearchForm({ year: (moment.isMoment(val) && val.format('YYYY')) || null });
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
  return (
    <div className="main">
      <div style={{ marginBottom: 12 }} className="yCenter-between">
        {/* {authActions.includes(MENU_ACTIONS.ADD) && (
          <Button className={styles.addForm} icon="plus" onClick={() => setAddModalVisible(true)}>
            新建
          </Button>
        )} */}
        <div />
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
            scroll={{ x: 1390 }}
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
