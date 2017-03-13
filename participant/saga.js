import { put, take, select, call, fork } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import {
  fetchContents, submitInvestment, submitNext, openInfo,
  changeInvestment, pressNumeric, pressBackspace
} from './actions'

function* fetchContentsSaga() {
  while (true) {
    yield take(`${fetchContents}`)
    yield call(sendData, 'fetch contents')
  }
}

function* submitInvestmentSaga() {
  while (true) {
    const { payload: { value } } = yield take(`${submitInvestment}`)
    const { money } = yield select(({ money }) => ({
      money
    }))
    if(value >= 0 && value <= money){
      yield put(openInfo(value))
      yield call(sendData, 'invest', value)
    }
  }
}

function* submitNextSaga() {
  while (true) {
    yield take(`${submitNext}`)
    yield call(sendData, 'next')
  }
}

function isValidInvestment(value, money) {
  return value >= 0 && value <= money
}

function* pressNumericSaga() {
  while (true) {
    const { payload } = yield take(`${pressNumeric}`)
    const { value, money } = yield select(({ investForm, money }) => ({
      value: investForm.value,
      money
    }))
    const newValue = value + payload
    yield put(changeInvestment(newValue, isValidInvestment(newValue, money)))
  }
}

function* pressBackspaceSaga() {
  while (true) {
    yield take(`${pressBackspace}`)
    const { value, money } = yield select(({ investForm, money }) => ({
      value: investForm.value,
      money
    }))
    const newValue = value.slice(0, -1)
    yield put(changeInvestment(newValue, isValidInvestment(newValue, money)))
  }
}

function* saga() {
  yield fork(fetchContentsSaga)
  yield fork(submitInvestmentSaga)
  yield fork(submitNextSaga)
  yield fork(pressNumericSaga)
  yield fork(pressBackspaceSaga)
}

export default saga
