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

import Point from '../shared/Point.js'
import { profitsSelector } from './selectors.js'
import { submitNext } from './actions'
import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text
const $s = multi_text["participant"]["experiment"]["punishment_result"]

const mapStateToProps = ({profits, punishments, used, voted, votesNext, members, punishmentRate }) => ({
  profits,
  punishments,
  used,
  voted,
  members,
  punishmentRate
})

const mapDispatchToProps = (dispatch) => ({
  submitNext: bindActionCreators(submitNext, dispatch)
})

const PunishmentResult = ({ profits, punishments, used, voted, votesNext, submitNext, members, punishmentRate }) => (
    <List>
      <ListItem>
      <p>{$s["list_title"][0]}</p>
        <Avatar
          backgroundColor={blue400}
          size={50}
          style={{margin: 5}}
        >
          <Point>
            {profits[0]}
          </Point>
        </Avatar>
      </ListItem>
      <ListItem>
        <p>{$s["list_title"][1]}</p>
        <Avatar
          backgroundColor={orange400}
          size={50}
          style={{margin: 5}}
        >
          <Point>
            {used[0]}
          </Point>
        </Avatar>
      </ListItem>
      <ListItem>
        <p>{$s["list_title"][2]}</p>
        <Avatar
          backgroundColor={pink400}
          size={50}
          style={{margin: 5}}
        >
          <Point>
            {punishments[0] * punishmentRate}
          </Point>
        </Avatar>
      </ListItem>
      <Divider />
      <ListItem>
        <p>{$s["list_title"][3]}</p>
        <Avatar
          backgroundColor={blue400}
          size={50}
          style={{margin: 5}}
        >
          <Point>
            {profits[0]}
          </Point>
        </Avatar>
        {$s["operator"][0]}
         <Avatar
          backgroundColor={orange400}
          size={50}
          style={{margin: 5}}
        >
          <Point>
            {used[0]}
          </Point>
        </Avatar>
        <Avatar
          backgroundColor={pink400}
          size={50}
          style={{margin: 5}}
        >
          {punishments[0] * punishmentRate}
        </Avatar>
        {$s["operator"][1]}
        <Avatar
          backgroundColor={blue400}
          size={50}
          style={{margin: 5}}
        >
          <Point>
             {profits[0] - used[0] - punishments[0] * punishmentRate}
          </Point>
        </Avatar>
      </ListItem>
    </List>
)

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentResult)
