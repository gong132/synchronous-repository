import { queryTeamList,
  queryTeamHeader
} from '@/services/systemManage/teamManage';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const TeamModel = {
  namespace: 'teamManage',
  state: {
    teamList: PagerHelper.genListState(),
    managerList: [],
    teamHeader: []
  },
  effects: {
    *fetchTeamData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryTeamList, payload);
      if (code !== 200) {
        message.error(msg);
        return false
      }
      const { records, ...others } = data;
      yield put({
        type: 'setTeamData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
      const arr = []
      data.data.map(v => {
        arr.push(v.teamHeaderName)
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          managerList: arr
        }
      })
      return true
    },

    // 查团队经理
    *queryTeamHeader({payload}, {call, put}) {
      const { code, data, msg } = yield call(queryTeamHeader, payload)
      if (code !== 200) {
        message.error(msg);
        return false
      }
      yield put({
        type: 'saveData',
        payload: {
          teamHeader: data
        }
      })
    }
  },
  reducers: {
    saveData(state, {payload}) {
      return { ...state, ...payload };
    },
    setTeamData(state, action) {
      return {
        ...state,
        teamList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default TeamModel;
