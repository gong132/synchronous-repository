import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import StandardTable from '@/components/StandardTable';
import { DefaultPage } from '@/utils/helper';
import CustomBtn from '@/components/commonUseModule/customBtn';
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import Ellipse from '@/components/commonUseModule/ellipse'
import editIcon from '@/assets/icon/cz_bj.svg';
import eyeIcon from '@/assets/icon/cz_ck.svg'
import { formLayoutItem, MENU_ACTIONS } from '@/utils/constant'
import { Modal, Form, Input, Select, Card, Checkbox, Row, Col } from 'antd';
import * as _ from 'lodash';
import styles from './index.less'

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
@connect(({ sector, loading, global }) => ({
  global,
  loadingQueryData: loading.effects['sector/queryData'],
  loadingCreateData: loading.effects['sector/addData'],
  loadingUpdateData: loading.effects['sector/updateData'],
  sectorList: sector.sectorList,
  deptList: sector.deptList,
  deptListMap: sector.deptListMap,
  deptListAll: sector.deptListAll,
  deptListMapAll: sector.deptListMapAll,
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
  handleQueryAllDept = (value) => {
    this.props.dispatch({
      type: 'sector/fetchAllDept',
      payload: {
        deptName: value
      }
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
    const { deptListAll } = this.props;
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={8}>
          <FormItem wrapperCol={{ span: 17 }} labelCol={{ span: 7 }} colon={false} label="集群/板块名称">
            <Input
              allowClear
              value={searchParams.name}
              onChange={e => this.saveParams(e, 'name')}
              placeholder="请输入集群/板块名称"
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formLayoutItem} labelCol={{ span: 5 }} colon={false} label="所属部门">
            <Select
              allowClear
              value={searchParams.deptInfo}
              showSearch
              onSearch={_.debounce(this.handleQueryAllDept, 500)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                JSON.stringify(option.props.children)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              placeholder="请输入所属部门"
              onChange={val => this.saveParams(val, 'deptInfo')}
              style={{
                width: '100%',
              }}
            >
              {!_.isEmpty(deptListAll) &&
                deptListAll.map(d => (
                  <Option key={d.id} value={d.name}>
                    {d.name}
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
              // loading={loadingQueryData}
              type="reset"
            />
          </FormItem>
        </Col>
      </Row>
    );
  };

  genColumns = () => {
    const { global: { authActions } } = this.props
    const columns = [
      {
        title: <Ellipse text='集群/模块名称' style={{width: '10vw'}} />,
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <Ellipse
              text={text}
              onClick={() => this.handleViewDetail(record)}
              className="globalStyle"
              style={{width: '10vw'}}
            />
          );
        },
      },
      {
        title: <Ellipse text='所属部门' style={{width: '10vw'}} />,
        dataIndex: 'deptName',
        key: 'deptName',
        render: (text, record) => {
          if (!_.isArray(record.clusterLinkDepts) || _.isEmpty(record.clusterLinkDepts)) return '';
          let str = '';
          record.clusterLinkDepts.map((d, index) => {
            if (record.clusterLinkDepts.length > index + 1) {
              str += `${d.deptName} `;
              return '';
            }
            str += d.deptName;
            return '';
          });
          return <Ellipse
            text={str}
            style={{width: '10vw'}}
          />;
        },
      },
      {
        title: <Ellipse text='创建人' style={{width: '10vw'}} />,
        dataIndex: 'createUserName',
        key: 'createUserName',
        render: (text) => {
          return (
            <Ellipse
              text={text}
            />
          );
        },
      },
      {
        title: <Ellipse text='创建时间' style={{width: '10vw'}} />,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text) => {
          return (
            <Ellipse
              text={text}
            />
          );
        },
      },
      {
        title: <Ellipse text='修改时间' style={{width: '10vw'}} />,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text) => {
          return (
            <Ellipse
              text={text}
            />
          );
        },
      },
      {
        title: <Ellipse text='修改人' style={{width: '10vw'}} />,
        dataIndex: 'updateUserName',
        key: 'updateUserName',
        render: (text) => {
          return (
            <Ellipse
              text={text}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div style={{whiteSpace: 'nowrap'}}>
              {authActions.includes(MENU_ACTIONS.EDIT) && <ListOptBtn
                title="编辑"
                onClick={() => this.handleViewModal(true, '编辑', record)}
                style={{
                  fontSize: '20px',
                  marginRight: '16px',
                  position: 'relative',
                  top: '1px'
                }}
                icon={editIcon}
              />}
              {authActions.includes(MENU_ACTIONS.CHECK) && <ListOptBtn
                title="查看"
                onClick={() => this.handleViewDetail(record)}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  top: '5px'
                }}
                icon={eyeIcon}
              />}
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { modalVisible, modalTitle, record } = this.state;
    const { sectorList, form, loadingQueryData, deptList, loadingCreateData, global: { authActions } } = this.props;
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
          {authActions.includes(MENU_ACTIONS.ADD) && <CustomBtn
            onClick={() => this.handleViewModal(true, '新建')}
            type="create"
            icon='plus'
          />}
        </div>
        <Card 
          bodyStyle={{
            overflow: 'auto'
          }}
        >
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
                              <Col key={v.id} span={6}>
                                <Checkbox key={v.id} value={v.id}>
                                  {v.name}
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
