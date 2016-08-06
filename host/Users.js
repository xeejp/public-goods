import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardHeader, CardText } from 'material-ui/Card'

const User = ({ id }) => (
  <tr>
    <td>{id}</td>
  </tr>
)

const mapStateToProps = ({ participants }) => ({ participants })

const Users = ({ participants }) => (
  <Card>
    <CardHeader
      title={"Users (" + Object.keys(participants).length + "人)"}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      <table>
        <thead>
          <tr>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(participants).map(id => (
              <User
                key={id}
                id={id}
              />
            ))
          }
        </tbody>
      </table>
    </CardText>
  </Card>
)

export default connect(mapStateToProps)(Users)
