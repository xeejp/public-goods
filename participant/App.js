import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Snackbar from 'material-ui/Snackbar'
import {Card, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Pages from './Pages'

import { fetchContents, closeInfo } from './actions'

const mapStateToProps = ({ loading, info, infoOpened }) => ({
  loading, info, infoOpened
})

const mapDispatchToProps = (dispatch) => ({
  closeInfo: bindActionCreators(closeInfo, dispatch),
  fetchContents: bindActionCreators(fetchContents, dispatch)
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    const { fetchContents } = this.props
    fetchContents()
  }

  render() {
    const { loading, closeInfo, info, infoOpened } = this.props
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
          <Pages />
          <Snackbar
            open={infoOpened}
            message={info}
            autoHideDuration={3000}
            onRequestClose={closeInfo}
          />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
