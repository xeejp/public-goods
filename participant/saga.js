import { put, take, call, fork } from 'redux-saga/effects'

import { fetchContents } from './actions'

function* fetchContentsSaga() {
  while (true) {
    yield take(`${fetchContents}`)
    yield call(sendData, 'fetch contents')
  }
}

function* saga() {
  yield fork(fetchContentsSaga)
}

export default saga
