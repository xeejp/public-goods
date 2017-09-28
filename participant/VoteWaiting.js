import React, { Component } from 'react'
import { connect } from 'react-redux'

import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import PunishmentResult from './PunishmentResult'
import InvestmentResult from './InvestmentResult'

import { submitNext } from './actions'
import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
	submitNext
}

const mapStateToProps = ({ voted, members, notVoted, invested, voting, punished, state, punishmentFlag, round, maxRound }) => ({
	voted,
	members,
	notVoted,
	invested,
	voting,
  punished,
  state,
  punishmentFlag,
  round,
  maxRound,
})

class VoteWaiting extends Component{    
  constructor(props, context) {
		super(props, context)
		this.state = {}
	}

	handleClose() {
		this.props.submitNext()
	}

  render() {
    const { voted, members, notVoted, invested, voting, punished, state, punishmentFlag, round, maxRound } = this.props
    console.log("voteWait"+ notVoted)
    
    //if ((state == "investment" || state == "investment_result") && !invested) return null
    //if ((state == "punishment" || state == "punishment_result") && !punished) return null
    //if (state != "punishment" && state != "punishment_result" && state != "investment" && state != "investment_result") return null
    const label = ((round + 1) == maxRound && !(punishmentFlag && state != "punishment_result"))?"実験結果へ":"OK"
    
    const actions = [
      <FlatButton
        label={label}
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ]

    return (
      <div style={{ clear: "both" }}>
        <p>{multi_text["experiment"]["end"]}</p>
        {(voting) ?
          <p>(確認：{members.length - notVoted}人/{members.length}人中)</p>
          : <p>(解答済み：{members.length - notVoted}人/{members.length}人中)</p>
        }
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
        <Dialog
          title={multi_text["experiment"]["dialog"]}
          actions={actions}
          modal={true}
          open={voting && !voted}
          autoScrollBodyContent={true}
        >
          {(state == "investment_result")
            ? <InvestmentResult />
            : (state == "punishment_result")
              ? <PunishmentResult />
              : null
          }
        </Dialog>
      </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(VoteWaiting)