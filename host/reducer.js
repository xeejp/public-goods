import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changePage } from './actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    'change state': ({ participants, groups }, { payload: { groupID, state, round, members }}) => {
      const newGroups = Object.assign({}, groups)
      newGroups[groupID].state = state
      newGroups[groupID].round = round
      const newParticipants = Object.assign({}, participants)
      groups[groupID].members.forEach(id, index => {
        newParticipants[id] = members[index]
      })
      return {
        groups: newGroups,
        participants: newParticipants
      }
    },
    [changePage]: (_, { payload }) => ({ page: payload }),
    'join': ({ participants }, { payload: { id, participant } }) => ({
      participants: Object.assign({}, participants, {[id]: participant})
    }),
    'matched': (_, { payload: { participants, groups } }) => ({
      participants, groups
    }),
    'invest': ({ participants }, { payload: { id, investment } }) => {
      const result = Object.assign({}, participants)
      result[id].invested = true
      result[id].investment = investment
      return { participants: result }
    },
    'investment result': ({ participants, groups }, { payload: {
      participantID, investment, groupID, profit
    }}) => {
      const newParticipants = Object.assign({}, participants)
      newParticipants[participantID].invested = true
      newParticipants[participantID].investment = investment
      const newGroups = Object.assign({}, groups)
      newGroups[groupID].state = "investment_result"
      newGroups[groupID].profit = profit
      return { participants: newParticipants, groups: newGroups }
    },
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
