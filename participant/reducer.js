import { combineReducers } from 'redux'
import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import {
  changeInvestment, submitInvestment, submitNext,
  openInfo, closeInfo,
} from './actions'

const investment = concatenateReducers([
  handleActions({
    [changeInvestment]: (state, { payload: { value, valid } }) => ({
      value,
      isValid: /^\d+$/.test(value) && valid
    }),
    [submitInvestment]: () => ({ value: '', isValid: false }),
  }, {value: '', isValid: false}),
])

function forKey(key, reducer) {
  return (state, action) => ({[key]: reducer(state && state[key], action)})
}

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    [openInfo]: (_, { payload }) => ({ infoOpened: true, info: payload}),
    [closeInfo]: () => ({ infoOpened: false })
  }, {investments: [], votesNext: 0, info: '', infoOpened: false, ranking: []}),
  forKey('investForm', investment),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
])

export default reducer
