import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'

import { openParticipantPage } from './actions'

const User = ({ id,investment_private, investment_public, profit_private, profit_public, profit, group, openParticipantPage, round, state }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{id}</a></td>
    <td>{investment_private}</td>
    <td>{investment_public}</td>
    <td>{profit_private}</td>
    <td>{profit_public}</td>
    <td>{profit}</td>
    <td>{group}</td>
    <td>{round}</td>
    <td>{state}</td>
  </tr>
)

const UsersList = ({groups, participants, openParticipantPage}) => (
  <table>
    <thead>
      <tr><th>被験者ID</th><th>私的財投資</th><th>公共財投資</th><th>私的財利得</th><th>公共財利得</th><th>利得合計</th><th>グループ</th><th>ラウンド</th><th>状態</th></tr>
    </thead>
    <tbody>
      {
        Object.keys(participants).sort((id1, id2) => {
          if(participants[id1].group > participants[id2].group) return  1
          if(participants[id1].group < participants[id2].group) return -1
          return 0
        }).map(id => {
          const group = groups[participants[id].group]
          const p = participants[id]
          return (
            <User
              key={id}
              id={id}
  　　　　　　investment_private={p.invs != null && p.invs.length != 0
                                 ? (p.money * p.invs.length) - p.invs.reduce((prev, current) => prev+current)
                                 : "未確定"}
  　　　　　　investment_public={p.invs != null && p.invs.length != 0
                                ? p.invs.reduce((prev, current, i, arr) => prev+current)
                                : "未確定"}
              profit_private={p.profits != null && p.profits.length != 0 && p.invs != null && p.invs.length != 0
                             ? (p.money * p.invs.length) - p.invs.reduce((prev, current, i, arr) => prev+current)
                             : "未確定"}
              profit_public={p.profits != null && p.profits.length != 0 && p.invs != null && p.invs.length != 0
                             ? p.profits.reduce((prev, current, i, arr) => prev+current) - ((p.money * p.invs.length) - p.invs.reduce((prev, current, i, arr) => prev+current))
                             : "未確定"}
              profit={p.profits != null && p.profits.length != 0
                     ? p.profits.reduce((prev, current, i, arr) => prev+current)
                     : "未確定"}
              group={p.group}
  　　　　　　round={group.round + 1}
              state={group.state}
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

const mapStateToProps = ({ groups, participants }) => ({ groups, participants })

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
