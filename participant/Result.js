import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

const mapStateToProps = ({ ranking }) => {
  ranking.sort(({profit: p1}, {profit: p2}) => p2 - p1) // Desc
  const filtered = ranking
    .map((obj, index) => {
      return Object.assign({rank: index + 1}, obj)
    })
    .filter(({ own }, index) => {
      return own || index < 10
    })
  return { ranking: filtered }
}

const Result = ({ranking}) => (
  <div>
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
              <td>{rank}</td><td>{profit}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)

export default connect(mapStateToProps)(Result)
