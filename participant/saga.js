import { fork, take, call, select } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { fetchContents } from '../shared/actions'
import { finishDescription, updateSnum, submitInvestment, submitPunishment, submitNext } from './actions'

function* fetchContentsSaga() {
  yield call(sendData, 'fetch contents')
}

function* finishDescriptionSaga() {
  yield call(sendData, 'finish description')
}

function* updateSnumSaga(action) {
  const { payload } = action 
  yield call(sendData, 'update snum', payload)
}

function* submitInvestmentSaga(action) {
  const { payload } = action
  const { money } = yield select(({ money }) => ({
      money
  }))
  if(payload >= 0 && payload <= money){
    yield call(sendData, 'invest', payload)
  }
}

function* submitPunishmentSaga(action) {
  const { payload } = action
  yield call(sendData, 'punish', payload)
}

function* submitNextSaga(action) {
    yield call(sendData, 'next')
} 

function* saga() {
  yield fork(takeEvery, fetchContents.getType(), fetchContentsSaga)
  yield fork(takeEvery, finishDescription.getType(), finishDescriptionSaga)
  yield fork(takeEvery, updateSnum.getType(), updateSnumSaga)
  yield fork(takeEvery, submitInvestment.getType(), submitInvestmentSaga)
  yield fork(takeEvery, submitPunishment.getType(), submitPunishmentSaga)
  yield fork(takeEvery, submitNext.getType(), submitNextSaga)
}

export default saga
