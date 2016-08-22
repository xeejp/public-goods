import { createAction } from 'redux-actions'

export const fetchContents = createAction('fetch contents')

export const changeInvestment = createAction('change investment', (value, valid) => ({ value, valid }))
export const submitInvestment = createAction('submit investment', (value) => ({ value }))
export const submitNext = createAction('submit next')
export const openInfo = createAction('open info', message => message)
export const closeInfo = createAction('close info')

export const pressNumeric = createAction('press numeric', value => value)
export const pressBackspace = createAction('press backspace')
