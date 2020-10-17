import React, {Fragment, useEffect, useState} from 'react';
import { connect } from "dva";
import {withRouter} from "umi/index";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import OptButton from "@/components/commonUseModule/optButton";


import sdIcon from '@/assets/icon/modular_xtxq.svg';
import editButton from "@/assets/icon/Button_bj.svg";
import budgetLog from '@/assets/icon/modular_czrz.svg';
import syncJIRAButton from "@/assets/icon/Button_tbjira.svg";

import styles from "./index.less"
import {Button, DatePicker, Descriptions, Form, Input, message, Popconfirm, Select} from "antd";
import {isEmpty, statusToValue} from "@/utils/lang";
import {STORY_PRIORITY, STORY_TYPE} from "@/pages/demand/util/constant";
import moment from "moment";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import Editor from "@/components/TinyEditor";
import StandardTable from "@/components/StandardTable";
import storage from "@/utils/storage";
import FileUpload from "@/components/FileUpload";

const FormItem = Form.Item;
const { Option } = Select;

const Index = withRouter(props => {

  const { dispatch, form, demand: { storyDetails }, global: { userList, logList }, saveStoryLoading, syncStoryLoading, loading } = props;

  const [editModalVisible, setEditModalVisible] = useState(false)
  const [description, setDescription] = useState("")
  const [fileList, setFileList] = useState("")

  const handleQueryStoryDetails = () => {
    dispatch({
      type: "demand/queryStoryDetails",
      payload: {
        storyId: props?.location?.query?.id,
      },
    }).then(data => {
      if (data) {
        setFileList(data?.attachments ? JSON.stringify(data.attachments) : '')
        setDescription(data?.description)
      }
    })
  }
  const handleQueryUserList = () => {
    dispatch({
      type: "global/queryUserList",
      payload: {
        ...PagerHelper.MaxPage,
      },
    })
  }
  const handleQueryLogList = params => {
    dispatch({
      type: "global/fetchLogList",
      payload: {
        linkId: props?.location?.query?.id,
        type: 5,
        ...PagerHelper.DefaultPage,
        ...params,
      },
    })
  }

  const handleSyncStory = () => {
    dispatch({
      type: "demand/syncStory",
      payload: {
        storyId: props?.location?.query?.id,
      },
    }).then(res => {
      if (!res) return;
      message.success("同步成功")
      handleQueryStoryDetails();
    })
  }

  const handleOk = () => {
    form.validateFields((err, val) => {
      if (err) return;
      // if (isEmpty(description, true)) {
      //   message.error('描述不能为空');
      //   return;
      // }

      const params = {
        id: props?.location?.query?.id,
        ...storyDetails,
        ...val,
        assessorName: isEmpty(val.assessor)
          ? null
          : userList.list.find(v => v.userId === val.assessor).userName,
        evaluateTime: isEmpty(val.evaluateTime)
          ? null
          : val.evaluateTime.format("YYYY-MM-DD"),
        description,
        attachments: isEmpty(fileList) ? null : JSON.parse(fileList).map(v => v.id),
      };
      if (!params.id) {
        message.error('storyId不能为空');
        return;
      }
      dispatch({
        type: "demand/updateStory",
        payload: {
          ...params,
        }
      }).then(res => {
        if (!res) return;
        message.success("保存成功");
        setEditModalVisible(false)
        handleQueryStoryDetails();
        handleQueryLogList()
      })
    })
  }

  // 分页操作
  const handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    handleQueryLogList(params);
  };

  useEffect(() => {
    handleQueryStoryDetails()
    handleQueryUserList()
    handleQueryLogList()
  }, [])

  const detailList = [
    { span: 2, required: false, name: 'Story标题', value: storyDetails?.title },
    { span: 1, required: false, name: 'Story编号', value: storyDetails?.number },
    { span: 1, required: false, name: '状态', value: storyDetails?.status },
    { span: 1, required: false, name: '评估人', value: storyDetails?.assessorName },
    { span: 1, required: false, name: 'story类型', value: statusToValue(STORY_TYPE, storyDetails?.type) },
    { span: 1, required: false, name: '优先级', value: storyDetails?.priority },
    { span: 1, required: false, name: '所属需求', value: storyDetails?.demandNumber },
    { span: 1, required: false, name: '所属系统', value: storyDetails?.systemName },
    { span: 1, required: false, name: '创建时间', value: storyDetails?.createTime },
    { span: 1, required: false, name: '创建人', value: storyDetails?.userName },
    { span: 1, required: false, name: 'IT预计上线日期', value: storyDetails?.evaluateTime },
    { span: 1, required: false, name: '开发预计工作量(人天)', value: storyDetails?.developWorkload },
    { span: 2, required: false, name: '测试预计工作量(人天)', value: storyDetails?.testWorkload },
  ];

  const renderEditForm = () => {
    return (
      <div className={styles.editPanel}>
        <Descriptions column={3} bordered>
          <Descriptions.Item span={2} label="Story标题">
            <FormItem>
              {form.getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入预算名称' }],
                initialValue: storyDetails?.title,
              })(<Input.TextArea placeholder="请输入预算名称" cols={1} rows={1} />)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="Story编号">
            <FormItem>{storyDetails?.number}</FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="状态">
            <FormItem>{storyDetails?.status}</FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="评估人">
            <FormItem>
              {form.getFieldDecorator('assessor', {
                rules: [{ required: true, message: '请选择评估人' }],
                initialValue: storyDetails?.assessor,
              })(
                <Select placeholder="请选择评估人">
                  {userList?.list && userList?.list.map(v => (
                    <Option value={v.userId} key={v.userId.toString()}>
                      {v.userName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="story类型">
            <FormItem>
              {form.getFieldDecorator('type', {
                rules: [{ required: false, message: '请选择story类型' }],
                initialValue: storyDetails?.type,
              })(
                <Select placeholder="请选择story类型">
                  {STORY_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="优先级">
            <FormItem>
              {form.getFieldDecorator('priority', {
                rules: [{ required: true, message: '请选择优先级' }],
                initialValue: storyDetails?.priority,
              })(
                <Select placeholder="请选择优先级">
                  {STORY_PRIORITY.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="所属需求">
            <FormItem>{storyDetails?.demandNumber}</FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="所属系统">
            <FormItem>{storyDetails?.systemName}</FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="创建时间">
            <FormItem>{storyDetails?.createTime}</FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="创建人">
            <FormItem>{storyDetails?.userName}</FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="IT预计上线时间">
            <FormItem>
              {form.getFieldDecorator('evaluateTime', {
                rules: [{ required: false, message: '请选择IT预计上线时间' }],
                initialValue: storyDetails?.evaluateTime && moment(storyDetails.evaluateTime),
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={1} label="开发预计工作量(人天)">
            <FormItem>
              {form.getFieldDecorator('developWorkload', {
                rules: [{ required: false, message: '请输入开发预计工作量' }],
                initialValue: storyDetails?.developWorkload,
              })(<Input placeholder="请输入开发预计工作量" />)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={2} label="测试预计工作量(人天)">
            <FormItem>
              {form.getFieldDecorator('testWorkload', {
                rules: [{ required: false, message: '请输入测试预计工作量' }],
                initialValue: storyDetails?.testWorkload,
              })(<Input placeholder="请输入测试预计工作量" />)}
            </FormItem>
          </Descriptions.Item>
          <Descriptions.Item span={3} label="描述">
            <Editor
              height={300}
              content={description}
              onContentChange={content => setDescription(content)}
            />
          </Descriptions.Item>
          <Descriptions.Item span={3} label="附件">
            <FileUpload
              uploadType='6'
              urls={fileList}
              handleSaveFileUrl={file => setFileList(file)}
            >
              <Button ghost type="primary">上传</Button>
              <span style={{ fontSize: 12, color: '#69707F', marginLeft: 6 }}>
                文件大小限制在20M之内
              </span>
            </FileUpload>
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }

  const { userInfo } = storage.get("gd-user", {})
  return (
    <Fragment>
      <GlobalSandBox
        title="story详情"
        img={sdIcon}
        optNode={(
          <>
            <Popconfirm
              title="确定要同步JIRA吗?"
              onConfirm={(userInfo.userId !== storyDetails.assessor || storyDetails?.issueId) && handleSyncStory}
              okText="确定"
              cancelText="取消"
            >
              <OptButton
                text="同步JIRA"
                disabled={(userInfo.userId !== storyDetails.assessor || storyDetails?.issueId)}
                loading={syncStoryLoading}
                img={syncJIRAButton}
              />
            </Popconfirm>
            {
              editModalVisible && (
                <>
                  <OptButton
                    text="取消"
                    img={editButton}
                    onClick={() => setEditModalVisible(false)}
                  />
                  <OptButton
                    text="保存"
                    loading={saveStoryLoading}
                    img={editButton}
                    onClick={handleOk}
                  />
                </>
              )
            }
            {
              !editModalVisible && (
                <OptButton
                  text="编辑"
                  img={editButton}
                  onClick={() => setEditModalVisible(true)}
                />
              )
            }
          </>
        )}
      >
        <Form>
          <div className={styles.detailPanel}>
            {
              !editModalVisible && (
                <Descriptions column={3} bordered>
                  {
                    detailList.map((v, i) => (
                      <Descriptions.Item
                        key={i.toString()}
                        span={v.span}
                        label={
                          <>
                            {v.required && <span style={{ color: 'red' }}>*</span>}
                            {v.name}
                          </>
                        }
                      >
                        {v.value}
                      </Descriptions.Item>
                    ))
                  }
                  <Descriptions.Item span={3} label="描述">
                    <div dangerouslySetInnerHTML={{ __html: storyDetails?.description }} />
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="附件">
                    <FileUpload
                      uploadType='6'
                      urls={fileList}
                      handleSaveFileUrl={file => setFileList(file)}
                    />
                  </Descriptions.Item>
                </Descriptions>
              )
            }
            {
              editModalVisible && renderEditForm()
            }
          </div>
        </Form>
      </GlobalSandBox>
      <GlobalSandBox img={budgetLog} title="操作日志">
        <StandardTable
          rowKey="id"
          columns={[
            TableColumnHelper.genPlanColumn("operateUserName", "操作人", { width: 120, align: "left" }),
            {
              title: "操作内容",
              align: "center",
              key: "content",
              render: rows => <div className="lFlex" dangerouslySetInnerHTML={{ __html: rows.content}} />
            },
            TableColumnHelper.genDateTimeColumn("createTime", "操作时间", "YYYY-MM-DD HH:mm:ss",{ width: 160, align: "left" })
          ]}
          data={logList}
          loading={loading}
          onChange={handleStandardTableChange}
        />
      </GlobalSandBox>
    </Fragment>
  );
})

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loading: loading.models.global,
  saveStoryLoading: loading.effects["demand/updateStory"],
  syncStoryLoading: loading.effects["demand/syncStory\""],
}))(Form.create()(Index));
