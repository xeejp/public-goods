import { put, take, call, select, fork } from 'redux-saga/effects'

import { fetchContents, match, nextPage, submitPage, changePage } from './actions'

function* changePageSaga() {
  while (true) {
    const { payload } = yield take(`${submitPage}`)
    sendData('change page', payload)
    if (payload == 'description') {
      yield put(match())
    }
    yield put(changePage(payload))
  }
}

function* nextPageSaga() {
  const pages = ["description", "experiment", "result", "waiting"]
  while (true) {
    yield take(`${nextPage}`)
    const page = yield select(({ page }) => page)
    let next = pages[0]
    for (let i = 0; i < pages.length; i ++) {
      if (page == pages[i]) {
        next = pages[(i + 1) % pages.length]
        break
      }
    }
    yield put(submitPage(next))
  }
}

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
  yield fork(changePageSaga)
  yield fork(nextPageSaga)
  yield fork(fetchContentsSaga)
  yield fork(matchSaga)
}

export default saga
