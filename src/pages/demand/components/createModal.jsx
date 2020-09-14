import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import numeral from 'numeral'
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import CustomBtn from '@/components/commonUseModule/customBtn'
import Editor from "@/components/TinyEditor"
import UploadFile from '@/components/FileUpload'
import styles from '../index.less'
import { Modal, Form, Select, Input, DatePicker, Col, Row, Table, message, Upload, Button, Radio } from 'antd'

const FormItem = Form.Item
const { Option } = Select
const RadioGroup = Radio.Group

const CreateDemand = (props) => {
    const {
        visibleModal,
        modalTitle,
        handleViewModal,
        form
    } = props

    const [description, setDescription] = useState('');

    const handleSubmitForm = () => {
        form.validateFieldsAndScroll((err, values) => {
            if (err) return
            if (description.length < 1) {
                message.error('请补全合同描述！')
                return
            }
            console.log('values: ', values)
        })
    }

    const renderForm = () => (
        <Form>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col span={24}>
                    <FormItem {...formLayoutItemAddEdit} label="标题">
                        {form.getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入标题' }],
                            // initialValue: name,
                        })(<Input placeholder="请输入标题" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="期望完成日期">
                        {form.getFieldDecorator('signingTime', {
                            rules: [{ required: true, message: '请输入期望完成日期' }],
                            // initialValue: signingTime ? moment(signingTime) : null,
                        })(<DatePicker placeholder="请输入期望完成日期" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="提出人">
                        {form.getFieldDecorator('headerId', {
                            rules: [{ required: true, message: '请输入提出人' }],
                            // initialValue: headerId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入提出人"
                        >
                            {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                            <Option key={1} value={1}>{1}</Option>
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="需求类型">
                        {form.getFieldDecorator('headerId', {
                            rules: [{ required: true, message: '请输入需求类型' }],
                            // initialValue: headerId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入需求类型"
                        >
                            {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                            <Option key={1} value={1}>{1}</Option>
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="优先级">
                        {form.getFieldDecorator('headerId', {
                            rules: [{ required: true, message: '请输入优先级' }],
                            // initialValue: headerId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入优先级"
                        >
                            {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                            <Option key={1} value={1}>{1}</Option>
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="受理团队">
                        {form.getFieldDecorator('headerId', {
                            rules: [{ required: false, message: '请输入受理团队' }],
                            // initialValue: headerId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入受理团队"
                        >
                            {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                            <Option key={1} value={1}>{1}</Option>
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="受理人">
                        {form.getFieldDecorator('headerId', {
                            rules: [{ required: false, message: '请输入受理人' }],
                            // initialValue: headerId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入受理人"
                        >
                            {/* {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))} */}
                            <Option key={1} value={1}>{1}</Option>
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="是否沟通">
                        {form.getFieldDecorator('type', {
                            rules: [{ required: false, message: '请选择项目类型' }],
                            // initialValue: values && values.type,
                        })(
                            <RadioGroup>
                                <Radio value={1} key={1}>是</Radio>
                                <Radio value={0} key={0}>否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Col>

                <Col span={24}>
                    <FormItem
                        {...formLayoutItemAddEdit}
                        label='需求描述'
                        required={true}
                    >
                        <Editor
                            editorKey='myContractAdd'
                            height={300}
                            content={description}
                            onContentChange={content => setDescription(content)}
                        />
                    </FormItem>
                </Col>
                {/* <Col span={24}>
              <FormItem
                {...formLayoutItemAddEdit}
                label='上传附件'
              >
                <UploadFile
                  uploadType='2'
                  urls={urls}
                  handleSaveFileUrl={handleSaveFileUrl}
                >
                  <Button>上传</Button>
                </UploadFile>
              </FormItem>
            </Col> */}
            </Row>
        </Form>
    )

    return (
        <Modal
            width={794}
            style={{ top: 0 }}
            title={`${modalTitle}需求`}
            visible={visibleModal}
            onCancel={() => handleViewModal(false)}
            // confirmLoading={loadingAdd || loadingUpdate}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CustomBtn
                        onClick={() => handleViewModal(false)}
                        type='cancel'
                        style={{ marginRight: '18px' }}
                    />
                    <CustomBtn
                        // loading={modalTitle === '编辑' ? loadingUpdate : loadingAdd}
                        onClick={handleSubmitForm}
                        type='save' />
                </div>}
        >
            {renderForm()}
        </Modal>
    )

}

export default connect(({ constract, loading }) => ({

}))(Form.create()(CreateDemand));