import { put, take, call, fork } from 'redux-saga/effects'

import { fetchContents, match } from './actions'

function* fetchContentsSaga() {
  while (true) {
    yield take(`${fetchContents}`)
    yield call(sendData, 'fetch contents')
  }
}

function* matchSaga() {
  while (true) {
    yield take(`${match}`)
    yield call(sendData, 'match')
  }
}

function* saga() {
  yield fork(fetchContentsSaga)
  yield fork(matchSaga)
}

export default saga
