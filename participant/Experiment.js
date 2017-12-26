import React, { Component } from 'react'
import { connect } from 'react-redux'

import Chip from 'material-ui/Chip'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import InputSnum from './InputSnum'
import Investment from './Investment'
import Punishment from './Punishment'

import { submitNext } from './actions'
import { profitsSelector } from './selectors.js'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
	submitNext
}

const mapStateToProps = ({ id, askStudentId, state }) => ({
	id,
	askStudentId,
	state,
})

class Experiment extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {}
	}

	render() {
		const {  id, askStudentId, state } = this.props
		
		return (
			<span>
				{(askStudentId && id == null)
					? <InputSnum />
					: <div>
						<div>
							{(state == "investment" || state == "investment_result")
								? <Investment />
							: (state == "punishment" || state == "punishment_result")
								? <Punishment />
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
