import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
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
    <p>利益: {profits[0]}</p>
    <p>利益合計: {profits.reduce((acc, profit) => acc + profit, 0)}</p>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderColumn>No</TableHeaderColumn>
          <TableHeaderColumn>投資額</TableHeaderColumn>
          <TableHeaderColumn>利益</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          investments.map((investment, id) => (
            <TableRow key={id}>
              <TableRowColumn>{id}</TableRowColumn>
              <TableRowColumn>{investment}</TableRowColumn>
              <TableRowColumn>{roi * investmentsSum - investment}</TableRowColumn>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
    <RaisedButton
      primary={true}
      label={"次に進む (" + votesNext + "/" + investments.length + ")"}
      disabled={voted}
      onClick={submitNext}
    />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentResult)
