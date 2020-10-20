
import { queryProjectReportForm } from '@/services/reportForm/projectForm'
import { message } from 'antd'

const Demand = {
  namespace: 'projectForm',
  state: {
    clusterList: [],
    stageList: [],
    teamList: [],
    projectTotal: 0,
    contractAmountTotal:'',
    estAmountTotal: ''
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
      const { projectClusterReportVOS, projectStageReportVOS, projectVOS, projectTotal, contractAmountTotal, estAmountTotal } = data
      yield put({
        type: 'saveData',
        payload: {
          clusterList: projectClusterReportVOS,
          stageList: projectStageReportVOS,
          teamList: projectVOS,
          projectTotal,
          estAmountTotal,
          contractAmountTotal,
        },
      });
      return true
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