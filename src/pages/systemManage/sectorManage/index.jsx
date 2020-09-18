import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import StandardTable from '@/components/StandardTable';
import { DefaultPage, TableColumnHelper } from '@/utils/helper';
import CustomBtn from '@/components/commonUseModule/customBtn';
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import editIcon from '@/assets/icon/cz_bj.svg';
import eyeIcon from '@/assets/icon/cz_ck.svg'
import { formLayoutItem } from '@/utils/constant'
import { Modal, Form, Input, Select, Card, Checkbox, Row, Col } from 'antd';
import * as _ from 'lodash';
import styles from './index.less'

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
@connect(({ sector, loading }) => ({
  loadingQueryData: loading.effects['sector/queryData'],
  loadingCreateData: loading.effects['sector/addData'],
  loadingUpdateData: loading.effects['sector/updateData'],
  sectorList: sector.sectorList,
  deptList: sector.deptList,
  deptListMap: sector.deptListMap,
  allDept: sector.allDept,
}))
class SectorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '新建',
      record: {},
      searchParams: {},
    };
    this.handleDebounceQueryData = _.debounce(this.handleDebounceQueryData, 500);
  }

  componentDidMount() {
    this.handleQueryData();
    this.handleQueryAllDept();
  }

  handleQueryData = (params = {}) => {
    const { searchParams } = this.state;
    this.props.dispatch({
      type: 'sector/queryData',
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

  // 查询所有部门
  handleQueryAllDept = () => {
    this.props.dispatch({
      type: 'sector/fetchAllDept',
    });
  };

  // 查部门
  handleQueryDept = (params = {}) => {
    this.props.dispatch({
      type: 'sector/fetchNotBindDept',
      payload: { ...params },
    });
  };

  saveParams = (val, type) => {
    const { searchParams } = this.state;
    const obj = searchParams;
    if (type === 'deptInfo') {
      obj[type] = val;
    } else if (type === 'name') {
      obj[type] = val.target.value;
    }
    this.setState(
      {
        searchParams: obj,
      },
      () => this.handleDebounceQueryData(),
    );
  };

  handleResetSearch = () => {
    this.setState(
      {
        searchParams: {},
      },
      () => this.handleQueryData(),
      500,
    );
  };

  handleEdit = params => {
    this.props.dispatch({
      type: 'sector/updateData',
      payload: { ...params },
    });
  };

  handleViewModal = (bool, title, record = {}) => {
    this.setState({
      modalVisible: bool,
      modalTitle: title,
      record,
    });
    if (!bool) {
      this.props.form.resetFields();
    }
    if (bool && !record.id) {
      this.handleQueryDept();
    }
    if (record.id) {
      this.handleQueryDept({ clusterId: record.id });
    }
  };

  handleSubmit = () => {
    const { deptListMap } = this.props;
    const { record } = this.state;
    this.props.form.validateFields((err, val) => {
      if (err) return;
      const arr = [];
      const values = val;
      values.dept.map(d => {
        const str = `${deptListMap[d]}-${d}`;
        arr.push(str);
        return true;
      });
      values.deptInfo = arr.join(',');
      delete values.dept;
      if (record.id) {
        values.id = record.id;
        this.handleEdit(values);
        return;
      }
      this.handleCreate(values);
    });
  };

  // 新增
  handleCreate = params => {
    this.props
      .dispatch({
        type: 'sector/addData',
        payload: {
          ...params,
        },
      })
      .then(bool => {
        if (bool) {
          this.handleQueryData();
          this.handleViewModal(false, '', {});
        }
      });
  };

  // 编辑
  handleEdit = params => {
    this.props
      .dispatch({
        type: 'sector/updateData',
        payload: {
          ...params,
        },
      })
      .then(bool => {
        if (bool) {
          this.handleQueryData();
          this.handleViewModal(false, '', {});
        }
      });
  };

  handleViewDetail = record => {
    router.push({
      pathname: '/systemManage/sectorManage/detail',
      query: {
        id: record.id,
      },
    });
  };

  // 分页操作
  handleStandardTableChange = pagination => {
    // const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryData(params);
  };

  renderSearchForm = () => {
    const { searchParams } = this.state;
    const { allDept, loadingQueryData } = this.props;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={8}>
          <FormItem wrapperCol={{span: 17}} labelCol={{span: 7}} colon={false} label="集群/板块名称">
            <Input
              allowClear
              value={searchParams.name}
              onChange={e => this.saveParams(e, 'name')}
              placeholder="请输入集群/板块名称"
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formLayoutItem} labelCol={{span: 5}} colon={false} label="所属部门">
            <Select
              allowClear
              value={searchParams.deptInfo}
              placeholder="请输入所属部门"
              onChange={val => this.saveParams(val, 'deptInfo')}
              style={{
                width: '100%',
              }}
            >
              {!_.isEmpty(allDept) &&
                allDept.map(d => (
                  <Option key={d.deptId} value={d.deptName}>
                    {d.deptName}
                  </Option>
                ))}
            </Select>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              style={{
                display: 'inline-block',
              }}
              loading={loadingQueryData}
              type="reset"
            />
          </FormItem>
        </Col>
      </Row>
    );
  };

  genColumns = () => {
    const columns = [
      {
        title: '集群/模块名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <span onClick={() => this.handleViewDetail(record)} className="globalStyle">
              {text}
            </span>
          );
        },
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => {
          if (!_.isArray(record.clusterLinkDepts) || _.isEmpty(record.clusterLinkDepts)) return '';
          let str = '';
          record.clusterLinkDepts.map((d, index) => {
            if (record.clusterLinkDepts.length > index + 1) {
              str += `${d.deptName}, `;
              return '';
            }
            str += d.deptName;
            return '';
          });
          return str;
        },
      },
      TableColumnHelper.genPlanColumn('createUserName', '创建人'),
      TableColumnHelper.genPlanColumn('createTime', '创建时间'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
      TableColumnHelper.genPlanColumn('updateUserName', '修改人'),
      {
        title: '操作',
        align: 'left',
        width: 190,
        render: (text, record) => {
          return (
            <div>
              <ListOptBtn
                title="编辑"
                onClick={() => this.handleViewModal(true, '编辑', record)}
                style={{
                  fontSize: '20px',
                  marginRight: '16px',
                  position: 'relative',
                  top:'1px'
                }}
                icon={editIcon}
              />
              <ListOptBtn
                title="查看"
                onClick={() => this.handleViewDetail(record)}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  top: '5px'
                }}
                icon={eyeIcon}
              />
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { modalVisible, modalTitle, record } = this.state;
    const { sectorList, form, loadingQueryData, deptList, loadingCreateData } = this.props;
    const { name, clusterLinkDepts } = record;
    const arr = [];
    if (clusterLinkDepts) {
      clusterLinkDepts.map(v => {
        arr.push(v.deptId);
        return true;
      });
    }

    return (
      <Fragment>
        <div style={{ display: 'flex' }}>
          <CustomBtn
            onClick={() => this.handleViewModal(true, '新建')}
            type="create"
            icon='plus'
          />
        </div>
        <Card>
          <Modal
            title={modalTitle}
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
                <CustomBtn
                  loading={loadingCreateData}
                  onClick={() => this.handleSubmit()}
                  type="save"
                />
              </div>
            }
          >
            <Row>
              <Col span={24}>
                <FormItem label="集群/板块名称" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入集群/板块名称!' }],
                    initialValue: name,
                  })(<Input placeholder="请输入集群/板块名称" />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="所属部门" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <div
                    style={{
                      border: '1px solid #EBEEF5',
                      borderRadius: '2px',
                      padding: '16px',
                    }}
                  >
                    {form.getFieldDecorator('dept', {
                      rules: [{ required: true, message: '请至少选择一个部门！' }],
                      initialValue: arr,
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                          {!_.isEmpty(deptList) &&
                            deptList.map(v => (
                              <Col key={v.deptId} span={4}>
                                <Checkbox key={v.deptId} value={v.deptId}>
                                  {v.deptName}
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
          <div className={styles.customSearchForm}>{this.renderSearchForm()}</div>
          <StandardTable
            rowKey={(r, index) => index}
            columns={this.genColumns()}
            data={sectorList}
            loading={loadingQueryData}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}

export default SectorManage;
