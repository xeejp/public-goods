import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

import Pages from './Pages'

const mapStateToProps = ({ loading }) => ({
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
      return <p>ロード中です。</p>
    } else {
      return (
        <div>
          <Pages />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(App)
