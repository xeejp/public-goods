import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'

import { fetchContents } from './actions'

import Users from './Users'
import PageButtons from './PageButtons'
import Chart from './Chart'
import Config from './Config'
import EditQuestion from './EditQuestion'
import DownloadButton from './DownloadButton'

const mapStateToProps = ({loading, page, participants}) => ({
  loading, page, participants
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchContents())
  }

  render() {
    const { loading, page, participants } = this.props
    if (loading) {
      return (
        <Card style={{padding: '20px'}}>
          <CardTitle title="接続中" style={{padding: '0px', marginTop: '7px', marginBottom: '14px'}}/>
          <CardText style={{padding: '0px', margin: '0px'}}>
            <div style={{textAlign: 'center'}}>
              <CircularProgress style={{margin: '0px', padding: '0px' }} />
            </div>
            　　　		<p style={{margin: '0px', padding: '0px'}}>サーバーに接続しています。<br/>このまましばらくお待ちください。</p>
          </CardText>
        </Card>
      )
    } else {
      return (
        <div>
          <PageButtons />
          <Divider
            style={{
              marginTop: "5%",
              marginBottom: "5%"
            }}
          />
          <Users /><br />
          <Chart /><br />
          <Config />
          <EditQuestion style={{marginLeft: "2%"}}/>
          <DownloadButton
            fileName={"public_goods.csv"}
            list={[
              ["公共財供給メカニズム"],
              ["実験日", new Date()],
              ["登録者数", Object.keys(participants).length],
              ["ID", "1回目の利益", "2回目の利益", "グループID"],
            ].concat(
              (participants ? Object.keys(participants).map(id => {
                return [id, participants[id].profits[1], participants[id].profits[0], participants[id].group]}) : [])
            )}
            style={{marginLeft: "2%"}}
            disabled={page != "result"}
          />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(App)
