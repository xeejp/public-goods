import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SwipeableViews from 'react-swipeable-views'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import Chip from 'material-ui/Chip'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'

import VoteWaiting from './VoteWaiting'
import Punishment from './Punishment'
import { submitInvestment } from './actions'
import { profitsSelector } from './selectors.js'
import styles from './styles.js'
import { ReadJSON, LineBreak , InsertVariable} from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text
const $s = multi_text["participant"]["experiment"]["investment"]

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
    let num = parseInt(value)
    const disabled = isNaN(num) || value.indexOf('.') != -1 || num < 0 || this.props.money < num
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
      snackbarMessage: InsertVariable($s["snack_bar"], {public:this.state.value, private:(this.props.money - this.state.value)},null),
      value: "",
    })
  }
  
  render() {
    const { round, maxRound, money, invested, profits } = this.props
    return (
      <div>
        <Card>
			    <CardHeader title={multi_text["participant"]["experiment"]["card"][0]} subtitle={multi_text["participant"]["experiment"]["card"][3]} />
          <SwipeableViews index={invested?1:0} disabled={true}>
            <div>
              <CardText>
                <Chip style={{float: "left"}}>{multi_text["participant"]["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["participant"]["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
  					    <Chip style={{float: "right"}}>{multi_text["participant"]["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>	
                <div style={{clear: "both"}}>
                  <p>{money + $s["desc"]}</p>
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
                  label={$s["button_label"]}
                  disabled={invested || this.state.disabled}
                  primary={true}
                  onTouchTap={this.Investment.bind(this)}
                />
              </CardActions>
            </div>

            <div>
              <CardText>
                <Chip style={{float: "left"}}>{multi_text["participant"]["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["participant"]["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
    					  <Chip style={{float: "right"}}>{multi_text["participant"]["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>	
                <VoteWaiting />
              </CardText>
            </div>
          </SwipeableViews>  
        </Card>
        <Snackbar
          open={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />  
      </div>  

    )
  }
}

export default connect(mapStateToProps, actionCreators)(Investment)
