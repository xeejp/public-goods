import React, { Component } from 'react'
import { connect } from 'react-redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Highcharts from 'react-highcharts'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ results, maxRound, maxGrazingNum, groupSize, activeParticipantsNumber }) => ({
  results,
  maxRound,
  maxGrazingNum,
  groupSize,
  activeParticipantsNumber,
})

class Graph extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { expanded: false }
  }

  handleExpandChange(expanded) {
    this.setState({expanded: expanded});
  }

  render() {
    const { results, maxRound, maxGrazingNum, groupSize, activeParticipantsNumber } = this.props
    if (!results) return null
    let size = activeParticipantsNumber % groupSize
    if(size == 0) size = groupSize
    let config = {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: multi_text["graph"]["title"][0]
      },
      subtitle: {
        text: multi_text["graph"]["title"][1]
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: multi_text["graph"]["axis"][0],
          enabled: true,
        },
        min: size - 1,
        max: maxGrazingNum * (groupSize - 1),
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: multi_text["graph"]["axis"][1],
        },
        min: 0,
        max: maxGrazingNum,
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: multi_text["graph"]["else"][0] 
          }
        }
      },
      exporting : {
        enabled: true
      },
      series: [{
        color: 'rgba(100, 200, 200, .5)',
        data: []
      }]
    }

    let data = []
    Object.keys(results.groups).forEach(group_id => {
      if (results.groups[group_id].groupStatus == 'result' || results.groups[group_id].group_status == 'result') {
        let members = results.groups[group_id].members.map(_id =>
            results.participants[_id].reduce((acc, val) => acc + val, 0)
        )
        let sum = members.reduce((acc, val) => acc + val, 0)

        members.forEach(member => {
          data.push(
            [(sum - member) / maxRound, (member) / maxRound]
          )
        })
      }
    })
    config["series"][0]["data"] = data
    return (<div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange.bind(this)}>
          <CardHeader title={multi_text["graph"]["else"][1]} actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <Highcharts config={config} />
            </CardText>
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps)(throttle(Graph, 200))
