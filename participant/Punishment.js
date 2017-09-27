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
    return punishmentSum <= this.props.maxPunishment && punishmentSum <= profitsSelector(this.props)
  }

  punishmentSum() {
    return this.state.punishments.reduce((acc, p) => acc + p, 0)
  }

  handleChange(i, value) {
    const punishments = this.state.punishments.slice()
    const disables = this.state.disables.slice()
    punishments[i] = parseInt(value) || 0
    disables[i] = value != "" && (isNaN(value) || value.indexOf('.') != -1) || parseInt(value) < 0
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
    const pProfits = Math.round(profitsSelector(this.props))
    const memberID = members.findIndex(a => a == uid)
    const punishmentSum = this.punishmentSum()
    const valid = this.isValid()

    return (
      <Card>
        <CardHeader title="公共財実験" subtitle="罰" />
        <SwipeableViews index={punished?1:0} disabled={true}>
          <div>
            <CardText>
              <Chip style={{float: "left"}}>{multi_text["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
					    <Chip style={{float: "right"}}>{multi_text["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>	
              <div style={{clear: "both"}}>
              <p>{pProfits}ポイントのうち、罰に利用するポイントを{maxPunishment}ポイント以内で入力して下さい。</p>
              <table>
                <thead>
                  <tr><th>他のメンバー</th><th>罰に利用するポイント</th><th>罰</th></tr>
                </thead>
                <tbody>
                  {
                    investments.map(({ id, investment }, i) => {
                      if (i != memberID) {
                        const punishment = this.state.punishments[i] || 0
                        return (
                          <tr key={i}>
                            <td>{investment}ポイントを投資したメンバー</td>
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
                <p>罰に{punishmentSum}ポイント使うので、あなたのポイントは{pProfits - punishmentSum}ポイントになります。</p>
              ) : (
                <p>罰則ポイントが超過しています。罰則ポイントの合計が{Math.min(maxPunishment, pProfits)}ポイント以下になるように入力して下さい。</p>
              )}
              </div>  
            </CardText>
            <CardActions>
              <RaisedButton
                label={"決定"}
                onClick={this.submit}
                disabled={punished || !valid || this.state.disables.some(a=>a)}
                primary={true}
              />
            </CardActions>
            </div>
            <div>
                <CardText>
                  <Chip style={{float: "left"}}>{multi_text["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
  					      <Chip style={{float: "right"}}>{multi_text["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>	
                  <VoteWaiting />
                </CardText>
            </div>
          </SwipeableViews>
      </Card>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(Punishment)
