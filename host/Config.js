import React, { Component } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import ReactTooltip from 'react-tooltip'

const mapStateToProps = ({ rounds, roi }) => {
  return {
    rounds, roi
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
    this.state = {
      roundsText: '4',
      roiText: '0.4',
      rounds: 4,
      roi: 0.4,
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

  submit() {
    const { rounds, roi } = this.state
    if (rounds !== NaN && roi !== NaN) {
      sendData('update config', { rounds, roi })
    }
  }

  componentWillMount() {
    const { rounds, roi } = this.props
    this.setState({
      rounds,
      roi,
      roundsText: rounds.toString(),
      roiText: roi.toString()
    })
  }

  render() {
    const { rounds, roi, roundsText, roiText } = this.state
    const actions = [
      <FlatButton
        onTouchTap={this.submit}
        label="Update"
        primary={true}
        disabled={rounds === NaN || roi === NaN}
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
        </Dialog>
        <FloatingActionButton onClick={this.toggle}>
          <ActionSettings />
        </FloatingActionButton>
      </span>
    )
  }
}

export default connect(mapStateToProps)(Config)
