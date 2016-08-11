import { combineReducers } from 'redux'

import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changeInvestment } from './actions'

const investment = concatenateReducers([
  handleActions({
    [changeInvestment]: (state, { payload: { value, valid } }) => ({
      value,
      isValid: /^\d+$/.test(value) && valid
    })
  }, {value: '', isValid: false})
])

function forKey(key, reducer) {
  return (state, action) => ({[key]: reducer(state && state[key], action)})
}

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    'change page': (_, { payload }) => ({ page: payload }),
    'matched': (_, { payload }) => payload,
    'invest': (_, { payload: investment }) => {
      return { investment, invested: true }
    }
  }, {}),
  forKey('investForm', investment),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
])

export default reducer
