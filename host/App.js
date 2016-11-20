import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'

import { fetchContents } from './actions'

import Users from './Users'
import MatchingButton from './MatchingButton'
import PageButtons from './PageButtons'
import Chart from './Chart'

const mapStateToProps = ({loading}) => ({
  loading
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
    const { loading } = this.props
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
          <MatchingButton />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(App)
