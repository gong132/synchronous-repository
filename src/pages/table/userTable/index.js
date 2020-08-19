import React, { Fragment, PureComponent } from "react";
import { connect } from 'dva'
import { Button, Col, Divider, Form, Input, Row, Select } from "antd";
import { DefaultPage, TableColumnHelper } from '@/utils/helper'
import { formLayoutItem } from "@/utils/constant";
import StandardTable from "@/components/StandardTable";

import styles from './index.less'
import { TYPE } from "./utils/constant";
import AddForm from './component/addForm'
import Details from './component/details'


const FormItem = Form.Item;
const { Option } = Select;
class Index extends PureComponent{
  columns = [
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
          <a onClick={() =>this.handleModalVisible('addModalVisible', rows)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible('detailModalVisible', rows)}>查看</a>
        </Fragment>
      )
    }
  ];
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false, // 新增/编辑显示隐藏
      detailModalVisible: false, // 详情显示隐藏
      selectedRow: {}, // 选中行,有值时为选中某行
    }
  }

  handleQueryOrderList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/fetchOrderData',
      payload: {
        ...DefaultPage,
        ...params
      },
    })
  };

  componentDidMount() {
    this.handleQueryOrderList()
  }

  // 分页操作
  handleStandardTableChange = pagination => {
    const { form } = this.props
    const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryOrderList(params)
  };

  // 查询列表
  handleSearchForm = () => {
    const { form } = this.props
    const formValues = form.getFieldsValue();
    this.handleQueryOrderList(formValues)
  };

  // 重置列表
  handleResetForm = () => {
    const { form } = this.props
    form.resetFields();
    this.handleQueryOrderList()
  };

  // 各modal操作 第一个参数 modal名, 第二个参数 选中值
  handleModalVisible = (modalName, rows) => {
    this.setState({
      [modalName]: !!rows,
      selectedRow: rows || {}
    })
  }

  // 箭头函数直接返回值时, 直接省略 return;
  renderForm (){
    const { form } = this.props
    return <Form layout="inline">
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
            onClick={() => this.handleModalVisible('addModalVisible', {})}
          >
            新建订单
          </Button>
          <Button
            ghost
            className="margin-right-12"
            type="primary"
            onClick={this.handleSearchForm}
          >
            查询
          </Button>
          <Button ghost type="danger" onClick={this.handleResetForm}>重置</Button>
        </Col>
      </Row>
    </Form>
  }

render () {
  const { order: { orderList }, loading } = this.props;
  const { addModalVisible, detailModalVisible, selectedRow } = this.state;
  return (
    <div className={styles.main}>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <StandardTable
          rowKey="id"
          loading={loading}
          data={orderList}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
      </div>

      {
        addModalVisible && (
          <AddForm
            modalVisible={addModalVisible}
            handleModalVisible={() => this.handleModalVisible("addModalVisible")}
            values={selectedRow}
          />
        )
      }
      {
        detailModalVisible && (
          <Details
            modalVisible={detailModalVisible}
            handleModalVisible={() => this.handleModalVisible("detailModalVisible")}
            values={selectedRow}
          />
        )
      }
    </div>
  )
}}

export default connect(
  ({
     order,
     loading,
   }) => ({
    order,
    loading: loading.models.order
  }))(Form.create()(Index))
