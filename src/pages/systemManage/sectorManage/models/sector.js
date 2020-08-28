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
      console.log(res)
      if(res && res.data) {
        yield put({
          type: 'saveData',
          payload: {
            data: res.data
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