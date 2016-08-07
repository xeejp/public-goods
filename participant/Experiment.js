import React, { Component } from 'react'
import { connect } from 'react-redux'

import Investment from './Investment'
import InvestmentResult from './InvestmentResult'
import Punishment from './Punishment'
import PunishmentResult from './PunishmentResult'

const mapStateToProps = ({ state }) => ({
  state
})

const Experiment = ({ state }) => (() => {
  switch (state) {
    case "investment":
      return <Investment />
    case "investment_result":
      return <InvestmentResult />
    case "punishment":
      return <Punishment />
    case "punishment_result":
      return <PunishmentResult />
    default:
      return <span></span>
  }
})()

export default connect(mapStateToProps)(Experiment)
