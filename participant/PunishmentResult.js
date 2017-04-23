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

import { profitsSelector } from './selectors.js'
import { submitNext } from './actions'

const mapStateToProps = (state) => {
  const {
    profits, punishments, used, voted, votesNext, members
  } = state
  return {
    profits, punishments, used,
    voted, votesNext, members
  }
}

const mapDispatchToProps = (dispatch) => ({
  submitNext: bindActionCreators(submitNext, dispatch)
})

const PunishmentResult = ({
  profits, punishments, used,
  voted, votesNext, submitNext, members
}) => (
  <Card>
    <CardHeader title="公共財実験" subtitle="罰結果画面" />
    <CardText>
      <List>
        <ListItem>
          <p>利得</p>
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {profits[0]}
          </Avatar>
        </ListItem>
        <ListItem>
          <p>罰に利用したポイント</p>
          <Avatar
            backgroundColor={orange400}
            size={50}
            style={{margin: 5}}
          >
            {used[0]}
          </Avatar>
        </ListItem>
        <ListItem>
          <p>受けた罰</p>
          <Avatar
            backgroundColor={pink400}
            size={50}
            style={{margin: 5}}
          >
            {punishments[0] * 3}
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
            {profits[0]}
          </Avatar>
          −
          <Avatar
            backgroundColor={orange400}
            size={50}
            style={{margin: 5}}
          >
            {used[0]}
          </Avatar>
          −
          <Avatar
            backgroundColor={pink400}
            size={50}
            style={{margin: 5}}
          >
            {punishments[0] * 3}
          </Avatar>
          ＝
          <Avatar
            backgroundColor={blue400}
            size={50}
            style={{margin: 5}}
          >
            {profits[0] - used[0] - punishments[0] * 3}
          </Avatar>
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
        <p>(確認：{votesNext}人/{members}人中)</p>
      </CardActions>
    </CardText>
  </Card>
)

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentResult)
