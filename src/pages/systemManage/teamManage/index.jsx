import React, { Component, Fragment } from 'react'
import { connect } from 'dva'
import CustomBtn from '@/components/commonUseModule/customBtn'
import { formLayoutItem, MENU_ACTIONS } from '@/utils/constant'
import StandardTable from "@/components/StandardTable";
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import { TableColumnHelper, DefaultPage } from "@/utils/helper";
import eyeIcon from '@/assets/icon/cz_ck.svg'
import { router } from 'umi'
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Card,
} from 'antd'
import _ from 'lodash'
import styles from './index.less'

const FormItem = Form.Item
const { Option } = Select
@Form.create()
@connect(({ teamManage, loading, global }) => ({
  global,
  teamManage,
  loadingQueryTeamData: loading.effects['teamManage/fetchTeamData']
}))
class TeamManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {},
      searchParams: {}
    }
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500);
  }

  componentDidMount() {
    this.handleQueryData()
  }

  handleQueryData = (params = {}) => {
    const { searchParams } = this.state;
    this.props.dispatch({
      type: 'teamManage/fetchTeamData',
      payload: {
        ...DefaultPage,
        ...params,
        ...searchParams,
      },
    });
  };

  // 搜索时防抖
  handleDebounceQueryData = () => {
    this.handleQueryData();
  };

  handleResetSearch = () => {
    this.setState(
      {
        searchParams: {},
      },
      () => this.handleQueryData(),
      500,
    );
  }

  saveParams = (val, type) => {
    const { searchParams } = this.state;
    const obj = searchParams;
    if (type === 'deptInfo') {
      obj[type] = val;
    } else if (type === 'name' || type === 'id') {
      obj[type] = val.target.value;
    }
    this.setState(
      {
        searchParams: obj,
      },
      () => this.handleDebounceQueryData(),
    );
  };

  handleViewModal = (bool, record = {}) => {
    this.setState({
      modalVisible: bool,
      record,
    });
  };

  // 查看详情
  handleViewDetail = record => {
    router.push({
      pathname: '/systemManage/teamManage/detail',
      query: {
        teamId: record.id,
      },
    });
  };

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      console.log(values);
    });
  };

  handleChangeChecked = checkedValues => {
    console.log('checked = ', checkedValues);
  };

  // 分页操作
  handleStandardTableChange = (pagination, filters, sorter) => {
    // const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues, // 添加已查询条件去获取分页
    };
    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === "ascend" ? 1 : -1,
    };

    this.handleQueryData({ ...params, ...sortParams })
  };

  renderSearchForm = () => {
    const { form: { getFieldDecorator }, loadingQueryTeamData } = this.props;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={6}>
          <FormItem {...formLayoutItem} labelCol={{ span: 5 }} colon={false} label="团队ID">
            {getFieldDecorator('id', {
            })(<Input
              allowClear
              onChange={e => this.saveParams(e, 'id')}
              placeholder='请输入团队ID'
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="团队名称">
            {getFieldDecorator('name', {
            })(<Input
              allowClear
              onChange={e => this.saveParams(e, 'name')}
              placeholder='请输入团队名称'
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="团队经理">
            {getFieldDecorator('headerId', {
            })(
              <Select
                placeholder='请输入团队经理'
                style={{
                  width: '100%'
                }}
              >
                <Option key='1' value='1'>未定义</Option>
                <Option key='2' value='2'>未定义</Option>
              </Select>)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              loading={loadingQueryTeamData}
              // style={{
              //   display: 'inline-block',
              //   marginRight: '5rem'
              // }}
              type='reset'
            />
            {/* <Button>重置</Button> */}
          </FormItem>
        </Col>
      </Row>
    );
  };

  genColumns = () => {
    const { global: { authActions } } = this.props
    const columns = [
      TableColumnHelper.genPlanColumn('id', '团队ID'),
      TableColumnHelper.genPlanColumn('name', '团队名称'),
      TableColumnHelper.genPlanColumn('teamHeaderName', '团队经理'),
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              {authActions.includes(MENU_ACTIONS.CHECK)
                && <ListOptBtn
                  title="查看"
                  onClick={() => this.handleViewDetail(record)}
                  style={{
                    fontSize: '24px',
                    position: 'relative',
                    top: '6px'
                  }}
                  icon={eyeIcon}
                />
              }
            </div>
          );
        },
      },
    ];
    return columns;
  };

  renderEditModal = () => {
    const { modalVisible, record } = this.state;
    const { form } = this.props;
    const { name, account } = record;
    const data = count => {
      const arr = [];
      Array(count).map((v, i) => {
        const a = {
          id: i.toString(),
          roleName: `角色${i}`,
        };
        arr.push(a);
        return true;
      });
      console.log(arr, 'v')
      return arr;
    };
    return (
      <Modal
        title="编辑"
        visible={modalVisible}
        maskClosable={false}
        onCancel={() => this.handleViewModal(false)}
        width="794px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CustomBtn
              onClick={() => this.handleViewModal(false)}
              type="cancel"
              style={{ marginRight: '18px' }}
            />
            <CustomBtn onClick={() => this.handleSubmit()} type="save" />
          </div>
        }
      >
        <Row>
          <Col span={24}>
            <FormItem label="姓名" labelCol={{ span: 2 }} wrapperCol={{ span: 8 }}>
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名!' }],
                initialValue: name,
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="工号" labelCol={{ span: 2 }} wrapperCol={{ span: 8 }}>
              {form.getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入工号!' }],
                initialValue: account,
              })(<Input placeholder="请输入工号" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="角色" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <div
                style={{
                  border: '1px solid #EBEEF5',
                  borderRadius: '2px',
                  padding: '16px',
                }}
              >
                {form.getFieldDecorator('role', {
                  rules: [{ required: true, message: '请至少选择一个角色！' }],
                  initialValue: ['0', '6'],
                })(
                  <Checkbox.Group style={{ width: '100%' }} onChange={this.handleChangeChecked}>
                    <Row>
                      {data(18).map(v => (
                        <Col key={v.id} span={4}>
                          <Checkbox key={v.id} value={v.id}>
                            {v.roleName}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>,
                )}
              </div>
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  };

  render() {
    const { teamManage, loadingQueryTeamData } = this.props
    const {
      teamList
    } = teamManage
    return (
      <Fragment>
        {this.renderEditModal()}
        <div className={styles.customSearchForm}>{this.renderSearchForm()}</div>
        <Card>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={teamList}
            loading={loadingQueryTeamData}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}

export default TeamManage;
