
import { queryDept, fetchSystemList, fetchAllCluster, queryGroup } from '@/services/global'
import { queryDemandBoard, } from '@/services/demand/demand'
import { queryAllStageStatus } from '@/services/project/project'
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
  },
  effects: {
    // 查询部门
    *queryDept({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryDept, payload)
      if (!data || code !== 200) {
        message.error(msg)
        return false
      }
      const arr = []
      data.map(v => {
        arr.push(v.name)
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          deptList: data,
          deptNameArr: arr
        }
      })
    },

    // 获取项目所有阶段状态
    *queryAllStageStatus({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryAllStageStatus, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {};
      data.map(v => {
        obj[v.id] = v.pjStageName;
        return true;
      });
      yield put({
        type: 'saveData',
        payload: {
          stageStatus: data,
          stageStatusMap: obj,
        },
      });
      return true;
    },

    // 查询集群板块
    *queryCluster({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchAllCluster, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          clusterList: data,
        },
      });
    },

    // 查需求
    *queryDemandBoard({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryDemandBoard, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          demandData: data,
        },
      });
    },

    // 查团队
    *queryTeam({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryGroup, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          teamData: data,
        },
      });
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