import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'

import Point from '../components/Point.js'
import { openParticipantPage } from './actions'
import { profitsSelector } from '../participant/selectors'

const User = ({ id,investment_private, investment_public, profit_private, profit_public, profit, group, openParticipantPage, round, state }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{id}</a></td>
    <td>{investment_private}</td>
    <td>{investment_public}</td>
    <td>{profit_private}</td>
    <td><Point>{profit_public}</Point></td>
    <td><Point>{profit}</Point></td>
    <td>{group}</td>
    <td>{round}</td>
    <td>{state}</td>
  </tr>
)

const UsersList = ({groups, participants, profitSum, openParticipantPage}) => (
  <table>
    <thead>
      <tr><th>被験者ID</th><th>私的財投資</th><th>公共財投資</th><th>私的財利得</th><th>公共財利得</th><th>利得合計</th><th>グループ</th><th>ラウンド</th><th>状態</th></tr>
    </thead>
    <tbody>
      {
        Object.keys(participants).sort((id1, id2) => {
          if(participants[id1].group == null) return 1
          if(participants[id1].group > participants[id2].group) return  1
          if(participants[id1].group < participants[id2].group) return -1
          return 0
        }).map(id => {
          const group = groups[participants[id].group]
          const p = participants[id]
          const profitSum = profitsSelector(p)
          return (
            <User
              key={id}
              id={id}
  　　　　　　investment_private={p.invs != null && p.invs.length != 0 && p.group != null
                                 ? (p.money * p.invs.length) - p.invs.reduce((prev, current) => prev+current)
                                 : "-"}
  　　　　　　investment_public={p.invs != null && p.invs.length != 0 && p.group != null
                                ? p.invs.reduce((prev, current, i, arr) => prev+current)
                                : "-"}
              profit_private={p.profits != null && p.profits.length != 0 && p.invs != null && p.invs.length != 0 && p.group != null
                             ? (p.money * p.invs.length) - p.invs.reduce((prev, current, i, arr) => prev+current)
                             : "-"}
              profit_public={p.profits != null && p.profits.length != 0 && p.invs != null && p.invs.length != 0 && p.group != null
                             ? profitSum - ((p.money * p.invs.length) - p.invs.reduce((prev, current, i, arr) => prev+current))
                             : "-"}
              profit={p.profits != null && p.profits.length != 0 && p.group != null
                     ? profitSum
                     : "-"}
              group={p.group != null
                     ? p.group
                     : "見学"}
              round={p.group != null
                     ? group.round + 1
                     : "-"}
              state={p.group != null
                     ? group.state
                     : "-"}
              openParticipantPage={openParticipantPage}
            />
          )
        })
      }
    </tbody>
  </table>
)

const Group = ({ id, round, state, members }) => (
  <tr><td>{id}</td><td>{round + 1}</td><td>{state}</td><td>{members}</td></tr>
)

const Groups = ({ groups, participants }) => (
  <table>
    <thead><tr><th>グループ番号</th><th>ラウンド数</th><th>状態</th><th>メンバー数</th></tr></thead>
    <tbody>
      {
        Object.keys(groups).map(id => (
          <Group
            key={id}
            id={id}
            round={groups[id].round}
            state={groups[id].state}
            members={groups[id].members.length}
          />
        ))
      }
    </tbody>
  </table>
)

const mapStateToProps = (state) => {
  const { groups, participants } = state
  return {
    groups, participants
  }
}

const mapDispatchToProps = (dispatch) => {
  const open = bindActionCreators(openParticipantPage, dispatch)
  return {
    openParticipantPage: (id) => () => open(id)
  }
}

const Users = ({ groups, participants, openParticipantPage }) => (
  <div>
    <Card>
      <CardHeader
        title={"登録者 " + Object.keys(participants).length + "人"}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <UsersList
          groups={groups}
          participants={participants}
          openParticipantPage={openParticipantPage}
        />
      </CardText>
    </Card>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(throttle(Users, 200))
