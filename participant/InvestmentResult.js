import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'

import { pink400, blue400, orange400 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar'
import List from 'material-ui/List/List'
import ListItem from 'material-ui/List/ListItem'

import { submitNext } from './actions'

const mapStateToProps = ({
  memberID, investments, roi, profits, voted, votesNext
}) => {
  const investmentsSum = investments.reduce((acc, { investment }) => acc + investment, 0)
  return {
    memberID, investments, roi, investmentsSum, profits,
    voted, votesNext
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitNext: bindActionCreators(submitNext, dispatch)
})

const InvestmentResult = ({
  memberID, investment, investments, roi, investmentsSum, profits,
  votesNext, voted, submitNext
}) => (
  <Card>
    <CardHeader title="公共財実験" subtitle="投資結果画面" />
    <CardText>
      <List>
        <ListItem>
          <p>私的財からの利得</p>
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {profits[0]-(investmentsSum*roi)}
          </Avatar>
        </ListItem>
        <ListItem>
          <p>公共財からの利得</p>
          <Avatar
            backgroundColor={orange400}
            size={50}
            style={{margin: 5}}
          >
            {investmentsSum}
          </Avatar>
          ×{roi}倍＝
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {investmentsSum*roi}
          </Avatar>
        </ListItem>
        <Divider />
        <ListItem>
          <p>利得合計</p>
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {profits[0]-(investmentsSum*roi)}
          </Avatar>
          ＋
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {investmentsSum*roi}
          </Avatar>
          ＝
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {profits[0]}
          </Avatar>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
        <p>メンバーの公共財投資</p>
        {
          investments.map(({ id, investment }) => (
            <Avatar
              key={id}
              backgroundColor={pink400}
              size={50}
              style={{margin: 5}}
            >
              {investment}
            </Avatar>
          ))
        }
        </ListItem>
      </List>
      <Divider />
      <CardActions>
        <RaisedButton
          primary={true}
          label={"次に進む "}
          disabled={voted}
          onClick={submitNext}
        />
        <p>(確認：{votesNext}人/{investments.length}人中)</p>
      </CardActions>
    </CardText>
  </Card>
)

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentResult)
