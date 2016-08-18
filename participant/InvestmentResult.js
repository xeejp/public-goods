import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'

import { submitNext } from './actions'

const mapStateToProps = ({
  memberID, investments, roi, profits, voted, votesNext
}) => {
  const investmentsSum = investments.reduce((acc, investment) => acc + investment, 0)
  return {
    memberID, investments, roi, investmentsSum, profits,
    voted, votesNext
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitNext: bindActionCreators(submitNext, dispatch)
})

const InvestmentResult = ({
  memberID, investment, investments, roi, investmentsSum, profits,
  votesNext, voted, submitNext
}) => (
  <div>
    <p>投資結果画面</p>
    <p>利得: {profits[0]}</p>
    <p>利得合計: {profits.reduce((acc, profit) => acc + profit, 0)}</p>
    <table>
      <thead>
        <tr>
          <th>投資額</th>
          <th>利得</th>
        </tr>
      </thead>
      <tbody>
        {
          investments.map((investment, id) => (
            <tr key={id}>
              <td>{investment}</td>
              <td>{Math.floor(roi * investmentsSum) - investment}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
    <RaisedButton
      primary={true}
      label={"次に進む (" + votesNext + "/" + investments.length + ")"}
      disabled={voted}
      onClick={submitNext}
    />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentResult)
