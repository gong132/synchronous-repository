import React, {useEffect} from "react";
import {Button, Descriptions} from "antd";
import GlobalSandBox from "@/components/commonUseModule/globalSandBox";
import budget_xq from '@/assets/icon/modular_xq.svg'
import budget_log from '@/assets/icon/modular_czrz.svg'
import {connect} from "dva";
import {DefaultPage, findValueByArray, moneyFormatAfter, TableColumnHelper} from "@/utils/helper";
import {BUDGET_TYPE, PROJECT_TYPE} from "@/pages/contractBudget/util/constant";
import StandardTable from "@/components/StandardTable";
import customBtn from "@/components/commonUseModule/customBtn";

const Index = props => {
  const columns = [
    TableColumnHelper.genPlanColumn('operateUserName', '修改人', { width: 200 }),
    TableColumnHelper.genPlanColumn('content', '修改人'),
    TableColumnHelper.genDateTimeColumn('createTime', '修改时间', "YYYY-MM-DD HH:mm:ss",{ width: 200 }),
  ];

  const { dispatch, budgetManage: { budgetDetails, budgetLogList } } = props;

  const handleQueryBudgetDetails = () => {
    const { id } = props.history.location.query;
    dispatch({
      type: 'budgetManage/queryBudgetDetails',
      payload: {
        id,
      }
    })
  };

  const handleQueryBudgetLog = params => {
    const { id } = props.history.location.query;
    dispatch({
      type: 'budgetManage/queryLogList',
      payload: {
        ...DefaultPage,
        linkId: id,
        type: 2,
        ...params,
      }
    })
  };

// 分页操作
  const handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    handleQueryBudgetLog(params)
  };

  useEffect(() => {
    handleQueryBudgetDetails();
    handleQueryBudgetLog()
  }, []);

  // 详情描述列表
  const detailsList = [
    { span: 1, required: true, name: '预算编号', value: budgetDetails.number },
    { span: 1, required: false, name: '项目名称', value: budgetDetails.name },
    { span: 1, required: false, name: '需求部门', value: budgetDetails.deptName },
    { span: 1, required: false, name: '所属集群或板块', value: budgetDetails.clusterName },
    { span: 1, required: false, name: '预计立项时间', value: budgetDetails.expectSetTime },
    { span: 1, required: false, name: '预算总金额', value: moneyFormatAfter(budgetDetails.expectTotalAmount) },
    { span: 1, required: false, name: '硬件预算金额', value: moneyFormatAfter(budgetDetails.hardwareExpectAmount) },
    { span: 1, required: false, name: '软件预算金额', value: moneyFormatAfter(budgetDetails.softwareExpectAmount) },
    { span: 1, required: true, name: '项目类型', value: findValueByArray(PROJECT_TYPE, 'key', budgetDetails.type, 'value') },
    { span: 1, required: true, name: '预算类型', value: findValueByArray(BUDGET_TYPE, 'key', budgetDetails.budgetType, 'value') },
    { span: 1, required: false, name: '承建团队', value: budgetDetails.receiveGroupName },
    { span: 1, required: false, name: '录入人', value: budgetDetails.userName },
    { span: 3, required: false, name: '录入时间', value: budgetDetails.createTime },
  ];

  return (
    <div className="main">
      <GlobalSandBox
        img={budget_xq}
        title="预算详情"
        optNode={<Button type="primary">编辑</Button>}
      >
        <Descriptions column={3} bordered>
          {
            detailsList.map((v, i) => (
              <Descriptions.Item
                key={i.toString()}
                span={v.span}
                label={<>{v.required && <span style={{ color: 'red' }}>*</span>}{v.name}</>}
              >
                {v.value}
              </Descriptions.Item>
            ))
          }
          <Descriptions.Item span={3} label="项目描述">
            <div dangerouslySetInnerHTML={{ __html: budgetDetails.description}}/>
          </Descriptions.Item>
        </Descriptions>
      </GlobalSandBox>
      <GlobalSandBox
        img={budget_log}
        title="操作日志"
        sandboxStyle={{ marginTop: 16 }}
      >
          <StandardTable
            rowKey="id"
            columns={columns}
            data={budgetLogList}
            onChange={handleStandardTableChange}
          />
      </GlobalSandBox>
    </div>
  )
};
export default connect(
  ({ budgetManage, loading }) => ({
    budgetManage,
    loading: loading.models.budgetManage
  })
)(Index)
