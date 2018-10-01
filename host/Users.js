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

import Point from '../shared/Point.js'
import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text
const $s = multi_text["host"]["users"]

const mapStateToProps = ({ page, groups, money, punishmentRate, participantsNumber, groupsNumber, participants, activeParticipantsNumber }) => ({
  page,
  groups,
  money,
  punishmentRate,
  participantsNumber,
  groupsNumber,
  participants,
  activeParticipantsNumber
})

const User = ({ id , userid, investment_private, investment_public, profit_private, profit_public, profit, group, openParticipantPage, round, state }) => (
  <tr>
    <td><a onClick={openParticipantPage(id)}>{userid}</a></td>
    <td><Point>{investment_private}</Point></td>
    <td><Point>{investment_public}</Point></td>
    <td><Point>{profit_private}</Point></td>
    <td><Point>{profit_public}</Point></td>
    <td><Point>{profit}</Point></td>
    <td>{group}</td>
    <td>{round}</td>
    <td>{state}</td>
  </tr>
)



const UsersList = ({groups, participants, openParticipantPage, page, money, punishmentRate}) => (
  <table>
    <thead>
      <tr>
        <th>{$s["table_header"][0]}</th>
        <th>{$s["table_header"][1]}</th>
        <th>{$s["table_header"][2]}</th>
        <th>{$s["table_header"][3]}</th>
        <th>{$s["table_header"][4]}</th>
        <th>{$s["table_header"][5]}</th>
        <th>{$s["table_header"][6]}</th>
        <th>{$s["table_header"][7]}</th>
        <th>{$s["table_header"][8]}</th>
      </tr>
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
          p["punishmentRate"] = punishmentRate
          let state
          if (p.group == null) state = "Wait Matching"
          else {
            switch (page) {
              case "experiment":
                if (!groups[p.group]) {
                  state = "-"
                  break;
                }
                switch (groups[p.group].group_status) {
                  case "investment":
                    state = (p.invested) ? "invested" : "investment"
                    break;
                  case "investment_result":
                    state = (p.voted) ? "investment confirmed" : "investment confirm"
                    break;
                  case "punishment":
                    state = (p.punished) ? "punished" : "punishment"
                    break;
                  case "punishment_result":
                    state = (p.voted) ? "punishment confirmed" : "punishment confirm"
                    break;
                  default:
                    state = "-"
                    break;
                }
                break;
              case "description":
                state = ((p.is_finish_description) ? "Read" : "Reading")
                break;
              default:
                state = page
                break;
            }
          }

          const profitSum = profitsSelector(p)
          return (
            <User
              key={id}
              id={id}
              userid={participants[id].id != null ? participants[id].id : id}

              investment_private={p.invs != null && p.invs.length != 0 && p.group != null
                                 ? (money * p.invs.length) - p.invs.reduce((prev, current) => prev+current)
                                 : "-"}
              investment_public={p.invs != null && p.invs.length != 0 && p.group != null
                                ? p.invs.reduce((prev, current, i, arr) => prev+current)
                                : "-"}
              profit_private={p.profits != null && p.profits.length != 0 && p.invs != null && p.invs.length != 0 && p.group != null
                             ? (money * p.invs.length) - p.invs.reduce((prev, current, i, arr) => prev+current)
                             : "-"}
              profit_public={p.profits != null && p.profits.length != 0 && p.invs != null && p.invs.length != 0 && p.group != null
                             ? profitSum - ((money * p.invs.length) - p.invs.reduce((prev, current, i, arr) => prev+current))
                             : "-"}
              profit={p.profits != null && p.profits.length != 0 && p.group != null
                     ? profitSum
                     : "-"}
              group={p.group != null
                     ? p.group
                     : "-"}
              round={p.group != null
                     ? group.round + 1
                     : "-"}
              state={state}
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
    const { page, maxRound, money, punishmentRate, participants, groups, participantsNumber, groupsNumber, openParticipantPage, activeParticipantsNumber } = this.props
    
    return (
      <div>
        <Card>
          <CardHeader
            title={multi_text["host"]["users"]["card_header"][0] + ((participants)? Object.keys(participants).length : "0") + multi_text["host"]["users"]["card_header"][1]}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>          
          <UsersList
            groups={groups}
            page={page}  
            participants={participants}
            openParticipantPage={openParticipantPage}
            money={money}
            punishmentRate={punishmentRate}  
          />
          </CardText>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(throttle(Users, 200))
