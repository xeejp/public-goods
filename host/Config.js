import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import ReactTooltip from 'react-tooltip'

const mapStateToProps = ({ rounds, roi, money, groupSize }) => {
  return {
    rounds, roi, money, groupSize
  }
}

class Config extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.close = this.close.bind(this)
    this.submit = this.submit.bind(this)
    this.changeRounds = this.changeRounds.bind(this)
    this.changeROI = this.changeROI.bind(this)
    this.changeMoney = this.changeMoney.bind(this)
    this.changeGroupSize = this.changeGroupSize.bind(this)
    this.state = {
      roundsText: '4',
      roiText: '0.4',
      moneyText: '100',
      groupSizeText: '4',
      rounds: 4,
      roi: 0.4,
      money: 100,
      groupSize: 4,
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

  validate() {
    const { rounds, roi, money, groupSize } = this.state
    return rounds !== NaN && roi !== NaN && money !== NaN && groupSize !== NaN
      && groupSize >= 2 && money >= 1 && rounds >= 1
  }

  submit() {
    const { rounds, roi, money, groupSize } = this.state
    if (this.validate()) {
      sendData('update config', { rounds, roi, money, group_size: groupSize })
      this.close()
    }
  }

  componentWillMount() {
    const { rounds, roi, money } = this.props
    this.setState({
      rounds,
      roi,
      money,
      roundsText: rounds.toString(),
      roiText: roi.toString(),
      moneyText: money.toString()
    })
  }

  render() {
    const { roundsText, roiText, moneyText, groupSizeText } = this.state
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
