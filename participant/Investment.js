import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'

import NumericKeypad from './NumericKeypad'
import { changeInvestment, submitInvestment } from './actions'

const mapStateToProps = ({ investForm, money, profits, invested }) => (
  Object.assign({}, investForm, {
    money,
    profits,
    invested,
    validateValue: (value) => value >= 0 && value <= money
  })
)
const mapDispatchToProps = (dispatch) => ({
  changeInvestment: bindActionCreators(changeInvestment, dispatch),
  submitInvestment: bindActionCreators(submitInvestment, dispatch)
})

const styles = ({
  chip: {
    marginTop: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    float: 'right',
  },
})

const MoneyEditor = ({ money, amp, value, changeInvestment, validateValue }) => {
  if (amp == 0) {
    return (
      <span>
        <TextField
          id='investment'
          value={value}
          onChange={(event) => changeInvestment(event.target.value, validateValue(event.target.value))}
          style={{width: "100px"}}
        />
      </span>
    )
  } else {
    let nextAmp = Math.floor(amp / 10)
    if (amp == 0) {
      nextAmp = 1
    }
    const valueInt = parseInt(value, 10)

    return (
      <MoneyEditor
        amp={nextAmp}
        value={value}
        changeInvestment={changeInvestment}
        validateValue={validateValue}
      />
    )
  }
}

const Investment = ({ money, value, invested, isValid, changeInvestment, submitInvestment, validateValue, profits }) => (
  <form onSubmit={(event) => {
    event.preventDefault()
    submitInvestment(+value)
  }}>
    <Card>
      <CardHeader title="公共財実験" subtitle="投資" />
      <CardText>
        <div style={styles.wrapper}>
          <Chip style={styles.chip}>
            {profits.reduce((acc, p) => acc + p, 0) + "ポイント"}
          </Chip>
        </div>
        <p>100ポイントのうち、私的財に投資するポイントを入力して下さい。</p>
          <MoneyEditor
            amp={Math.floor(money / 10)}
            value={value}
            changeInvestment={changeInvestment}
            validateValue={validateValue}
            money={money}
          />
      </CardText>
      <CardActions>
          <RaisedButton
            type="submit"
            label={
              invested
                ? "投資済み"
                : "投資"
            }
            disabled={invested || !isValid}
            primary={true}
          />
      </CardActions>
    </Card>
  </form>
)

export default connect(mapStateToProps, mapDispatchToProps)(Investment)
