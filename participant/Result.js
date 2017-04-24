import React, { Component } from 'react'
import { connect } from 'react-redux'

import Chart from '../components/Chart.js'

import { fetchContents } from './actions'
import { profitsSelector } from './selectors'
import Point from '../components/Point.js'

const mapStateToProps = (state) => {
  const { ranking } = state
  ranking.sort(({profit: p1}, {profit: p2}) => p2 - p1) // Desc
  const filtered = ranking
    .map((obj, index) => {
      return Object.assign({rank: index + 1}, obj)
    })
    .filter(({ own }, index) => {
      return own || index < 10
    })
  return { ranking: filtered, profits: profitsSelector(state) }
}

const Result = ({ranking, profits}) => (
  <div>
    <p>あなたのポイント<Point>{profits}</Point></p>
    <table>
      <thead>
        <tr><th>順位</th><th>利得</th></tr>
      </thead>
      <tbody>
        {
          ranking.map(({ profit, own, rank }, i) => (
            <tr
              key={i}
              style={own
                ? {
                  backgroundColor: "#bbb"
                }
                : {}
              }
            >
              <td>{rank}</td><td><Point>{profit}</Point></td>
            </tr>
          ))
        }
      </tbody>
    </table>
    <Chart />
  </div>
)

export default connect(mapStateToProps)(Result)
