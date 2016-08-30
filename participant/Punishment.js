import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import { submitPunishment, incrementPunishment, decrementPunishment } from './actions'

const mapStateToProps = ({
  memberID, investments, roi, profits, voted, votesNext, punishment, punishmentRatio
}) => {
  const investmentsSum = investments.reduce((acc, investment) => acc + investment, 0)
  return {
    memberID, investments, roi, investmentsSum, profits,
    voted, votesNext, punishments: punishment, punishmentRatio,
    profit: profits.reduce((acc, profit) => acc + profit, 0),
    penalty: punishment.reduce((acc, penalty) => acc + penalty, 0)
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitPunishment: bindActionCreators(submitPunishment, dispatch),
  incrementPunishment: (id) => () => bindActionCreators(incrementPunishment, dispatch)(id),
  decrementPunishment: (id) => () => bindActionCreators(decrementPunishment, dispatch)(id)
})

const styles = {
  button: {
    width: "10%"
  }
}

const Punishment = ({
  memberID, investment, investments, roi, investmentsSum,
  profits, profit, penalty, punishments, punishmentRatio,
  votesNext, voted, submitPunishment,
  incrementPunishment, decrementPunishment
}) => (
  <div>
    <p>罰則画面</p>
    <p>利得: {profits[0]}</p>
    <p>罰則によるペナルティー: {penalty}</p>
    <p>利得合計: {profit} - {penalty} = {profit - penalty}</p>
    <table>
      <thead>
        <tr>
          <th>投資額</th>
          <th>利得</th>
          <th>罰則</th>
        </tr>
      </thead>
      <tbody>
        {
          investments.map((investment, id) => (
            <tr key={id}>
              <td>{investment}</td>
              <td>{Math.floor(roi * investmentsSum) - investment}</td>
              <td>
                <span style={styles.button}>
                  <FlatButton
                    label="-"
                    onClick={decrementPunishment(id)}
                  />
                </span>
                {(punishments[id] || 0) * punishmentRatio}
                <span style={styles.button}>
                  <FlatButton
                    label="+"
                    onClick={incrementPunishment(id)}
                  />
                </span>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
    <RaisedButton
      primary={true}
      label={"この罰則内容で確定する (" + votesNext + "/" + investments.length + ")"}
      disabled={voted}
      onClick={submitPunishment}
    />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Punishment)
