import { put, take, call, fork } from 'redux-saga/effects'

import { fetchContents, submitInvestment } from './actions'

function* fetchContentsSaga() {
  while (true) {
    yield take(`${fetchContents}`)
    yield call(sendData, 'fetch contents')
  }
}

function* submitInvestmentSaga() {
  while (true) {
    const { payload: { value } } = yield take(`${submitInvestment}`)
    yield call(sendData, 'invest', value)
  }
}

function* saga() {
  yield fork(fetchContentsSaga)
  yield fork(submitInvestmentSaga)
}

export default saga
