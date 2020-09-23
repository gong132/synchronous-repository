import React, {useEffect, useState} from "react";
import styles from "@/pages/demand/index.less";
import StandardTable from "@/components/StandardTable";
import AddStory from "@/pages/demand/components/story/addStory";
import ITAssess from "@/pages/demand/components/story/ITAssess";
import TurnAssess from "@/pages/demand/components/story/turnAssign";
import {PagerHelper, TableColumnHelper} from "@/utils/helper";
import { connect } from "dva";
import {Button, Col, DatePicker, Form, Icon, Input, Popover, Row, Select} from "antd";
import { formLayoutItem, formLayoutItem2 } from "@/utils/constant";
import {STORY_PRIORITY, STORY_STATUS, STORY_TYPE} from "@/pages/demand/util/constant";
import classNames from "classnames";
import bottomIcon from "@/assets/icon/drop_down.svg";
import upIcon from "@/assets/icon/Pull_up.svg";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const Index = props => {

  const { dispatch, form, addStoryModalVisible, itAssessModalVisible, turnAssessModalVisible,
    selectedStoryRows, setSelectedStoryRows, handleModalVisible,
    handleQueryStoryList, loadingQueryStoryData, demandInfo,
    demand: { storyList }, global: { systemList, userList }} = props

  const [searchMore, setSearchMore] = useState(false)

  const handleStoryTableChange = pagination => {
      // const formValues = form.getFieldsValue();
      const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        // ...formValues, // 添加已查询条件去获取分页
      };
      handleQueryStoryList(params);
    };

  const handleQuerySystemList = () => {
    dispatch({
      type: "global/querySystemList",
      payload: {
        ...PagerHelper.MaxPage,
      }
    })
  }

  const handleQueryUserList = () => {
    dispatch({
      type: "global/queryUserList",
      payload: {
        ...PagerHelper.MaxPage,
      }
    })
  }

  useEffect(() => {
    handleQuerySystemList()
    handleQueryUserList()
  }, [])
  const storyColumns = [
    TableColumnHelper.genPopoverColumn('number', 'story编号', 8),
    TableColumnHelper.genPlanColumn('title', '标题'),
    TableColumnHelper.genPlanColumn('status', '状态'),
    TableColumnHelper.genPlanColumn('priority', '优先级'),
    TableColumnHelper.genPlanColumn('type', 'story类型'),
    TableColumnHelper.genPlanColumn('systemName', '所属系统'),
    TableColumnHelper.genDateTimeColumn('evaluateTime', 'IT预计上线时间', "YYYY-MM-DD"),
    TableColumnHelper.genPlanColumn('developWorkload', '开发预计测试工作量'),
    TableColumnHelper.genPlanColumn('testWorkload', '测试预计测试工作量'),
    TableColumnHelper.genPlanColumn('assessor', '评估人'),
    TableColumnHelper.genPlanColumn('userName', '创建人'),
    TableColumnHelper.genDateTimeColumn('createTime', '创建时间'),
  ];

  const handleSearchForm = ()=> {
    const formValues = form.getFieldsValue();
    const params =  {
      startTime: formValues?.RangeDate ? formValues?.RangeDate[0].format("YYYY-MM-DD") : null,
      endTime: formValues?.RangeDate ? formValues?.RangeDate[1].format("YYYY-MM-DD") : null,
    }
    handleQueryStoryList({ ...formValues, ...params });
  };

  const handleResetForm = () => {
    setSearchMore(true);
    form.resetFields();
    setSearchMore(false);
    handleQueryStoryList();
  }
  const renderStoryForm = () => {
    const { getFieldDecorator } = form;
    const content = (
      <div className={styles.moreSearch} style={{ width: 230, height: 280 }}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="创建时间">
              {getFieldDecorator('RangeDate')(
                <RangePicker
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择经办人" allowClear>
                  {STORY_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="评估人">
              {getFieldDecorator('assessor')(
                <Select placeholder="请选择评估人" allowClear>
                  {userList?.list && userList.list.map(v => (
                    <Option value={v.loginid} key={v.loginid.toString()}>
                      {v.lastname}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={() => setSearchMore(false)}>取消</Button>
          <Button type="primary" onClick={handleSearchForm}>查询</Button>
        </div>
      </div>
    );
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="story编号标题" colon={false}>
              {getFieldDecorator('title')(
                <Input
                  allowClear
                  onBlur={handleSearchForm}
                  placeholder="请输入story编号标题"
                />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="状态" colon={false}>
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择story状态"
                >
                  {
                    STORY_STATUS.map(v => (
                      <Option value={v.value} key={v.value}>{v.value}</Option>
                    ))
                  }
                </Select>
                )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="优先级" colon={false}>
              {getFieldDecorator('priority')(
                <Select
                  placeholder="请选择优先级"
                >
                  {
                    STORY_PRIORITY.map(v => (
                      <Option value={v.key} key={v.key}>{v.value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="所属系统" colon={false}>
              {getFieldDecorator('systemId')(
                <Select
                  placeholder="请选择所属系统"
                >
                  {
                    systemList?.list && systemList.list.map(v => (
                      <Option value={v.id} key={v.id}>{v.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button
                ghost
                className={classNames('margin-right-6', styles.orangeForm)}
                onClick={handleResetForm}
              >
                重置
              </Button>
              <Popover
                visible={searchMore}
                placement="bottomRight"
                content={content}
                trigger="click"
              >
                <div className="yCenter">
                  {
                    !searchMore ? (
                      <span className="activeColor" onClick={() => setSearchMore(true)}>
                        <Icon style={{ verticalAlign: '-0.4em' }} component={bottomIcon} />
                        更多
                      </span>
                    ) : (
                      <span className="activeColor" onClick={() => setSearchMore(false)}>
                        <Icon style={{ verticalAlign: '-0.4em' }} component={upIcon} />
                        隐藏
                      </span>
                    )
                  }
                </div>
              </Popover>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };
  return (
    <div className={styles.tableList}>
      <div className={styles.tableListForm}>{renderStoryForm()}</div>
      <StandardTable
        rowKey="id"
        selectedRows={selectedStoryRows}
        onSelectRow={rows => setSelectedStoryRows(rows)}
        columns={storyColumns}
        data={storyList}
        loading={loadingQueryStoryData}
        onChange={handleStoryTableChange}
      />

      {addStoryModalVisible && (
        <AddStory
          type="add"
          modalVisible={addStoryModalVisible}
          handleModalVisible={() => handleModalVisible(false, "addStoryModalVisible")}
          values={{demandName: demandInfo?.title, demandNumber: demandInfo?.demandNumber}}
          handleQueryStoryList={handleQueryStoryList}
        />
      )}
      {itAssessModalVisible && (
        <ITAssess
          modalVisible={itAssessModalVisible}
          handleModalVisible={() => handleModalVisible(false, "itAssessModalVisible")}
          values={demandInfo}
        />
      )}
      {turnAssessModalVisible && (
        <TurnAssess
          modalVisible={turnAssessModalVisible}
          handleModalVisible={() => handleModalVisible(false, "turnAssessModalVisible")}
          values={demandInfo}
        />
      )}
    </div>
  )
}

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loadingQueryStoryData: loading.effects['demand/queryStoryList'],
}))(Form.create()(Index))
