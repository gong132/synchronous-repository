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
} from 'antd';
import styles from './home.less';
import StandardTable from '@/components/StandardTable';
import { isEmpty } from '@/utils/lang';
import { PagerHelper, TableColumnHelper } from '@/utils/helper';
import OptButton from '@/components/commonUseModule/optButton';
import readButton from '@/assets/icon/read.svg';
import { formLayoutItem } from '@/utils/constant';

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
  const handleBatchModifyRead = msgId => {
    let msgIds = [];
    if (msgId && selectedRows.length === 0) msgIds = [msgId];
    if (!msgId && selectedRows.length === 0) {
      message.warning('请选择至少一条消息');
      return;
    }
    if (!msgId && selectedRows.length > 0) {
      console.log(selectedRows, 'selectedRows');
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
      message.success('标记成功');
      handleQueryMessageList();
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
    form.validateFields((err, val) => {
      if (err) return;
      const params = {
        ...val,
        startTime: !isEmpty(val.RangeDate) ? val.RangeDate[0].format('YYYY-MM-DD') : null,
        endTime: !isEmpty(val.RangeDate) ? val.RangeDate[1].format('YYYY-MM-DD') : null,
      };
      delete params.RangeDate;
      handleQueryMessageList(params);
    });
  };

  const handleResetForm = e => {
    e.stopPropagation();
    form.resetFields();
    handleQueryMessageList();
  };

  const columns = [
    {
      title: '编号',
      align: 'center',
      key: 'linkId',
      render: rows => {
        if (isEmpty(rows.linkId, true)) return '';
        return (
          <Tooltip placement="top" title={rows.linkId}>
            <span
              style={{ color: '#2E5BFF' }}
              onClick={() => {
                props.history.push({
                  pathname: '/contract-budget/budget/detail',
                  query: {
                    id: rows.id,
                  },
                });
              }}
            >
              {rows.linkId.length > 10
                ? `${rows.linkId.substring(0, 10)}...`
                : rows.linkId.substring(0, 10)}
            </span>
          </Tooltip>
        );
      },
    },
    TableColumnHelper.genPlanColumn('title', '标题'),
    TableColumnHelper.genPlanColumn('userId', '发送者'),
    {
      title: '消息内容',
      align: 'center',
      key: 'content',
      render: rows => {
        if (isEmpty(rows.content, true)) return '';
        // eslint-disable-next-line
        return <div dangerouslySetInnerHTML={{ __html: rows.content }} />;
      },
    },
    TableColumnHelper.genDateTimeColumn('createTime', '创建时间', 'YYYY-MM-DD HH:mm:ss', {
      sorter: true,
    }),
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: rows => (
        <Fragment>
          <OptButton
            icon="eye"
            text="查看"
            showText={false}
            onClick={() => {
              props.history.push({
                pathname: '/contract-budget/budget/detail',
                query: {
                  id: rows.id,
                },
              });
            }}
          />
          {msgStatus === '0' && (
            <>
              <Divider type="vertical" />
              <Popconfirm
                title={`确定要标记（${rows.title}）为已读吗?`}
                onConfirm={() => handleBatchModifyRead(rows.id)}
                okText="确定"
                cancelText="取消"
              >
                <OptButton img={readButton} text="标为已读" showText={false} />
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
          <FormItem {...formLayoutItem} label="标题/编号">
            {getFieldDecorator(
              'titleAndNumber',
              {},
            )(<Input onBlur={handleSearchForm} placeholder="请输入标题/编号关键字" />)}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formLayoutItem} label="发送者">
            {getFieldDecorator('userId')(
              <Select
                onBlur={handleSearchForm}
                style={{ width: '100%' }}
                placeholder="请选择发送者"
                allowClear
              >
                {list &&
                  list.map(v => (
                    <Option value={v.loginid} key={v.loginid}>
                      {v.lastname}
                    </Option>
                  ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formLayoutItem} label="消息内容">
            {getFieldDecorator('content')(
              <Input onBlur={handleSearchForm} placeholder="请输入消息内容" />,
            )}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formLayoutItem} label="创建时间">
            {getFieldDecorator('RangeDate')(
              <RangePicker onBlur={handleSearchForm} format="YYYY-MM-DD" />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
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
            />
            {messageList?.list && messageList?.list.length > 0 && (
              <Button
                ghost
                type="primary"
                style={{ position: 'absolute', bottom: 16 }}
                onClick={() => handleBatchModifyRead()}
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
