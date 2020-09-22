import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import StandardTable from "@/components/StandardTable";
import { TableColumnHelper } from "@/utils/helper";
import ListOptBtn from '@/components/commonUseModule/listOptBtn'
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

  handleViewDetail = () => {}

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
            })(<Select
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
            </Select>)}
          </FormItem>
        </Col>
        <Col span={7}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} colon={false} label="业务集群/板块">
            {getFieldDecorator('clusterId', {
            })(<Select
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
            </Select>)}
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
        title: '项目编号',
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        render: (text, record) => {
          return (
            <span
              onClick={
                () => this.handleViewDetail(record)
              }
              className='globalStyle'
            >
              {text}
            </span>
          )
        }
      },
      TableColumnHelper.genPlanColumn('deptName', '项目名称'),
      TableColumnHelper.genLangColumn('systemName', '项目状态'),
      TableColumnHelper.genPlanColumn('userName', '项目进度'),
      TableColumnHelper.genPlanColumn('userName', '项目优先级'),
      TableColumnHelper.genPlanColumn('userName', '立项金额'),
      TableColumnHelper.genPlanColumn('userName', '业务集群/板块'),
      TableColumnHelper.genPlanColumn('userName', '商务状态'),
      TableColumnHelper.genPlanColumn('userName', '立项申请团队'),
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div>
              {<ListOptBtn
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
              {<ListOptBtn
                title="查看"
                onClick={() => this.handleViewDetail(record)}
                style={{
                  fontSize: '24px',
                  position: 'relative',
                  marginRight: '16px',
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
      <Card>
        {this.renderSearchForm()}
        <StandardTable
          rowKey={(record, index) => index}
          columns={this.genColumns()}
          // data={constractList}
          // loading={loadingQueryData}
          dataSource={[
            { number: 'gong', systemName: 'gg' },
            { number: 'gong2', systemName: 'gg' },
            { number: 'gong3', systemName: 'gg' }
          ]}
        // onChange={this.handleStandardTableChange}
        // scroll={{ x: 1800 }}
        />
      </Card>
    );
  }
}

export default ProjectManage