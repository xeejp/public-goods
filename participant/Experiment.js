import React, { Component } from 'react'
import { connect } from 'react-redux'

import Chip from 'material-ui/Chip'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import InputSnum from './InputSnum'
import Investment from './Investment'
import InvestmentResult from './InvestmentResult'
import Punishment from './Punishment'
import PunishmentResult from './PunishmentResult'

import { submitNext } from './actions'
import { profitsSelector } from './selectors.js'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
	submitNext
}

const mapStateToProps = ({ profits, punishments, used, punishmentRate, maxRound, round, id, askStudentId, state, voted, members, notVoted, invested, voting, punished }) => ({
	profits,
	punishments,
	used,
	punishmentRate,
	maxRound,
	round,
	id,
	askStudentId,
	state,
	voted,
	members,
	notVoted,
	invested,
	voting,
	punished
})

class Experiment extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {}
	}

	handleClose() {
		this.props.submitNext()
	}

	render() {
		const {  id, askStudentId, state, voted, members, notVoted, invested, voting, punished, maxRound, round } = this.props
		const actions = [
			<FlatButton
				label="OK"
				primary={true}
				onTouchTap={this.handleClose.bind(this)}
			/>
		]
		return (
			<span>
				{(askStudentId && id == null)
					? <InputSnum />
					: <div>
						<div>
							{(state == "investment" && !invested)
								? <Investment />
							: (state == "punishment" && !punished)
								? <Punishment />
							: (invested || punished)
								?<Card>
									<CardTitle title="公共財実験" subtitle="結果画面" />
									<CardText>
										<Chip style={{float: "left"}}>{multi_text["experiment"]["round"] + " : " + ((round+1==maxRound)?multi_text["experiment"]["roundend"]:((round + 1) + " / " + maxRound))}</Chip>
										<Chip style={{float: "right"}}>{multi_text["experiment"]["profit"] + ":" + Math.round(profitsSelector(this.props))}</Chip>
										<div style={{ clear: "both" }}>
											<p>{multi_text["experiment"]["end"]}</p>	
											{(voting)?
												<p>(確認：{members.length-notVoted}人/{members.length}人中)</p>
												:<p>(解答済み：{members.length - notVoted}人/{members.length})</p>
											}
											<div style={{ textAlign: "center" }}>
												<CircularProgress />
											</div>
											{<Dialog
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
												:null			
												}
											</Dialog>}
										</div>
									</CardText>
								</Card>		
							: null		
							}
							</div>
					</div>
				}
			</span>				
		)
	}
}

export default connect(mapStateToProps, actionCreators)(Experiment)
