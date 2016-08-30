import { combineReducers } from 'redux'
import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import {
  changeInvestment, submitInvestment, submitNext,
  openInfo, closeInfo,
  incrementPunishment, decrementPunishment
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
    'update ranking': (_, { payload }) => ({ ranking: payload }),
    'change page': (_, { payload }) => ({ page: payload }),
    'change state': (_, { payload }) => Object.assign(payload, {votesNext: 0}),
    'matched': (_, { payload }) => payload,
    'invest': (_, { payload: investment }) => {
      return { investment, invested: true }
    },
    'investment result': ({ invested, profits }, { payload: {
      investment, investments, profit, newProfit
    }}) => {
      profits.splice(0, 0, newProfit)
      if (invested) {
        return {
          profit,
          state: "investment_result",
          investments,
          profits
        }
      } else {
        return {
          profit,
          invested: true,
          investment: investment,
          state: "investment_result",
          investments,
          profits
        }
      }
    },
    'punishment result': ({ punished, punishments, profits }, { payload: {
      newPunishment, newProfit
    }}) => {
      punishments.splice(0, 0, newPunishment)
      profits[0] = newProfit
      if (punished) {
        return {
          state: "punishment_result",
          punishments,
          profits
        }
      } else {
        return {
          punished: true,
          state: "punishment_result",
          punishments,
          profits
        }
      }
    },
    [incrementPunishment]: ({ punishment }, { payload }) => {
      const newPunishments = Array.concat(punishment)
      newPunishments[payload] = (newPunishments[payload] || 0) + 1
      return {
        punishment: newPunishments
      }
    },
    [decrementPunishment]: ({ punishment }, { payload }) => {
      const newPunishments = Array.concat(punishment)
      newPunishments[payload] = Math.max((newPunishments[payload] || 0) - 1, 0)
      return {
        punishment: newPunishments
      }
    },
    [submitNext]: () => ({voted: true}),
    'vote next': ({ investments }, { payload: { state, notVoted } }) => ({
      votesNext: investments.length - notVoted,
    }),
    [openInfo]: (_, { payload }) => ({ infoOpened: true, info: payload}),
    [closeInfo]: () => ({ infoOpened: false })
  }, {
    punishments: [], investments: [],
    votesNext: 0, info: '', infoOpened: false, ranking: []
  }),
  forKey('investForm', investment),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
])

export default reducer
