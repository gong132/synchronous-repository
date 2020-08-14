import { queryNotices, query as queryUsers } from '@/services/user';
import {PagerHelper} from "@/utils/helper";


const UserModel = {
  namespace: 'order',
  state: {
    orderList: PagerHelper.genListState()
  },
  effects: {
    *fetchOrderData({payload}, { call, put }) {
      const response = yield call(queryNotices);
      console.log(response, 'response')
      yield put({
        type: 'setOrderData',
        payload: {
          filter: payload,
          data: response,
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
