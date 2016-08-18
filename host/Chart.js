import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

const mapStateToProps = ({investmentLog, rounds}) => {
  const data = Array.from(Array(rounds).keys()).map(() => [])
  investmentLog.forEach(({round, investments}) => {
    Array.prototype.push.apply(data[round], investments)
  })
  const config = {
    chart: {
      type: 'boxplot'
    },
    title: {
      text: 'タイトル'
    },
    legend: {
      enabled: false
    },
    xAxis: {
      categories: Array.from(Array(rounds).keys()).map(x => (x + 1).toString()),
        title: {
          text: 'Round'
        }
    },
    yAxis: {
      title: {
        text: '投資額'
      },
    },
    series: [{
      name: '投資額',
      data,
      tooltip: {
        headerFormat: '<em>{point.key}回目</em><br/>'
      }
    }]
  }
  console.log(config)
  return {
    display: investmentLog.length > 0,
    config
  }
}

const Chart = ({ config, display }) => (
  display
    ? <ReactHighcharts config={config} />
    : null
)

export default connect(mapStateToProps)(Chart)
