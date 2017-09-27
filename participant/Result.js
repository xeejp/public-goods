import React, { Component } from 'react'
import { connect } from 'react-redux'

import Divider from 'material-ui/Divider'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import { profitsSelector } from './selectors.js'
import Rank from '../shared/Rank'
import Point from '../shared/Point.js'
import Graph from '../shared/Graph'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ askStudentId, profits, punishments, used, punishmentRate }) => ({
  askStudentId,
  profits,
  punishments,
  used,
  punishmentRate,
})

class Result extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { askStudentId } = this.props
    const profit = profitsSelector(this.props)
    return (
      <Card>
        <CardTitle title={multi_text["result"]["card"][0]} subtitle={multi_text["result"]["card"][1] + (askStudentId ? multi_text["result"]["card"][2] + (id ? id : "") + ")" : "")}/>
        <CardText>
          <p>{multi_text["result"]["card"][3]}</p>
          <p>あなたのポイント:<Point>{profit}</Point></p>
          <Rank
            my_profit={profit}
          />
          <br />
          <Graph />
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Result)
