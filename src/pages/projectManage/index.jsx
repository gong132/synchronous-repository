import React, { Component } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import moment from 'moment'
import StandardTable from "@/components/StandardTable";
import { TableColumnHelper } from "@/utils/helper";
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
import Ellipse from '@/components/commonUseModule/ellipse'
import editIcon from '@/assets/icon/cz_bj.svg';
import eyeIcon from '@/assets/icon/cz_ck.svg'
import lcbIcon from '@/assets/icon/cz_lcbjh.svg'
import { formLayoutItem } from '@/utils/constant'
import downIcon from '@/assets/icon/drop_down.svg'
import upIcon from '@/assets/icon/Pull_up.svg'
import CustomBtn from '@/components/commonUseModule/customBtn'
import {
  Form,
  Input,
  Select,
  Card,
  Popover,
  Icon,
  Row,
  Col,
  Button,
  DatePicker
} from 'antd'
import * as _ from 'lodash'
import styles from './index.less'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker
@Form.create()
@connect(({ project }) => ({
  project
}))
class ProjectManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchMore: false,
    }
  }

  // 查询集群列表
  handleQueryCluster = (name) => {
    this.props.dispatch({
      type: 'project/queryAllCluster',
      payload: { name }
    })
  }

  saveParams = () => { }

  // 更多查询
  moreQuery = () => {
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD')
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD')
    } else if (formValues.defendPayTime) {
      formValues.defendPayTime = moment(formValues.defendPayTime).format('YYYY-MM-DD')
    }
    this.handleDebounceQueryData(formValues);
  };

  saveParams = () => {
    this.moreQuery();
  };

  setSearchMore = bool => {
    this.setState({
      searchMore: bool,
    });
  };

  handlePlan = () => {

  }

  handleViewDetail = () => {
    router.push({
      pathname: '/projectDetail'
    })
  }

  // 分页操作
  handleStandardTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    const formValues = this.props.form.getFieldsValue();
    if (formValues.signTime && !_.isEmpty(formValues.signTime)) {
      formValues.signingStartTime = moment(formValues.signTime[0]).format('YYYY-MM-DD');
      formValues.signingEndTime = moment(formValues.signTime[1]).format('YYYY-MM-DD');
    }
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
    };

    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    // this.handleQueryData({ ...params, ...sortParams });
  };

  renderSearchForm = () => {
    const { searchMore } = this.state
    const { project, form } = this.props
    const {
      loadingQueryData,
      clusterList,
    } = project;
    const { getFieldDecorator } = form
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem colon={false} label="商务状态">
              {getFieldDecorator(
                'providerCompanyName',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入商务状态"
                >
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="所属需求编号">
              {getFieldDecorator('budgetNumber', {
              })(<Input allowClear placeholder="请输入所属需求编号" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目编号">
              {getFieldDecorator(
                'description',
                {},
              )(<Input allowClear placeholder="请输入项目编号" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目进度百分比">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'expectTotalAmountLow',
                  {},
                )(<Input allowClear addonAfter="%" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'expectTotalAmountMax',
                  {},
                )(<Input allowClear addonAfter="%" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目进度偏差">
              <div className="yCenter" style={{ height: 30 }}>
                {getFieldDecorator(
                  'expectTotalAmountLow',
                  {},
                )(<Input allowClear addonAfter="%" />)}
                <span style={{ padding: '0 3px' }}>—</span>
                {getFieldDecorator(
                  'expectTotalAmountMax',
                  {},
                )(<Input allowClear addonAfter="%" />)}
              </div>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目健康状态">
              {getFieldDecorator(
                'providerCompanyName',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入项目健康状态"
                >
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="项目优先级">
              {getFieldDecorator(
                'headerId',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商"
                >
                  {/* {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.supplierId} value={d.supplierName}>
                        {d.supplierName}
                      </Option>
                    ))} */}
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同负责人团队">
              {getFieldDecorator(
                'headerTeamId ',
                {},
              )(
                <Select
                  allowClear
                  // showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入供应商"
                >
                  {/* {!_.isEmpty(supplierList) &&
                    supplierList.map(d => (
                      <Option key={d.supplierId} value={d.supplierName}>
                        {d.supplierName}
                      </Option>
                    ))} */}
                  <Option key='p' value='p'>未定义</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="合同签订日期">
              {getFieldDecorator('signTime', {
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem colon={false} label="维保支付提醒日期">
              {getFieldDecorator('defendPayTime', {
              })(
                <DatePicker />
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={() => this.moreQuery()} loading={loadingQueryData} type="primary" ghost>
            查询
          </Button>
          <Button onClick={() => this.setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );
    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col span={7}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false} label="项目名称和描述">
            {getFieldDecorator('name', {
            })(<Input
              allowClear
              onChange={_.debounce(this.saveParams, 500)}
              placeholder='请输入项目名称和描述'
            />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formLayoutItem} colon={false} label="项目状态">
            {getFieldDecorator('projectNumber', {
            })(
              <Select
                allowClear
                // showSearch
                onChange={_.debounce(this.saveParams, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '100%'
                }}
                placeholder="请输入项目状态"
              >
                {/* {!_.isEmpty(projectList) &&
                projectList.map(d => (
                  <Option key={d.number} value={d.number}>
                    {d.name}
                  </Option>
                ))} */}
                <Option key='p' value='p'>未定义</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={7}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} colon={false} label="业务集群/板块">
            {getFieldDecorator('clusterId', {
            })(
              <Select
                allowClear
                showSearch
                onChange={_.debounce(this.saveParams, 500)}
                onSearch={_.debounce(this.handleQueryCluster, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '100%'
                }}
                placeholder="请输入业务集群/板块"
              >
                {
                  clusterList.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            <CustomBtn
              onClick={() => this.handleResetSearch()}
              loading={loadingQueryData}
              type='reset'
            />
            <Popover visible={searchMore} placement="bottomRight" content={content} trigger="click">
              {
                <div
                  className="activeColor"
                  onClick={() => this.setSearchMore(!searchMore)}
                  style={{
                    float: 'right'
                  }}
                >
                  <div className={styles.moreBtn}>
                    <Icon component={searchMore ? downIcon : upIcon} />
                    <span>更多</span>
                  </div>
                </div>
              }
            </Popover>
          </FormItem>
        </Col>
      </Row>
    );
  };

  genColumns = () => {
    const columns = [
      {
        title: <Ellipse text='项目编号' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text, record) => {
          return (
            <Ellipse
              text={text}
              onClick={() => this.handleViewDetail(record)}
              className="globalStyle"
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目名称' style={{ width: 57 }} />,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '8vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目状态' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目进度' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='项目优先级' style={{ width: '3vw' }} />,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '3vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='立项金额' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='业务集群/板块' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='商务状态' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: <Ellipse text='立项申请团队' style={{ width: 57 }} />,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        align: 'center',
        render: (text) => {
          return (
            <Ellipse
              text={text}
              style={{
                width: '6vw'
              }}
            />
          );
        },
      },
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              {<ListOptBtn
                title="编辑"
                onClick={() => this.handleViewModal(true, '编辑', record)}
                style={{
                  fontSize: '20px',
                  marginRight: '12px',
                  position: 'relative',
                  top: '1px'
                }}
                icon={editIcon}
              />}
              {<ListOptBtn
                title="查看"
                onClick={() => this.handleViewDetail(record)}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  marginRight: '12px',
                  top: '5px'
                }}
                icon={eyeIcon}
              />}
              {
                <ListOptBtn
                  title='里程碑计划'
                  onClick={() => this.handlePlan()}
                  style={{
                    fontSize: '20px',
                    position: 'relative',
                    top: '1px'
                  }}
                  icon={lcbIcon}
                />
              }
            </div>
          );
        }
      },
    ]
    return columns
  }

  render() {
    return (
      <Card
        bodyStyle={{
          overflow: 'auto'
        }}
      >
        {this.renderSearchForm()}
        <div className='cusOverflow'>
          <StandardTable
            rowKey={(record, index) => index}
            columns={this.genColumns()}
            // data={constractList}
            // loading={loadingQueryData}
            dataSource={[
              { number: 'gong', systemName: 'gg', name: '国庆放假不调休，哈哈哈' },
              { number: 'gong2', systemName: 'gg' },
              { number: 'gong3', systemName: 'gg' }
            ]}
            onChange={this.handleStandardTableChange}
          // scroll={{ x: 1800 }}
          />
        </div>
      </Card>
    );
  }
}

export default ProjectManage
