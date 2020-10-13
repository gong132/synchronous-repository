import React, { Fragment, useEffect, useState } from 'react';
import styles from '@/pages/demand/index.less';
import StandardTable from '@/components/StandardTable';
import AddStory from '@/pages/demand/components/story/addStory';
import ITAssess from '@/pages/demand/components/story/ITAssess';
import TurnAssess from '@/pages/demand/components/story/turnAssign';
import { PagerHelper, TableColumnHelper } from '@/utils/helper';
import { connect } from 'dva';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Popconfirm,
  Popover,
  Row,
  Select,
  Tooltip,
} from 'antd';
import { formLayoutItem, formLayoutItem2 } from '@/utils/constant';
import { STORY_PRIORITY, STORY_STATUS, STORY_TYPE } from '@/pages/demand/util/constant';
import classNames from 'classnames';
import bottomIcon from '@/assets/icon/drop_down.svg';
import upIcon from '@/assets/icon/Pull_up.svg';
import { isEmpty } from '@/utils/lang';
import storage from '@/utils/storage';
import OptButton from '@/components/commonUseModule/optButton';
import edit from '@/assets/icon/Button_bj.svg';
import { router } from 'umi/index';
import deleteIcon from '@/assets/icon/Button_del.svg';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const Index = props => {
  const {
    dispatch,
    form,
    addStoryModalVisible,
    itAssessModalVisible,
    turnAssessModalVisible,
    selectedStoryRows,
    setSelectedStoryRows,
    handleModalVisible,
    handleQueryStoryList,
    loadingQueryStoryData,
    demandInfo,
    demand: { systemList, storyList },
    global: { userList },
  } = props;

  const [searchMore, setSearchMore] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const handleStoryTableChange = (pagination, filters, sorter)  => {
    const { RangeDate, ...others } = form.getFieldsValue();
    const formValues = {
      ...others,
      startTime: RangeDate ? RangeDate[0].format("YYYY-MM-DD") : null,
      endTime: RangeDate ? RangeDate[1].format("YYYY-MM-DD") : null,
    }
    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...sortParams,
      ...formValues, // 添加已查询条件去获取分页
    };

    handleQueryStoryList(params);
  };

  const handleQuerySystemList = () => {
    dispatch({
      type: 'demand/querySystemList',
      payload: {
        ...PagerHelper.MaxPage,
      },
    });
  };

  const handleQueryUserList = () => {
    dispatch({
      type: 'global/queryUserList',
      payload: {
        ...PagerHelper.MaxPage,
      },
    });
  };

  const handleUpdateStory = ids => {
    dispatch({
      type: 'demand/updateStory',
      payload: {
        id: ids,
        isDelete: 1,
      },
    }).then(sure => {
      if (!sure) return;
      message.success('删除成功');
      handleQueryStoryList();
    });
  };

  // 同步JIRA
  const handleSyncStory = () => {
    dispatch({
      type: 'demand/syncStory',
      payload: {
        storyId: props?.location?.query?.id,
      },
    }).then(res => {
      if (!res) return;
      message.success('同步成功');
      handleQueryStoryList();
    });
  };

  useEffect(() => {
    handleQuerySystemList();
    handleQueryUserList();
  }, []);
  const storyColumns = [
    {
      title: 'story编号',
      key: 'number',
      sorter: true,
      width: 120,
      render: rows => {
        if (isEmpty(rows.number, true)) return '';
        return (
          <Tooltip placement="top" title={rows.number}>
            <span
              style={{ color: '#2E5BFF', cursor: 'pointer' }}
              onClick={() => {
                router.push({
                  pathname: '/demand/storyDetail',
                  query: {
                    id: rows.id,
                  },
                });
              }}
            >
              {rows.number.length > 8
                ? `${rows.number.substring(0, 8)}...`
                : rows.number.substring(0, 8)}
            </span>
          </Tooltip>
        );
      },
    },
    TableColumnHelper.genPlanColumn('title', '标题'),
    TableColumnHelper.genPlanColumn('status', '状态', { sorter: true }),
    TableColumnHelper.genPlanColumn('priority', '优先级', { sorter: true }),
    TableColumnHelper.genPlanColumn('type', 'story类型', { sorter: true }),
    TableColumnHelper.genLangColumn('systemName', '所属系统', {}, 10),
    TableColumnHelper.genDateTimeColumn('evaluateTime', 'IT预计上线日期', 'YYYY-MM-DD', { width: 150, sorter: true }),
    TableColumnHelper.genPlanColumn('developWorkload', '开发预计测试工作量', { width: 180, sorter: true }),
    TableColumnHelper.genPlanColumn('testWorkload', '测试预计测试工作量', { width: 180, sorter: true }),
    TableColumnHelper.genPlanColumn('assessor', '评估人'),
    TableColumnHelper.genPlanColumn('userName', '创建人'),
    TableColumnHelper.genDateTimeColumn('createTime', '创建时间',  'YYYY-MM-DD', { sorter: true }),
    {
      title: '操作',
      width: 170,
      align: 'center',
      render: rows => {
        const { userInfo } = storage.get('gd-user', {});
        const isDelete = userInfo?.userId === rows?.userId && !rows?.issueId;
        return (
          <Fragment>
            <OptButton
              img={edit}
              showText={false}
              text="编辑"
              onClick={() => {
                setAddModalVisible(true);
                setSelectedRows(rows);
              }}
            />
            <Divider type="vertical" />
            <OptButton
              icon="eye"
              text="查看"
              showText={false}
              onClick={() => {
                router.push({
                  pathname: '/demand/storyDetail',
                  query: {
                    id: rows.id,
                  },
                });
              }}
            />
            <Divider type="vertical" />

            <Popconfirm
              title="确定要同步JIRA吗?"
              onConfirm={(userInfo.userId !== rows.assessor || rows?.issueId) && handleSyncStory}
              okText="确定"
              cancelText="取消"
            >
              <OptButton
                icon="sync"
                text="同步"
                disabled={userInfo.userId !== rows.assessor || rows?.issueId}
                showText={false}
              />
            </Popconfirm>
            <Divider type="vertical" />

            <Popconfirm
              title={`确定要删除${rows.title}吗?`}
              onConfirm={() => isDelete && handleUpdateStory(rows.id)}
              okText="确定"
              cancelText="取消"
            >
              <OptButton
                img={deleteIcon}
                showText={false}
                style={isDelete ? { color: '#d63649' } : { color: '#b0bac9' }}
                text="删除"
                disabled={!isDelete}
              />
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  const handleSearchForm = () => {
    const formValues = form.getFieldsValue();
    const params = {
      startTime: formValues?.RangeDate ? formValues?.RangeDate[0].format('YYYY-MM-DD') : null,
      endTime: formValues?.RangeDate ? formValues?.RangeDate[1].format('YYYY-MM-DD') : null,
    };
    handleQueryStoryList({ ...formValues, ...params });
  };

  const handleResetForm = () => {
    setSearchMore(true);
    form.resetFields();
    setSearchMore(false);
    handleQueryStoryList();
  };
  const renderStoryForm = () => {
    const { getFieldDecorator } = form;
    const content = (
      <div className={styles.moreSearch} style={{ width: 230, height: 280 }}>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="创建时间">
              {getFieldDecorator('RangeDate')(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择类型" allowClear>
                  {STORY_TYPE.map(v => (
                    <Option value={v.key} key={v.key.toString()}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formLayoutItem2} label="评估人">
              {getFieldDecorator('assessor')(
                <Select placeholder="请选择评估人" allowClear>
                  {userList?.list &&
                    userList.list.map(v => (
                      <Option value={v.loginid} key={v.loginid.toString()}>
                        {v.lastname}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.moreSearchButton}>
          <Button onClick={() => setSearchMore(false)}>取消</Button>
          <Button type="primary" onClick={handleSearchForm}>
            查询
          </Button>
        </div>
      </div>
    );
    return (
      <Form layout="inline">
        <Row>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="story编号/标题" colon={false}>
              {getFieldDecorator('titleAndNumber')(
                <Input allowClear onBlur={handleSearchForm} placeholder="请输入story编号标题" />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="状态" colon={false}>
              {getFieldDecorator('status')(
                <Select placeholder="请选择story状态">
                  {STORY_STATUS.map(v => (
                    <Option value={v.value} key={v.value}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="优先级" colon={false}>
              {getFieldDecorator('priority')(
                <Select placeholder="请选择优先级">
                  {STORY_PRIORITY.map(v => (
                    <Option value={v.key} key={v.key}>
                      {v.value}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem {...formLayoutItem} label="所属系统" colon={false}>
              {getFieldDecorator('systemId')(
                <Select placeholder="请选择所属系统">
                  {systemList &&
                    systemList.map(v => (
                      <Option value={v.id} key={v.id}>
                        {v.sysName}
                      </Option>
                    ))}
                </Select>,
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
                  {!searchMore ? (
                    <span className="activeColor" onClick={() => setSearchMore(true)}>
                      <Icon style={{ verticalAlign: '-0.4em' }} component={bottomIcon} />
                      更多
                    </span>
                  ) : (
                    <span className="activeColor" onClick={() => setSearchMore(false)}>
                      <Icon style={{ verticalAlign: '-0.4em' }} component={upIcon} />
                      隐藏
                    </span>
                  )}
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
        scroll={{ x: 1880 }}
      />

      {addStoryModalVisible && (
        <AddStory
          type="add"
          modalVisible={addStoryModalVisible}
          handleModalVisible={() => handleModalVisible(false, 'addStoryModalVisible')}
          values={{ demandName: demandInfo?.title, demandNumber: demandInfo?.demandNumber }}
          handleQueryStoryList={handleQueryStoryList}
        />
      )}
      {itAssessModalVisible && (
        <ITAssess
          modalVisible={itAssessModalVisible}
          handleModalVisible={() => handleModalVisible(false, 'itAssessModalVisible')}
          values={demandInfo}
        />
      )}
      {turnAssessModalVisible && (
        <TurnAssess
          modalVisible={turnAssessModalVisible}
          handleModalVisible={() => handleModalVisible(false, 'turnAssessModalVisible')}
          values={demandInfo}
        />
      )}
      {addModalVisible && (
        <AddStory
          values={selectedRows}
          modalVisible={addModalVisible}
          handleModalVisible={() => {
            setAddModalVisible(false);
            setSelectedRows({});
          }}
        />
      )}
    </div>
  );
};

export default connect(({ global, demand, loading }) => ({
  global,
  demand,
  loadingQueryStoryData: loading.effects['demand/queryStoryList'],
}))(Form.create()(Index));
