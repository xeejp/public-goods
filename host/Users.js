import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardHeader, CardText } from 'material-ui/Card'

const User = ({ id, profit, invested }) => (
  <tr><td>{id}</td><td>{profit}</td><td>{invested}</td></tr>
)

const UsersList = ({participants}) => (
  <table>
    <thead><tr><th>id</th><th>profit</th><th>invested</th><th></th></tr></thead>
    <tbody>
      {
        Object.keys(participants).map(id => (
          <User
            key={id}
            id={id}
            profit={participants[id].profit}
            invested={participants[id].invested ? "投資済" : "未投資"}
          />
        ))
      }
    </tbody>
  </table>
)

const Group = ({ group, participants }) => (
  <UsersList
    participants={group.members.reduce((res, id) => Object.assign(res, {[id]: participants[id]}), {})}
  />
)

const Groups = ({ groups, participants }) => (
  <div>
    {
      Object.keys(groups).map(id => (
        <Group
          key={id}
          group={groups[id]}
          participants={participants}
        />
      ))
    }
  </div>
)

const mapStateToProps = ({ groups, participants }) => ({ groups, participants })

const Users = ({ groups, participants }) => (
  <div>
    <Card>
      <CardHeader
        title={"Users (" + Object.keys(participants).length + "人)"}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <UsersList
          participants={participants}
        />
      </CardText>
    </Card>
    <Card>
      <CardHeader
        title={"グループ数 (" + Object.keys(groups).length + ")"}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <Groups
          groups={groups}
          participants={participants}
        />
      </CardText>
    </Card>
  </div>
)

export default connect(mapStateToProps)(Users)
