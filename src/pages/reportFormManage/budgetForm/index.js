import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import YearPicker from '@/components/YearPicker';
import { formLayoutItem } from '@/utils/constant';
import { Button, Card, Col, Form, Row, Select } from 'antd';

import ProjectPie from './component/approvalProjectPie';
import ConstractPie from './component/contractPie';

import styles from './index.less';
import numeral from 'numeral';
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import { PagerHelper, TableColumnHelper } from '@/utils/helper';
import OptButton from '@/components/commonUseModule/optButton';
import _ from 'lodash';
import { isEmpty } from '@/utils/lang';

const FormItem = Form.Item;
const { Option } = Select;
const Index = props => {
  const {
    form,
    dispatch,
    loading,
    budgetChart: { budgetList, budgetChartList },
  } = props;
  const [yearTime, setYearTime] = useState(moment());

  const handleQueryBudgetChartsData = params => {
    dispatch({
      type: 'budgetChart/queryBudgetChartsData',
      payload: {
        year: yearTime.format('YYYY'),
        ...params,
        clusterId: !isEmpty(params?.clusterId) ? params?.clusterId : null,
      },
    });
  };
  const handleQueryTableListData = params => {
    dispatch({
      type: 'budgetChart/queryBudgetListData',
      payload: {
        year: yearTime.format('YYYY'),
        ...PagerHelper.DefaultPage,
        ...params,
        clusterId: !isEmpty(params?.clusterId) ? params?.clusterId : null,
      },
    });
  };

  // 分页操作
  const handleStandardTableChange = (pagination, filters, sorter) => {
    const formValues = form.getFieldsValue();
    const params = {
      year: yearTime.format('YYYY'),
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };

    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    handleQueryTableListData({ ...params, ...sortParams });
  };

  const handleSearchForm = (params = {}) => {
    const formValues = form.getFieldsValue();
    handleQueryBudgetChartsData({ ...formValues, ...params });
  };

  useEffect(() => {
    handleQueryBudgetChartsData();
    handleQueryTableListData();
  }, []);

  const columns = [
    TableColumnHelper.genPlanColumn('pjCode', '项目编号', { sorter: true }),
    TableColumnHelper.genPlanColumn('pjName', '项目名称', {}),
    TableColumnHelper.genPlanColumn('estAmount', '立项金额(元)', { sorter: true }),
    TableColumnHelper.genPlanColumn('contractAmount', '合同成交金额(元)', { sorter: true }),
    TableColumnHelper.genDateTimeColumn('createTime', '项目接收日期', 'YYYY-MM-DD', {
      sorter: true,
    }),
    TableColumnHelper.genPlanColumn('name', '所属预算', { sorter: true }),
    TableColumnHelper.genPlanColumn('number', '预算编号', { sorter: true }),
    {
      title: '操作',
      align: 'center',
      render: rows => (
        <Fragment>
          <OptButton
            icon="eye"
            showText={false}
            text="查看"
            onClick={() => {
              if (!rows?.number) return;
              props.history.push({
                pathname: '/reportFormManage/budgetForm/belongBudget',
                query: {
                  id: rows?.number,
                },
              });
            }}
          />
        </Fragment>
      ),
    },
  ];

  return (
    <div className="main">
      <div className={styles.headBox}>
        <div className={styles.head_year}>
          <div className={styles.head_year_form}>
            <FormItem {...formLayoutItem} label="预算年份" colon={false}>
              <YearPicker
                value={yearTime || moment()}
                onChange={val => {
                  setYearTime(val);
                  const formValues = form.getFieldsValue();
                  const obj = {
                    ...formValues,
                    year: (moment.isMoment(val) && val.format('YYYY')) || moment().format('YYYY'),
                  };
                  handleQueryBudgetChartsData(obj);
                  handleQueryTableListData(obj);
                }}
              />
            </FormItem>
            <span className={styles.yearName}>年</span>
          </div>
          <div className={styles.budgetAmount}>
            年度总预算额:
            <span className="margin-left-8">
              {numeral(budgetChartList?.budgetTotalAmount).format('0,0')}
            </span>
          </div>
        </div>
        <Button
          type="primary"
          onClick={() => {
            const YEAR = yearTime.format('YYYY');
            props.history.push({
              pathname: '/reportFormManage/budgetForm/budgetTree',
              query: {
                YEAR,
              },
            });
          }}
        >
          树状图
        </Button>
      </div>
      <Card>
        <div className={styles.chartHead}>
          <div className={styles.module}>
            <FormItem {...formLayoutItem} label="统计模块" colon={false}>
              {form.getFieldDecorator('clusterId', {
                initialValue: '',
              })(
                <Select style={{ width: '100%' }} onChange={_.debounce(handleSearchForm, 500)}>
                  <Option value="">全部模块</Option>
                </Select>,
              )}
            </FormItem>
          </div>
          <div className={styles.period}>
            <FormItem {...formLayoutItem} label="统计周期" colon={false}>
              {form.getFieldDecorator(
                'startMonth',
                {},
              )(
                <Select
                  placeholder="请选择月份"
                  style={{ width: '100%' }}
                  onChange={_.debounce(handleSearchForm, 500)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(v => (
                    <Option value={v} key={v}>
                      {v}
                    </Option>
                  ))}
                </Select>,
              )}
              <span style={{ margin: '0 4px' }}>-</span>
              {form.getFieldDecorator(
                'endMonth',
                {},
              )(
                <Select
                  placeholder="请选择月份"
                  style={{ width: '100%' }}
                  onChange={_.debounce(handleSearchForm, 500)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(v => (
                    <Option value={v} key={v}>
                      {v}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </div>
        </div>
        <Row>
          <Col span={12}>
            <div>
              <ProjectPie budgetChartList={budgetChartList} />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ borderLeft: '1px solid #EBEEF5' }}>
              <ConstractPie budgetChartList={budgetChartList} />
            </div>
          </Col>
        </Row>
      </Card>
      <GlobalSandBox title="明细" sandboxStyle={{ marginTop: 16 }}>
        <StandardTable
          rowKey="id"
          columns={columns}
          data={budgetList}
          loading={loading}
          onChange={handleStandardTableChange}
        />
      </GlobalSandBox>
    </div>
  );
};

export default connect(({ budgetChart, loading }) => ({
  budgetChart,
  loading: loading.models.budgetChart,
}))(Form.create()(Index));
