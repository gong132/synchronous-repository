import React, {useEffect, useState, Fragment} from "react";
import { connect } from 'dva'
import {Button, Col, Divider, Form, Input, Row, Select} from "antd";
import { DefaultPage, TableColumnHelper } from '@/utils/helper'
import {formLayoutItem} from "@/utils/constant";
import StandardTable from "@/components/StandardTable";

import styles from './index.less'
import { TYPE } from "./utils/constant";
import AddForm from './component/addForm'


const FormItem = Form.Item;
const { Option } = Select;
const Index = props => {
  const { dispatch, order: { orderList }, loading, form } = props;

  // 新增/编辑显示隐藏
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // 选中行,有值时为选中某行
  const [selectedRow, setSelectedRow] = useState({});

  const handleQueryOrderList = params => {
    dispatch({
      type: 'order/fetchOrderData',
      payload: {
        ...DefaultPage,
          ...params
      },
    })
  };

  // 分页操作
  const handleStandardTableChange = pagination => {
    const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };
    handleQueryOrderList(params)
  };

  // 查询列表
  const handleSearchForm = () => {
    const formValues = form.getFieldsValue();
    handleQueryOrderList(formValues)
  };

  // 重置列表
  const handleResetForm = () => {
    form.resetFields();
    handleQueryOrderList()
  };

  // 关闭Modal
  const handleCloseModalVisible = () => {
    setAddModalVisible(false);
    setDetailModalVisible(false);
    setSelectedRow({})
  }

  useEffect(() => {
    handleQueryOrderList()
  }, []);

  const columns = [
    {
      title: '序号',
      key: (text, rows, index) => `${rows.id}-${index}`,
      render: (text, rows, index) => index + 1,
    },
    TableColumnHelper.genPlanColumn('id', 'ID'),
    TableColumnHelper.genNewlineColumn('title', '标题', 12,{ align: 'left'}),
    TableColumnHelper.genEllipsisColumn('description', '描述', 12, { align: 'left'}),
    TableColumnHelper.genPlanColumn('extra', '阶段'),
    TableColumnHelper.genPlanColumn('status', '状态'),
    TableColumnHelper.genSelectColumn('type', '类型', TYPE),
    TableColumnHelper.genMoneyColumn('account', '总额'),
    {
      title: '操作',
      render: rows => (
        <Fragment>
          <a onClick={() => { setAddModalVisible(true); setSelectedRow(rows) }}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => { setDetailModalVisible(true); setSelectedRow(rows) }}>查看</a>
        </Fragment>
      )
    }
  ]

  // 箭头函数直接返回值时, 直接省略 return;
  const renderForm = () => (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem {...formLayoutItem} label="订单ID">
            {form.getFieldDecorator('id',{
              // rules: [{required: true, message: '请选择类型'}]
            })(<Input placeholder="请输入订单ID"/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formLayoutItem} label="订单类型">
            {form.getFieldDecorator('type',{
              // rules: [{required: true, message: '请选择类型'}]
              // initialValue: '',
            })(<Select
              placeholder="请选择订单类型"
            >
              {
                TYPE.map(({value, key}) => (
                  <Option value={key} key={key.toString()}>{value}</Option>
                ))
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <Button
            ghost
            className="margin-right-12"
            type="primary"
            onClick={() => setAddModalVisible(true)}
          >
            新建订单
          </Button>
          <Button
            ghost
            className="margin-right-12"
            type="primary"
            onClick={handleSearchForm}
          >
            查询
          </Button>
          <Button ghost type="danger" onClick={handleResetForm}>重置</Button>
        </Col>
      </Row>
    </Form>
  );


  return (
    <div className="main">
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{renderForm()}</div>
        <StandardTable
          rowKey="id"
          loading={loading}
          data={orderList}
          columns={columns}
          onChange={handleStandardTableChange}
        />
      </div>

      {
        addModalVisible && (
          <AddForm
            modalVisible={addModalVisible}
            handleModalVisible={handleCloseModalVisible}
            values={selectedRow}
          />
        )
      }
    </div>
  )
};

export default connect(
  ({
     order,
    loading,
  }) => ({
    order,
    loading: loading.models.order
  }))(Form.create()(Index))
