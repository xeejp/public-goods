import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardText} from 'material-ui/Card'
import Backspace from 'material-ui/svg-icons/hardware/keyboard-backspace'

import { pressNumeric, pressBackspace } from './actions'

const keypad = [
  { value: '7', style: {float: "left"} },
  { value: '8', style: {float: "left"} },
  { value: '9', style: {float: "left"} },
  { value: '4', style: {float: "left"} },
  { value: '5', style: {float: "left"} },
  { value: '6', style: {float: "left"} },
  { value: '1', style: {float: "left"} },
  { value: '2', style: {float: "left"} },
  { value: '3', style: {float: "left"} },
  { value: '0', style: {float: "left"} },
  { value: 'bs', style: {float: "left"}, icon: <Backspace />}
]

const mapStateToProps = ({}) => ({
})

const mapDispatchToProps = (dispatch) => {
  return {
    keypad: keypad.map(key => (
      Object.assign({}, key, {
        action: () => {
          if (key.value == 'bs') {
            bindActionCreators(pressBackspace, dispatch)()
          } else {
            bindActionCreators(pressNumeric, dispatch)(key.value)
          }
        }
      })
    ))
  }
}

const NumericKeypad = ({ keypad }) => {
  return (
    <Card>
      <CardText>
        {
          keypad.map(({ value, action, style, icon }, i) => (
            <div
              key={i}
              style={
                Object.assign({
                  width: "33%",
                  padding: "1%"
                }, style)
              }
            >
              <RaisedButton
                icon={icon}
                label={value}
                onClick={action}
                style={{width: "100%"}}
              />
            </div>
          ))
        }
        <div
          style={{clear: "both", width: "0px"}}
        />
      </CardText>
    </Card>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NumericKeypad)
