import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateSnum } from './actions'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import { ReadJSON, LineBreak } from '../shared/ReadJSON'

const multi_text = ReadJSON().static_text

const actionCreators = {
  updateSnum,
}
const mapStateToProps = ({}) => ({})

class InputSnum extends Component {
  constructor(props){
    super(props)
    this.state = { snum: "" }
  }

  handleUpdate(event){
    this.setState({ snum: event.target.value })
  }

  submit() {
    if(this.state.snum != "") {
      this.props.updateSnum(this.state.snum.replace(multi_text["input_snum"][0], s => { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0) }).replace(/[^\x01-\x7E]/g, "").trim())
    }
  }

  handleKeyDown(event) {
    if (event.key === "Enter" || event.keyCode === 13) { // Enter
      this.submit()
    }
  }

  render() {
    return (<div>
    <p>{multi_text["input_snum"][1]}</p>
    <TextField
      hintText={multi_text["input_snum"][2]}
      onChange={this.handleUpdate.bind(this)}
      onKeyDown={this.handleKeyDown.bind(this)}
    />
    <RaisedButton label={multi_text["input_snum"][3]} primary={true} disabled={this.state.snum == ""} onClick={this.submit.bind(this)} />
   </div>)
  }
}

export default connect(mapStateToProps, actionCreators)(InputSnum)
