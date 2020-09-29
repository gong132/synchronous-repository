
import { queryDept } from '@/services/global'
import { message } from 'antd'

const Demand = {
  namespace: 'demandForm',
  state: {
    formType: 'demandSide',
    deptList: [],
    deptNameArr:[],
  },
  effects: {
    // 查询部门
    *queryDept({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryDept, payload)
      console.log('data: ', data)
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
    }
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