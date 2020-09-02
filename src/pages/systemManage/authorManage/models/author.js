import {
  fetchAllRolesList,
  updateRoleAuthor,
  deleteRoleAuthor,
  addRoleAuthor,
} from '@/services/systemManage/authorManage'
import { PagerHelper } from "@/utils/helper";
import { message } from "antd";

const Author = {
  namespace: 'authorManage',
  state: {
    roleList: PagerHelper.genListState(),
  },
  effects: {
    *queryAllRolesList({ payload }, { put, call }) {
      const { code, msg, data } = call(fetchAllRolesList, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'saveData',
        payload: { roleList: PagerHelper.resolveListState(data)}
      })
    }
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  }
}

export default Author
