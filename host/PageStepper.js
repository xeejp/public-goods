import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changePage } from './actions'

import { Step, Stepper, StepButton} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const pages = ["waiting", "description", "experiment", "result"]
const page_name = {"waiting": multi_text["host"]["page_stepper"]["page"][0], "description": multi_text["host"]["page_stepper"]["page"][1], "experiment": multi_text["host"]["page_stepper"]["page"][2], "result": multi_text["host"]["page_stepper"]["page"][3]}

const actionCreators = {
  changePage,
}
const mapStateToProps = ({ page }) => ({
  page,
})

class PageStepper extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  nextPage() {
    const { page } = this.props
    switch (page) {
      case "waiting":
        this.changePage("description")
        break
      case "description":
        this.changePage("experiment")
        break
      case "experiment":
        this.changePage("result")
        break
      case "result":
        this.changePage("waiting")
        break
    }
  }

  backPage() {
    const { page } = this.props
    switch (page) {
      case "waiting":
        this.changePage("result")
        break
      case "description":
        this.changePage("waiting")
        break
      case "experiment":
        this.changePage("description")
        break
      case "result":
        this.changePage("experiment")
        break
    }
  }

  changePage(page) {
    this.props.changePage(page)
  }

  render() {
    const { page } = this.props
    const steps = []
    for (let i = 0; i < pages.length; i++) {
      steps[i] = (
        <Step key={i}>
          <StepButton onTouchTap={this.changePage.bind(this, pages[i])}>
            {page_name[pages[i]]}
          </StepButton>
        </Step>
      )
    }
    return (
      <div style={{marginBottom: "5%"}}>
        <Stepper activeStep={pages.indexOf(page)} linear={false}>
          {steps}
        </Stepper>
        <div>
          <FlatButton
            label={multi_text["host"]["page_stepper"]["button"][0]}
            style={{marginLeft: '3%'}}
            onClick={this.backPage.bind(this)}
            disabled={page == "waiting"}
          />
          <RaisedButton
            label={multi_text["host"]["page_stepper"]["button"][1]}
            style={{marginLeft: '3%'}}
            primary={true}
            onClick={this.nextPage.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(PageStepper)
