import {
  fetchData,
  createData,
  updateData
} from '@/services/systemManage/sectorManage'

const Sector = {
  namespace: 'sector',
  state: {
    data: [],
  },
  effects: {
    *queryData({payload}, {call, put}) {
      const res = yield call(fetchData, payload)
      if(res && res.code === 200) {
        yield put({
          type: 'saveData',
          payload: {
            data: res.data.records || []
          }
        })
        return res
      }
      return res
    },
    *addData({payload}, {call}) {
      const res = yield call(createData, payload)
      return res
    },
    *updateData({payload}, {call}) {
      const res = yield call(updateData, payload)
      return res
    }
  },
  reducers: {
    saveData(state, {payload}){
      return {
        ...state,
        ...payload
      }
    }
  }
}

export default Sector