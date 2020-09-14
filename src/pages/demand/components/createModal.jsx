import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import numeral from 'numeral'
import { formLayoutItemAddDouble, formLayoutItemAddEdit } from "@/utils/constant";
import CustomBtn from '@/components/commonUseModule/customBtn'
import Editor from "@/components/TinyEditor"
import UploadFile from '@/components/FileUpload'
import styles from '../index.less'
import { Modal, Form, Select, Input, DatePicker, Col, Row, Table, message, Upload, Button } from 'antd'

const CreateDemand = (props) => {
    const {
        visibleModal,
        modalTitle,
        handleViewModal,
    } = props

    const renderForm = () => (
        <Form>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col span={24}>
                    <FormItem {...formLayoutItemAddEdit} label="名称">
                        {form.getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入名称' }],
                            initialValue: name,
                        })(<Input placeholder="请输入名称" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="预算编号">
                        {form.getFieldDecorator('budgetNumber', {
                            rules: [{ required: true, message: '请输入预算编号' }],
                            initialValue: budgetNumber,
                        })(<Select
                            placeholder="请输入预算编号"
                        >
                            {!_.isEmpty(budgetList) && budgetList.map(d => (
                                <Option key={d.number} value={d.number}>{d.number}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="所属项目">
                        {form.getFieldDecorator('projectNumber', {
                            rules: [{ required: true, message: '请输入所属项目' }],
                            initialValue: projectNumber,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入所属项目"
                        >
                            {!_.isEmpty(projectList) && projectList.map(d => (
                                <Option key={d.number} value={d.number}>{d.name}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="所属部门">
                        {form.getFieldDecorator('deptId', {
                            rules: [{ required: true, message: '请输入所属部门' }],
                            initialValue: deptId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入所属部门"
                        >
                            {!_.isEmpty(deptList) && deptList.map(d => (
                                <Option key={d.deptId} value={d.deptId}>{d.deptName}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="所属系统">
                        {form.getFieldDecorator('systemId', {
                            rules: [{ required: true, message: '请输入所属系统' }],
                            initialValue: systemId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入所属系统"
                        >
                            {!_.isEmpty(systemList) && systemList.map(d => (
                                <Option key={d.systemId} value={d.systemId}>{d.systemName}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="合同成交额">
                        {form.getFieldDecorator('transactionAmount', {
                            rules: [{
                                required: true,
                                message: '请输入合同成交额',
                                pattern: /^[0-9]+$|,/g,
                                whitespace: true
                            }],
                            normalize: formatMoney,
                            initialValue: transactionAmount,
                        })(<Input
                            onChange={changeTotalMoney}
                            addonAfter='元'
                            placeholder="请输入合同成交额" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="首次报价金额">
                        {form.getFieldDecorator('firstOfferAmount', {
                            rules: [{
                                required: true,
                                message: '请输入首次报价金额',
                                pattern: /^[0-9]+$|,/g,
                                whitespace: true
                            }],
                            normalize: formatMoney,
                            initialValue: firstOfferAmount,
                        })(<Input addonAfter='元' placeholder="请输入首次报价金额" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="合同签订时间">
                        {form.getFieldDecorator('signingTime', {
                            rules: [{ required: true, message: '请输入合同签订时间' }],
                            initialValue: signingTime ? moment(signingTime) : null,
                        })(<DatePicker placeholder="请输入合同签订时间" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="供应商">
                        {form.getFieldDecorator('providerCompanyId', {
                            rules: [{ required: true, message: '请输入供应商' }],
                            initialValue: providerCompanyId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入供应商"
                        >
                            {!_.isEmpty(supplierList) && supplierList.map(d => (
                                <Option key={d.supplierId} value={d.supplierId}>{d.supplierName}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="合同负责人">
                        {form.getFieldDecorator('headerId', {
                            rules: [{ required: true, message: '请输入合同负责人' }],
                            initialValue: headerId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入合同负责人"
                        >
                            {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.leaderId} value={d.leaderId}>{d.leaderName}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="合同负责人团队">
                        {form.getFieldDecorator('headerGroupId', {
                            rules: [{ required: true, message: '请输入合同负责人团队' }],
                            initialValue: headerGroupId,
                        })(<Select
                            allowClear
                            // showSearch
                            placeholder="请输入合同负责人团队"
                        >
                            {!_.isEmpty(headerList) && headerList.map(d => (
                                <Option key={d.number} value={d.number}>{d.name}</Option>
                            ))}
                        </Select>)}
                    </FormItem>
                </Col>
                {/* <Col span={12}>
              <FormItem {...formLayoutItemAddDouble} label="免费维保期">
                {form.getFieldDecorator('headerGroupId', {
                  rules: [{ required: true, message: '请输入免费维保期' }],
                  // initialValue: values && values.name,
                })(<Input placeholder='请输入免费维保期' addonAfter='月' />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formLayoutItemAddDouble} label="维保支付日期">
                {form.getFieldDecorator('signingTime', {
                  rules: [{ required: true, message: '请输入维保支付日期' }],
                  // initialValue: values && values.name,
                })(<DatePicker placeholder="请输入维保支付日期" />)}
              </FormItem>
            </Col> */}
                <Col span={12}>
                    <FormItem {...formLayoutItemAddDouble} label="付款笔数">
                        {form.getFieldDecorator('count', {
                            rules: [{
                                required: true,
                                message: '请输入付款笔数',
                                pattern: /^[0-9]+$/
                            }],
                            normalize: formatCount,
                            initialValue: data.length,
                        })(
                            <Input
                                onChange={e => handleChangeColumns(e)}
                                addonAfter='笔'
                                placeholder='请输入付款笔数' />
                        )}
                    </FormItem>
                </Col>
                {!_.isEmpty(data) && <Col span={24}>
                    <FormItem {...formLayoutItemAddEdit} label=" " colon={false}>
                        <div className={styles.customTable}>
                            <Table
                                rowKey={(record, index) => index}
                                columns={payColumns}
                                pagination={false}
                                dataSource={data}
                            />
                        </div>
                    </FormItem>
                </Col>}
                <Col span={24}>
                    <FormItem
                        {...formLayoutItemAddEdit}
                        label='合同描述'
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
            title={`${modalTitle}合同`}
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

export default CreateDemand