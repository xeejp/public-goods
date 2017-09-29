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
const $s = multi_text["participant"]["result"]

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
        <CardTitle title={$s["card"][0]} subtitle={$s["card"][1] + (askStudentId ? $s["card"][2] + (id ? id : "") + ")" : "")}/>
        <CardText>
          <p>{$s["card"][3]}</p>
          <p>{$s["card"][4]}:<Point>{profit}</Point></p>
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
