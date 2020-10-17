
import { queryProjectReportForm } from '@/services/reportForm/projectForm'
import { message } from 'antd'

const Demand = {
  namespace: 'projectForm',
  state: {
    deptList: [],
    deptNameArr: [],
    systemList: [],
    systemNameArr: [],
    clusterList: [],
    demandData: [],
    teamData: [],
    stageStatus: [],
    projectList: [],
    projectListName:[]
  },
  effects: {
     // 查询项目报表
     *queryProjectReportForm({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryProjectReportForm, payload)
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