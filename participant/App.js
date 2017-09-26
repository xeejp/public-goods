import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from 'shared/actions'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'

import Experiment from './Experiment'
import Waiting from './Waiting'
import Description from './Description'
import Result from './Result'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
  fetchContents
}

const mapStateToProps = ({ page, joinable, group, state }) => ({
  page,
  joinable,
  group,
  state,
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchContents();
  }

  render() {
    const { page, joinable, group, state } = this.props
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
        { joinable || group != null
          ? <div>
              { (page == "waiting") ? <Waiting /> : null }
              { (page == "description") ? <Description /> : null }
              { (page == "experiment")
                  ? (state == "investment" || state == "punishment" || state == "investment_result" || state == "punishment_result")
                      ? <Experiment />
                      : (state == "finished") ? <Result /> : null
                  : null
              }
              { (page == "result") ? <Result /> : null }
          </div>
          : <Card>
              <CardTitle title={multi_text["app"][0]} subtitle={multi_text["app"][1]}/>
              <CardText>
                <p>{multi_text["app"][2]}</p>
                <p>{multi_text["app"][3]}</p>
              </CardText>
          </Card>
        }
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)
