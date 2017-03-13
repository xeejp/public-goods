import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import ReactTooltip from 'react-tooltip'

const mapStateToProps = ({ rounds, roi, money }) => {
  return {
    rounds, roi, money
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
    this.state = {
      roundsText: '4',
      roiText: '0.4',
      moneyText: '100',
      rounds: 4,
      roi: 0.4,
      money: 100,
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

  submit() {
    const { rounds, roi, money } = this.state
    if (rounds !== NaN && roi !== NaN && money !== NaN) {
      sendData('update config', { rounds, roi, money })
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
    const { rounds, roi, money, roundsText, roiText, moneyText } = this.state
    const actions = [
      <FlatButton
        onTouchTap={this.submit}
        label="Update"
        primary={true}
        disabled={rounds === NaN || roi === NaN || money === NaN}
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
        </Dialog>
        <FloatingActionButton onClick={this.toggle}>
          <ActionSettings />
        </FloatingActionButton>
      </span>
    )
  }
}

export default connect(mapStateToProps)(Config)
