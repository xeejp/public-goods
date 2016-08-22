import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

function computeQuartile(array, length, n, d) {
  const pos = (length - 1.0) * n / d

  const divisible = (length - 1) % d == 0
  if (divisible) {
    return array[Math.trunc(pos)]
  } else {
    const posInt = Math.trunc(pos)
    const ratio1 = pos - posInt
    const ratio2 = 1.0 - ratio1
    return array[posInt] * ratio2 + array[posInt + 1] * ratio1
  }
}

const mapStateToProps = ({investmentLog, rounds}) => {
  const data = Array.from(Array(rounds).keys()).map(() => [])
  investmentLog.forEach(({round, investments}) => {
    Array.prototype.push.apply(data[round], investments)
  })
  const finalData = data.map(investments => {
    investments.sort((a, b) => a - b)
    length = investments.length
    const low = investments[0]
    const q1 = computeQuartile(investments, length, 1, 4)
    const median = computeQuartile(investments, length, 1, 2)
    const q2 = computeQuartile(investments, length, 3, 4)
    const high = investments[length - 1]
    return [low, q1, median, q2, high]
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
      data: finalData,
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
