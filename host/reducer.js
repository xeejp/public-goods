import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction } from 'redux-actions'
import combineSectionReducers from 'combine-section-reducers'

const reducer = concatenateReducers([
  handleAction('update contents', (_, { payload }) => payload, {}),
  handleAction('change page', (_, { payload }) => payload, { page: "waiting" }),
  handleAction('join', ({ participants }, { payload: { id, participant } }) => ({
    participants: Object.assign({}, participants, {[id]: participant})
  }), { participants: {} })
])

export default reducer
