import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Snackbar from 'material-ui/Snackbar'
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
      return <p>ロード中です。</p>
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
