
import { queryDept, fetchSystemList, fetchAllCluster } from '@/services/global'
import { message } from 'antd'

const Demand = {
  namespace: 'demandForm',
  state: {
    formType: 'demandSide',
    deptList: [],
    deptNameArr:[],
    systemList: [],
    systemNameArr: [],
    clusterList: []
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

    // 查询系统列表
    *querySystemList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchSystemList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      const arr = []
      data.map(v => {
        arr.push(v.name)
        return true
      })

      yield put({
        type: 'saveData',
        payload: {
          systemList: data,
          systemNameArr: arr
        },
      });
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