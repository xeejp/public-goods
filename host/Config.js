import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'

import ReactTooltip from 'react-tooltip'

class IntegerForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: this.props.value
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value
    })
  }

  handleChange(event) {
    const value = event.target.value
    const parsed = parseInt(value, 10)
    this.setState({value})
    this.props.onChange(parsed || this.props.default || 0)
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

const mapStateToProps = ({ rounds, roi, money, groupSize, punishment, maxPunishment, punishmentRate }) => {
  return {
    rounds, roi, money, groupSize, punishment, maxPunishment, punishmentRate
  }
}

class Config extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.close = this.close.bind(this)
    this.submit = this.submit.bind(this)
    this.togglePunishment = this.togglePunishment.bind(this)
    this.changeRounds = this.changeRounds.bind(this)
    this.changeROI = this.changeROI.bind(this)
    this.changeMoney = this.changeMoney.bind(this)
    this.changeGroupSize = this.changeGroupSize.bind(this)
    this.changeMaxPunishment = this.changeMaxPunishment.bind(this)
    this.changePunishmentRate = this.changePunishmentRate.bind(this)
    this.state = {
      maxPunishment: 3,
      punishmentRate: 3,
      roundsText: '4',
      roiText: '0.4',
      moneyText: '100',
      groupSizeText: '4',
      rounds: 4,
      roi: 0.4,
      money: 100,
      groupSize: 4,
      punishment: false,
      open: true
    }
  }

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  close() {
    this.setState({
      open: false
    })
  }

  togglePunishment(event) {
    this.setState({
      punishment: !this.state.punishment
    })
  }

  changeRounds(event) {
    const text = event.target.value
    this.setState({
      roundsText: text,
      rounds: parseInt(text, 10)
    })
  }

  changeROI(event) {
    const text = event.target.value
    this.setState({
      roiText: text,
      roi: parseFloat(text)
    })
  }

  changeMoney(event) {
    const text = event.target.value
    this.setState({
      moneyText: text,
      money: parseInt(text, 10)
    })
  }

  changeGroupSize(event) {
    const text = event.target.value
    this.setState({
      groupSizeText: text,
      groupSize: parseInt(text, 10)
    })
  }

  changeMaxPunishment(value) {
    this.setState({
      maxPunishment: value
    })
  }

  changePunishmentRate(value) {
    this.setState({
      punishmentRate: value
    })
  }

  validate() {
    const { rounds, roi, money, groupSize, maxPunishment, punishmentRate } = this.state
    return rounds !== NaN && roi !== NaN && money !== NaN && groupSize !== NaN
      && groupSize >= 2 && money >= 1 && rounds >= 1
  }

  submit() {
    const { rounds, roi, money, groupSize, punishment, maxPunishment, punishmentRate } = this.state
    if (this.validate()) {
      sendData('update config', { rounds, roi, money, group_size: groupSize, punishment, maxPunishment, punishmentRate })
      this.close()
    }
  }

  componentWillMount() {
    const { rounds, roi, money, punishment, maxPunishment, punishmentRate } = this.props
    this.setState({
      maxPunishment, punishmentRate,
      punishment,
      rounds,
      roi,
      money,
      roundsText: rounds.toString(),
      roiText: roi.toString(),
      moneyText: money.toString(),
    })
  }

  render() {
    const { roundsText, roiText, moneyText, groupSizeText, punishment, maxPunishment, punishmentRate } = this.state
    const actions = [
      <FlatButton
        onTouchTap={this.submit}
        label="Update"
        primary={true}
        disabled={!this.validate()}
      />,
      <FlatButton
        onTouchTap={this.close}
        label="Cancel"
      />
    ]
    return (
      <span>
        <Dialog
          title="設定"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.close}
        >
          <p>罰則</p>
          <Toggle
            toggled={punishment}
            onToggle={this.togglePunishment}
          />
          {punishment ? (
            <div>
              <p>罰則に使えるポイントの最大値</p>
              <IntegerForm
                id="maxPunishment"
                value={maxPunishment}
                default={maxPunishment}
                onChange={this.changeMaxPunishment}
              />
              <p>罰則の倍率</p>
              <IntegerForm
                id="punishmentRate"
                value={punishmentRate}
                default={punishmentRate}
                onChange={this.changePunishmentRate}
              />
            </div>
          ) : null}
          <p>ラウンド数</p>
          <TextField
            id="rounds"
            value={roundsText}
            onChange={this.changeRounds}
          />
          <p>ROI</p>
          <TextField
            id="roi"
            value={roiText}
            onChange={this.changeROI}
          />
          <p>初期値</p>
          <TextField
            id="money"
            value={moneyText}
            onChange={this.changeMoney}
          />
          <p>グループ人数</p>
          <TextField
            id="size"
            value={groupSizeText}
            onChange={this.changeGroupSize}
          />
        </Dialog>
        <FloatingActionButton onClick={this.toggle}>
          <ActionSettings />
        </FloatingActionButton>
      </span>
    )
  }
}

export default connect(mapStateToProps)(Config)
