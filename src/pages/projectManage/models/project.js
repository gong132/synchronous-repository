
import { PagerHelper } from '@/utils/helper';
import {
  queryAllCluster
} from '@/services/project/project'
import { message } from 'antd'

const Project = {
  namespace: 'project',
  state: {
    projectList: PagerHelper.genListState(),
    clusterList: []
  },
  effects: {
    // 查询所有集群板块
    *queryAllCluster({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryAllCluster, payload)
      if (code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'saveData',
        payload: {
          clusterList: data
        },
      })
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setProjectData(state, action) {
      return {
        ...state,
        sectorList: PagerHelper.resolveListState(action.payload),
      };
    },
    setLogData(state, action) {
      return {
        ...state,
        logList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
}
export default Project