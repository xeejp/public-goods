import { fork, take, call, takeEvery} from 'redux-saga/effects'

import { fetchContents } from '../shared/actions'
import { changePage, match, visit, updateConfig, updateDescription } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* changePageSaga(action) {
  const { payload } = action
  yield call(sendData, 'change page', payload)
}

function* updateConfigSaga(action) {
  const { payload } = action
  yield call(sendData, 'update config', payload)
}

function* updateDescriptionSaga(action) {
  const { payload } = action
  yield call(sendData, 'update description', payload)
}

function* visitSaga() {
  yield call(sendData, 'visit')
}

function* matchSaga() {
  yield call(sendData, 'match')
}

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, changePage.getType(), changePageSaga)
  yield fork(takeEvery, updateConfig.getType(), updateConfigSaga)
  yield fork(takeEvery, updateDescription.getType(), updateDescriptionSaga)
  yield fork(takeEvery, visit.getType(), visitSaga)
  yield fork(takeEvery, match.getType(), matchSaga)
}

export default saga
