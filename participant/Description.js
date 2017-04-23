import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'

const mapStateToProps = ({ rounds, roi, money, members }) => ({ rounds, roi, money, members: members || 4 })

class Description extends Component {
  render() {
    const { rounds, roi, money, members } = this.props
    return (
      <Card>
        <CardTitle title="公共財実験" subtitle="ルールの説明" />
        <CardText>
          <p>あなたは他の{members-1}名の参加者とともに{members}人1組のグループに属しています。<br />このグループのメンバーは実験を通じて変わりません。</p>
          <p>グループのメンバーには各ターンごとに{ money }ポイントずつ与えられます。<br />あなたはこの{ money }ポイントを、私的財と公共財に振り分けて投資してください。</p>
          <p>私的財：投資したポイントがそのまま自分の収益になります。</p>
          <p>公共財：メンバー全員の投資したポイントを合計して、{ roi }を乗じたポイントが全員の収益になります。</p>
          <p>各ターンの収益は各ターンごとに集計され、次のターンには持ち越されません。<br />つまり、どのターンでも投資できるポイントは{ money }ポイントです。<br />収益は累積され、画面右上に表示されます。</p>
          <p>この投資を全部で{ rounds }ターン繰り返します。</p>
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Description)
