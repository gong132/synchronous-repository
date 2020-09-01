import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import StandardTable from "@/components/StandardTable";
import { DefaultPage, TableColumnHelper } from "@/utils/helper";
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import { Card, Descriptions } from 'antd'


@connect(({ sector, global, loading }) => ({
  loadingQueryLogData: loading.effects['global/fetchLogList'],
}))
class SectorDetail extends PureComponent {
  constructor(props) {
    super(props)
  }

  handleQueryBudgetData = (params) => {
    console.log(params)
  }

  // 分页操作
  handleStandardTableChange = pagination => {
    // const formValues = form.getFieldsValue();
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      // ...formValues, // 添加已查询条件去获取分页
    };
    this.handleQueryBudgetData(params)
  };

  render() {
    const detailList = [
      { span: 1, required: true, name: '集群/板块名称', value: '111111', dataIndex: 'name' },
      { span: 1, required: false, name: '所属部门', value: 'bumne', dataIndex: 'deptName' },
      { span: 1, required: false, name: '创建人', value: 'gong', dataIndex: 'createUserName' },
      { span: 1, required: false, name: '创建时间', value: '818', dataIndex: 'createTime' },
      { span: 1, required: false, name: '修改人', value: '胖胖', dataIndex: 'updateUserName' },
      { span: 1, required: false, name: '修改时间', value: '820', dataIndex: 'updateTime' },
    ]
    const columns = [
      TableColumnHelper.genPlanColumn('operateUserName', '修改人'),
      TableColumnHelper.genPlanColumn('content', '修改内容'),
      TableColumnHelper.genPlanColumn('updateTime', '修改时间'),
    ]
    return (
      <Fragment>
        <GlobalSandBox
          img={budget_xq}
          title='板块详情'
        >
          <Descriptions column={3} bordered>
            {
              detailList.map((v, i) => (
                <Descriptions.Item
                  key={i.toString()}
                  span={v.span}
                  label={<>{v.required && <span style={{ color: 'red' }}>*</span>}{v.name}</>}
                >
                  {v.value}
                </Descriptions.Item>
              ))
            }
          </Descriptions>
        </GlobalSandBox>
        <div style={{ height: '16px' }}></div>
        <GlobalSandBox
          img={budget_log}
          title='操作日志'
        >
          <StandardTable
            rowKey={(record, index) => index}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </GlobalSandBox>
      </Fragment>

    )
  }
}

export default SectorDetail