import React, { Component } from 'react'
import { connect } from 'react-redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import { ReadJSON, LineBreak } from '../shared/ReadJSON'

import Point from './Point.js'

const multi_text = ReadJSON().static_text

const mapStateToProps = ({ profits_data, punishmentRate }) => ({
    profits_data,
    punishmentRate
})

const RankTable = ({ data, index, style, my_profit })=> (
    <table className="highlight">
        <thead>
            <tr>
                <th style={style}>{"順位"}</th>
                <th style={style}>{"総利益"}</th>
            </tr>
        </thead>
        <tbody>
            {data.filter(
                    a => a.rank <= 10
                ).map(
                    (a,i)=>(
                    (i==index)?
                    <tr key={i} style={style} className="blue lighten-5">
                        <td style={style}>{a.rank}</td>
                        <td style={style}><Point>{a.value}</Point></td>
                    </tr>:
                    <tr key={i} style={style} >
                        <td style={style}>{a.rank}</td>
                        <td style={style}><Point>{a.value}</Point></td>
                    </tr>
                    )
                )
               }
               {
                   
                (index != -1 && data[index] && data[index].rank > 10)? 
                    (<tr style={style} className="blue lighten-5">
                        <td style={style}>{data[index].rank}</td>
                        <td style={style}>{data[index].value}</td>
                    </tr>):null
               }
        </tbody>
    </table>
)

class Rank extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = { expanded: false }
  }

  handleExpandChange(expanded) {
    this.setState({expanded: expanded});
  }

  render() {
    const { profits_data, punishmentRate, my_profit } = this.props
    if(!profits_data) return null
    let data = profits_data.map(
        a => {
            const profits = a.profits.reduce((acc, p) => acc + p, 0)
            const punishments = a.punishments.reduce((acc, p) => acc + p, 0)
            const used = a.used.reduce((acc, p) => acc + p, 0)
            
            return ({ value: profits - punishments*punishmentRate - used, rank: 1 })
        }
    ).sort(
        (a,b) => (a.value>b.value)?-1:1
    )
    let f = true,index
    if(my_profit === "host") f = false,index= -1
    if(my_profit !== null && profits_data.length != 0 && f && data[0].value == my_profit) f=false,index=0
    for(let i = 1; i < data.length ; i++){
        if(data[i-1].value == data[i].value) data[i].rank = data[i-1].rank
        else data[i].rank = i+1
        if(my_profit !== null && f && my_profit == data[i].value) f=false,index=i
    }
    return (
        <div>
            <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange.bind(this)}>
                <CardHeader title={"ランキング"} actAsExpander={true} showExpandableButton={true} />
                <CardText expandable={true}>
                    <RankTable
                        data={data}
                        index={index}
                        style={{textAlign: "center"}}
                        my_profit={my_profit}
                    />
                </CardText>
            </Card>
        </div>)
  }
}

export default connect(mapStateToProps)(Rank)