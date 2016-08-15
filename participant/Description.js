import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'

const mapStateToProps = ({}) => ({
})

const Description = ({}) => (
	<Card>
		<CardTitle title="公共財実験" subtitle="ルールの説明" />
		<CardText>
			<p>あなたは他の3名の参加者とともに4人1組のグループに属しています。<br/>このグループのメンバーは実験を通じて変わりません。</p>
			<p>グループのメンバーには各ターンごとに20ポイントずつ与えられます。<br/>あなたはこの20ポイントを、私的財と公共財に振り分けて投資してください。</p>
			<List>
			        <ListItem
					primaryText="私的財"
					secondaryText="投資したポイントがそのまま自分の収益になります。"
			        />
        			<ListItem
				primaryText="公共財"
				secondaryText="メンバー全員の投資したポイントを合計して、0.4を乗じたポイントが全員の収益になります。"
				/>
			</List>
			<p>各ターンの収益は各ターンごとに集計され、次のターンには持ち越されません。<br/>つまり、どのターンでも投資できるポイントは20ポイントです。<br/>収益は累積され、画面右上に表示されます。</p>
			<p>はじめに練習として2ターン行います。<br/>つづいて、本番としてnターン行います。<br/>nターン目が終了した後に、実験参加者全員のランキングと平均投資率を表示します。</p>
		</CardText>
	</Card>
)
export default connect()(Description)
