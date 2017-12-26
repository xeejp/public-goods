import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ participantsNumber }) => ({
  participantsNumber
})

class Waiting extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { participantsNumber } = this.props
    return (
  <Card>
    <CardTitle title={multi_text["participant"]["waiting"][1]} subtitle={multi_text["participant"]["waiting"][1]} />
    <CardText>
      <p>{multi_text["participant"]["waiting"][2]}</p>
      <p>{multi_text["participant"]["waiting"][3]}</p>
      <p>{multi_text["participant"]["waiting"][4]}{participantsNumber}{multi_text["participant"]["waiting"][5]} </p>
    </CardText>
    <div style={{textAlign: "center"}}>
      <CircularProgress size={2}/>
    </div>
  </Card>
    )
  }
}

export default connect(mapStateToProps)(Waiting)
