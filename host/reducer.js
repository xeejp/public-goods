import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction } from 'redux-actions'

const reducer = concatenateReducers([
  handleAction('update contents', (_, { payload }) => payload, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
  handleAction('change page', (_, { payload }) => { page: payload }, {}),
  handleAction('join', ({ participants }, { payload: { id, participant } }) => ({
    participants: Object.assign({}, participants, {[id]: participant})
  }), {}),
  handleAction('matched', (_, { payload: { participants, groups } }) => ({
    participants, groups
  }), {})
])

export default reducer
