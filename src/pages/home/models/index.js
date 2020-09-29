import { fetchMessageList, batchModifyRead } from '@/services/home/home';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'home',
  state: {
    messageList: PagerHelper.genListState()
  },
  effects: {
    *queryMessageList({payload}, { call, put }) {
      const { code, data, msg } = yield call(fetchMessageList, payload);
      if (code !== 200) {
        message.error(msg)
        return
      }
      const { datas, ...others } = data;
      yield put({
        type: 'setMessageData',
        payload: {
          filter: payload,
          data: datas,
          ...others
        },
      })
    },
    *batchModifyRead({payload}, { call }) {
      const { code, msg } = yield call(batchModifyRead, payload);
      if (code !== 200) {
        message.error(msg)
        return false
      }
      return true
    },
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
    },
    setMessageData(state, action) {
      return {
        ...state,
        messageList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default UserModel;
