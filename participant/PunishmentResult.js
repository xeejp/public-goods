import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import { submitNext } from './actions'

const mapStateToProps = ({
  investments, profits, voted, votesNext, punishment, punishments
}) => {
  return {
    investments, profits, punishments, voted, votesNext,
    profit: profits.reduce((acc, profit) => acc + profit, 0),
    penalty: punishment.reduce((acc, penalty) => acc + penalty, 0),
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitNext: bindActionCreators(submitNext, dispatch)
})

const PunishmentResult = ({
  investments, roi, profits, punishments, penalty, profit,
  votesNext, voted, submitNext
}) => (
  <div>
    <p>投資結果画面</p>
    <p>利得: {profits[0] + penalty + punishments[0]}</p>
    <p>罰則によるペナルティー: {penalty}</p>
    <p>受けた罰則の合計: {punishments[0]}</p>
    <p>利得合計: {profits[0]}</p>
    <p>これまでの利得の合計: {profit}</p>
    <RaisedButton
      primary={true}
      label={"次に進む (" + votesNext + "/" + investments.length + ")"}
      disabled={voted}
      onClick={submitNext}
    />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentResult)
