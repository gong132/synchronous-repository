import { queryTeamList,
  // queryTeamBy
} from '@/services/systemManage/teamManage';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const TeamModel = {
  namespace: 'teamManage',
  state: {
    teamList: PagerHelper.genListState(),
    managerList: []
  },
  effects: {
    *fetchTeamData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryTeamList, payload);
      if (code !== 200) {
        message.error(msg);
        return
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
    },
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
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
