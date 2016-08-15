import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

const mapStateToProps = ({}) => ({
})

const Waiting = ({}) => (
	<Card>
		<CardTitle title="公共財実験" subtitle="待機画面" />
		<CardText>
			<p>参加者の登録を待っています。</p>
			<p>この画面のまましばらくお待ち下さい。</p>
		</CardText>
		<div style={{textAlign: "center"}}>
			<CircularProgress size={2}/>
		</div>
	</Card>
)

export default connect()(Waiting)
