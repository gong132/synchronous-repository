import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import CustomBtn from '@/components/commonUseModule/customBtn';
import { formLayoutItem } from '@/utils/constant';
import editIcon from '@/assets/icon/cz_bj.svg';
import _ from 'lodash'
import StandardTable from '@/components/StandardTable';
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import { TableColumnHelper, DefaultPage } from '@/utils/helper';
import { Modal, Form, Input, Select, Row, Col, Checkbox, Card } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ userManage, loading }) => ({
  userManage,
  groupMap: userManage.groupMap,
  groupList: userManage.groupList,
  roleDataMap: userManage.roleDataMap,
  loadingQueryUserData: loading.effects['userManage/fetchUserData'],
}))
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {},
    };
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500);
  }

  componentDidMount() {
    this.handleQueryData()
    this.handleQueryRoleData()
    this.handleQueryGroup()
  }

  // 搜索框查团队
  handleSearchTeam = (name) => {
    this.handleQueryGroup({ name })
  }

  // 查询负责人和团队
  handleQueryGroup = (params) => {
    this.props.dispatch({
      type: 'userManage/fetchHeaderGroup',
      payload: {
        ...params
      }
    });
  };

  // 获取角色
  handleQueryRoleData = () => {
    this.props.dispatch({
      type: 'userManage/queryAllRoles',
      payload: {
        ...DefaultPage,
      }
    })
  };

  handleQueryData = (params) => {
    this.props.dispatch({
      type: 'userManage/fetchUserData',
      payload: {
        ...DefaultPage,
        ...params,
      }
    })
  };

  // 模糊查询
  moreQuery = () => {
    const formValues = this.props.form.getFieldsValue();
    if(formValues.teamId) {
      formValues.teamId = Number(formValues.teamId)
    }
    this.handleDebounceQueryData(formValues);
  };

  // 搜索时防抖
  handleDebounceQueryData = params => {
    this.handleQueryData(params);
  };

  handleResetSearch = () => {
    this.props.form.resetFields()
    this.handleDebounceQueryData()
  };

  handleViewModal = (bool, record = {}) => {
    this.setState({
      modalVisible: bool,
      record,
    });
    if (bool) {
      this.props.dispatch({
        type: 'userManage/queryRoleById',
        payload: {
          userId: record.userId
        }
      })
    }
  };

  handleSubmit = () => {
    const { record } = this.state
    const { id, userName, userId } = record
    this.props.form.validateFields((err, values) => {
      if (err) return;
      values.id = id
      values.userName=userName
      values.userId=userId
      this.props.dispatch({
        type: 'userManage/updateUser',
        payload: {
          ...values
        }
      }).then(res => {
        if (res) {
          this.moreQuery()
          this.setState({
            modalVisible: false
          })
        }
      })
    });
  };

  // 分页操作
  handleStandardTableChange = (pagination) => {
    const formValues = this.props.form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryData(params);
  };

  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
      groupList,
      userManage
    } = this.props;
    const { roleData } = userManage
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="搜索人员">
            {getFieldDecorator('idOrName', {})(<Input onChange={_.debounce(this.moreQuery, 500)} allowClear placeholder="请输入姓名或工号" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="用户角色">
            {getFieldDecorator(
              'roleId',
              {},
            )(
              <Select
                allowClear
                showSearch
                onSearch={_.debounce(this.handleSearchTeam, 500)}
                onChange={_.debounce(this.moreQuery, 500)}
                // onInputKeyDown={_.debounce(this.moreQuery)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder="请输入用户角色"
                style={{
                  width: '100%'
                }}
              >
                {!_.isEmpty(roleData) &&
                  roleData.map(d => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.roleName}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="所属团队">
            {getFieldDecorator(
              'teamId',
              {},
            )(
              <Select
                allowClear
                showSearch
                onSearch={_.debounce(this.handleSearchTeam, 500)}
                onChange={_.debounce(this.moreQuery, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder="请输入所属团队"
                style={{
                  width: '100%'
                }}
              >
                {!_.isEmpty(groupList) &&
                  groupList.map(d => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.name}
                    </Select.Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              style={{
                display: 'inline-block',
                marginRight: '5rem',
              }}
              type="reset"
            />
          </FormItem>
        </Col>
      </Row>
    );
  };

  genColumns = () => {
    const { groupMap, roleDataMap } = this.props
    const columns = [
      TableColumnHelper.genPlanColumn('userName', '姓名', {align: 'left'}),
      TableColumnHelper.genPlanColumn('userId', '工号', {align: 'left'}),
      {
        title: '用户角色',
        dataIndex: 'roles',
        key: 'roles',
        render: (text) => {
          if (_.isEmpty(text)) {
            return false
          }
          let str = ''
          text.map(v => {
            str += `${v.roleName} `
            return true
          })
          return str
        }
      },
      {
        title: '所属团队',
        dataIndex: 'teamId',
        key: 'teamId',
        render: (text) => groupMap[text]
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <ListOptBtn
                title="编辑"
                onClick={() => this.handleViewModal(true, record)}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  top: '6px'
                }}
                icon={editIcon}
              />
            </div>
          );
        },
      },
    ];
    return columns;
  };

  renderEditModal = () => {
    const { modalVisible, record } = this.state;
    const { form, userManage } = this.props;
    const { userName, userId } = record;
    const { roleData, checkRole } = userManage
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
              {userName}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="工号" labelCol={{ span: 2 }} wrapperCol={{ span: 8 }}>
             {userId}
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
                {form.getFieldDecorator('roleArr', {
                  rules: [{ required: false, message: '请至少选择一个角色！' }],
                  initialValue: checkRole,
                })(
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {roleData.map(v => (
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
    const { userManage, loadingQueryUserData } = this.props
    const { userList } = userManage
    const { modalVisible } = this.state
    return (
      <Fragment>
        { modalVisible && this.renderEditModal()}
        <div className={styles.customSearchForm}>{this.renderSearchForm()}</div>
        {/* <Button onClick={() => this.handleViewModal(true)}>新建</Button> */}
        <Card>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            data={userList}
            // dataSource={[{ name: 'gong', account: '0001', role: '普通员工', team: '零售集群' }]}
            loading={loadingQueryUserData}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}

export default UserManage;
