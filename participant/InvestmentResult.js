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
const $s = multi_text["participant"]["experiment"]["investment_result"]

const actionCreators = {
  submitNext
}

const mapStateToProps = ({ money, members, investments, roi, profits, voted, uid }) => ({
  money,
  members,
  investments,
  roi,
  profits,
  voted,
  uid
})

class InvestmentResult extends Component {
  constructor(props, context) {
		super(props, context)
    this.state = {}
  }

  render() {
    const { money, members, investments, roi, profits, voted, submitNext, uid } = this.props
    const investmentsSum = investments.reduce((acc, { investment }) => acc + investment, 0)
    const memberID = members.findIndex(a => a == uid)
    return (
      <span>
        <List>
          <ListItem>
            <p>{$s["list_title"][0]}</p>
            <Avatar
              backgroundColor={blue400}
              size={50}
              style={{ margin: 5 }}
            >
              <Point>
                {money - investments[memberID].investment}
              </Point>
            </Avatar>
          </ListItem>
          <ListItem>
            <p>{$s["list_title"][1]}</p>
            <Avatar
              backgroundColor={orange400}
              size={50}
              style={{ margin: 5 }}
            >
              <Point>
                {investmentsSum}
              </Point>
            </Avatar>
            {$s["operator"][0] + roi + $s["rate"]+ $s["operator"][2]}
          <Avatar
              backgroundColor={blue400}
              size={50}
              style={{ margin: 5 }}
            >
              <Point>
                {investmentsSum * roi}
              </Point>
            </Avatar>
          </ListItem>
          <Divider />
          <ListItem>
            <p>{$s["list_title"][2]}</p>
            <Avatar
              backgroundColor={blue400}
              size={50}
              style={{ margin: 5 }}
            >
              <Point>
                {money - investments[memberID].investment}
              </Point>
            </Avatar>
            {$s["operator"][1]}
          <Avatar
              backgroundColor={blue400}
              size={50}
              style={{ margin: 5 }}
            >
              <Point>
                {investmentsSum * roi}
              </Point>
            </Avatar>
            {$s["operator"][2]}
          <Avatar
              backgroundColor={blue400}
              size={50}
              style={{ margin: 5 }}
            >
              <Point>
                {profits[0]}
              </Point>
            </Avatar>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <p>{$s["list_title"][3]}</p>
            {
              investments.map(({ id, investment }) => (
                <Avatar
                  key={id}
                  backgroundColor={pink400}
                  size={50}
                  style={{ margin: 5 }}
                >
                  <Point>
                    {investment}
                  </Point>
                </Avatar>
              ))
            }
          </ListItem>
        </List>
      </span>  
      )
  }
}

export default connect(mapStateToProps, actionCreators)(InvestmentResult)
