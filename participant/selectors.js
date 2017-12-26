function sum(array) {
  return array.reduce((acc, p) => acc + p, 0)
}

export const profitsSelector = state => {
  const profits = sum(state.profits)
  const punishments = sum(state.punishments)
  const used = sum(state.used)
  return profits - punishments*state.punishmentRate - used
}
