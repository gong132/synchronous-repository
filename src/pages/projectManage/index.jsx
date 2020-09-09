import React, { Component } from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import OptButton from "@/components/commonUseModule/optButton";
import { formLayoutItem1 } from '@/utils/constant'
import editIcon from '@/assets/icon/Button_bj.svg'
import downIcon from '@/assets/icon/drop_down.svg'
import upIcon from '@/assets/icon/Pull_up.svg'
import SearchForm from '@/components/commonUseModule/searchForm'
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
class ProjectManage extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  saveParams = () => { }

  genColumns = () => {
    const columns = [
      {
        title: '合同编号',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => {
          return (
            <span
              // onClick={
              //   () => this.handleViewDetail(record)
              // }
              className='globalStyle'>
              {text}
            </span>
          )
        }
      },
      TableColumnHelper.genPlanColumn('deptName', '所属部门'),
      TableColumnHelper.genLangColumn('systemName', '涉及系统', {}, 6),
      TableColumnHelper.genPlanColumn('userName', '录入人'),
      TableColumnHelper.genDateTimeColumn('createTime', '录入时间', "YYYY-MM-DD"),
      TableColumnHelper.genPlanColumn('headerName', '合同负责人'),
      TableColumnHelper.genPlanColumn('providerCompanyName', '供应商'),
      TableColumnHelper.genPlanColumn('signingTime', '合同签订时间'),
      TableColumnHelper.genDiscountMoneyColumn('payAmount', '合同已支付金额', {}, ''),
      TableColumnHelper.genDiscountMoneyColumn('notPayAmount', '合同待支付金额', {}, ''),
      {
        title: '操作',
        align: 'left',
        render: (text, record) => {
          return (
            <div>
              <OptButton
                style={{
                  marginRight: '12px'
                }}
                onClick={
                  () => this.handleViewModal(true, '编辑', record)
                }
                img={editIcon}
                text="编辑"
              />
              <OptButton
                icon='eye'
                onClick={
                  () => this.handleViewDetail(record)
                }
                text="查看"
              />
            </div>
          );
        }
      },
    ]
    return columns
  }

  renderSearchForm = () => {
    const { searchMore } = this.state
    const { deptList, loadingQueryData, form: { getFieldDecorator } } = this.props
    const content = (
      <div className={styles.moreSearch}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="名称">
              {getFieldDecorator('name', {
              })(<Input
                allowClear
                placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="预算编号">
              {getFieldDecorator('budgetNumber', {
              })(<Input
                allowClear
                placeholder="请输入预算编号" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem1} label="项目编号">
              {getFieldDecorator('projectNumber', {
              })(<Input
                allowClear
                placeholder="请输入项目编号" />)}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={() => this.moreQuery()}>查询</Button>
          <Button onClick={() => this.setSearchMore(false)}>取消</Button>
        </div>
      </div>
    );
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SearchForm
          labelName="合同编号"
        >
          {getFieldDecorator('number', {
          })(<Input
            allowClear
            onChange={_.debounce(this.saveParams, 500)}
            placeholder='请输入合同编号' />)}
        </SearchForm>
        <SearchForm
          labelName="所属部门"
        >
          {getFieldDecorator('deptId', {
          })(<Select
            allowClear
            placeholder='请输入所属部门'
            onChange={_.debounce(this.saveParams, 500)}
            style={{
              width: '100%'
            }}
          >
            {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.name}>{d.name}</Option>
            ))}
          </Select>)}
        </SearchForm>
        <SearchForm
          labelName="供应商"
        >
          {getFieldDecorator('providerCompanyName', {
          })(
            <Select
              allowClear
              placeholder='请输入供应商'
              onChange={_.debounce(this.saveParams, 500)}
              style={{
                width: '100%'
              }}
            >
              <Option key={1} value={1}>自定义</Option>
              {/* {!_.isEmpty(deptList) && deptList.map(d => (
              <Option key={d.number} value={d.name}>{d.name}</Option>
            ))} */}
            </Select>
          )}
        </SearchForm>
        <SearchForm
          labelName="合同签订时间"
        >
          {getFieldDecorator('signTime', {
          })(
            <RangePicker
              onChange={_.debounce(this.saveParams, 500)}
            />
          )}
        </SearchForm>
        <CustomBtn
          onClick={() => this.handleResetSearch()}
          style={{
            display: 'inline-block'
          }}
          // loading={loadingQueryData}
          type='reset' />
        <Popover visible={searchMore} placement="bottomRight" content={content} trigger="click">
          {
            <div
              className="activeColor"
              // onClick={() => this.setSearchMore(!searchMore)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '30px'
              }}
            >
              <div className={styles.moreBtn}>
                <Icon component={searchMore ? downIcon : upIcon} />
                <span>更多</span>
              </div>
            </div>
          }
        </Popover>
      </div>
    )
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
          scroll={{ x: 1800 }}
        />
      </Card>
    );
  }
}

export default ProjectManage