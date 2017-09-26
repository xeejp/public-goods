import React, { Component } from 'react'
import { connect } from 'react-redux'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ cost, maxGrazingNum, members, capacity }) => ({
  cost,
  maxGrazingNum,
  members,
  capacity,
})

class ProfitTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    // use as key
    let uuid = (function(){
      let S4 = () => ((((1+Math.random())*0x10000)|0).toString(16).substring(1))
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())
    })

    const { value, lineValue, cost, maxGrazingNum, members, capacity } = this.props
    const groupSize = members.length
    const sumOfCattles = (groupSize - 1) * maxGrazingNum

    let header = []
    for (let i = 0; i <= sumOfCattles; ++i) {
      header.push(<th key={uuid()} style={(lineValue == i) ? {backgroundColor: '#f2f2f2', textAlign: 'center'}:{textAlign: 'center'}}>{i}</th>)
    }
    let body = []
    for (let i = 1; i <= maxGrazingNum; ++i) {
      let line = []
      line.push(<td key={uuid()} style={{borderRight: 'solid 1px silver'}}>{i}</td>)
      for (let j = 0; j <= sumOfCattles; j++) {
        line.push(<td key={uuid()} style={(lineValue == j) ? {backgroundColor: '#f2f2f2', textAlign: 'center'}:{textAlign: 'center'}}>{i * (capacity - (i + j)) - cost * i}</td>)
      }
      body.push(<tr key={uuid()} style={(value == i) ? {backgroundColor: '#f2f2f2'} : null}>{line}</tr>)
    }

    return (
        <table className={(!lineValue)?"highlight":""}>
          <caption>{multi_text["pasture_form"][0]}</caption>
          <thead>
            <tr>
              <th></th>
              <th style={{textAlign: 'center'}} colSpan={sumOfCattles - 2}>{multi_text["pasture_form"][1]}</th>
            </tr>
            <tr>
              <th key={uuid()}></th>
              <th key={uuid()} style={{borderRight: 'solid 1px silver'}}></th>
              {header}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{textAlign: 'center'}} rowSpan={maxGrazingNum + 1}>{multi_text["pasture_form"][2]}</th>
            </tr>
            {body}
          </tbody>
        </table>
    )
  }
}

export default connect(mapStateToProps)(ProfitTable)