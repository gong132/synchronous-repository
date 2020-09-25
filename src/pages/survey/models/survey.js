import { addSurvey, querySurvey } from '@/services/survey/survey'
import {message} from 'antd'

const Survey = {
  namespace: 'survey',
  state: {
    surveyInfo: {}
  },
  effects: {
    *add({ payload }, { call }) {
      const res = yield call(addSurvey, payload)
      if(!res || !res.code === 200) {
        message.error(res.msg)
        return false
      }
      return true
    },
    *query({ payload }, { call, put }) {
      const res = yield call(querySurvey, payload)
      if (res && res.code === 200) {
        yield put({
          type: 'saveData',
          payload: {
            surveyInfo: res.data || {}
          }
        })
        return true
      }
      message.error(res.msg)
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

export default Survey