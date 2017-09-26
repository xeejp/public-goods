import React, { Component } from 'react'
import { connect } from 'react-redux'

import Divider from 'material-ui/Divider'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'
import Rank from '../shared/Rank'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ askStudentId }) => ({
  askStudentId,
})

class Result extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { askStudentId } = this.props
    return (
      <Card>
        <CardTitle title={multi_text["result"]["card"][0]} subtitle={multi_text["result"]["card"][1] + (askStudentId ? multi_text["result"]["card"][2] + (id ? id : "") + ")" : "")}/>
        <CardText>
          <p>{multi_text["result"]["card"][3]}</p>
          <Rank
            my_profit={null}
          />
          <br />
          {/*<Chart />*/}
        </CardText>
      </Card>
    )
  }
}

export default connect(mapStateToProps)(Result)
