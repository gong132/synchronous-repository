import React, { useState, useEffect } from 'react'
import CustomBtn from '@/components/commonUseModule/customBtn';
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from '@/utils/constant';
import { connect } from 'dva'
import _ from 'lodash'
import {
  Modal,
  Input,
  Select,
  Form,
  DatePicker,
  Row,
  Col
} from 'antd'
import Editor from '@/components/TinyEditor';
import { DEMAND_PRIORITY_ARR } from '../utils/constant'

const FormItem = Form.Item
const { Option } = Select

const EditModal = (props) => {
  const {
    visible,
    handleViewModal,
    moreQuery,
    loadingAdd,
    project,
    form
  } = props
  const {
    stageStatus,
    projectInfo
  } = project

  const {
    pjName,
    pjSn,
    pjStage,
    pjProgress,
    pjProgressDeviation,
    pjHealthStatus,
    demandLevel,
    budgetNo,
    demandNo,
    estTeam,
    estAmount,
    techStage,
    estStage,
    pjMgType,
    buildType,
    systemLevel,
    pjDesc,
    pjType,
    pjId,
    createTime,
    updateTime,
    pjUpdateUserId,
    pjUpdateUserName,
    pmId,
    pm,
    contractAmount,
    pretermId
  } = projectInfo

  const [description, setDescription] = useState(pjDesc)
  useEffect(() => {
    setDescription(pjDesc)
  }, [pjDesc])

  const handleSubmit = () => {
    form.validateFields(['pjStage', 'pjMgType', 'buildType', 'systemLevel'], (err, values) => {
      if (err) {
        return false
      }
      console.log(values)
      values.id = projectInfo.id
      values.pjDesc = description
      props.dispatch({
        type: 'project/updateProject',
        payload: {
          ...values
        }
      }).then(res => {
        if (res) {
          handleViewModal(false)
          moreQuery()
        }
      })
    })
  }

  const renderForm = () => {
    return (
      <Form>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目名称">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目编号">
              {form.getFieldDecorator('pjSn', {
                initialValue: pjSn,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目状态">
              {form.getFieldDecorator('pjStage', {
                initialValue: pjStage ? Number(pjStage) : '',
              })(
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入项目状态"
                >
                  {!_.isEmpty(stageStatus) &&
                    stageStatus.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.pjStageName}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目管理类型">
              {form.getFieldDecorator('pjMgType', {
                initialValue: pjMgType,
              })(
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入项目管理类型"
                >
                  {/* {!_.isEmpty(stageStatus) &&
                    stageStatus.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.pjStageName}
                      </Option>
                    ))} */}
                  <Option key='1' value='1'>研发管理类</Option>
                  <Option key='2' value='2'>需求起草类</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目建设方式">
              {form.getFieldDecorator('buildType', {
                initialValue: buildType,
              })(
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入项目建设方式"
                >
                  {/* {!_.isEmpty(stageStatus) &&
                    stageStatus.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.pjStageName}
                      </Option>
                    ))} */}
                  <Option key='1' value='1'>外包采购</Option>
                  <Option key='2' value='2'>部门研发</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="系统级别">
              {form.getFieldDecorator('systemLevel', {
                initialValue: systemLevel,
              })(
                <Select
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    JSON.stringify(option.props.children)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请输入系统级别"
                >
                  {DEMAND_PRIORITY_ARR.map(d => (
                    <Option key={d.key} value={d.key}>
                      {d.val}
                    </Option>
                  ))}
                  {/* <Option key='1' value='1'>未定义</Option> */}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目进度">
              {form.getFieldDecorator('pjProgress', {
                initialValue: pjProgress,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="需求优先级">
              {form.getFieldDecorator('demandLevel', {
                initialValue: demandLevel,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="预算编号">
              {form.getFieldDecorator('budgetNo', {
                initialValue: budgetNo,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="所属需求编号">
              {form.getFieldDecorator('demandNo', {
                initialValue: demandNo,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="需求提出部门">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="立项申请团队">
              {form.getFieldDecorator('estTeam', {
                initialValue: estTeam,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="立项金额">
              {form.getFieldDecorator('estAmount', {
                initialValue: estAmount,
              })(<Input addonAfter='万' disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="合同成交金额">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input addonAfter='万' disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="业务集群/板块">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="供应商">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="技术评审阶段">
              {form.getFieldDecorator('techStage', {
                initialValue: techStage,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="立项评审阶段">
              {form.getFieldDecorator('estStage', {
                initialValue: estStage,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="商务状态">
              {form.getFieldDecorator('pjStage', {
                initialValue: pjStage,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目负责人">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目优先级">
              {form.getFieldDecorator('pjName', {
                initialValue: pjName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formLayoutItemAddDouble} label="项目创建时间">
              {form.getFieldDecorator('createTime', {
                initialValue: createTime,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label='描述' {...formLayoutItemAddEdit}>
              <Editor
                editorKey="myContractAdd"
                height={300}
                content={description}
                onContentChange={content => setDescription(content)}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

  return (
    <Modal
      width={794}
      style={{ top: 0 }}
      title='编辑'
      visible={visible}
      onCancel={() => handleViewModal(false)}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomBtn
            onClick={() => handleViewModal(false)}
            type="cancel"
            style={{ marginRight: '18px' }}
          />
          <CustomBtn
            loading={loadingAdd}
            onClick={() => handleSubmit()}
            type="save"
          />
        </div>
      }
    >
      {renderForm()}
    </Modal>
  )
}

export default connect(({ project, loading }) => ({
  project,
  loadingAdd: loading.effects['project/updateProject']
}))(Form.create()(EditModal)) 