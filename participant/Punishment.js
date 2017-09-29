import React, { Component } from 'react'
import { connect } from 'react-redux'

import SwipeableViews from 'react-swipeable-views'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'

import VoteWaiting from './VoteWaiting'
import Point from '../shared/Point.js'
import { profitsSelector } from './selectors.js'
import { submitPunishment } from './actions.js'
import styles from './styles.js'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text
const $s = multi_text["participant"]["experiment"]["punishment"]

class PunishmentForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: ''
    }
  }

  handleChange(event) {
    const value = event.target.value
    this.setState({value})
    this.props.onChange(value)
  }

  render() {
    const { id, value } = this.props
    return (
      <TextField
        id={id}
        value={this.state.value}
        onChange={this.handleChange}
        style={{width: "100px"}}
      />
    )
  }
}

const mapStateToProps = ({ punished, punishmentRate, maxPunishment, members, uid, investments, profits, round, maxRound, punishments, used}) => ({
  punished,
  punishmentRate,
  maxPunishment,
  members,
  uid,
  investments, 
  profits, 
  round,
  maxRound,
  punishments,
  used  
})

const actionCreators = {
  submitPunishment
}

class Punishment extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.state = {
      punishments: [],
      disables: []
    }
  }

  reset() {
    this.setState = {
      punishments: []
    }
  }

  isValid() {
    const punishmentSum = this.punishmentSum()
    const { profits, round } = this.props
    return punishmentSum <= this.props.maxPunishment && punishmentSum <= profits[round]
  }

  punishmentSum() {
    return this.state.punishments.reduce((acc, p) => acc + p, 0)
  }

  handleChange(i, value) {
    const punishments = this.state.punishments.slice()
    const disables = this.state.disables.slice()
    punishments[i] = parseInt(value)
    if(isNaN(punishments[i])) punishments[i] = 0
    disables[i] = isNaN(parseInt(value)) || value.indexOf('.') != -1 || parseInt(value) < 0
    this.setState({
      punishments,
      disables
    })
  }

  submit() {
    const { submitPunishment, investments } = this.props
    const map = {}
    this.state.punishments.forEach((punishment, i) => {
      if (punishment != null && punishment > 0) {
        const id = investments[i].id
        map[id] = punishment
      }
    })
    submitPunishment(map)
  }

  render() {
    const { punished, punishmentRate, maxPunishment, members , uid, investments, profits, round, maxRound } = this.props
    const profit = Math.round(profits[round])
    const memberID = members.findIndex(a => a == uid)
    const punishmentSum = this.punishmentSum()
    const valid = this.isValid()

    return (
      <Card>
        <CardHeader
          title   ={multi_text["participant"]["experiment"]["card"][0]}
          subtitle={multi_text["participant"]["experiment"]["card"][4]}
        />
        <SwipeableViews index={punished?1:0} disabled={true}>
          <div>
            <CardText>
              <Chip style={{float: "left"}}>{multi_text["participant"]["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["participant"]["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
					    <Chip style={{float: "right"}}>{multi_text["participant"]["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>	
              <div style={{clear: "both"}}>
              <p>{profit + $s["desc"][0] + maxPunishment + $s["desc"][1]}</p>
              <table>
                <thead>
                    <tr>
                      <th>{$s["table"]["header"][0]}</th>
                      <th>{$s["table"]["header"][1]}</th>
                      <th>{$s["table"]["header"][2]}</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    investments.map(({ id, investment }, i) => {
                      if (i != memberID) {
                        const punishment = this.state.punishments[i] || 0
                        return (
                          <tr key={i}>
                            <td>{investment + $s["table"]["body"]}</td>
                            <td>
                              <PunishmentForm
                                id={`punishment-${i}`}
                                value={punishment}
                                onChange={value => this.handleChange(i, value)}
                              />
                            </td>
                            <td>
                              {punishment * punishmentRate}
                            </td>
                          </tr>
                        )
                      } else {
                        return null
                      }
                    })
                  }
                </tbody>
              </table>
              {valid ? (
                <p>{$s["desc2"][0] + punishmentSum + $s["desc2"][1] + (profit - punishmentSum) + $s["desc2"][2]}</p>
              ) : (
                <p>{$s["valid"][0] + Math.min(maxPunishment, profit) + $s["valid"][1]}</p>
              )}
              </div>  
            </CardText>
            <CardActions>
              <RaisedButton
                label={$s["button_label"]}
                onClick={this.submit}
                disabled={punished || !valid || this.state.disables.some(a=>a)}
                primary={true}
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
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Punishment)
