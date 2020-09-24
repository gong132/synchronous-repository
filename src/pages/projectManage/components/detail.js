import React, { PureComponent, Fragment } from 'react'
import GlobalSandBox from '@/components/commonUseModule/globalSandBox';
import StandardTable from '@/components/StandardTable';
import OptButton from '@/components/commonUseModule/optButton';
import { TableColumnHelper, DefaultPage } from '@/utils/helper';
import { getParam } from '@/utils/utils'
import flowIcon from '@/assets/icon/modular_lcjd.svg';
import budgetXqIcon from '@/assets/icon/modular_xq.svg';
import budgetLogIcon from '@/assets/icon/modular_czrz.svg';
import editIcon from '@/assets/icon/Button_bj.svg';
import {
  Form,
  Descriptions,
  Input,
  Select,
  DatePicker,
} from 'antd'
import { connect } from 'dva'
import styles from '../index.less'

const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const { Option } = Select

@Form.create()
@connect(({ project }) => ({
  project
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editBool: false,
    }
  }

  // 查日志
  handleQueryLogList = (obj = {}) => {
    const id = getParam('id');
    const params = {
      linkId: id,
      type: '7',
    };
    this.props.dispatch({
      type: 'project/fetchLogList',
      payload: {
        ...DefaultPage,
        ...params,
        ...obj,
      },
    });
  };

  // 日志分页操作
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.handleQueryLogList(params);
  };

  render() {
    const { editBool } = this.state
    const { form } = this.props
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '操作人', { width: '100px' }),
      TableColumnHelper.genPlanColumn('content', '操作内容'),
      TableColumnHelper.genPlanColumn('updateTime', '操作时间', { width: '100px' }),
    ];

    const proColumns = [
      TableColumnHelper.genPlanColumn('operateUserName', '里程碑阶段'),
      TableColumnHelper.genPlanColumn('content1', '负责人'),
      TableColumnHelper.genPlanColumn('updateTime', '计划完成日期'),
      TableColumnHelper.genPlanColumn('content2', '创建人'),
      TableColumnHelper.genPlanColumn('content3', '创建时间'),
      TableColumnHelper.genPlanColumn('content4', '修改人'),
      TableColumnHelper.genPlanColumn('content5', '修改时间'),
    ];

    const detailList = [
      {
        span: 2,
        required: false,
        name: '项目名称',
        value: 'title',
        style: { whiteSpace: 'pre' },
      },
      { span: 1, required: false, name: '项目编号', value: 'demandNumber' },
      {
        span: 1,
        required: false,
        name: '项目优先级',
        value: 'status',
        type: 'p',
        // arrDict: BOARD_TITLE_OBJ,
      },
      { span: 1, required: false, name: '项目状态', value: 'budgetNumbers' },
      {
        span: 1,
        required: false,
        name: '项目进度',
        value: 'type',
      },
      {
        span: 1,
        required: false,
        name: '项目进度偏差',
        value: 'priority',
      },
      { span: 1, required: false, name: '项目健康状态', value: 'introducer' },
      { span: 1, required: false, name: '需求优先级', value: 'introducer' },
      { span: 1, required: false, name: '预算编号', value: 'introducer' },
      { span: 1, required: false, name: '所属需求编号', value: 'introducer' },
      { span: 1, required: false, name: '需求提出部门', value: 'introducer' },
      { span: 1, required: false, name: '立项申请团队', value: 'introducer' },
      { span: 1, required: false, name: '技术评审立项金额（万）', value: 'introducer' },
      { span: 1, required: false, name: '立项评审金额（万）', value: 'introducer' },
      { span: 1, required: false, name: '合同成交金额（万）', value: 'introducer' },
      { span: 1, required: false, name: '业务集群/板块', value: 'introducer' },
      { span: 1, required: false, name: '供应商', value: 'introducer' },
      { span: 1, required: false, name: '技术评审状态', value: 'introducer' },
      { span: 1, required: false, name: '立项评审状态', value: 'introducer' },
      { span: 1, required: false, name: '商务状态', value: 'introducer' },
      { span: 1, required: false, name: '项目管理类型', value: 'introducer' },
      { span: 1, required: false, name: '建设方式', value: 'introducer' },
      { span: 1, required: false, name: '系统级别', value: 'introducer' },
      { span: 1, required: false, name: '项目负责人', value: 'introducer' },
      { span: 2, required: false, name: '项目创建时间', value: 'introducer' },
      { span: 1, required: false, name: '项目描述', value: 'introducer', dataIndex: 'description' },
    ];

    const btnStyle = {
      border: '1px solid #D63649',
      borderRadius: '2px',
      color: '#D63649',
    };

    const w = {width: '100%'}

    return (
      <Fragment>
        <GlobalSandBox title="项目进度" img={flowIcon}>
          项目进度
        </GlobalSandBox>
        <GlobalSandBox
          title="项目详情"
          img={budgetXqIcon}
          optNode={
            !editBool ? (
              <OptButton
                style={{
                  backgroundColor: 'white',
                }}
                onClick={() => {
                  this.setState({
                    editBool: true,
                  });
                }}
                img={editIcon}
                text="编辑"
              />
            ) : (
                <div>
                  <OptButton
                    style={{
                      ...btnStyle,
                      backgroundColor: 'white',
                    }}
                    icon="close"
                    onClick={() =>
                      this.setState({
                        editBool: false,
                      })
                    }
                    text="取消"
                  />
                  <OptButton
                    style={{
                      backgroundColor: 'white',
                      marginLeft: '16px',
                    }}
                    // onClick={() => this.handleSubmit()}
                    text="保存"
                  />
                </div>
              )
          }
        >
          <Descriptions column={3} bordered className={styles.formatDetailDesc}>
            {editBool ? (
              <Fragment>
                <DescriptionItem
                  span={3}
                  label={<>{<span style={{ color: 'red' }}>*</span>}项目名称</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目名称!' }],
                      // initialValue: name,
                    })(<Input style={w} placeholder="请输入项目名称" />)}
                  </FormItem>
                </DescriptionItem>
                <DescriptionItem
                  span={3}
                  label={<>{<span style={{ color: 'red' }}>*</span>}项目编号</>}
                >
                  <FormItem>
                    {form.getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入项目编号!' }],
                      // initialValue: name,
                    })(<Input style={w} disabled placeholder="请输入项目编号" />)}
                  </FormItem>
                </DescriptionItem>
              </Fragment>
            ) : (
                detailList.map(
                  (v, i) =>
                    <DescriptionItem
                      key={i.toString()}
                      span={v.span}
                      label={
                        <>
                          {v.required && <span style={{ color: 'red' }}>*</span>}
                          {v.name}
                        </>
                      }
                    >
                      {(v.dataIndex === 'description' && (
                        /* eslint-disable */
                        <div
                          className="infoDescription"
                          style={{ border: 0 }}
                          dangerouslySetInnerHTML={{ __html: v.value ? v.value : '--' }}
                        /> /* eslint-disable */
                      )) ||
                        (v.arrDict && <div style={v.style}>{v.arrDict[v.value]}</div>) || (
                          <div style={v.style}>{v.value}</div>
                        )}
                    </DescriptionItem>
                )
              )}
          </Descriptions>
        </GlobalSandBox>
        <GlobalSandBox title="项目里程碑计划" img={budgetXqIcon}>
          <StandardTable
            rowKey={(record, index) => index}
            columns={proColumns}
          // data={logList}
          // loading={loadingQueryLogData}
          // onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
        <GlobalSandBox title="项目日志" img={budgetLogIcon}>
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            // data={logList}
            // loading={loadingQueryLogData}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>
    )
  }
}
export default Detail