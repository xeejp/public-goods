import { createAction } from 'redux-act'

export const updateSnum = createAction('update snum', snum => snum)
export const finishDescription = createAction('finish description')
export const submitInvestment = createAction('submit investment', value => value)
export const submitPunishment = createAction('submit punishment', map => map)
export const submitNext = createAction('submit next')