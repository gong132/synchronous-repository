import {
  fetchAllRoles,
  updateRoleAuthor,
  deleteRoleAuthor,
  addRoleAuthor,
} from '@/services/systemManage/authorManage'
import { PagerHelper } from "@/utils/helper";
import { message } from "antd";

const Author = {
  namespace: 'authorManage',
  state: {
    roleList: [PagerHelper.genListState()],
  },
  effects: {
    
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