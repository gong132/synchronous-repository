import React, { useState, Fragment, useEffect } from 'react';
import { connect } from 'dva';
import {
  Button,
  DatePicker,
  Col,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Tabs,
  Tooltip,
  Popover,
} from 'antd';
import styles from './home.less';
import StandardTable from '@/components/StandardTable';
import { isEmpty } from '@/utils/lang';
import { PagerHelper, TableColumnHelper } from '@/utils/helper';
import OptButton from '@/components/commonUseModule/optButton';
import readButton from '@/assets/icon/read.svg';
import { formLayoutItem } from '@/utils/constant';
import _ from "lodash";
import ListOptBtn from "@/components/commonUseModule/listOptBtn";
import eyeIcon from "@/assets/icon/cz_ck.svg";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const Index = props => {
  const {
    dispatch,
    form,
    loading,
    home: { messageList },
    global: {
      userList: { list = [] },
    },
  } = props;

  const [msgStatus, setMsgStatus] = useState('0');

  const [selectedRows, setSelectedRows] = useState([]);

  const handleQueryMessageList = params => {
    dispatch({
      type: 'home/queryMessageList',
      payload: {
        readStatus: msgStatus,
        ...PagerHelper.DefaultPage,
        ...params,
      },
    });
  };
  const handleBatchModifyRead = (msgId, eventType, callback) => {
    let msgIds = [];
    if (eventType === 'rowClick' && msgId) msgIds = [msgId];
    if (eventType !== 'rowClick' && selectedRows.length === 0) {
      message.warning('请选择至少一条消息');
      return;
    }
    if (eventType !== 'rowClick' && selectedRows.length > 0) {
      msgIds = selectedRows.map(v => v.id);
    }
    dispatch({
      type: 'home/batchModifyRead',
      payload: {
        flag: 1,
        notices: msgIds,
      },
    }).then(res => {
      if (!res) return;
      setSelectedRows([]);
      handleQueryMessageList();
      callback && callback();
    });
  };
  const handleQueryUserList = () => {
    dispatch({
      type: 'global/queryUserList',
      payload: {},
    });
  };

  useEffect(() => {
    handleQueryMessageList();
    handleQueryUserList();
  }, []);

  const handleTabsChange = key => {
    setMsgStatus(key);
    form.resetFields();
    setSelectedRows([]);
    handleQueryMessageList({ readStatus: key });
  };

  // 分页操作
  const handleStandardTableChange = (pagination, filters, sorter) => {
    const formValues = form.getFieldsValue();

    const sortParams = {
      sortBy: sorter.columnKey,
      orderFlag: sorter.order === 'ascend' ? 1 : -1,
    };

    const params = {
      readStatus: msgStatus,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues, // 添加已查询条件去获取分页
      ...sortParams, // 排序参数
    };
    handleQueryMessageList(params);
  };

  const handleSearchForm = () => {
    const formValues = form.getFieldsValue();
    const params = {
      ...formValues,
      startTime: !isEmpty(formValues.RangeDate) ? formValues.RangeDate[0].format('YYYY-MM-DD') : null,
      endTime: !isEmpty(formValues.RangeDate) ? formValues.RangeDate[1].format('YYYY-MM-DD') : null,
    };
    delete params.RangeDate;
    handleQueryMessageList(params);
  };

  const handleResetForm = e => {
    e.stopPropagation();
    form.resetFields();
    handleQueryMessageList();
  };

  const handleGotoTargetByType = rows => {
    //   { key: 'p', value: '项目需求' },
    //   { key: 'u', value: '一般需求' },
    const { demandId, demandType, linkUrlType, linkId, title } = rows;
    if (linkUrlType === 1 && demandType === 'u') {
      props.history.push({
        pathname: '/demand/generalDemand/detail',
        query: {
          id: demandId,
          no: linkId,
        },
      });
      msgStatus === '0' && handleBatchModifyRead(rows.id, 'rowClick');
      return;
    }
    if (linkUrlType === 1 && demandType === 'p') {
      props.history.push({
        pathname: '/demand/projectDemand/detail',
        query: {
          id: demandId,
          no: linkId,
        },
      });
      msgStatus === '0' && handleBatchModifyRead(rows.id, 'rowClick');
      return;
    }
    if (linkUrlType === 3) {
      props.history.push({
        pathname: '/survey',
        query: {
          no: linkId,
          t: title,
        },
      });
      msgStatus === '0' && handleBatchModifyRead(rows.id, 'rowClick');
      return;
    }
    message.warning('该消息类型暂不支持跳转');
  };

  const columns = [
    {
      title: '编号',
      width: 120,
      align: 'center',
      key: 'linkId',
      render: rows => {
        if (isEmpty(rows.linkId, true)) return '';
        return (
          <Tooltip placement="top" title={rows.linkId}>
            <span style={{ color: '#2E5BFF' }} onClick={() => handleGotoTargetByType(rows)}>
              {rows.linkId.length > 10
                ? `${rows.linkId.substring(0, 10)}...`
                : rows.linkId.substring(0, 10)}
            </span>
          </Tooltip>
        );
      },
    },
    TableColumnHelper.genLangColumn('title', '标题', { width: 180 }, 12, 'left'),
    TableColumnHelper.genPlanColumn('userName', '发送者', { width: 120 }),
    {
      title: '消息内容',
      align: 'center',
      width: 540,
      key: 'content',
      render: rows => {
        if (isEmpty(rows.content, true)) return '';
        // eslint-disable-next-line
        // return <div dangerouslySetInnerHTML={{ __html: rows.content }} />;
        const text = <div dangerouslySetInnerHTML={{ __html: rows.content }} />;
        return (
          <Popover content={text} trigger="hover" title={rows?.title}>
            <div
              style={{ width: 550, textAlign: 'left' }}
              className="overHide"
              dangerouslySetInnerHTML={{ __html: rows.content }}
            />
          </Popover>
        );
      },
    },
    TableColumnHelper.genDateTimeColumn('createTime', '创建时间', 'YYYY-MM-DD HH:mm:ss', {
      width: 180,
      sorter: true,
    }),
    {
      title: '操作',
      width: 120,
      align: 'center',
      render: rows => (
        <Fragment>
          <ListOptBtn
            title="查看"
            icon={eyeIcon}
            style={{
              fontSize: '24px',
              position: 'relative',
              top: '5px'
            }}
            onClick={() => handleGotoTargetByType(rows)}
          />
          {msgStatus === '0' && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title={`确定要标记（${rows.title}）为已读吗?`}
                onConfirm={() =>
                  handleBatchModifyRead(rows.id, 'rowClick', () => message.success('标记成功'))
                }
                okText="确定"
                cancelText="取消"
              >
                <ListOptBtn
                  title="标为已读"
                  icon={readButton}
                  style={{
                    fontSize: '24px',
                    position: 'relative',
                    top: '5px'
                  }}
                />
              </Popconfirm>
            </>
          )}
        </Fragment>
      ),
    },
  ];
  const renderForm = () => {
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span={5}>
          <FormItem {...formLayoutItem} label="标题/编号" colon={false}>
            {getFieldDecorator(
              'titleAndNumber',
              {},
            )(<Input onChange={_.debounce(handleSearchForm, 500)} placeholder="请输入标题/编号关键字" />)}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formLayoutItem} label="发送者" colon={false}>
            {getFieldDecorator('userId')(
              <Select
                style={{ width: '100%' }}
                placeholder="请选择发送者"
                allowClear
                showSearch
                onChange={_.debounce(handleSearchForm, 500)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  JSON.stringify(option.props.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {list &&
                  list.map(v => (
                    <Option value={v.userId} key={v.userId}>
                      {v.userName}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formLayoutItem} label="消息内容" colon={false}>
            {getFieldDecorator('content')(
              <Input onChange={_.debounce(handleSearchForm, 500)} placeholder="请输入消息内容" />,
            )}
          </FormItem>
        </Col>
        <Col span={7}>
          <FormItem {...formLayoutItem} label="创建时间" colon={false}>
            {getFieldDecorator('RangeDate')(
              <RangePicker onChange={_.debounce(handleSearchForm, 500)} format="YYYY-MM-DD" />,
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <Button ghost type="primary" onClick={handleResetForm}>
            重置
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div className="main">
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{renderForm()}</div>
        <Tabs activeKey={msgStatus} className={styles.tabBarStyle} onChange={handleTabsChange}>
          <Tabs.TabPane key="0" tab="未读消息">
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              onSelectRow={rows => setSelectedRows(rows)}
              loading={loading}
              columns={columns}
              data={messageList}
              onChange={handleStandardTableChange}
              scroll={{ x: 1290 }}
            />
            {messageList?.list && messageList?.list.length > 0 && (
              <Button
                ghost
                type="primary"
                style={{ position: 'absolute', bottom: 16 }}
                onClick={() => handleBatchModifyRead('', null, () => message.success('标记成功'))}
              >
                标为已读
              </Button>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane key="1" tab="已读消息">
            <StandardTable
              rowKey="id"
              loading={loading}
              columns={columns}
              data={messageList}
              onChange={handleStandardTableChange}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default connect(({ global, home, loading }) => ({
  global,
  home,
  loading: loading.models.home,
}))(Form.create()(Index));
