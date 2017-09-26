import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import Chip from 'material-ui/Chip'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'

import { submitInvestment } from './actions'
import { profitsSelector } from './selectors.js'
import styles from './styles.js'
import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
  submitInvestment
}

const mapStateToProps = ({ round, maxRound, money, invested, profits, punishments, used, punishmentRate }) => ({
  round,
  maxRound,
  money,
  invested,
  profits,
  punishments,
	used,
	punishmentRate,
})

class Investment extends Component {
  constructor(props, context) {
		super(props, context)
    this.state = {
      value: "",
      disabled: true,
      isOpenSnackbar: false,
      snackbarMessage: "",
    }
  }

  handleChangeMoney(e, value) {
    const disabled = isNaN(value) || value.indexOf('.') != -1 || parseInt(value) < 0 || this.props.money < parseInt(value)
    this.setState({
      value: value,
      disabled:disabled
    })
  }

  handleRequestClose() {
    this.setState({
      isOpenSnackbar: false,
    })
  }

  Investment() {
    if (!this.state.disabled) this.props.submitInvestment(parseInt(this.state.value))
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: this.state.value + "を投資しました",
      value: "",
    })
  }
  
  render() {
    const { round, maxRound, money, invested, profits } = this.props
    return (
      <Card>
			  <CardHeader title="公共財実験" subtitle="投資" />
        <CardText>
          <Chip style={{float: "left"}}>{multi_text["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
					<Chip style={{float: "right"}}>{multi_text["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>	
          <div style={{clear: "both"}}>
            <p>{money + "ポイントのうち、公共財に投資するポイントを入力して下さい。"}</p>
            <span>
              <TextField
                id='investment'
                value={this.state.value}
                onChange={this.handleChangeMoney.bind(this)}
                multiLine={false}
                style={{width: "100px"}}
              />
            </span>
          </div>
        </CardText>
        <CardActions>
          <RaisedButton
            label={
              invested
                ? "投資済み"
                : "投資"
              }
            disabled={invested || this.state.disabled}
            primary={true}
            onTouchTap={this.Investment.bind(this)}
          />
        </CardActions>
        <Snackbar
          open={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </Card>

    )
  }
}

export default connect(mapStateToProps, actionCreators)(Investment)
