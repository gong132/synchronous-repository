
import {
  addDemand,
  updateDemand,
  queryDemand,
  queryDemandDetail,
  queryDemandProject,
  queryDemandBoard,
  queryProjectDemandBoard,
} from '@/services/demand/demand'
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const Demand = {
  namespace: 'demand',
  state: {
    formType: 'list',
    demandList: PagerHelper.genListState(),
  },
  effects: {
    *addDemand({ payload }, { call }) {
      const { code, msg } = yield call(addDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    }
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  }
}

export default Demand