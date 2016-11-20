import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'

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
      <span>
        <FlatButton
          label={"-" + amp}
          disabled={!validateValue(valueInt - amp)}
          onClick={() => changeInvestment(valueInt - amp, validateValue(valueInt - amp))}
        />
        <MoneyEditor
          amp={nextAmp}
          value={value}
          changeInvestment={changeInvestment}
          validateValue={validateValue}
        />
        <FlatButton
          label={"+" + amp}
          disabled={!validateValue(valueInt + amp)}
          onClick={() => changeInvestment(valueInt + amp, validateValue(valueInt + amp))}
        />
      </span>
    )
  }
}

const Investment = ({ money, value, invested, isValid, changeInvestment, submitInvestment, validateValue, profits }) => (
  <div>
    <div style={styles.wrapper}>
      <Chip
        style={styles.chip}
      >
        {profits.reduce((acc, p) => acc + p, 0) + "ポイント"}
      </Chip>
    </div>
    <h2>公共財実験</h2>
    <p>100ポイントのうち、私的財に投資するポイントを入力して下さい。</p>
    <form onSubmit={(event) => {
      event.preventDefault()
      submitInvestment(+value)
    }}>
      <MoneyEditor
        amp={Math.floor(money / 10)}
        value={value}
        changeInvestment={changeInvestment}
        validateValue={validateValue}
        money={money}
      />
      <NumericKeypad />
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
    </form>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Investment)
