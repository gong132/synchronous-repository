import { queryNotices, query as queryUsers } from '@/services/user';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'order',
  state: {
    orderList: PagerHelper.genListState()
  },
  effects: {
    *fetchOrderData({payload}, { call, put }) {
      const { code, data, msg } = yield call(queryNotices, payload);

      if (code !== 200) {
        message.error(msg)
        return
      }
      const { datas, ...others } = data;
      yield put({
        type: 'setOrderData',
        payload: {
          filter: payload,
          data: datas,
          ...others
        },
      })
    },
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
    },
    setOrderData(state, action) {
      return {
        ...state,
        orderList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default UserModel;
