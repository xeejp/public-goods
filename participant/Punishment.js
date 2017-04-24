import React, { Component } from 'react'
import { connect } from 'react-redux'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'

import Point from '../components/Point.js'
import { profitsSelector } from './selectors.js'
import { submitPunishment } from './actions.js'
import styles from './styles.js'

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
    const parsed = parseInt(value, 10)
    this.setState({value})
    this.props.onChange(parsed || 0)
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

const mapStateToProps = (state) => {
  const {punished, punishmentRate, maxPunishment, memberID, investments, profits, round, rounds} = state
  return {
    punished,
    round, rounds,
    punishmentRate, maxPunishment,
    investments,
    memberID,
    profits: profitsSelector(state)
  }
}

const mapDispatchToProps = {
  submitPunishment
}

class Punishment extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.state = {
      punishments: []
    }
  }

  reset() {
    this.setState = {
      punishments: []
    }
  }

  isValid() {
    const punishmentSum = this.punishmentSum()
    return punishmentSum <= this.props.maxPunishment && punishmentSum <= this.props.profits
  }

  punishmentSum() {
    return this.state.punishments.reduce((acc, p) => acc + p, 0)
  }

  handleChange(i, value) {
    console.log(value)
    const punishments = this.state.punishments.slice()
    punishments[i] = value
    console.log(punishments)
    this.setState({
      punishments
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
    const {punished, punishmentRate, maxPunishment, memberID, investments, profits, round, rounds} = this.props
    const punishmentSum = this.punishmentSum()
    const valid = this.isValid()
    return (
      <Card>
        <CardHeader title="公共財実験" subtitle="罰" />
        <CardText>
          <div style={styles.wrapper}>
            <Chip style={styles.chip}>
              {`${round + 1}/${rounds}ラウンド`}
            </Chip>
            <Chip style={styles.chip}>
            <Point>{profits}</Point>ポイント
            </Chip>
          </div>
          <p>{profits}ポイントのうち、罰に利用するポイントを{maxPunishment}ポイント以内で入力して下さい。</p>
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
            <p>罰に{punishmentSum}ポイント使うので、あなたのポイントは{profits - punishmentSum}ポイントになります。</p>
          ) : (
            <p>罰則ポイントが超過しています。罰則ポイントの合計が{Math.min(maxPunishment, profits)}ポイント以下になるように入力して下さい。</p>
          )}
        </CardText>
        <CardActions>
          <RaisedButton
            label={
              punished
                ? "決定済み"
                : "決定"
            }
            onClick={this.submit}
            disabled={punished || !valid}
            primary={true}
          />
        </CardActions>
      </Card>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Punishment)
