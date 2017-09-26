import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import throttle from 'react-throttle-render'

import Badge from 'material-ui/Badge'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import PersonIcon from 'material-ui/svg-icons/social/person'
import PeopleIcon from 'material-ui/svg-icons/social/people'
import PersonOutlineIcon from 'material-ui/svg-icons/social/person-outline'

import { openParticipantPage } from './actions'
import { profitsSelector } from '../participant/selectors'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ page, groups, participantsNumber, groupsNumber, participants, activeParticipantsNumber }) => ({
  page,
  groups,
  participantsNumber,
  groupsNumber,
  participants,
  activeParticipantsNumber
})

const User = ({ id , userid, investment_private, investment_public, profit_private, profit_public, profit, group, openParticipantPage, round, state }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{userid}</a></td>
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
          const profitSum = profitsSelector(p)
          return (
            <User
              key={id}
              id={id}
              userid={participants[id].id != null ? participants[id].id : id}

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
                     ? group.group_status
                     : "-"}
              openParticipantPage={openParticipantPage}
            />
          )
        })
      }
    </tbody>
  </table>
)

const mapDispatchToProps = (dispatch) => {
  const open = bindActionCreators(openParticipantPage, dispatch)
  return {
    openParticipantPage: (id) => () => open(id)
  }
}

class Users extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const { page, maxRound, participants, groups, participantsNumber, groupsNumber, openParticipantPage, activeParticipantsNumber } = this.props
    return (
      <div>
        <Card>
          <CardHeader
            title={multi_text["users"][0] + ((participants)? Object.keys(participants).length : "0") + multi_text["users"][1]}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(throttle(Users, 200))
