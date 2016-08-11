import { createAction } from 'redux-actions'

export const fetchContents = createAction('fetch contents')

export const changeInvestment = createAction('change investment', (value, valid) => ({ value, valid }))
export const submitInvestment = createAction('submit investment', (value) => ({ value }))
