
import { queryDept, fetchSystemList, fetchAllCluster, queryGroup } from '@/services/global'
import { queryDemandBoard, } from '@/services/demand/demand'
import { queryDemandReportForm } from '@/services/reportForm/demandForm'
import { message } from 'antd'

const Demand = {
  namespace: 'demandForm',
  state: {
    formType: 'demandSide',
    deptList: [],
    systemList: [],
    clusterList: [],
    statusList: [],
    teamData: [],
    finishData: [],
    currentNumber: 0,
    showOtherFlag: false,
    total: 0,
  },
  effects: {
    // 查询需求报表
    *queryDemandReportForm({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryDemandReportForm, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      console.log(payload)
      if (payload.type === 1) {
        const { demandClusterReportVOS, demandDeptReportVOS, demandStatusReportVOS } = data
        yield put({
          type: 'saveData',
          payload: {
            clusterList: demandClusterReportVOS,
            deptList: demandDeptReportVOS,
            statusList: demandStatusReportVOS
          },
        });
      }
      if(payload.type === 2) {
        const {demandSystemReportVOS, demandTeamReportVOS, goingCount, overCount, currentNumber, count, showOtherFlag} = data
        yield put({
          type: 'saveData',
          payload: {
            systemList: demandSystemReportVOS,
            teamData: demandTeamReportVOS,
            finishData: [{name: '未完成', count: goingCount}, {name: '已完成', count: overCount}],
            currentNumber,
            total: count,
            showOtherFlag,
          },
        });
      }

      return true;
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
export default Demand