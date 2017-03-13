import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

import { changePage } from './actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
  }, {}),
  handleAction('update contents', () => ({ loading: false }), { loading: true })
])

export default reducer
